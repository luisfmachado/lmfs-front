import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { formatInTimeZone } from 'date-fns-tz';
import { catchError, of, switchMap, tap } from 'rxjs';
import { AlertService } from 'src/app/core/alert.service';
import { ShopeeVw } from 'src/app/model/shopee';
import { ShopeeService } from 'src/app/services/integracao/shopee.service';
import { DialogGenericoComponent } from 'src/app/shared/dialog/dialog-generico/dialog-generico.component';

@Component({
  selector: 'app-shopee',
  templateUrl: './shopee.component.html',
  styleUrls: [
    './shopee.component.scss',
    '../../../styles/animate-fade-slide-in.scss',
    '../../../styles/spinner.scss',
  ],
})
export class ShopeeComponent implements OnInit {
  constructor(
    private _shopeeService: ShopeeService,
    public dialogo: MatDialog,
    private _notificationService: AlertService
  ) {}

  public ngOnInit(): void {
    this.spinnerCarregamento = true;
    this.carregaDados();
  }

  spinnerCarregamento: boolean = false;

  //Colunas da tabela
  displayedColumns: string[] = [
    'nm_sequenc',
    'ds_arquivo',
    'dt_cadastr',
    'no_usuario',
  ];

  //Tabela
  dataSource: MatTableDataSource<ShopeeVw> = new MatTableDataSource<ShopeeVw>();

  //Chama o paginator
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  /*----------------------Pegar os dados da tabela---------------------------*/
  private carregaDados() {
    this._shopeeService.get().subscribe({
      next: (data: ShopeeVw[]) => {
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

  /*----------------------Caixa de dialogo para importar---------------------------*/
  public abrirImport(): void {
    const user = localStorage.getItem('name');
    if (user) {
      const dialogRef = this.dialogo.open(DialogGenericoComponent, {
        maxWidth: '950px',
        data: {
          titulo: 'Importar:',
          file: 'File',
          cancelar: 'Cancelar',
          confirmar: 'Cadastrar',
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result?.file) {
          const date = formatInTimeZone(
            new Date(),
            'America/Sao_Paulo',
            'yyyy-MM-dd'
          );
          this.spinnerCarregamento = true;
          this._shopeeService
            .saveImport(result.file)
            .pipe(
              catchError((error) => {
                console.error('Erro ao importar', error);
                this.spinnerCarregamento = false;
                this._notificationService.show('Erro ao importar!');
                return of([]);
              }),
              tap(() => {
                this._notificationService.show('Importado com sucesso!');
              }),
              switchMap(() => {
                return this._shopeeService.save(result.file.name, date, user);
              }),
              catchError((error) => {
                console.error('Erro na segunda requisição', error);
                this._notificationService.show(
                  'Erro ao realizar a segunda requisição!'
                );
                return of([]);
              }),
              tap(() => {
                this._notificationService.show(
                  'Segunda requisição concluída com sucesso!'
                );
              })
            )
            .subscribe(() => {
              this.carregaDados();
              this.spinnerCarregamento = false;
            });
        } else {
          this.spinnerCarregamento = false;
        }
      });
    }
  }
}
