import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private router: Router) {}

  title = 'lmfs';

  public selectedItem: string | null = null;
  public showSubmenuMap: { [key: string]: boolean } = {};

  public toggleSubmenu(item: string) {
    this.showSubmenuMap[item] = !this.showSubmenuMap[item];
  }

  public showSubmenu(item: string): boolean {
    return this.showSubmenuMap[item];
  }

  isLoginRoute(): boolean {
    return this.router.url === '/login';
  }
}
