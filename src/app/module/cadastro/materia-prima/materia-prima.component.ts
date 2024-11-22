import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MateriaPrima, MateriaPrimaVw } from 'src/app/model/materia-prima';
import { AlertService } from 'src/app/core/alert.service';
import { MateriaPrimaService } from 'src/app/services/cadastro/materia-prima.service';
import { DialogGenericoComponent } from 'src/app/shared/dialog/dialog-generico/dialog-generico.component';
import { formatInTimeZone } from 'date-fns-tz';

@Component({
  selector: 'app-materia-prima',
  templateUrl: './materia-prima.component.html',
  styleUrls: [
    './materia-prima.component.scss',
    '../../../styles/animate-fade-slide-in.scss',
    '../../../styles/spinner.scss',
  ],
})
export class MateriaPrimaComponent implements OnInit {
  constructor(
    private _materiaPrimaService: MateriaPrimaService,
    public dialogo: MatDialog,
    private alertService: AlertService
  ) {}

  public ngOnInit(): void {
    this.spinnerCarregamento = true;
    this.carregaDados();
  }

  spinnerCarregamento: boolean = false;
  exibirCamposAdicionais: boolean = false;

  //Colunas da tabela
  displayedColumns: string[] = [
    'nm_sequenc',
    'no_materia',
    'dt_movimen',
    'vl_pgtotal',
    'no_fornece',
    'acoes',
  ];

  //Tabela
  dataSource: MatTableDataSource<MateriaPrimaVw> =
    new MatTableDataSource<MateriaPrimaVw>();

  //Chama o paginator
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  /*----------------------Pegar os dados da tabela---------------------------*/
  private carregaDados() {
    this._materiaPrimaService.getVw().subscribe({
      next: (data: MateriaPrimaVw[]) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.spinnerCarregamento = false;
      },
    });
  }

  /*----------------------Caixa de Pesquisa---------------------------*/
  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /*----------------------Caixa de dialogo para adicionar novo---------------------------*/
  abrirDialogo(): void {
    const user = localStorage.getItem('name');
    if (user) {
      const dialogRef = this.dialogo.open(DialogGenericoComponent, {
        maxWidth: '980px',
        data: {
          titulo: 'Entrada:',
          tipoMaterial: 'Material',
          date: 'Data',
          fornecedor: 'Fornecedor',
          lg_custoad: 'Gerou custos adicionais?',
          custoAddValor: 'F',
          ds_custoad: 'Descrição de custo adicional',
          vl_custoad: 'Valor de custo adicional',
          tp_custoad: 'Responsável por custo adicional',
          quantidade: 'Quantidade',
          cancelar: 'Cancelar',
          confirmar: 'Cadastrar',
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result.tipoMaterial) {
          this.spinnerCarregamento = true;
          const date = formatInTimeZone(
            result.date,
            'America/Sao_Paulo',
            'yyyy-MM-dd'
          );
          console.log(result.tipoPagamento);
          this._materiaPrimaService
            .save(
              result.tipoMaterial,
              date,
              result.fornecedor,
              result.lg_custoad,
              result.ds_custoadd,
              result.vl_custoad,
              result.tp_custoad,
              result.quantidade
            )
            .subscribe(
              () => {
                this.carregaDados();
                this.spinnerCarregamento = false;
                this.alertService.show('Adicionado com sucesso!', 'Fechar');
              },
              () => {
                this.spinnerCarregamento = false;
                this.alertService.show('Erro ao adicionar produto.', 'Fechar');
              }
            );
        } else {
          this.spinnerCarregamento = false;
          this.alertService.show(
            'Ação cancelada ou dados incompletos.',
            'Fechar'
          );
        }
      });
    }
  }

  onTypeChange(value: string): void {
    if (value === 'T') {
      //
    }
  }

  /*----------------------Excluir da tabela---------------------------*/
  public excluir(nm_sequenc: number): void {
    this.spinnerCarregamento = true;
    this._materiaPrimaService.delete(nm_sequenc).subscribe({
      next: (res) => {
        if (res.status) {
          this.carregaDados();
          this.spinnerCarregamento = false;
          this.alertService.show('Excluído com sucesso!', 'Fechar');
        } else {
          this.spinnerCarregamento = false;
          this.alertService.show('Erro ao excluir!', 'Fechar');
        }
      },
    });
  }

  /*----------------------Excluir da tabela---------------------------*/
  public gerarPagamento(nm_sequenc: number, lg_faturad: string): void {
    if (lg_faturad != 'T') {
      this.abrirPagamento(nm_sequenc);
    } else {
      this.alertService.show('Pagamento já concluído!', 'Fechar');
    } 
  }

  public abrirPagamento(nm_sequenc: number): void {
    const user = localStorage.getItem('name');
    if (user) {
      const dialogRef = this.dialogo.open(DialogGenericoComponent, {
        maxWidth: '980px',
        data: {
          titulo: 'Pagamento',
          date: 'Data',
          valor: 'Valor',
          cancelar: 'Cancelar',
          confirmar: 'Cadastrar',
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result.date && result.valor) {
          this.spinnerCarregamento = true;
          const date = formatInTimeZone(
            result.date,
            'America/Sao_Paulo',
            'yyyy-MM-dd'
          );
          this._materiaPrimaService
            .savePagamento(nm_sequenc, date, result.valor)
            .subscribe(
              () => {
                this.carregaDados();
                this.spinnerCarregamento = false;
                this.alertService.show('Pagamento registrado!', 'Fechar');
              },
              () => {
                this.spinnerCarregamento = false;
                this.alertService.show('Erro', 'Fechar');
              }
            );
        } else {
          this.spinnerCarregamento = false;
          this.alertService.show(
            'Ação cancelada ou dados incompletos.',
            'Fechar'
          );
        }
      });
    }
  }
}
