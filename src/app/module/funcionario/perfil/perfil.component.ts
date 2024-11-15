import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  catchError,
  filter,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { AlertService } from 'src/app/core/alert.service';
import { FuncionarioVw } from 'src/app/model/funcionario';
import { RegisterService } from 'src/app/services/auth/register.service';
import { FuncionarioService } from 'src/app/services/cadastro/funcionario.service';
import { DialogGenericoComponent } from 'src/app/shared/dialog/dialog-generico/dialog-generico.component';
import { DialogVerificacaoComponent } from 'src/app/shared/dialog/dialog-verificacao/dialog-verificacao.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: [
    './perfil.component.scss',
    '../../../styles/animate-fade-slide-in.scss',
    '../../../styles/spinner.scss',
  ],
})
export class PerfilComponent implements OnInit {
  constructor(
    private _funcionarioService: FuncionarioService,
    private _registerService: RegisterService,
    public _dialog: MatDialog,
    private _notificationService: AlertService
  ) {}

  public funcionarios$: Observable<FuncionarioVw[]> = of([]);

  public ngOnInit(): void {
    this.carregaDados();
  }

  spinnerCarregamento: boolean = false;

  //Colunas da tabela
  displayedColumns: string[] = [
    'cd_usuario',
    'no_funcion',
    'dt_emissao',
    'no_cargofu',
    'ds_emailfu',
    'acoes',
  ];

  //Tabela
  dataSource: MatTableDataSource<FuncionarioVw> =
    new MatTableDataSource<FuncionarioVw>();

  //Chama o paginator
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  /*----------------------Pegar os dados da tabela---------------------------*/
  private carregaDados() {
    this.spinnerCarregamento = true;
    this.funcionarios$ = this._funcionarioService.get().pipe(
      shareReplay(1),
      tap(() => (this.spinnerCarregamento = false)),
      catchError((error): Observable<any[]> => {
        console.error(error);
        this.spinnerCarregamento = false;
        return of([]);
      })
    );
  }

  /*----------------------Caixa de Pesquisa---------------------------*/
  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /*----------------------Caixa de dialogo para adicionar novo---------------------------*/
  public abrirDialogo(): void {
    const dialogRef = this._dialog.open(DialogGenericoComponent, {
      maxWidth: '950px',
      data: {
        titulo: 'Cadastrar:',
        descricao: 'Nome',
        rg: 'RG',
        cpf: 'CPF',
        date: 'Data de nascimento',
        celular: 'Celular',
        descricao2: 'Naturalidade',
        date2: 'Data de contratação',
        descricao3: 'Cargo',
        valor: 'Salário base',
        valor2: 'VT',
        valorCusto: 'VR',
        descricao4: 'Email',
        cancelar: 'Cancelar',
        confirmar: 'Cadastrar',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((result) => !!result),
        tap(() => (this.spinnerCarregamento = true)),
        switchMap((result) =>
          this._funcionarioService
            .save(
              result.descricao,
              result.rg,
              result.cpf,
              result.date,
              result.celular,
              result.descricao2,
              result.date2,
              result.descricao3,
              result.valor,
              result.valorCusto,
              result.valor2,
              result.descricao4
            )
            .pipe(
              switchMap(() =>
                this._registerService
                  .save(
                    result.descricao4,
                    '12345678',
                    'USER',
                    result.descricao,
                    result.rg
                  )
                  .pipe(
                    catchError((error) => {
                      console.error(
                        'Erro ao cadastrar no RegisterService:',
                        error
                      );
                      this.spinnerCarregamento = false;
                      this._notificationService.show(
                        'Erro ao cadastrar no registro!'
                      );
                      return of([]);
                    })
                  )
              ),
              tap(() =>
                this._notificationService.show('Cadastrado com sucesso!')
              ),
              switchMap(() => this._funcionarioService.get()),
              tap((funcionarios) => {
                this.funcionarios$ = of(funcionarios);
                this.spinnerCarregamento = false;
              })
            )
        ),
        catchError((error) => {
          console.error('Erro ao cadastrar o funcionário:', error);
          this.spinnerCarregamento = false;
          this._notificationService.show('Erro ao cadastrar funcionário!');
          return of([]);
        })
      )
      .subscribe();
  }

  /*----------------------Excluir da tabela---------------------------*/
  public delete(cd_usuario: number, ds_emailfu: string): void {
    const dialogRef = this._dialog.open(DialogVerificacaoComponent, {
      maxWidth: '450px',
      data: {
        title: 'Excluir funcionário',
        msg: 'Deseja realmente excluir esta funcionário?',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((result) => result === true),
        tap(() => (this.spinnerCarregamento = true)),
        switchMap(() =>
          this._funcionarioService.delete(cd_usuario).pipe(
            switchMap(() =>
              this._registerService.delete(ds_emailfu).pipe(
                catchError((error) => {
                  console.error('Erro ao excluir', error);
                  this.spinnerCarregamento = false;
                  this._notificationService.show(
                    'Erro ao excluir!'
                  );
                  return of([]);
                })
              )
            )
          )
        ),
        tap(() =>
          this._notificationService.show('Funcionário excluído com sucesso!')
        ),
        switchMap(() => this._funcionarioService.get()),
        tap((funcionarios) => {
          this.funcionarios$ = of(funcionarios);
          this.spinnerCarregamento = false;
        }),
        catchError((error) => {
          console.error(error);
          this.spinnerCarregamento = false;
          this._notificationService.show('Erro ao excluir!');
          return of([]);
        })
      )
      .subscribe();
  }
}
