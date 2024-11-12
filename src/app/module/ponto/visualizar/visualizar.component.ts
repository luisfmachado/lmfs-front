import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from 'src/app/core/alert.service';
import { PontoVw } from 'src/app/model/ponto';
import { PontoService } from 'src/app/services/ponto/ponto.service';

@Component({
  selector: 'app-visualizar',
  templateUrl: './visualizar.component.html',
  styleUrls: [
    './visualizar.component.scss',
    '../../../styles/animate-fade-slide-in.scss',
    '../../../styles/spinner.scss',
  ],
})
export class VisualizarComponent implements OnInit {
  constructor(
    private _pontoService: PontoService,
    public dialogo: MatDialog,
    private alertService: AlertService
  ) {}

  public ngOnInit(): void {
    this.carregaDados();
  }

  spinnerCarregamento: boolean = false;

  displayedColumns: string[] = ['dt_movimen', 'nm_usuario'];

  //Tabela
  dataSource: MatTableDataSource<PontoVw> = new MatTableDataSource<PontoVw>();

  //Chama o paginator
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  /*----------------------Pegar os dados da tabela---------------------------*/
  private carregaDados() {
    this._pontoService.getAllPontos().subscribe({
      next: (data: PontoVw[]) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.updateDisplayedColumns(data);
        this.spinnerCarregamento = false;
      },
    });
  }

  updateDisplayedColumns(pontos: any[]) {
    const columnsWithData = ['dt_movimen', 'nm_usuario'];

    for (let i = 1; i <= 5; i++) {
      if (pontos.some((p) => p[`hr_entrada${i}`])) {
        columnsWithData.push(`hr_entrada${i}`);
      }
      if (pontos.some((p) => p[`hr_partida${i}`])) {
        columnsWithData.push(`hr_partida${i}`);
      }
    }

    this.displayedColumns = columnsWithData;
  }

  /*----------------------Caixa de Pesquisa---------------------------*/
  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
