import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './module/home/home.component';
import { LoginComponent } from './module/login/login.component';
import { AdminGuard } from './guards/admin.guard';
import { OrcamentoComponent } from './module/cadastro/orcamento/orcamento.component';
import { ProdutosComponent } from './module/cadastro/produtos/produtos.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },

  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AdminGuard],
    data: { roles: ['USER', 'ADMIN'] },
  },

  {
    path: 'cadastro/orcamento',
    component: OrcamentoComponent,
    canActivate: [AdminGuard],
    data: { roles: ['USER', 'ADMIN'] },
  },

  {
    path: 'cadastro/produtos',
    component: ProdutosComponent,
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
