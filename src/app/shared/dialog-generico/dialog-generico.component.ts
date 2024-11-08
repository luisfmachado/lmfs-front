import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { MatSelectChange } from '@angular/material/select';
import { PagamentoParceladoCartao, tipoPagamento, tipoPagamentoAdd } from 'src/app/model/materia-prima';
import { ClientesService } from 'src/app/services/cadastro/clientes.service';
import { FornecedorService } from 'src/app/services/cadastro/fornecedor.service';

interface Opcao {
  value: string;
  id: number;
  disabled: boolean;
}

interface OpcaoF {
  value: string;
  id: number;
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
  @Output() typeChange = new EventEmitter<boolean>();

  exibirCamposAdicionais: boolean = false;
  exibirParcelamento: boolean = false;

  id: number | null = null;
  titulo: string = '';
  descricao: string = '';
  descricao2: string = '';
  descricao3: string = '';
  valor: number = 0;
  valor2: number = 0;
  valorCusto: number = 0;
  cor: string = '';
  cliente: number | null = null;
  fornecedor: number | null = null;
  file!: File;
  date: Date | null = null;
  date2: Date | null = null;
  cnpj: string | null = null;
  rg: string | null = null;
  cpf: string | null = null;
  celular!: string;
  tipoPagamentoId!: number;
  lg_custoad: string = this.data.custoAddValor || 'F';
  ds_custoad!: string;
  vl_custoad!: number;
  tp_custoad!: number;
  pagamentoParceladoId!: number;

  opcoes: Opcao[] = [];
  opcoesF: OpcaoF[] = [];
  opcoesCor: OpcaoCor[] = [
    { value: 'Incolor' },
    { value: 'Verde' },
    { value: 'Fumê' },
    { value: 'Cromado' },
  ];
  tipoPagamento: tipoPagamento[] = [
    { id: 1, nome: 'Pix' },
    { id: 2, nome: 'Cheque' },
    { id: 3, nome: 'Cartão de crédito' },
    { id: 4, nome: 'Cartão de dédito' },
  ];
  tipoPagamentoAdd: tipoPagamentoAdd[] = [
    { id: 1, nome: 'Empresa' },
    { id: 2, nome: 'Cliente' },
    { id: 3, nome: 'Ambos' },
  ];
  pagamentoParcelado:PagamentoParceladoCartao[] = [
    { id: 1, nome: '1x' },
    { id: 2, nome: '2x' },
    { id: 3, nome: '3x' },
    { id: 4, nome: '4x' },
    { id: 5, nome: '5x' },
    { id: 6, nome: '6x' },
    { id: 7, nome: '7x' },
    { id: 8, nome: '8x' },
    { id: 9, nome: '9x' },
    { id: 10, nome: '10x' },
    { id: 11, nome: '11x' },
    { id: 12, nome: '12x' },
  ];

  constructor(
    public dialogRef: MatDialogRef<DialogGenericoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private clientesService: ClientesService,
    private _fornecedorService: FornecedorService
  ) {
  }

  ngOnInit(): void {
    this.carregaCliente();
    this.carregaFornecedor();
  }

  dadosInput(): void {
    this.dialogRef.close({
      id: this.id,
      descricao: this.descricao,
      descricao2: this.descricao2,
      descricao3: this.descricao3,
      valor: this.valor,
      valor2: this.valor2,
      valorCusto: this.valorCusto,
      cor: this.cor,
      cliente: this.cliente,
      fornecedor: this.fornecedor,
      file: this.file,
      date: this.date,
      date2: this.date2,
      cnpj: this.cnpj,
      rg: this.rg,
      cpf: this.cpf,
      celular: this.celular,
      tipoPagamentoId: this.tipoPagamentoId,
      lg_custoad: this.lg_custoad,
      ds_custoadd: this.ds_custoad,
      vl_custoad: this.vl_custoad,
      tp_custoad: this.tp_custoad,
      pagamentoParceladoId: this.pagamentoParceladoId
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

  carregaFornecedor(): void {
    this._fornecedorService.getFornecedor().subscribe({
      next: (nomes) => {
        this.opcoesF = nomes.map((fornecedor) => ({
          id: fornecedor.id_fornece,
          value: fornecedor.no_fornece,
          disabled: false,
        }));
      },
      error: (err) => console.error('Erro ao carregar fornecedores:', err),
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

  onTypeChange(event: MatRadioChange): void {
    this.lg_custoad = event.value;
    this.exibirCamposAdicionais = this.lg_custoad === 'T';
  }

  onPayChange(event: MatSelectChange): void {
    this.exibirParcelamento = this.tipoPagamentoId === 3 /*|| this.tipoPagamentoId === 2*/;
  }
}
