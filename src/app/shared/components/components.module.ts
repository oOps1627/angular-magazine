import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../../app.routing.module';

import {
  MatToolbarModule,
  MatButtonModule,
  MatExpansionModule,
  MatMenuModule,
  MatIconModule
} from '@angular/material';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    // Angular Material
    MatToolbarModule,
    MatButtonModule,
    MatExpansionModule,
    MatMenuModule,
    MatIconModule
    ],
  declarations: [
    HeaderComponent,
    FooterComponent
    ],
  exports: [
    HeaderComponent,
    FooterComponent
  ]
})
export class ComponentsModule {
}
