import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { environment } from 'src/environments/environment';
import { SystemConstants } from '../../config/system.constants';

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
  protected readonly loginUrl = `${SystemConstants.api.fwt}/auth/login`;

  private _isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isLoggedIn());
  public isLoggedIn$: Observable<boolean> = this._isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkAndClearLocalStorage();
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.loginUrl, { email, password }).pipe(
      map((response) => {
        localStorage.setItem('token', response.token);
        const decodedToken: CustomJwtPayload = jwtDecode<CustomJwtPayload>(response.token);
        localStorage.setItem('name', response.name);
        localStorage.setItem('roles', JSON.stringify(decodedToken.roles));

        this._isLoggedInSubject.next(true);

        setTimeout(() => {
          this.clearLocalStorage();
        }, 5 * 60 * 60 * 1000);

        return response;
      })
    );
  }

  logout() {
    this.clearLocalStorage();
    this._isLoggedInSubject.next(false);
  }

  public get userRoles(): string[] {
    const roles = localStorage.getItem('roles');
    return roles ? JSON.parse(roles) : [];
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return token !== null && token !== '';
  }

  private readonly clearInterval = 3 * 60 * 60 * 1000;
  private readonly lastClearKey = 'lastClearTime';

  private checkAndClearLocalStorage(): void {
    const now = Date.now();
    const lastClear = localStorage.getItem(this.lastClearKey);

    if (lastClear) {
      const lastClearTime = parseInt(lastClear, 10);
      if (now - lastClearTime >= this.clearInterval) {
        this.clearLocalStorage();
      }
    } else {
      // Se não houver registro anterior, cria um novo.
      localStorage.setItem(this.lastClearKey, now.toString());
    }
  }

  private clearLocalStorage(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    localStorage.removeItem('name');
    localStorage.setItem(this.lastClearKey, Date.now().toString());
    localStorage.clear();
  }
}
