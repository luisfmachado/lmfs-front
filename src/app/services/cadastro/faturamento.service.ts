import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SystemConstants } from 'src/app/config/system.constants';
import { Resposta } from 'src/app/model/resposta';

@Injectable({
  providedIn: 'root',
})
export class FaturamentoService {
  protected readonly baseURL = `${SystemConstants.api.url}/faturamento`;

  constructor(private http: HttpClient) {}

  /*----------------------Buscar---------------------------*/

  /*----------------------Alterar---------------------------*/
  public updtFo(id_orcamen: number, lg_faturad: number): Observable<Resposta> {
    const params = new HttpParams()
      .set('id_orcamen', id_orcamen.toString())
      .set('lg_faturad_number', lg_faturad.toString());

    return this.http.put<Resposta>(
      `${this.baseURL}/lgfaturad`,
      {},
      {
        params: params,
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }

  public updatePagamento(
    id_orcamen: number,
    tp_pagamen: number,
    qt_parcela: number,
    dt_pagamen: string
  ): Observable<Resposta> {
    const body = {
      id_orcamen: id_orcamen,
      tp_pagamen: tp_pagamen,
      qt_parcela: qt_parcela,
      dt_pagamen: dt_pagamen,
    };
    return this.http.put<Resposta>(`${this.baseURL}/pagamento`, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }
}
