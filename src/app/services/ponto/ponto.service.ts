import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SystemConstants } from 'src/app/config/system.constants';
import { ApiService } from 'src/app/core/api.service';

@Injectable({
  providedIn: 'root',
})
export class PontoService {
  protected readonly baseURL = `${SystemConstants.api.url}/ponto`;

  constructor(private api: ApiService) {}

  public get(dt_movimen: string): Observable<any[]> {
    return this.api.get<any[]>(`${this.baseURL}/${dt_movimen}`);
  }

  public getAllPontos(): Observable<any[]> {
    const role = localStorage.getItem('roles');
    if (role == '"ADMIN"') {
      return this.api.get<any[]>(`${this.baseURL}/all`);
    }
    return this.api.get<any[]>(`${this.baseURL}/allu`);
  }

  public save(
    dt_movimen: string,
    hr_entrada: string,
    hr_partida: string,
    ds_localiz: string
  ): Observable<any[]> {
    const body = {
      dt_movimen: dt_movimen,
      hr_entrada: hr_entrada,
      hr_partida: hr_partida,
      ds_localiz: ds_localiz,
    };
    return this.api.post<any[]>(`${this.baseURL}/save`, body);
  }
}
