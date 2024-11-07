import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SystemConstants } from 'src/app/config/system.constants';
import { Fornecedor, OpcaoFornecedor } from 'src/app/model/fornecedor';
import { Resposta } from 'src/app/model/resposta';

@Injectable({
  providedIn: 'root',
})
export class FornecedorService {
  protected readonly baseURL = `${SystemConstants.api.url}/fornecedores`;

  constructor(private http: HttpClient) {}

  /*----------------------Buscar---------------------------*/
  public get(): Observable<Fornecedor[]> {
    return this.http.get<Fornecedor[]>(`${this.baseURL}`);
  }

  public getFornecedor(): Observable<OpcaoFornecedor[]> {
    return this.http.get<OpcaoFornecedor[]>(`${this.baseURL}/nome`);
  }

  /*----------------------Salvar---------------------------*/
  public save(
    no_fornece: string,
    nm_cnpjfor: string,
    nm_celular: string
  ): Observable<Resposta> {
    return this.http.post<Resposta>(
      `${this.baseURL}/save`,
      {
        no_fornece: no_fornece,
        nm_cnpjfor: nm_cnpjfor,
        nm_celular: nm_celular,
      },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }

  /*----------------------Deletar---------------------------*/
  public delete(id_fornece: number): Observable<Resposta> {
    return this.http.delete<Resposta>(`${this.baseURL}/delete/${id_fornece}`);
  }
}
