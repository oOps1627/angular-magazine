import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatCardModule, MatIconModule } from '@angular/material';

import { ComponentsModule } from '../../shared/components/components.module';
import { UserComponent } from './user.component';
import { UserBasketComponent } from './user-basket/user-basket.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

@NgModule({
  imports: [
    BrowserModule,
    ComponentsModule,
    RouterModule,

    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  declarations: [
    UserComponent,
    UserBasketComponent,
    UserProfileComponent,
  ],
  exports: []
})
export class UserModule {
}
