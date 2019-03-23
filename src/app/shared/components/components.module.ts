import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule, MatExpansionModule, MatIconModule, MatInputModule, MatMenuModule, MatToolbarModule } from '@angular/material';

import { AppRoutingModule } from '../../app.routing.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AmountRollerComponent } from './amount-roller/amount-roller.component';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    // Angular Material
    MatToolbarModule,
    MatButtonModule,
    MatExpansionModule,
    MatMenuModule,
    MatInputModule,
    MatIconModule
    ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    AmountRollerComponent
    ],
  exports: [
    HeaderComponent,
    FooterComponent,
    AmountRollerComponent
  ]
})
export class ComponentsModule {
}
