import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { Product } from '../models/product.model';
import { FilterOptions } from '../models/filter-options.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = `${environment.API_URL}/products`;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {
  }

  /* GET product by id */
  getProduct(id: string): Observable<Product> {
    const url = `${this.productsUrl}/${id}`;
    return this.http.get<any>(url).pipe(
      map(body => JSON.parse(body)),
      catchError(this.handleError<Product>())
    );
  }

  /* GET collection products */
  getProducts(page: number, limit: number, order: string, filterOptions?: FilterOptions): Observable<Product[]> {
    const url = `${this.productsUrl}/collect`;
    let paramsForUrl = {};
    let httpParams = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('order', order);

    if (filterOptions) {
      for (const propName in filterOptions.sliders) {
        if (filterOptions.sliders.hasOwnProperty(propName) && filterOptions.sliders[propName].checkValues()) {
          const property = propName + '-range';
          const value = `${filterOptions.sliders[propName].lte}-${filterOptions.sliders[propName].gte}`;
          httpParams = httpParams.set(property, value);
          paramsForUrl[property] = value;
        }
      }
      for (const propName in filterOptions.checkboxes) {
        if (filterOptions.checkboxes.hasOwnProperty(propName)) {
          filterOptions.checkboxes[propName].forEach((elem) => {
            const property = propName.toString();
            const value = elem.name.toString();
            if (httpParams.has(propName)) {
              httpParams = httpParams.append(property, value);
              paramsForUrl[property].push(value);
            } else {
              httpParams = httpParams.set(property, value);
              paramsForUrl[property] = [value];
            }
          });
        }
      }
    }
    this.route.queryParamMap.subscribe(
      params => {
        console.log(params.getAll('price-range'));
      }
    );
    this.router.navigate(['/'], {queryParams: paramsForUrl});
    return this.http.get<any>(url, {params: httpParams}).pipe(
      map(body => {
        const r = JSON.parse(body);
        return r.data;
      }),
      catchError(this.handleError<Product[]>())
    );

  }

  /* GET products whose name contains search term */
  searchProducts(page: number, limit: number, order: string, term: string): Observable<Product[]> {
    if (!term.trim()) {
      return of([]);
    }
    const url = `${this.productsUrl}/search`;
    const params = {
      params: new HttpParams()
        .set('page', page.toString())
        .set('limit', limit.toString())
        .set('order', order)
        .set('q', term)
    };
    return this.http.get<any>(url, params).pipe(
      map(body => {
        const r = JSON.parse(body);
        return r.data;
      }),
      catchError(this.handleError<Product[]>())
    );
  }

  /* GET options for init the filter */
  getFilterOptions(): Observable<any[]> {
    const url = `${this.productsUrl}/filter-options`;
    return this.http.get<any>(url).pipe(
      map((body) => {
        const r = JSON.parse(body);
        return r.data;
      }),
      catchError(this.handleError<any[]>())
    );
  }

  sortProducts(page: number, limit: number, order: string): Observable<Product[]> {
    const url = `${this.productsUrl}/sort`;
    const params = {
      params: new HttpParams()
        .set('page', page.toString())
        .set('limit', limit.toString())
        .set('order', order)
    };
    return this.http.get<any>(url, params).pipe(
      map(body => {
        const r = JSON.parse(body);
        return r.data;
      }),
      catchError(this.handleError<any[]>())
    );
  }

  private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      // Let the app keep running by returning an empty result
      return of(result as T);
    };
  }

}
