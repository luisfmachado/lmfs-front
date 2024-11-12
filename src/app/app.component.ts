import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './services/auth/login.service';
import { AlertService } from './core/alert.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.scss',
    './styles/animate-fade-slide-in.scss',
    './styles/spinner.scss',
  ],
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
      transition('closed <=> open', [animate('300ms ease-in-out')]),
    ]),
  ],
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private _authService: LoginService
  ) {}

  title = 'lmfs';

  spinnerCarregamento: boolean = false;

  nome: string | null = '';
  role: string | null = '';
  isAdmin: boolean = false;

  isMenuOpen = true;

  ngOnInit(): void {
    this._authService.isLoggedIn$.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.getNome();
      }
    });
  }

  getNome() {
    this.nome = localStorage.getItem('name');
    const regra = localStorage.getItem('roles');
    if (regra === '"ADMIN"') {
      this.role = 'Administrador';
      this.isAdmin = true;
    } else if (regra === '"USER"') {
      this.role = 'Usuário';
    }
    console.log(this.isAdmin);
  }

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
    this.isAdmin = false;
    this.role = null;
    this.nome = null;
    this.spinnerCarregamento = false;
    this.router.navigate(['/login']);
  }
}
