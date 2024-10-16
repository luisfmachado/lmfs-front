import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Estoque } from 'src/app/model/estoque';
import { OpcaoFornecedor } from 'src/app/model/fornecedor';
import { Resposta } from 'src/app/model/resposta';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FornecedorService {
  protected readonly baseURL = environment.URL_API + '/fornecedores';

  constructor(private http: HttpClient) {}

  /*----------------------Buscar---------------------------*/
  public getFornecedor(): Observable<OpcaoFornecedor[]> {
    return this.http.get<OpcaoFornecedor[]>(`${this.baseURL}/nome`);
  }

  /*----------------------Salvar---------------------------*/
  public save(estoque: Estoque[]): Observable<Resposta> {
    return this.http.post<Resposta>(`${this.baseURL}/save`, estoque, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }
}
