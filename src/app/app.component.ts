import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'lmfs';

  public selectedItem: string | null = null;
  public showSubmenuMap: { [key: string]: boolean } = {};

  public toggleSubmenu(item: string) {
    this.showSubmenuMap[item] = !this.showSubmenuMap[item];
  }

  public showSubmenu(item: string): boolean {
    return this.showSubmenuMap[item];
  }
}
