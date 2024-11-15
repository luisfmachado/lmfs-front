import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SystemConstants } from 'src/app/config/system.constants';
import { ApiService } from 'src/app/core/api.service';

@Injectable({
  providedIn: 'root'
})
export class RelatorioService {

  protected readonly baseURL = `${SystemConstants.api.url}/relatorio`;

  constructor(private api: ApiService, private http: HttpClient) {}

  public get(): Observable<any[]> {
    return this.api.get<any[]>(`${this.baseURL}`);
  }

  public gerarRelatorio(cd_relator: number, startDate: string, endDate: string): Observable<Blob> {
    const options = { responseType: 'blob' as 'json' };
    return this.http.get<Blob>(`${this.baseURL}/export/${cd_relator}/${startDate}/${endDate}`, options);
  }  
}
