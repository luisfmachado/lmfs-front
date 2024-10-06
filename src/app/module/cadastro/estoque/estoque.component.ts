import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Estoque } from 'src/app/model/estoque';
import { AlertService } from 'src/app/services/alert.service';
import { EstoqueService } from 'src/app/services/cadastro/estoque.service';
import { DialogEdicaoComponent } from 'src/app/shared/dialog-edicao/dialog-edicao.component';
import { DialogGenericoComponent } from 'src/app/shared/dialog-generico/dialog-generico.component';

@Component({
  selector: 'app-estoque',
  templateUrl: './estoque.component.html',
  styleUrls: ['./estoque.component.scss'],
})
export class EstoqueComponent implements OnInit {
  constructor(
    private estoqueService: EstoqueService,
    public dialogo: MatDialog,
    private alertService: AlertService
  ) {}

  public ngOnInit(): void {
    this.spinnerCarregamento = true;
    this.carregaDados();
  }

  spinnerCarregamento: boolean = false;

  //Colunas da tabela
  displayedColumns: string[] = [
    'id_estoque',
    'id_produto',
    'qt_produto',
    'vl_pgcusto',
    'acoes',
  ];

  //Tabela
  dataSource: MatTableDataSource<Estoque> = new MatTableDataSource<Estoque>();

  //Chama o paginator
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  /*----------------------Pegar os dados da tabela---------------------------*/
  private carregaDados() {
    this.estoqueService.get().subscribe({
      next: (data: Estoque[]) => {
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
          id: 'ID (Opcional)',
          descricao: 'Nome',
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
          this.estoqueService
            .save(result.id, result.descricao, result.valor, result.cor)
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

  /*----------------------Editar da tabela---------------------------*/
  // abrirDialogoEditar(id_produto: number, id_cliente: number): void {
  //   this.estoqueService.getProduto(id_produto, id_cliente).subscribe({
  //     next: (produto: any) => {
  //       const dialogRef = this.dialogo.open(DialogEdicaoComponent, {
  //         data: {
  //           titulo: 'Editar',
  //           id_produto: produto.id_produto,
  //           ds_produto: produto.ds_produto,
  //           vl_produto: produto.vl_produto,
  //           ds_corprod: produto.ds_corprod,
  //           cliente: produto.id_cliente,
  //           cancelar: 'Cancelar',
  //           confirmar: 'Editar',
  //         },
  //       });

  //       dialogRef.afterClosed().subscribe((result) => {
  //         if (result) {
  //           this.editar(
  //             result.id_produto,
  //             result.ds_produto,
  //             result.vl_produto,
  //             result.ds_corprod,
  //             result.cliente
  //           );
  //         }
  //       });
  //     },
  //     error: (error) => {
  //       alert(`Erro ao buscar produto: ${error.message}`);
  //     },
  //   });
  // }

  // public editar(
  //   id_produto: number,
  //   ds_produto: string,
  //   vl_produto: number,
  //   ds_corprod: string,
  //   id_cliente: number
  // ): void {
  //   this.estoqueService
  //     .update(id_produto, ds_produto, vl_produto, ds_corprod, id_cliente)
  //     .subscribe({
  //       next: (res) => {
  //         if (res) {
  //           this.carregaDados();
  //           this.alertService.show('Alterado com sucesso!', 'Fechar');
  //         } else {
  //           this.alertService.show('Erro ao alterar!', 'Fechar');
  //         }
  //       },
  //     });
  // }

  /*----------------------Excluir da tabela---------------------------*/
  // public excluir(id_produto: number): void {
  //   this.spinnerCarregamento = true;
  //   this.estoqueService.delete(id_produto).subscribe({
  //     next: (res) => {
  //       if (res.status) {
  //         this.carregaDados();
  //         this.spinnerCarregamento = false;
  //         this.alertService.show('Excluído com sucesso!', 'Fechar');
  //       } else {
  //         this.spinnerCarregamento = false;
  //         this.alertService.show('Erro ao excluir!', 'Fechar');
  //       }
  //     },
  //   });
  // }
}
