import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Produtos } from 'src/app/model/produtos';
import { Resposta } from 'src/app/model/resposta';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {

  protected readonly baseURL = environment.URL_API + '/produtos';

  constructor(private http: HttpClient) {}


  /*----------------------Buscar---------------------------*/
  public get(): Observable<Produtos[]> {
    return this.http.get<Produtos[]>(`${this.baseURL}`);
  }

  public getNome(): Observable<{ ds_produto: string, id_produto: number }[]> {
    return this.http.get<{ ds_produto: string, id_produto: number }[]>(`${this.baseURL}/nome`);
  }

  /*----------------------Salvar---------------------------*/
  public save(ds_produto: string, vl_produto: number, ds_corprod: string, id_cliente: number): Observable<Resposta> {
    console.log(ds_produto, vl_produto, ds_corprod, id_cliente);
    return this.http.post<Resposta>(`${this.baseURL}/save`, {
      ds_produto: ds_produto,
      vl_produto: vl_produto,
      ds_corprod: ds_corprod,
      id_cliente: id_cliente
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
}
