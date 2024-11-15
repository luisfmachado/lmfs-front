import { DatePipe, registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMaskDirective, NgxMaskPipe, provideEnvironmentNgxMask } from 'ngx-mask';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProdutosComponent } from './module/cadastro/produtos/produtos.component';
import { HomeComponent } from './module/home/home.component';
import { LoginComponent } from './module/login/login.component';
import { AuthInterceptor } from './core/auth-interceptor.service';
import { DialogGenericoComponent } from './shared/dialog/dialog-generico/dialog-generico.component';
import { MaterialModule } from './shared/material.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { OrcamentoComponent } from './module/cadastro/orcamento/orcamento.component';
import { ClienteComponent } from './module/cadastro/cliente/cliente.component';
import { OrcamentoManualComponent } from './module/cadastro/orcamento-manual/orcamento-manual.component';
import { DialogEdicaoComponent } from './shared/dialog/dialog-edicao/dialog-edicao.component';
import { EstoqueComponent } from './module/cadastro/estoque/estoque.component';
import { DialogMultipleComponent } from './shared/dialog/dialog-multiple/dialog-multiple.component';
import { MateriaPrimaComponent } from './module/cadastro/materia-prima/materia-prima.component';
import { ManualComponent } from './module/relatorio/manual/manual.component';
import { AutomaticoComponent } from './module/relatorio/automatico/automatico.component';
import { PerfilComponent } from './module/funcionario/perfil/perfil.component';
import { StatusComponent } from './module/funcionario/status/status.component';
import { VisualizarComponent } from './module/ponto/visualizar/visualizar.component';
import { FornecedorComponent } from './module/cadastro/fornecedor/fornecedor.component';
import { RegistrarComponent } from './module/ponto/registrar/registrar.component';
import { ToastrModule } from 'ngx-toastr';
import { DialogVerificacaoComponent } from './shared/dialog/dialog-verificacao/dialog-verificacao.component';
import { DialogFiltrosComponent } from './shared/dialog/dialog-filtros/dialog-filtros.component';
import { ShopeeComponent } from './module/integracao/shopee/shopee.component';
import { MercadoLivreComponent } from './module/integracao/mercado-livre/mercado-livre.component';


registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    DialogGenericoComponent,
    ProdutosComponent,
    OrcamentoComponent,
    ClienteComponent,
    OrcamentoManualComponent,
    DialogEdicaoComponent,
    EstoqueComponent,
    DialogMultipleComponent,
    MateriaPrimaComponent,
    ManualComponent,
    AutomaticoComponent,
    PerfilComponent,
    StatusComponent,
    VisualizarComponent,
    FornecedorComponent,
    RegistrarComponent,
    DialogVerificacaoComponent,
    DialogFiltrosComponent,
    ShopeeComponent,
    MercadoLivreComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    NgxMaskDirective,
    NgxMaskPipe,
    CurrencyMaskModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    DatePipe,
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    provideEnvironmentNgxMask(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
