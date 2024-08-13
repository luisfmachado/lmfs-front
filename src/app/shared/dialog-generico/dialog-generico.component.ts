import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClientesService } from 'src/app/services/cadastro/clientes.service';

interface Opcao {
  value: string; // Nome a ser exibido
  id: number;    // ID do cliente
  disabled: boolean;
}

interface OpcaoCor {
  value: string;
}

@Component({
  selector: 'app-dialog-generico',
  templateUrl: './dialog-generico.component.html',
  styleUrls: ['./dialog-generico.component.scss'],
})
export class DialogGenericoComponent implements OnInit {
  
  titulo: string = '';
  descricao: string = '';
  valor!: number;
  cor: string = '';
  cliente: number | null = null;

  opcoes: Opcao[] = [];
  opcoesCor: OpcaoCor[] = [
    { value: 'Incolor' },
    { value: 'Verde' },
    { value: 'Fumê' },
  ]

  constructor(
    public dialogRef: MatDialogRef<DialogGenericoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private clientesService: ClientesService,
  ) {}

  ngOnInit(): void {
    this.carregaCliente();
  }

  dadosInput(): void {
    this.dialogRef.close({
      descricao: this.descricao,
      valor: this.valor,
      cor: this.cor,
      cliente: this.cliente,
    });
  }

  carregaCliente(): void {
    this.clientesService.getNome().subscribe({
      next: (nomes) => {
        this.opcoes = nomes.map(cliente => ({
          value: cliente.no_cliente,
          id: cliente.id_cliente,
          disabled: false,
        }));
        console.log('Opções carregadas:', this.opcoes); // Verifique se as opções estão corretas
      },
      error: (err) => console.error('Erro ao carregar clientes:', err)
    });
  }
}
