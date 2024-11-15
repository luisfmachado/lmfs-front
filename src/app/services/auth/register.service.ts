import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SystemConstants } from 'src/app/config/system.constants';
import { Resposta } from 'src/app/model/resposta';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  protected readonly baseURL = `${SystemConstants.api.fwt}/auth`;

  constructor(private http: HttpClient) {}

  /*----------------------Salvar---------------------------*/
  public save(
    descricao: string,
    senha: string,
    role: string,
    nome: string,
    rg: string
  ): Observable<Resposta> {
    console.log('descricao - ', descricao);
    console.log('senha - ',senha);
    console.log('role - ',role);
    console.log('nome - ',nome);
    console.log('rg - ',rg);
    return this.http.post<Resposta>(
      `${this.baseURL}/register`,
      {
        email: descricao,
        password: senha,
        role: role,
        name: nome,
        rg: rg,
      }
    );
  }

  /*----------------------Deletar---------------------------*/
  public delete(email: string): Observable<Resposta> {
    return this.http.delete<Resposta>(`${this.baseURL}/users/delete/${email}`);
  }

  /*----------------------Alterar senha---------------------------*/
  // public update(senhaAntiga: string, senhaNova: string, token: string): Observable<Resposta> {
  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${token}`
  //   });
  //   const body = {
  //     oldPassword: senhaAntiga,
  //     newPassword: senhaNova
  //   };
  //   return this.http.post<Resposta>(`${this.baseURL}/updatepass`, body, { headers: headers });
  // }
}
