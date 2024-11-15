import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Clientes } from 'src/app/model/clientes';
import { Fornecedor } from 'src/app/model/fornecedor';
import { AlertService } from 'src/app/core/alert.service';
import { ClientesService } from 'src/app/services/cadastro/clientes.service';
import { FornecedorService } from 'src/app/services/cadastro/fornecedor.service';
import { DialogGenericoComponent } from 'src/app/shared/dialog/dialog-generico/dialog-generico.component';
@Component({
  selector: 'app-fornecedor',
  templateUrl: './fornecedor.component.html',
  styleUrls: [
    './fornecedor.component.scss',
    '../../../styles/animate-fade-slide-in.scss',
    '../../../styles/spinner.scss',
  ],
})
export class FornecedorComponent implements OnInit {
  constructor(
    private _fornecedorService: FornecedorService,
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
    'id_fornece',
    'no_fornece',
    'nm_cnpjfor',
    'nm_celular',
    'acoes',
  ];

  //Tabela
  dataSource: MatTableDataSource<Fornecedor> = new MatTableDataSource<Fornecedor>();

  //Chama o paginator
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  /*----------------------Pegar os dados da tabela---------------------------*/
  private carregaDados() {
    this._fornecedorService.get().subscribe({
      next: (data: Fornecedor[]) => {
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
          titulo: 'Adicionar:',
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
          console.log(result.descricao, result.cnpj, result.celular);
          this._fornecedorService
            .save(result.descricao, result.cnpj, result.celular)
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

  /*----------------------Excluir da tabela---------------------------*/
  public excluir(id_fornece: number): void {
    this.spinnerCarregamento = true;
    this._fornecedorService.delete(id_fornece).subscribe({
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
