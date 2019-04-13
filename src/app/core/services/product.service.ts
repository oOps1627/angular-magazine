import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { Observable, of, ReplaySubject } from 'rxjs';

import { Product } from '../models/product.model';
import { FilterOptions } from '../models/filter-options.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public paramsFromUrlSubject = new ReplaySubject<any>(1);
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
    let httpParams;
    let objParams = {
      page: page.toString(),
      limit: limit.toString(),
      order: order
    };
    let paramsInUrl = {};
    this.route.queryParams.subscribe(queryParams => {
      paramsInUrl = queryParams;
    });

    if (filterOptions) {
      objParams = {...objParams, ...filterOptions.getObjectOptions()};
      httpParams = new HttpParams({fromObject: objParams});
      this.router.navigate(['/'], {queryParams: objParams});

    } else if (Object.keys(paramsInUrl).length) {
      httpParams = new HttpParams({fromObject: paramsInUrl});
      this.paramsFromUrlSubject.next(paramsInUrl);
    } else {
      httpParams = new HttpParams({fromObject: objParams});
    }
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
