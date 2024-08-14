import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Orcamento, OrcamentoVW } from 'src/app/model/orcamento';
import { Resposta } from 'src/app/model/resposta';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrcamentoService {

  protected readonly baseURL = environment.URL_API + '/orcamento';

  constructor(private http: HttpClient) {}


  /*----------------------Buscar---------------------------*/
  public get(): Observable<OrcamentoVW[]> {
    return this.http.get<OrcamentoVW[]>(`${this.baseURL}`);
  }

  public getIdOrcamen(): Observable<number> {
    return this.http.get<number>(`${this.baseURL}/id`);
  }
  /*----------------------Salvar---------------------------*/
  public save(produtos: Orcamento[]): Observable<Resposta> {
    return this.http.post<Resposta>(`${this.baseURL}/save`, produtos, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  /*----------------------Deletar---------------------------*/
  public delete(id: number): Observable<Resposta> {
    return this.http.delete<Resposta>(`${this.baseURL}/delete/${id}`);
  }

  /*----------------------Alterar---------------------------*/
  public update(id: number, descricao: string): Observable<Resposta> {
    return this.http.put<Resposta>(`${this.baseURL}/update/${id}`, {
      agenda: descricao,
    });
  }

  /*----------------------PROCEDURES---------------------------*/
  exec(id_orcamen: number, ds_orcamen: string): Observable<string> {
    return this.http.post<string>(`${this.baseURL}/exec`, null, {
      params: {
        id_orcamen: id_orcamen.toString(), // Converte para string
        ds_orcamen: ds_orcamen
      },
      responseType: 'text' as 'json' // Adiciona o tipo de resposta como texto
    });
  }
}
