import { Injectable } from '@angular/core';
import { Product } from './product.model';
import { FilterOptions } from './filter-options.model';
import { environment } from '../../../../environments/environment';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = `${environment.API_URL}/products`;
  constructor(private http: HttpClient) {
  }

  /* GET product by id */
  getProduct(id: string): Observable<Product> {
    const url = `${this.productsUrl}/${id}`;
    return this.http.get<Product>(url).pipe(
      catchError(this.handleError<Product>())
    );
  }
  /* GET collection products */
  getProducts(page: number, limit: number, order: string, filterOptions?: FilterOptions): Observable<Product[]> {
    const url = `${this.productsUrl}/collect`;
    let httpParams = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('order', order);
    if (filterOptions) {
      for (const propName in filterOptions.sliders) {
        if (filterOptions.sliders.hasOwnProperty(propName) && filterOptions.sliders[propName].checkValues()) {
          httpParams = httpParams
            .set(propName + '[lte]', filterOptions.sliders[propName].lte.toString())
            .set(propName + '[gte]', filterOptions.sliders[propName].gte.toString());
        }
      }
      for (const propName in filterOptions.checkboxes) {
        if (filterOptions.checkboxes.hasOwnProperty(propName)) {
          filterOptions.checkboxes[propName].forEach((elem) => {
            if (httpParams.has(propName)) {
              httpParams = httpParams.append(propName.toString(), elem.name.toString());
            } else {
              httpParams = httpParams.set(propName.toString(), elem.name.toString());
            }
          });
        }
      }
    }
      return this.http.get<any>(url, {params: httpParams}).pipe(
        map((response) => {
          let res = JSON.parse(response);
          return res.data;
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
    return this.http.get<Product[]>(url, params).pipe(
      catchError(this.handleError<Product[]>())
    );
  }
  /* GET options for init the filter */
  getFilterOptions(): Observable<any[]> {
    const url = `${this.productsUrl}/filter-options`;
    return this.http.get<any[]>(url).pipe(
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
    return this.http.get<Product[]>(url, params).pipe(
      catchError(this.handleError<any[]>())
    );
  }

  private handleError<T> (result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      // Let the app keep running by returning an empty result
      return of(result as T);
    };
  }

}
