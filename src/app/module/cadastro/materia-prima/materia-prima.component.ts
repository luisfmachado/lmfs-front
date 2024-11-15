import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MateriaPrima, MateriaPrimaVw } from 'src/app/model/materia-prima';
import { AlertService } from 'src/app/core/alert.service';
import { MateriaPrimaService } from 'src/app/services/cadastro/materia-prima.service';
import { DialogGenericoComponent } from 'src/app/shared/dialog/dialog-generico/dialog-generico.component';

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
        maxWidth: '950px',
        data: {
          titulo: 'Entrada:',
          descricao: 'Descrição',
          date: 'Data',
          fornecedor: 'Fornecedor',
          valor: 'Custo do material',
          lg_custoad: 'Gerou custos adicionais?',
          custoAddValor: 'F',
          tipoPagamento: 'Pagamento',
          ds_custoad: 'Descrição de custo adicional',
          vl_custoad: 'Valor de custo adicional',
          tp_custoad: 'Responsável por custo adicional',
          cancelar: 'Cancelar',
          confirmar: 'Cadastrar',
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result.descricao) {
          this.spinnerCarregamento = true;
          console.log(
            result.descricao,
            result.date,
            result.tipoPagamento,
            result.fornecedor,
            result.lg_custoad,
            result.ds_custoadd,
            result.vl_custoad,
            result.tp_custoad,
            result.valor,
          );
          this._materiaPrimaService
            .save(
              result.descricao,
              result.date,
              result.tipoPagamento,
              result.fornecedor,
              result.lg_custoad,
              result.ds_custoadd,
              result.vl_custoad,
              result.tp_custoad,
              result.valor,
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
}
