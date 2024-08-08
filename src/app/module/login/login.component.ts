import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  spinnerCarregamento: boolean = false;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private alertService: AlertService
  ) {}

  login(): void {
    this.spinnerCarregamento = true;
    this.loginService.login(this.email, this.password).subscribe({
      next: (response) => {
        const userName = localStorage.getItem('name');
        this.router.navigate(['/home']);
        this.spinnerCarregamento = false;
      },
      error: (error) => {
        this.alertService.show(
          'Falha ao fazer login. Verifique seu e-mail e senha e tente novamente.',
          'Fechar'
        );
        this.spinnerCarregamento = false;
      },
    });
  }

  estaLogado() {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/home']);
    }
  }
}
