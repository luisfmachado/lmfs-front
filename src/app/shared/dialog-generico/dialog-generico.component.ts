import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClientesService } from 'src/app/services/cadastro/clientes.service';
import { FornecedorService } from 'src/app/services/cadastro/fornecedor.service';

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
  valorCusto!: number;
  cor: string = '';
  cliente: number | null = null;
  fornecedor: number | null = null;
  file!: File;
  date: Date | null = null;

  opcoes: Opcao[] = [];
  opcoesCor: OpcaoCor[] = [
    { value: 'Incolor' },
    { value: 'Verde' },
    { value: 'Fumê' },
    { value: 'Cromado' },
  ]

  constructor(
    public dialogRef: MatDialogRef<DialogGenericoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private clientesService: ClientesService,
    private _fornecedorService: FornecedorService
  ) {}

  ngOnInit(): void {
    this.carregaCliente();
    this.carregaFornecedor();
  }

  dadosInput(): void {
    this.dialogRef.close({
      id: this.id,
      descricao: this.descricao,
      valor: this.valor,
      valorCusto: this.valorCusto,
      cor: this.cor,
      cliente: this.cliente,
      fornecedor: this.fornecedor,
      file: this.file,
      date: this.date
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

  carregaFornecedor(): void {
    this._fornecedorService.getFornecedor().subscribe({
      next: (nomes) => {
        this.opcoes = nomes.map(fornecedor => ({
          id: fornecedor.id_fornece,
          value: fornecedor.no_fornece,
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

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const dataTransfer = event.dataTransfer;
    if (dataTransfer && dataTransfer.files && dataTransfer.files.length > 0) {
      this.file = dataTransfer.files[0];
      this.selectedFileName = this.file.name;
    }
  }
}
