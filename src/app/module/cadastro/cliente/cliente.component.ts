import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Clientes } from 'src/app/model/clientes';
import { AlertService } from 'src/app/core/alert.service';
import { ClientesService } from 'src/app/services/cadastro/clientes.service';
import { DialogGenericoComponent } from 'src/app/shared/dialog-generico/dialog-generico.component';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: [
    './cliente.component.scss',
    '../../../styles/animate-fade-slide-in.scss',
    '../../../styles/spinner.scss',
  ],
})
export class ClienteComponent implements OnInit {
  constructor(
    private _clienteService: ClientesService,
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
    'id_cliente',
    'no_cliente',
    'ds_cnpjcli',
    'nm_celular',
    'acoes',
  ];

  //Tabela
  dataSource: MatTableDataSource<Clientes> = new MatTableDataSource<Clientes>();

  //Chama o paginator
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  /*----------------------Pegar os dados da tabela---------------------------*/
  private carregaDados() {
    this._clienteService.get().subscribe({
      next: (data: Clientes[]) => {
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
          titulo: 'Novo cliente:',
          descricao: 'Nome',
          cnpj: 'CNPJ',
          celular: 'Contato',
          cancelar: 'Cancelar',
          confirmar: 'Cadastrar',
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result.descricao) {
          this.spinnerCarregamento = true;
          console.log(
            result.descricao,
            result.cnpj,
            result.celular
          );
          this._clienteService
            .save(
              result.descricao,
              result.cnpj,
              result.celular
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

  /*----------------------Editar da tabela---------------------------*/
  // abrirDialogoEditar(id_produto: number, id_cliente: number): void {
  //   this._clienteService.getProduto(id_produto, id_cliente).subscribe({
  //     next: (produto: any) => {
  //       const dialogRef = this.dialogo.open(DialogEdicaoComponent, {
  //         data: {
  //           titulo: 'Editar',
  //           id_produto: produto.id_produto,
  //           ds_produto: produto.ds_produto,
  //           vl_produto: produto.vl_produto,
  //           vl_custopr: produto.vl_custopr,
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
  //             result.vl_custopr,
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
  //   vl_custopr: number,
  //   ds_corprod: string,
  //   id_cliente: number
  // ): void {
  //   this._clienteService
  //     .update(
  //       id_produto,
  //       ds_produto,
  //       vl_produto,
  //       vl_custopr,
  //       ds_corprod,
  //       id_cliente
  //     )
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
  public excluir(id_cliente: number): void {
    this.spinnerCarregamento = true;
    this._clienteService.delete(id_cliente).subscribe({
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
