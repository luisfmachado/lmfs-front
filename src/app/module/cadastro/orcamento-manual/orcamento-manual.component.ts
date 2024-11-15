import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertService } from 'src/app/core/alert.service';
import { OrcamentoService } from 'src/app/services/cadastro/orcamento.service';
import { ProdutosService } from 'src/app/services/cadastro/produtos.service';
import { DialogGenericoComponent } from 'src/app/shared/dialog/dialog-generico/dialog-generico.component';

interface Produto {
  id_produto: number;
  qt_produto: number;
  id_orcamen: number;
  id_cliente: number;
}

interface OpcaoProduto {
  id: number;
  value: string;
}

@Component({
  selector: 'app-orcamento-manual',
  templateUrl: './orcamento-manual.component.html',
  styleUrls: [
    './orcamento-manual.component.scss',
    '../../../styles/animate-fade-slide-in.scss',
    '../../../styles/spinner.scss',
  ],
})
export class OrcamentoManualComponent implements OnInit {
  produtos: Produto[] = [
    { id_produto: 0, qt_produto: 1, id_orcamen: 0, id_cliente: 0 },
  ];
  opcoes: OpcaoProduto[] = [];
  spinnerCarregamento: boolean = false;
  idOrcam!: number;

  constructor(
    private produtoService: ProdutosService,
    public dialogo: MatDialog,
    private orcamentoService: OrcamentoService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregaProduto();
  }

  adicionarConvidado() {
    if (this.produtos.length < 25) {
      this.produtos.push({
        id_produto: 0,
        qt_produto: 1,
        id_orcamen: 0,
        id_cliente: 0,
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
      error: () => this.alertService.show('Erro ao carregar produtos!', 'Fechar'),
    });
  }

  onSubmit(form: any) {
    this.abrirDialogo();
  }

  abrirDialogo(): void {
    const dialogRef = this.dialogo.open(DialogGenericoComponent, {
      data: {
        titulo: 'Finalizar',
        descricao: 'Descrição',
        cliente: 'Cliente',
        date: 'Data de Entrega',
        cancelar: 'Cancelar',
        confirmar: 'Cadastrar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.cliente && this.produtos.length > 0) {
        this.produtos.forEach((produto) => {
          produto.id_cliente = result.cliente;
        });

        // Pegue o ID do orçamento antes de enviar
        this.pegarIdOrcamen().subscribe({
          next: (id_orcamen) => {
            this.produtos.forEach((produto) => {
              if (id_orcamen > 0 ) {
                produto.id_orcamen = id_orcamen + 1;
                this.idOrcam = id_orcamen + 1;
              } else {
                produto.id_orcamen = 1;
                this.idOrcam = 1;
              }
            });

            // Após obter o ID do orçamento, enviar os produtos
            this.spinnerCarregamento = true;
            this.orcamentoService.save(this.produtos).subscribe(
              () => {
                console.log(result.date);
                const dataFormatada = this.formatDate(result.date);
                console.log(dataFormatada);
                this.exec(this.idOrcam, result.descricao, dataFormatada);
                this.spinnerCarregamento = false;
                this.router.navigate(['/cadastro/orcamento']);
                this.alertService.show('Adicionado com sucesso!', 'Fechar');
              },
              () => {
                this.spinnerCarregamento = false;
                this.alertService.show('Erro ao adicionar notícia.', 'Fechar');
              }
            );
          },
          error: (err) => {
            this.spinnerCarregamento = false;
            this.alertService.show(
              'Erro ao carregar ID do orçamento.',
              'Fechar'
            );
          },
        });
      } else {
        this.spinnerCarregamento = false;
        this.alertService.show(
          'Ação cancelada ou dados incompletos.',
          'Fechar'
        );
      }
    });
  }

  pegarIdOrcamen(): Observable<number> {
    return this.orcamentoService.getIdOrcamen();
  }

  exec(idOrcamen: number, dsOrcamen: string, dtEntrega: string) {
    this.orcamentoService.exec(idOrcamen, dsOrcamen, dtEntrega).subscribe(
    );
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
}
