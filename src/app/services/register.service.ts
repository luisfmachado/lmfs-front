import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Usuarios } from '../model/users';
import { Resposta } from '../model/resposta';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private baseURL = environment.URL_API_FWT + '/auth';

  constructor(private http: HttpClient) {}

  /*----------------------Buscar---------------------------*/
  public get(): Observable<Usuarios[]> {
    return this.http.get<Usuarios[]>(`${this.baseURL}/users`);
  }

  public getAdmin(): Observable<Usuarios[]> {
    return this.http.get<Usuarios[]>(`${this.baseURL}/admins`);
  }

  /*----------------------Salvar---------------------------*/
  public save(
    descricao: string,
    senha: string,
    role: string,
    nome: string,
    rg: string,
    headers: HttpHeaders
  ): Observable<Resposta> {
    return this.http.post<Resposta>(
      `${this.baseURL}/register`,
      {
        name: nome,
        email: descricao,
        password: senha,
        role: role,
        rg: rg,
      },
      { headers: headers }
    );
  }

  /*----------------------Deletar---------------------------*/
  public delete(email: string): Observable<Resposta> {
    return this.http.delete<Resposta>(`${this.baseURL}/users/delete/${email}`);
  }

  /*----------------------Alterar senha---------------------------*/
  public update(senhaAntiga: string, senhaNova: string, token: string): Observable<Resposta> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const body = {
      oldPassword: senhaAntiga,
      newPassword: senhaNova
    };
    return this.http.post<Resposta>(`${this.baseURL}/updatepass`, body, { headers: headers });
  }
}
