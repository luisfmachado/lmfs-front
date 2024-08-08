import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './services/login.service';
import { AlertService } from './services/alert.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss', './styles/animate-fade-slide-in.scss', './styles/spinner.scss'],
  animations: [
    trigger('rotateMenuIcon', [
      state('closed', style({ transform: 'rotate(0deg)' })),
      state('open', style({ transform: 'rotate(180deg)' })),
      transition('closed <=> open', animate('300ms ease-in-out')),
    ]),
    trigger('rotateIcon', [
      state('closed', style({ transform: 'rotate(0deg)' })),
      state('open', style({ transform: 'rotate(180deg)' })),
      transition('closed <=> open', animate('300ms ease-in-out')),
    ]),
    trigger('submenuAnimation', [
      state('open', style({ height: '*', opacity: 1 })),
      state('closed', style({ height: '0', opacity: 0 })),
      transition('closed <=> open', [
        animate('300ms ease-in-out')
      ]),
    ])
  ],
})
export class AppComponent {
  constructor(
    private router: Router,
    private loginService: LoginService,
    private alertService: AlertService
  ) {}

  title = 'lmfs';

  spinnerCarregamento: boolean = false;

  
  isMenuOpen = true;

  toggleMenu(sidenav: any) {
    sidenav.toggle();
    this.isMenuOpen = !this.isMenuOpen;
  }

  public submenuState: { [key: string]: boolean } = {};

  toggleSubmenu(submenu: string): void {
    this.submenuState[submenu] = !this.submenuState[submenu];
  }

  showSubmenu(submenu: string): boolean {
    return this.submenuState[submenu];
  }

  public selectedItem: string | null = null;
  public showSubmenuMap: { [key: string]: boolean } = {};

  isLoginRoute(): boolean {
    return this.router.url === '/login';
  }

  logout() {
    this.spinnerCarregamento = true;
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    localStorage.removeItem('name');
    this.spinnerCarregamento = false;
    this.router.navigate(['/login']);
  }
}
