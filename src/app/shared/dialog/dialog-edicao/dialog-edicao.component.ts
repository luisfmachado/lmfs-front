import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/core/alert.service';
import { ClientesService } from 'src/app/services/cadastro/clientes.service';
import { DialogMultipleComponent } from '../dialog-multiple/dialog-multiple.component';
import { MateriaPrimaService } from 'src/app/services/cadastro/materia-prima.service';
import { ProdutoCustoVw } from 'src/app/model/produtos';

interface Opcao {
  value: string;
  id: number;
}

interface OpcaoMaterial {
  value: string;
  id: number;
}

interface OpcaoCor {
  value: string;
}

@Component({
  selector: 'app-dialog-edicao',
  templateUrl: './dialog-edicao.component.html',
  styleUrls: ['./dialog-edicao.component.scss', '../../../styles/spinner.scss'],
})
export class DialogEdicaoComponent implements OnInit {
  id_produto!: number;
  ds_produto: string = '';
  vl_produto!: number;
  vl_custopr!: number;
  ds_corprod: string = '';
  cliente: number | null = null;
  material: number | null = null;
  produtos: ProdutoCustoVw[] = [{ id_produto: 0, id_materia: 0, qt_materia: 0 }];
  opcoes: Opcao[] = [];
  opcoesMaterial: OpcaoMaterial[] = [];
  spinnerCarregamento: boolean = false;
  idEstoque!: number;

  opcoesCor: OpcaoCor[] = [
    { value: 'INCOLOR' },
    { value: 'VERDE' },
    { value: 'FUME' },
  ];

  constructor(
    private readonly clientesService: ClientesService,
    private readonly alertService: AlertService,
    private readonly _materiaPrimaService: MateriaPrimaService,
    public dialogRef: MatDialogRef<DialogMultipleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.spinnerCarregamento = true;
    this.carregaCliente();
    this.carregaMaterial();

    this.id_produto = this.data.id_produto;
    this.produtos[0].id_produto = this.data.id_produto;
    this.ds_produto = this.data.ds_produto;
    this.vl_produto = this.data.vl_produto;
    this.vl_custopr = this.data.vl_custopr;
    this.ds_corprod = this.data.ds_corprod;
    this.cliente = this.data.cliente;
    setTimeout(() => {
      this.spinnerCarregamento = false;
    }, 1000);
  }

  dadosInput(): void {
    this.dialogRef.close({
      id_produto: this.id_produto,
      ds_produto: this.ds_produto,
      vl_produto: this.vl_produto,
      vl_custopr: this.vl_custopr,
      ds_corprod: this.ds_corprod,
      cliente: this.cliente,
      produtos: this.produtos,
    });
  }

  carregaCliente(): void {
    this.clientesService.getNome().subscribe({
      next: (nomes) => {
        this.opcoes = nomes.map((cliente) => ({
          value: cliente.no_cliente,
          id: cliente.id_cliente,
          disabled: false,
        }));
      },
      error: (err) => console.error('Erro ao carregar clientes:', err),
    });
  }

  adicionarConvidado() {
    if (this.produtos.length < 25) {
      this.produtos.push({
        id_produto: this.id_produto,
        id_materia: 0,
        qt_materia: 0,
      });
    }
  }

  removerConvidado(index: number) {
    this.produtos.splice(index, 1);
  }

  carregaMaterial(): void {
    this._materiaPrimaService.getTp().subscribe({
      next: (nomes) => {
        this.opcoesMaterial = nomes.map((material: any) => ({
          id: material.nm_sequenc,
          value: material.no_materia,
        }));
      },
      error: () =>
        this.alertService.show('Erro ao carregar produtos!', 'Fechar'),
    });
  }
}
