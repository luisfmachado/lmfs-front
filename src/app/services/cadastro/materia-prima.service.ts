import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MateriaPrima, MateriaPrimaVw } from 'src/app/model/materia-prima';
import { Resposta } from 'src/app/model/resposta';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MateriaPrimaService {
  protected readonly baseURL = environment.URL_API + '/materia';

  constructor(private http: HttpClient) {}

  /*----------------------Buscar---------------------------*/
  public get(): Observable<MateriaPrima[]> {
    return this.http.get<MateriaPrima[]>(`${this.baseURL}`);
  }

  public getVw(): Observable<MateriaPrimaVw[]> {
    return this.http.get<MateriaPrimaVw[]>(`${this.baseURL}/vw`);
  }

  /*----------------------Salvar---------------------------*/
  public save(
    no_materia: string,
    dt_movimen: string,
    tp_pagamen: number,
    id_fornece: number,
    lg_custoad: string,
    no_custoad: string,
    vl_custoad: number,
    tp_custoad: number,
    vl_pgmater: number
  ): Observable<Resposta> {
    return this.http.post<Resposta>(
      `${this.baseURL}/save`,
      {
        no_materia: no_materia,
        dt_movimen: dt_movimen,
        tp_pagamen: tp_pagamen,
        id_fornece: id_fornece,
        lg_custoad: lg_custoad,
        no_custoad: no_custoad,
        vl_custoad: vl_custoad,
        tp_custoad: tp_custoad,
        vl_pgmater: vl_pgmater,
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
}
