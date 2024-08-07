import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resposta } from 'src/app/model/resposta';
import { TipoGasto } from 'src/app/model/tipo-gasto';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TipoGastoService {

  protected readonly baseURL = environment.URL_API + "/tipoGasto";

  constructor(private http: HttpClient) { }

  /*----------------------Buscar do TP_GASTO---------------------------*/
  public get(): Observable<TipoGasto[]> {
    return this.http.get<TipoGasto[]>(`${this.baseURL}`);
  }

  /*----------------------Salvar no TP_GASTO---------------------------*/
  public save(descricao: string): Observable<Resposta> {
    return this.http.post<Resposta>(`${this.baseURL}/save`, {ds_tp_gasto: descricao});
  }

  /*----------------------Deletar do TP_GASTO---------------------------*/
  public delete(id_tp_gasto: number): Observable<Resposta> {
    return this.http.delete<Resposta>(`${this.baseURL}/delete/${id_tp_gasto}`);
  }

  /*----------------------Alterar do TP_GASTO---------------------------*/
  public update(id_tp_gasto: number, descricao: string): Observable<Resposta> {
    return this.http.put<Resposta>(`${this.baseURL}/update/${id_tp_gasto}`, { ds_tp_gasto: descricao });
  }  
}
