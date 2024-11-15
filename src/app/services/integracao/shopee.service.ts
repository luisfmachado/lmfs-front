import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SystemConstants } from 'src/app/config/system.constants';
import { ApiService } from 'src/app/core/api.service';
import { Resposta } from 'src/app/model/resposta';

@Injectable({
  providedIn: 'root',
})
export class ShopeeService {
  protected readonly baseURL = `${SystemConstants.api.url}/shopee`;

  constructor(private api: ApiService, private http: HttpClient) {}

  public get(): Observable<any[]> {
    return this.api.get<any[]>(`${this.baseURL}`);
  }

  public save(
    ds_arquivo: string,
    dt_cadastr: string,
    no_usuario: string
  ): Observable<any[]> {
    const body = {
      ds_arquivo: ds_arquivo,
      dt_cadastr: dt_cadastr,
      no_usuario: no_usuario,
    };
    return this.api.post(`${this.baseURL}/save`, body);
  }

  public saveImport(file: File): Observable<Resposta> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Resposta>(`${this.baseURL}/import`, formData);
  }
}
