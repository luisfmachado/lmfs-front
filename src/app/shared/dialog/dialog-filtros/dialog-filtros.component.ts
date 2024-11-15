import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-filtros',
  templateUrl: './dialog-filtros.component.html',
  styleUrls: ['./dialog-filtros.component.scss'],
})
export class DialogFiltrosComponent {
  range: FormGroup;
  date: Date | null = null;

  constructor(
    public dialogRef: MatDialogRef<DialogFiltrosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.range = this.fb.group({
      start: [null],
      end: [null],
    });
  }

  dadosInput(): void {
    this.dialogRef.close({
      date: this.date,
      range: this.range.value
    });
  }
}
