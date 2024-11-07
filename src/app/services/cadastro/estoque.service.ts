import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SystemConstants } from 'src/app/config/system.constants';
import { EstoqueVw, Produtos } from 'src/app/model/estoque';
import { Resposta } from 'src/app/model/resposta';

@Injectable({
  providedIn: 'root',
})
export class EstoqueService {
  protected readonly baseURL = `${SystemConstants.api.url}/estoque`;

  constructor(private http: HttpClient) {}

  /*----------------------Buscar---------------------------*/
  public get(): Observable<EstoqueVw[]> {
    return this.http.get<EstoqueVw[]>(`${this.baseURL}/vw`);
  }

  public getIdEstoque(): Observable<number> {
    return this.http.get<number>(`${this.baseURL}/id`);
  }

  /*----------------------Salvar---------------------------*/
  public save(ds_estoque: string, id_fornece: number, date: string, estoques: Produtos[], ): Observable<Resposta> {
    const body = {
      ds_estoque: ds_estoque,
      id_fornece: id_fornece,
      dt_movimen: date,
      estoques: estoques
    };
    return this.http.post<Resposta>(`${this.baseURL}/save`, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  /*----------------------Deletar---------------------------*/
  public delete(id: number): Observable<Resposta> {
    return this.http.delete<Resposta>(`${this.baseURL}/delete/${id}`);
  }
}
