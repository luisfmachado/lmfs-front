import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Produtos } from 'src/app/model/produtos';
import { AlertService } from 'src/app/services/alert.service';
import { ProdutosService } from 'src/app/services/cadastro/produtos.service';
import { DialogGenericoComponent } from 'src/app/shared/dialog-generico/dialog-generico.component';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.scss'],
})
export class ProdutosComponent implements OnInit {
  constructor(
    private produtoService: ProdutosService,
    public dialogo: MatDialog,
    private alertService: AlertService
  ) {}

  public ngOnInit(): void {
    this.spinnerCarregamento = true;
    this.carregaDados();
  }

  spinnerCarregamento: boolean = false;

  //Colunas da tabela
  displayedColumns: string[] = ['id', 'ds_produto', 'vl_produto', 'ds_corprod', 'no_cliente', 'acoes'];

  //Tabela
  dataSource: MatTableDataSource<Produtos> = new MatTableDataSource<Produtos>();

  //Chama o paginator
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  /*----------------------Pegar os dados da tabela---------------------------*/
  private carregaDados() {
    this.produtoService.get().subscribe({
      next: (data: Produtos[]) => {
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
        data: {
          titulo: 'Novo produto:',
          descricao: 'Nome do produto',
          valor: 'Valor',
          cor: 'Cor',
          cliente: 'Cliente',
          cancelar: 'Cancelar',
          confirmar: 'Cadastrar',
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result.descricao) {
          this.spinnerCarregamento = true;
          console.log(result.descricao, result.valor, result.cor, result.cliente);
          this.produtoService
            .save(result.descricao, result.valor, result.cor, result.cliente)
            .subscribe(
              () => {
                this.carregaDados();
                this.spinnerCarregamento = false;
                this.alertService.show('Adicionado com sucesso!', 'Fechar');
              },
              () => {
                this.spinnerCarregamento = false;
                this.alertService.show('Erro ao adicionar notícia.', 'Fechar');
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
    this.spinnerCarregamento = true;
    this.produtoService.delete(id).subscribe({
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
