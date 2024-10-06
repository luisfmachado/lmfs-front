import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Estoque } from 'src/app/model/estoque';
import { Resposta } from 'src/app/model/resposta';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EstoqueService {
  protected readonly baseURL = environment.URL_API + '/orcamento';

  constructor(private http: HttpClient) {}

  /*----------------------Buscar---------------------------*/
  public get(): Observable<Estoque[]> {
    return this.http.get<Estoque[]>(`${this.baseURL}`);
  }

  public save(
    id_produto: number,
    qt_produto: number,
    dt_movimen: string,
    vl_pgcusto: number
  ): Observable<Resposta> {
    return this.http.post<Resposta>(`${this.baseURL}/save`, {
      id_produto: id_produto,
      qt_produto: qt_produto,
      dt_movimen: dt_movimen,
      vl_pgcusto: vl_pgcusto,
    });
  }

  /*----------------------Deletar---------------------------*/
  public delete(id: number): Observable<Resposta> {
    return this.http.delete<Resposta>(`${this.baseURL}/delete/${id}`);
  }
}
