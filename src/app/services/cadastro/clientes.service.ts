import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Clientes } from 'src/app/model/clientes';
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

  public getNome(): Observable<{ id_cliente: number, no_cliente: string }[]> {
    return this.http.get<{ id_cliente: number, no_cliente: string }[]>(`${this.baseURL}/nome`);
  }
}
