import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuncionarioService } from 'src/app/services/cadastro/funcionario.service';

interface FuncionariosNome {
  id: number;
  value: string;
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
  listaFuncionario: FuncionariosNome[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogFiltrosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private _funcionarioService: FuncionarioService
  ) {
    this.range = this.fb.group({
      start: [null],
      end: [null],
    });
  }

  ngOnInit(): void {
    this.getNome();
  }

  dadosInput(): void {
    this.dialogRef.close({
      date: this.date,
      range: this.range.value,
      funcionario: this.funcionario
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
}
