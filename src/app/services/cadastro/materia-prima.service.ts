import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SystemConstants } from 'src/app/config/system.constants';
import {
  MateriaPrima,
  MateriaPrimaVw,
  TipoMaterial,
} from 'src/app/model/materia-prima';
import { Resposta } from 'src/app/model/resposta';

@Injectable({
  providedIn: 'root',
})
export class MateriaPrimaService {
  protected readonly baseURL = `${SystemConstants.api.url}/materia`;
  protected readonly baseURLTipo = `${SystemConstants.api.url}/tpmat`;

  constructor(private http: HttpClient) {}

  /*----------------------Buscar---------------------------*/
  public get(): Observable<MateriaPrima[]> {
    return this.http.get<MateriaPrima[]>(`${this.baseURL}`);
  }

  public getVw(): Observable<MateriaPrimaVw[]> {
    return this.http.get<MateriaPrimaVw[]>(`${this.baseURL}/vw`);
  }

  public getTp(): Observable<TipoMaterial[]> {
    return this.http.get<TipoMaterial[]>(`${this.baseURLTipo}`);
  }

  /*----------------------Salvar---------------------------*/
  public save(
    no_materia: string,
    dt_movimen: string,
    id_fornece: number,
    lg_custoad: string,
    no_custoad: string,
    vl_custoad: number,
    tp_custoad: number,
    quantidade: number
  ): Observable<Resposta> {
    return this.http.post<Resposta>(
      `${this.baseURL}/save`,
      {
        no_materia: no_materia,
        dt_movimen: dt_movimen,
        id_fornece: id_fornece,
        lg_custoad: lg_custoad,
        no_custoad: no_custoad,
        vl_custoad: vl_custoad,
        tp_custoad: tp_custoad,
        qt_materia: quantidade,
      },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }

  public saveTp(no_materia: string, vl_custoun: number): Observable<Resposta> {
    return this.http.post<Resposta>(
      `${this.baseURLTipo}/save`,
      { no_materia: no_materia, vl_custoun: vl_custoun },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }

  public savePagamento(
    id_materia: number,
    dt_pagamen: string,
    vl_pagamen: number
  ): Observable<Resposta> {
    return this.http.post<Resposta>(
      `${this.baseURL}/pagamento`,
      {
        id_materia: id_materia,
        dt_pagamen: dt_pagamen,
        vl_pagamen: vl_pagamen,
      },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }

  /*----------------------Deletar---------------------------*/
  public delete(nm_sequenc: number): Observable<Resposta> {
    return this.http.delete<Resposta>(`${this.baseURL}/delete/${nm_sequenc}`);
  }

  public deleteTp(nm_sequenc: number): Observable<Resposta> {
    return this.http.delete<Resposta>(
      `${this.baseURLTipo}/delete/${nm_sequenc}`
    );
  }
}
