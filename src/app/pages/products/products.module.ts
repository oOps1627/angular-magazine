import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSidenavModule,
  MatTabsModule,
  MatToolbarModule
} from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NpnSliderModule } from 'npn-slider';
import { RatingModule } from 'ngx-rating';

import { ProductsRoutingModule } from './products-routing.module';
import { ComponentsModule } from '../../shared/components/components.module';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductsComponent } from './products.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductFilterComponent } from './product-filter/product-filter.component';
import { PaginatorComponent } from '../../features/paginator/paginator.component';
import { DialogAddToBasketComponent } from './dialog-add-to-basket/dialog-add-to-basket.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ProductsRoutingModule,
    ComponentsModule,

    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatSidenavModule,
    NpnSliderModule,
    MatToolbarModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatInputModule,
    MatTabsModule,
    MatDialogModule,

    RatingModule
  ],
  declarations: [
    ProductsComponent,
    ProductListComponent,
    ProductDetailsComponent,
    ProductFilterComponent,

    PaginatorComponent,
    DialogAddToBasketComponent,
  ],
  exports: [],
  entryComponents: [
    DialogAddToBasketComponent
  ],
})
export class ProductsModule {
}
