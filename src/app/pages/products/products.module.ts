import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProductListComponent } from './product-list/product-list.component';
import { ProductsComponent } from './products.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductFilterComponent } from './product-filter/product-filter.component';
import { ProductsRoutingModule } from './products-routing.module';
import { ComponentsModule } from '../../shared/components/components.module';

import { fakeBackendProvider } from '../../../fake-backend/fake-backend';
// Material
import {
  MatButtonModule,
  MatCheckboxModule,
  MatCardModule,
  MatSidenavModule,
  MatToolbarModule,
  MatChipsModule,
  MatFormFieldModule,
  MatSelectModule,
  MatProgressSpinnerModule,
  MatAutocompleteModule,
  MatInputModule,
  MatTabsModule
} from '@angular/material';
import { MatDialogModule} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { NpnSliderModule } from 'npn-slider';
import { RatingModule } from 'ngx-rating';
import { PaginatorComponent } from '../../features/paginator/paginator.component';
import { DialogAddToBasketComponent } from './dialog-add-to-basket/dialog-add-to-basket.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatSidenavModule,
    NpnSliderModule,
    FormsModule,
    MatToolbarModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    ProductsRoutingModule,
    ComponentsModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatInputModule,
    MatTabsModule,
    MatDialogModule,
    RatingModule,
  ],
  declarations: [
    ProductsComponent,
    ProductListComponent,
    ProductDetailsComponent,
    ProductFilterComponent,

    PaginatorComponent,
    DialogAddToBasketComponent
  ],
  exports: [
  ],
  providers: [
    fakeBackendProvider,
  ],
  entryComponents: [
    DialogAddToBasketComponent
  ]
})
export class ProductsModule {
}
