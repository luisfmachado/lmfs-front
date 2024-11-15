import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-verificacao',
  templateUrl: './dialog-verificacao.component.html',
  styleUrls: ['./dialog-verificacao.component.scss'],
})
export class DialogVerificacaoComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { title: string; msg: string }
  ) {}
}
