import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { environment } from 'src/environments/environment';

interface CustomJwtPayload {
  iss: string;
  sub: string;
  exp: number;
  roles: string[];
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private loginUrl = environment.URL_API + '/auth/login';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.loginUrl, { email, password }).pipe(
      map((response) => {
        localStorage.setItem('token', response.token);
        const decodedToken: CustomJwtPayload = jwtDecode<CustomJwtPayload>(
          response.token
        );
        localStorage.setItem('name', response.name);
        localStorage.setItem('roles', JSON.stringify(decodedToken.roles));
        setTimeout(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('roles');
          localStorage.removeItem('name');
        }, 5 * 60 * 60 * 1000); // 5 horas
        return response;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    localStorage.removeItem('name');
  }

  public get userRoles(): string[] {
    const roles = localStorage.getItem('roles');
    return roles ? JSON.parse(roles) : [];
  }
}
