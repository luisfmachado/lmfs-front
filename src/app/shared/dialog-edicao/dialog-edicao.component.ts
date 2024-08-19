import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClientesService } from 'src/app/services/cadastro/clientes.service';

interface Opcao {
  value: string; // Nome a ser exibido
  id: number; // ID do cliente
  disabled: boolean;
}

interface OpcaoCor {
  value: string;
}

@Component({
  selector: 'app-dialog-edicao',
  templateUrl: './dialog-edicao.component.html',
  styleUrls: ['./dialog-edicao.component.scss'],
})
export class DialogEdicaoComponent implements OnInit {
  id_produto: number | null = null;
  ds_produto: string = '';
  vl_produto!: number;
  ds_corprod: string = '';
  cliente: number | null = null;

  opcoes: Opcao[] = [];
  opcoesCor: OpcaoCor[] = [
    { value: 'INCOLOR' },
    { value: 'VERDE' },
    { value: 'FUME' },
  ];

  constructor(
    public dialogRef: MatDialogRef<DialogEdicaoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private clientesService: ClientesService
  ) {}

  ngOnInit(): void {
    this.carregaCliente();

    this.id_produto = this.data.id_produto;
    this.ds_produto = this.data.ds_produto;
    this.vl_produto = this.data.vl_produto;
    this.ds_corprod = this.data.ds_corprod;
    this.cliente = this.data.cliente;
  }

  dadosInput(): void {
    this.dialogRef.close({
      id_produto: this.id_produto,
      ds_produto: this.ds_produto,
      vl_produto: this.vl_produto,
      ds_corprod: this.ds_corprod,
      cliente: this.cliente,
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
}
