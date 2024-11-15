import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { formatInTimeZone } from 'date-fns-tz';
import { Relatorio } from 'src/app/model/relatorio';
import { RelatorioService } from 'src/app/services/relatorio/relatorio.service';
import { DialogFiltrosComponent } from 'src/app/shared/dialog/dialog-filtros/dialog-filtros.component';

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
    private readonly _relatorioService: RelatorioService,
    public dialogo: MatDialog
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
    const dialogRef = this.dialogo.open(DialogFiltrosComponent, {
      maxWidth: '950px',
      data: {
        title: 'Filtros',
        date: 'Data',
        funcionario: 'Funcionário',
        cancelar: 'Cancelar',
        confirmar: 'Gerar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinnerCarregamento = true;

        let startDate = result.range.start;
        let endDate = result.range.end;
        let nm_usuario = result.funcionario;

        if (result.range.start != null) {
          startDate = formatInTimeZone(
            result.range.start,
            'America/Sao_Paulo',
            'ddMMyyyy'
          );
          endDate = formatInTimeZone(
            result.range.end,
            'America/Sao_Paulo',
            'ddMMyyyy'
          );
        }
        
        if (nm_usuario == '') {
          nm_usuario = null;
        }

        console.log(nm_usuario);

        this._relatorioService
          .gerarRelatorio(cd_relator, startDate, endDate, nm_usuario)
          .subscribe(
            (response: Blob) => {
              const blob = new Blob([response], { type: 'application/pdf' });
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = 'relatorio.pdf';
              link.click();
              this.spinnerCarregamento = false;
            },
            (error) => {
              console.error('Erro ao gerar o relatório', error);
              this.spinnerCarregamento = false;
            }
          );
      }
    });
  }
}
