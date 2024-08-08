import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private snackBar: MatSnackBar, private http: HttpClient) {}

  protected readonly baseURL = environment.URL_API + '/email';

  show(message: string, action: string = 'Fechar'): void {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  enviarEmail(emailArray: string[]): Observable<any> {
    return this.http.post<any>(`${this.baseURL}/home`, emailArray, {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
