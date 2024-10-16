import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { OrcamentoService } from 'src/app/services/cadastro/orcamento.service';
import { ProdutosService } from 'src/app/services/cadastro/produtos.service';
import { DialogGenericoComponent } from 'src/app/shared/dialog-generico/dialog-generico.component';
import { Observable } from 'rxjs';
import { EstoqueService } from 'src/app/services/cadastro/estoque.service';
import { Estoque, Produtos } from 'src/app/model/estoque';

interface Opcao {
  id: number;
  value: string;
}

@Component({
  selector: 'app-dialog-multiple',
  templateUrl: './dialog-multiple.component.html',
  styleUrls: ['./dialog-multiple.component.scss'],
})
export class DialogMultipleComponent implements OnInit {
  produtos: Produtos[] = [{ id_produto: 0, qt_produto: 1, id_estoque: 1 }];
  opcoes: Opcao[] = [];
  spinnerCarregamento: boolean = false;
  idEstoque!: number;

  constructor(
    private produtoService: ProdutosService,
    public dialogo: MatDialog,
    private orcamentoService: OrcamentoService,
    private alertService: AlertService,
    private _estoqueService: EstoqueService,
    public dialogRef: MatDialogRef<DialogMultipleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.carregaProduto();
  }

  adicionarConvidado() {
    if (this.produtos.length < 25) {
      this.produtos.push({
        id_produto: 0,
        qt_produto: 1,
        id_estoque: 1,
      });
    }
  }

  removerConvidado(index: number) {
    this.produtos.splice(index, 1);
  }

  carregaProduto(): void {
    this.produtoService.getNome().subscribe({
      next: (nomes) => {
        this.opcoes = nomes.map((cliente: any) => ({
          id: cliente.id_produto,
          value: cliente.ds_produto,
        }));
      },
      error: () =>
        this.alertService.show('Erro ao carregar produtos!', 'Fechar'),
    });
  }

  onSubmit(form: any) {
    if (this.produtos.length > 0) {
      console.log('Produtos preenchidos:', this.produtos); // Verifique os dados aqui
      this.abrirDialogo();
    } else {
      this.alertService.show(
        'Por favor, adicione ao menos um produto.',
        'Fechar'
      );
    }
  }

  abrirDialogo(): void {
    const dialogRef = this.dialogo.open(DialogGenericoComponent, {
      data: {
        titulo: 'Finalizar',
        descricao: 'Descrição',
        fornecedor: 'Fornecedor',
        date: 'Data de Entrada',
        cancelar: 'Cancelar',
        confirmar: 'Cadastrar',
        produtos: this.produtos,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.produtos) {
        this.spinnerCarregamento = true;
        this.getIdEstoque().subscribe({
          next: (id) => {
            this.produtos.forEach((produto) => {
              if (id > 0) {
                produto.id_estoque = id + 1;
                this.idEstoque = id + 1;
              } else {
                produto.id_estoque = 1;
                this.idEstoque = 1;
              }
            });
            this._estoqueService
              .save(
                result.descricao,
                result.fornecedor,
                result.date,
                this.produtos
              )
              .subscribe(
                () => {
                  this.spinnerCarregamento = false;
                  this.alertService.show('Adicionado com sucesso!', 'Fechar');
                },
                () => {
                  this.spinnerCarregamento = false;
                  this.alertService.show(
                    'Erro ao adicionar notícia.',
                    'Fechar'
                  );
                }
              );
          },
        });
      } else {
        this.alertService.show(
          'Ação cancelada ou dados incompletos.',
          'Fechar'
        );
      }
    });
  }

  getIdEstoque(): Observable<number> {
    return this._estoqueService.getIdEstoque();
  }

  closeDialog() {
    this.dialogo.closeAll();
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
}
