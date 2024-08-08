import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './module/home/home.component';
import { OrcamentoComponent } from './module/orcamento/orcamento.component';
import { LoginComponent } from './module/login/login.component';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },

  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AdminGuard],
    data: { roles: ['USER', 'ADMIN'] },
  },

  {
    path: 'orcamento',
    component: OrcamentoComponent,
    canActivate: [AdminGuard],
    data: { roles: ['USER', 'ADMIN'] },
  },

  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
