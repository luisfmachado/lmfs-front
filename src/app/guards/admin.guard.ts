import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { LoginService } from '../services/login.service';
import { AlertService } from '../services/alert.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: LoginService,
    private alertService: AlertService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data['roles'] as string[];
    const userRoles = this.authService.userRoles;

    if (!requiredRoles.some((role) => userRoles.includes(role))) {
      this.alertService.show('Você não tem permissão para acessar esta página.', 'Fechar');
      return false;
    }

    return true;
  }
}
