import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './module/home/home.component';
import { LoginComponent } from './module/login/login.component';
import { OrcamentoComponent } from './module/orcamento/orcamento.component';
import { AuthInterceptor } from './services/auth-interceptor.service';
import { MaterialModule } from './shared/material.module';
import { ProdutosComponent } from './module/cadastro/produtos/produtos.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    OrcamentoComponent,
    LoginComponent,
    ProdutosComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
