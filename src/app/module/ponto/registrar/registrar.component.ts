import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, filter, interval, of, Subscription, switchMap, tap } from 'rxjs';
import { AlertService } from 'src/app/core/alert.service';
import { PontoLista, Registro } from 'src/app/model/ponto';
import { PontoService } from 'src/app/services/ponto/ponto.service';
import { DialogVerificacaoComponent } from 'src/app/shared/dialog/dialog-verificacao/dialog-verificacao.component';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: [
    './registrar.component.scss',
    '../../../styles/animate-fade-slide-in.scss',
    '../../../styles/spinner.scss',
  ],
})
export class RegistrarComponent implements OnInit, OnDestroy {
  spinnerCarregamento: boolean = false;
  dataSource = new MatTableDataSource<Registro>();
  displayedColumns: string[] = ['tipo', 'horario'];

  horaAtual!: string;
  private horarioSubscription!: Subscription;
  localizacao!: { latitude: number; longitude: number } | null;

  constructor(
    private _pontoService: PontoService,
    private _datePipe: DatePipe,
    private _dialog: MatDialog,
    private _notificationService: AlertService
  ) {}

  ngOnInit(): void {
    this.spinnerCarregamento = true;
    this.carregaDados();
    this.atualizarHorario();
    this.spinnerCarregamento = false;
  }

  ngOnDestroy(): void {
    if (this.horarioSubscription) {
      this.horarioSubscription.unsubscribe();
    }
  }

  /*----------------------Pegar os dados da tabela---------------------------*/
  private carregaDados(): void {
    const date = this._datePipe.transform(new Date(), 'yyyy-MM-dd');
    if (date) {
      this._pontoService.get(date).subscribe({
        next: (data: PontoLista[]) => {
          this.dataSource.data = data
            .sort((a, b) => b.nm_sequenc - a.nm_sequenc)
            .map((item) => {
              if (item.hr_entrada) {
                return { tipo: 'Entrada', horario: item.hr_entrada };
              } else if (item.hr_partida) {
                return { tipo: 'Saída', horario: item.hr_partida };
              }
              return { tipo: '', horario: '' };
            });
        },
        error: (error) => {
          console.error('Erro ao carregar dados:', error);
        },
      });
    }
  }

  /*----------------------Bater ponto---------------------------*/
  public abrirDialogo(): void {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.localizacao = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        const latitude = this.localizacao.latitude;
        const longitude = this.localizacao.longitude;
        const local = latitude + " / " + longitude;

        const dialogRef = this._dialog.open(DialogVerificacaoComponent, {
          maxWidth: '450px',
          data: {
            title: 'Ponto',
            msg: 'Deseja realmente bater o ponto?',
          },
        });

        const date = this._datePipe.transform(new Date(), 'yyyy-MM-dd');
        const agora = new Date().toLocaleTimeString();

        if (date) {
          dialogRef.afterClosed().pipe(
            filter((result) => result === true),
            tap(() => (this.spinnerCarregamento = true)),
            switchMap(() => {
              const ultimoRegistro = this.dataSource.data[0];
              const hr_entrada = ultimoRegistro == undefined || ultimoRegistro.tipo === 'Saída' ? agora : "";
              const hr_partida = hr_entrada === "" ? agora : "";
              return this._pontoService.save(date, hr_entrada, hr_partida, local);
            }),
            tap(() => this._notificationService.show('Ponto batido com sucesso!')),
            tap(() => {
              this.spinnerCarregamento = false;
              this.carregaDados();
            }),
            catchError((error) => {
              console.error(error);
              this.spinnerCarregamento = false;
              this._notificationService.show('Erro ao bater ponto!');
              return of([]);
            })
          ).subscribe();
        }
      },
      (error) => {
        console.error('Erro ao obter localização:', error);
        this._notificationService.show('Erro ao obter localização.');
      }
    );
  }

  /*----------------------Mostra hora em tempo real------------------------*/
  atualizarHorario(): void {
    this.horarioSubscription = interval(1000).subscribe(() => {
      const agora = new Date();
      this.horaAtual = agora.toLocaleTimeString();
    });
  }
}
