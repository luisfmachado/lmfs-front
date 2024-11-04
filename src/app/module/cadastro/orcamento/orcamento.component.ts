import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { OrcamentoVW } from 'src/app/model/orcamento';
import { AlertService } from 'src/app/services/alert.service';
import { OrcamentoService } from 'src/app/services/cadastro/orcamento.service';
import { DialogGenericoComponent } from 'src/app/shared/dialog-generico/dialog-generico.component';
import { saveAs } from 'file-saver';
import { FaturamentoService } from 'src/app/services/cadastro/faturamento.service';

@Component({
  selector: 'app-orcamento',
  templateUrl: './orcamento.component.html',
  styleUrls: [
    './orcamento.component.scss',
    '../../../styles/animate-fade-slide-in.scss',
    '../../../styles/spinner.scss',
  ],
})
export class OrcamentoComponent implements OnInit {
  constructor(
    private orcamentoService: OrcamentoService,
    public dialogo: MatDialog,
    private alertService: AlertService,
    private router: Router,
    private _faturamentoService: FaturamentoService
  ) {}

  public ngOnInit(): void {
    this.spinnerCarregamento = true;
    this.carregaDados();
  }

  spinnerCarregamento: boolean = false;

  //Colunas da tabela
  displayedColumns: string[] = [
    'id_orcamen',
    'ds_orcamen',
    'dt_orcamen',
    'vl_totalor',
    'no_cliente',
    'dt_entrega',
    'acoes',
  ];

  //Tabela
  dataSource: MatTableDataSource<OrcamentoVW> =
    new MatTableDataSource<OrcamentoVW>();

  //Chama o paginator
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  /*----------------------Pegar os dados da tabela---------------------------*/
  private carregaDados() {
    this.orcamentoService.get().subscribe({
      next: (data: OrcamentoVW[]) => {
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

  /*----------------------Adicionar novo---------------------------*/
  public abrirSave() {
    this.router.navigate(['/cadastro/orcamento-manual']);
  }

  public abrirImport(): void {
    const user = localStorage.getItem('name');
    if (user) {
      const dialogRef = this.dialogo.open(DialogGenericoComponent, {
        data: {
          titulo: 'Importar:',
          file: 'File',
          cliente: 'Cliente',
          cancelar: 'Cancelar',
          confirmar: 'Cadastrar',
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result.file && result.cliente) {
          this.spinnerCarregamento = true;
          this.orcamentoService
            .saveImport(result.file, result.cliente)
            .subscribe(
              () => {
                this.orcamentoService.exec2().subscribe(
                  () => {
                    this.carregaDados();
                    this.spinnerCarregamento = false;
                    this.alertService.show('Importado com sucesso!', 'Fechar');
                  },
                  (error) => {
                    this.spinnerCarregamento = false;
                    this.alertService.show(
                      'Erro ao importar produtos.',
                      'Fechar'
                    );
                    console.error('Erro ao importar produtos:', error);
                  }
                );
              },
              (error) => {
                this.spinnerCarregamento = false;
                this.alertService.show('Erro ao importar produtos.', 'Fechar');
                console.error('Erro ao importar produtos:', error);
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

  /*----------------------Excluir da tabela---------------------------*/
  public excluir(id: number): void {
    this.spinnerCarregamento = true;
    this.orcamentoService.delete(id).subscribe({
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

  /*----------------------Gerar PDF---------------------------*/
  gerarPDF(id_orcamen: number): void {
    this.spinnerCarregamento = true;
    this.orcamentoService.getRelatorio(id_orcamen).subscribe(
      (pdf: Blob) => {
        saveAs(pdf, 'orcamento.pdf');
        this.spinnerCarregamento = false;
      },
      (error) => {
        this.spinnerCarregamento = false;
        console.error('Erro ao gerar o relatório:', error);
      }
    );
  }

  /*----------------------Faturar---------------------------*/
  gerarFat(id_orcamen: number, lg_faturad: string): void {
    this.spinnerCarregamento = true;
    if (lg_faturad === 'T') {
      this._faturamentoService.updtFo(id_orcamen, 0).subscribe({
        next: (res) => {
          if (res.status) {
            this.carregaDados();
            this.spinnerCarregamento = false;
            this.alertService.show('Faturamento removido com sucesso!', 'Fechar');
          } else {
            this.carregaDados();
            this.spinnerCarregamento = false;
            this.alertService.show('Erro!', 'Fechar');
          }
        },
      });
    } else if (lg_faturad === 'F') {
      console.log("entrou");
      this._faturamentoService.updtFo(id_orcamen, 1).subscribe({
        next: (res) => {
          if (res.status) {
            this.carregaDados();
            this.spinnerCarregamento = false;
            this.alertService.show('Faturado com sucesso!', 'Fechar');
          } else {
            this.carregaDados();
            this.spinnerCarregamento = false;
            this.alertService.show('Erro!', 'Fechar');
          }
        },
      });
    }
  }
}
