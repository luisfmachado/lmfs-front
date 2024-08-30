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
  
  id: number | null = null;
  titulo: string = '';
  descricao: string = '';
  valor!: number;
  cor: string = '';
  cliente: number | null = null;
  file!: File;

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
      id: this.id,
      descricao: this.descricao,
      valor: this.valor,
      cor: this.cor,
      cliente: this.cliente,
      file: this.file,
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
      },
      error: (err) => console.error('Erro ao carregar clientes:', err)
    });
  }

  selectedFileName: string | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
      this.selectedFileName = this.file.name;
    }
  }

  baixarExemplo() {
    const link = document.createElement('a');
    link.href = '../../../assets/EXEMPLO.xlsx';
    link.download = 'EXEMPLO.xlsx';
    link.click();
  }
}
