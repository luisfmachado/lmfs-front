import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FornecedorService } from 'src/app/services/cadastro/fornecedor.service';
import { FuncionarioService } from 'src/app/services/cadastro/funcionario.service';

interface FuncionariosNome {
  id: number;
  value: string;
}

interface OpcaoF {
  value: string;
  id: number;
  disabled: boolean;
}

@Component({
  selector: 'app-dialog-filtros',
  templateUrl: './dialog-filtros.component.html',
  styleUrls: [
    './dialog-filtros.component.scss',
    '../dialog-generico/dialog-generico.component.scss',
  ],
})
export class DialogFiltrosComponent implements OnInit {
  range: FormGroup;
  date: Date | null = null;
  funcionario: string = '';
  fornecedor: string | null = null;
  listaFuncionario: FuncionariosNome[] = [];
  opcoesF: OpcaoF[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogFiltrosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private _funcionarioService: FuncionarioService,
    private _fornecedorService: FornecedorService
  ) {
    this.range = this.fb.group({
      start: [null],
      end: [null],
    });
  }

  ngOnInit(): void {
    this.getNome();
    this.carregaFornecedor();
  }

  dadosInput(): void {
    this.dialogRef.close({
      date: this.date,
      range: this.range.value,
      funcionario: this.funcionario,
      fornecedor: this.fornecedor
    });
  }

  private getNome() {
    this._funcionarioService.getName().subscribe({
      next: (data: string[]) => {
        this.listaFuncionario = data.map((nome, index) => ({
          id: index + 1,
          value: nome,
        }));
      }
    });
  }

  private carregaFornecedor(): void {
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
}
