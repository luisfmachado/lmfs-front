import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Produtos } from 'src/app/model/produtos';
import { AlertService } from 'src/app/core/alert.service';
import { ProdutosService } from 'src/app/services/cadastro/produtos.service';
import { DialogEdicaoComponent } from 'src/app/shared/dialog-edicao/dialog-edicao.component';
import { DialogGenericoComponent } from 'src/app/shared/dialog-generico/dialog-generico.component';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.scss', '../../../styles/animate-fade-slide-in.scss', '../../../styles/spinner.scss'],
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
  displayedColumns: string[] = ['id_produto', 'ds_produto', 'vl_produto', 'vl_custopr', 'ds_corprod', 'no_cliente', 'acoes'];

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
        maxWidth: '950px',
        data: {
          titulo: 'Novo produto:',
          id: 'ID (Opcional)',
          descricao: 'Nome',
          valor: 'Vlr. de venda',
          valorCusto: 'Vlr. de custo',
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
            .save(result.id, result.descricao, result.valor, result.cor, result.cliente)
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

  abrirImport() {
    this.abrirDialogoImport();
  }

  abrirDialogoImport(): void {
    const user = localStorage.getItem('name');
    if (user) {
      const dialogRef = this.dialogo.open(DialogGenericoComponent, {
        data: {
          titulo: 'Importar produtos:',
          filePadrao: 'File',
          file: 'File',
          cancelar: 'Cancelar',
          confirmar: 'Cadastrar',
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        console.log('Resultado do diálogo:', result);
        if (result.file) {
          this.spinnerCarregamento = true;
          this.produtoService
            .saveImport(result.file)
            .subscribe(
              () => {
                this.produtoService.exec().subscribe(
                  () => {
                this.carregaDados();
                this.spinnerCarregamento = false;
                this.alertService.show('Importado com sucesso!', 'Fechar');
                  },
                  (error) => {
                    this.spinnerCarregamento = false;
                    this.alertService.show('Erro ao importar produtos.', 'Fechar');
                    console.error('Erro ao importar produtos:', error);
                  }
                )
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

  /*----------------------Editar da tabela---------------------------*/
  abrirDialogoEditar(id_produto: number, id_cliente: number): void {
    this.produtoService.getProduto(id_produto, id_cliente).subscribe({
      next: (produto: any) => {
        const dialogRef = this.dialogo.open(DialogEdicaoComponent, {
          data: {
            titulo: 'Editar',
            id_produto: produto.id_produto,
            ds_produto: produto.ds_produto,
            vl_produto: produto.vl_produto,
            vl_custopr: produto.vl_custopr,
            ds_corprod: produto.ds_corprod,
            cliente: produto.id_cliente,
            cancelar: 'Cancelar',
            confirmar: 'Editar',
          },
        });
  
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.editar(
              result.id_produto,
              result.ds_produto,
              result.vl_produto,
              result.vl_custopr,
              result.ds_corprod,
              result.cliente
            );
          }
        });
      },
      error: (error) => {
        alert(`Erro ao buscar produto: ${error.message}`);
      }
    });
  }
  
  public editar(
    id_produto: number,
    ds_produto: string,
    vl_produto: number,
    vl_custopr: number,
    ds_corprod: string,
    id_cliente: number
  ): void {
    this.produtoService.update(id_produto, ds_produto, vl_produto, vl_custopr, ds_corprod, id_cliente).subscribe({
      next: (res) => {
        if (res) {
          this.carregaDados();
          this.alertService.show('Alterado com sucesso!', 'Fechar');
        } else {
          this.alertService.show('Erro ao alterar!', 'Fechar');
        }
      }
    });
  }
  
  
  /*----------------------Excluir da tabela---------------------------*/
  public excluir(id_produto: number, id_cliente: number): void {
    this.spinnerCarregamento = true;
    this.produtoService.delete(id_produto, id_cliente).subscribe({
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
