import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Clientes } from 'src/app/model/clientes';
import { Resposta } from 'src/app/model/resposta';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  protected readonly baseURL = environment.URL_API + '/clientes';

  constructor(private http: HttpClient) {}

  /*----------------------Buscar---------------------------*/
  public get(): Observable<Clientes[]> {
    return this.http.get<Clientes[]>(`${this.baseURL}`);
  }

  public getNome(): Observable<{ id_cliente: number; no_cliente: string }[]> {
    return this.http.get<{ id_cliente: number; no_cliente: string }[]>(
      `${this.baseURL}/nome`
    );
  }

  /*----------------------Salvar---------------------------*/
  public save(
    no_cliente: string,
    ds_cnpjcli: string,
    nm_celular: string
  ): Observable<Resposta> {
    return this.http.post<Resposta>(
      `${this.baseURL}/save`,
      {
        no_cliente: no_cliente,
        ds_cnpjcli: ds_cnpjcli,
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
  public delete(id_cliente: number): Observable<Resposta> {
    return this.http.delete<Resposta>(
      `${this.baseURL}/delete/${id_cliente}`
    );
  }
}
