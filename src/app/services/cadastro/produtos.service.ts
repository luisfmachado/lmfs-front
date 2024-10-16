import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Produtos } from 'src/app/model/produtos';
import { Resposta } from 'src/app/model/resposta';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProdutosService {
  protected readonly baseURL = environment.URL_API + '/produtos';

  constructor(private http: HttpClient) {}

  /*----------------------Buscar---------------------------*/
  public get(): Observable<Produtos[]> {
    return this.http.get<Produtos[]>(`${this.baseURL}`);
  }

  public getNome(): Observable<{ ds_produto: string; id_produto: number }[]> {
    return this.http.get<{ ds_produto: string; id_produto: number }[]>(
      `${this.baseURL}/nome`
    );
  }

  /*----------------------Salvar---------------------------*/
  public save(
    id_produto: number,
    ds_produto: string,
    vl_produto: number,
    ds_corprod: string,
    id_cliente: number
  ): Observable<Resposta> {
    return this.http.post<Resposta>(`${this.baseURL}/save`, {
      id_produto: id_produto,
      ds_produto: ds_produto,
      vl_produto: vl_produto,
      ds_corprod: ds_corprod,
      id_cliente: id_cliente,
    });
  }

  public saveImport(file: File): Observable<Resposta> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Resposta>(`${this.baseURL}/import`, formData, { responseType: 'text' as 'json' });
  }

  public exec(): Observable<string> {
    return this.http.post<string>(`${this.baseURL}/exec`, null, {
      responseType: 'text' as 'json'
    });
  }

  /*----------------------Deletar---------------------------*/
  public delete(id_produto: number, id_cliente: number): Observable<Resposta> {
    return this.http.delete<Resposta>(
      `${this.baseURL}/delete/${id_produto}/${id_cliente}`
    );
  }

  /*----------------------Alterar---------------------------*/
  public update(
    id_produto: number,
    ds_produto: string,
    vl_produto: number,
    vl_custopr: number,
    ds_corprod: string,
    id_cliente: number
  ): Observable<Resposta> {
    return this.http.put<Resposta>(`${this.baseURL}/update`, null, {
      params: {
        id_produto: id_produto.toString(),
        ds_produto: ds_produto,
        vl_produto: vl_produto.toString(),
        vl_custopr: vl_custopr.toString(),
        ds_corprod: ds_corprod,
        id_cliente: id_cliente.toString(),
      },
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  public getProduto(
    id_produto: number,
    id_cliente: number
  ): Observable<Produtos[]> {
    return this.http.get<Produtos[]>(
      `${this.baseURL}/${id_produto}/${id_cliente}`
    );
  }
}
