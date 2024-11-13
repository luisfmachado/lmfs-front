import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Relatorio } from 'src/app/model/relatorio';
import { RelatorioService } from 'src/app/services/relatorio/relatorio.service';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-manual',
  templateUrl: './manual.component.html',
  styleUrls: [
    './manual.component.scss',
    '../../../styles/animate-fade-slide-in.scss',
    '../../../styles/spinner.scss',
  ],
})
export class ManualComponent implements OnInit {
  constructor(
    private _relatorioService: RelatorioService,
    private http: HttpClient
  ) {}

  public ngOnInit(): void {
    this.spinnerCarregamento = true;
    this.carregaDados();
  }

  spinnerCarregamento: boolean = false;

  //Colunas da tabela
  displayedColumns: string[] = ['cd_relator', 'ds_relator', 'acoes'];

  //Tabela
  dataSource: MatTableDataSource<Relatorio> =
    new MatTableDataSource<Relatorio>();

  //Chama o paginator
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  /*----------------------Pegar os dados da tabela---------------------------*/
  private carregaDados() {
    this._relatorioService.get().subscribe({
      next: (data: Relatorio[]) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.spinnerCarregamento = false;
      },
    });
  }

  /*----------------------Caixa de Pesquisa---------------------------*/
  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /*----------------------Download Arquivo---------------------------*/
  gerarRelatorio(cd_relator: number) {
    this._relatorioService.gerarRelatorio(cd_relator).subscribe(
      (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'relatorio.pdf';
        link.click();
      },
      (error) => {
        console.error('Erro ao gerar o relatório', error);
      }
    );
  }
}
