import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FilterOptions, Checkbox, SliderPropertyList } from '../../../core/models/filter-options.model';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';

import { forkJoin, zip, Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, tap, toArray } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { pipe } from 'rxjs/internal/util/pipe';

@Component({
  selector: 'app-product-filter',
  templateUrl: 'product-filter.component.html',
  styleUrls: ['product-filter.component.scss']
})
export class ProductFilterComponent implements OnInit, OnDestroy {
  @Output() updateProducts = new EventEmitter<Product[]>(); // send new products to ProductListComponent
  @Output() switchProductsLoading = new EventEmitter<boolean>(); // for switch loading icon in ProductListComponent
  @Input() page: number;
  @Input() limit: number;
  @Input() order: string;
  loading = true;
  searchControl = new FormControl();
  selectedFilterOptions = new FilterOptions();
  receivedFilterOptions = new FilterOptions(); // all options which needs for init filter
  currentSlidersValues = new SliderPropertyList();
  foundProducts: Observable<Product[]>;
  urlParams: Subscription;

  constructor(private productService: ProductService) {
  }

  ngOnInit(): void {
    this.initFilter();
    this.foundProducts = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.productService.searchProducts(this.page, this.limit, this.order, term))
    );
  }

  ngOnDestroy(): void {
    this.urlParams.unsubscribe();
  }

  initFilter(): void {
     this.productService.getFilterOptions().subscribe(options => {
       options.forEach((option) => {
         switch (option.type) {
           case 'slider': {
             this.receivedFilterOptions.sliders[option.property].setValues(option.value.lte, option.value.gte);
             this.currentSlidersValues[option.property].setValues(option.value.lte, option.value.gte);
             break;
           }
           case 'checkbox': {
             option.value.forEach((name) => {
               this.receivedFilterOptions.checkboxes[option.property].push(new Checkbox(name));
             });
           }
         }
       });
       this.loading = false;
     }, (err) => {
       console.log(err);
       },
       () => {
         this.urlParams = this.productService.paramsFromUrlSubject.subscribe((options: any) => {
           for (const propName of Object.keys(options)) {
             if (this.selectedFilterOptions.sliders.hasOwnProperty(propName)) {
               const values = options[propName].split('-');
               this.selectedFilterOptions.sliders[propName].setValues(+values[0], +values[1]);
               this.currentSlidersValues[propName].setValues(+values[0], +values[1]);

             } else if (this.selectedFilterOptions.checkboxes.hasOwnProperty(propName)) {
               if ( options[propName] instanceof Array) {
                 options[propName].forEach( name => {
                   this.selectedFilterOptions.checkboxes[propName].push(new Checkbox(name));
                   this.receivedFilterOptions.checkboxes[propName].find( checkbox => checkbox.name === name).checked = true;
                 });
               } else {
                 this.selectedFilterOptions.checkboxes[propName].push(new Checkbox(options[propName]));
                 this.receivedFilterOptions.checkboxes[propName].find( checkbox => checkbox.name === options[propName]).checked = true;
               }
             }
           }
         });
     });
  }

  getProducts(page: number, limit: number, order: string, options?: FilterOptions): void {
    this.switchProductsLoading.emit(true);
    this.productService.getProducts(page, limit, order, options).subscribe(products => {
      this.updateProducts.emit(products);
    });
  }

  onSliderChange(property: string, selectedValues: number[]): void {
    this.currentSlidersValues[property].setValues(selectedValues[0], selectedValues[1]);
  }

  search() {
    this.switchProductsLoading.emit(true);
    this.productService.searchProducts(this.page, this.limit, this.order, this.searchControl.value).subscribe((products) => {
      this.updateProducts.emit(products);
    });
  }

  onFilter(): void {
    // iterate all selected sliders
    for (const propName of Object.keys(this.selectedFilterOptions.sliders)) {
      // assign a value to selectedFilterOptions if it is not primary
      if (this.currentSlidersValues[propName].isValuesNotDefault(
        this.receivedFilterOptions.sliders[propName].lte,
        this.receivedFilterOptions.sliders[propName].gte,
      )) {
        this.selectedFilterOptions.sliders[propName].setValues(
          this.currentSlidersValues[propName].lte,
          this.currentSlidersValues[propName].gte
        );
      }
    }
    // iterate all selected checkboxes
    for (const propName of Object.keys(this.receivedFilterOptions.checkboxes)) {
      this.selectedFilterOptions.checkboxes[propName] = this.receivedFilterOptions.checkboxes[propName].filter((checkbox) => {
        return checkbox.checked === true;
      });
    }
    this.getProducts(this.page, this.limit, this.order, this.selectedFilterOptions);
  }

  deleteTag(type: string, propName: string, elem?): void {
    if (type === 'slider') {
      const receivedProperty = this.receivedFilterOptions.sliders[propName];
      this.currentSlidersValues[propName].setValues(receivedProperty.lte, receivedProperty.gte);  // set default min max values on slider
      this.selectedFilterOptions.sliders[propName].setValues(0, 0); // zeroing current values (when choose nothing)
    } else if (type === 'checkbox') {
      const index = this.selectedFilterOptions.checkboxes[propName].indexOf(elem);
      this.selectedFilterOptions.checkboxes[propName].splice(index, 1);
      this.receivedFilterOptions.checkboxes[propName].find((checkbox) => checkbox.name === elem.name).checked = false;

    }
    this.getProducts(this.page, this.limit, this.order, this.selectedFilterOptions);
  }

}
