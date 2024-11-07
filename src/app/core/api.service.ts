import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(public readonly http: HttpClient) {}

  public get<T>(url: string, req?: any | HttpParams): Observable<T> {
    const params = this.resolveParams(req);
    return this.http.get<T>(url, { params }).pipe(take(1));
  }

  public put<T>(
    url: string,
    body: any = {},
    req?: any | HttpParams
  ): Observable<T> {
    const params = this.resolveParams(req);
    return this.http.put<T>(url, body, { params }).pipe(take(1));
  }

  public patch<T>(
    url: string,
    body: any = {},
    req?: any | HttpParams
  ): Observable<T> {
    const params = this.resolveParams(req);
    return this.http.patch<T>(url, body, { params }).pipe(take(1));
  }

  public post<T>(
    url: string,
    body: any = {},
    req?: any | HttpParams
  ): Observable<T> {
    const params = this.resolveParams(req);
    return this.http.post<T>(url, body, { params }).pipe(take(1));
  }

  public delete<T>(url: string, req?: any | HttpParams): Observable<T> {
    const params = this.resolveParams(req);
    return this.http.delete<T>(url, { params }).pipe(take(1));
  }

  private resolveParams(req: any = {}): HttpParams {
    if (req instanceof HttpParams) {
      return req;
    }

    let params = new HttpParams();

    Object.keys(req).forEach((key) => {
      if (req[key] !== undefined && req[key] !== null) {
        params = params.set(key, req[key]);
      }
    });

    return params;
  }
}
