import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { OrcamentoVW } from 'src/app/model/orcamento';
import { AlertService } from 'src/app/services/alert.service';
import { OrcamentoService } from 'src/app/services/cadastro/orcamento.service';

@Component({
  selector: 'app-orcamento',
  templateUrl: './orcamento.component.html',
  styleUrls: ['./orcamento.component.scss', '../../../styles/animate-fade-slide-in.scss', '../../../styles/spinner.scss'],
})
export class OrcamentoComponent implements OnInit {
  constructor(
    private orcamentoService: OrcamentoService,
    public dialogo: MatDialog,
    private alertService: AlertService,
    private router: Router
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
    'acoes',
  ];

  //Tabela
  dataSource: MatTableDataSource<OrcamentoVW> = new MatTableDataSource<OrcamentoVW>();

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

  /*----------------------Enviar para outro módulo---------------------------*/
  public abrirSave() {
    this.router.navigate(['/cadastro/orcamento-manual']);
  }

  /*----------------------Editar da tabela---------------------------*/
  /*
  abrirDialogoEditar(id_tp_gasto: number): void {
    const dialogRef = this.dialogo.open(DialogGenericoComponent, {
      data: {
        titulo: 'Editar tipo de gasto:',
        descricao: 'Nova descrição',
        cancelar: 'Cancelar',
        confirmar: 'Editar',
      },
    });

    dialogRef.afterClosed().subscribe((novaDescricao: string) => {
      if (novaDescricao) {
        this.editar(id_tp_gasto, novaDescricao);
      }
    });
  }

  public editar(id_tp_gasto: number, novaDescricao: string): void {
    this.assembleiaService.update(id_tp_gasto, novaDescricao).subscribe({
      next: (res) => {
        if (res.status) {
          this.carregaDados();
          alert(res.mensagem);
        } else {
          alert(res.mensagem);
        }
      },
      error: (error) => {
        alert(`Erro ao editar tipo de gasto: ${error.message}`);
      },
    });
  }
  */
  /*----------------------Excluir da tabela---------------------------*/
  public excluir(id: number): void {
    console.log(id);
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
}
