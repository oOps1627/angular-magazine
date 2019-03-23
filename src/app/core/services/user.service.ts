import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userUrl = `${environment.API_URL}/user`;

  constructor(private http: HttpClient) {
  }

  getProfile() {

  }

  getBasket(): Observable<any> {
    const url = `${this.userUrl}/basket`;
    return this.http.get<any>(url).pipe(
      map(body => JSON.parse(body)),
      catchError(this.handleError<any[]>())
    );
  }

  addToBasket(productId: string, amount: number): Observable<any> {
    const url = `${this.userUrl}/basket`;
    return this.http.post(url, {
      productId: productId,
      amount: amount
    }).pipe(
      catchError(this.handleError<any>())
    );
  }

  deleteFromBasket(productId: string): Observable<any> {
    const url = `${this.userUrl}/basket`;
    let httpParams = new HttpParams()
      .set('productId', productId);
    return this.http.delete<any>(url, {params: httpParams}).pipe(
      map(basket => JSON.parse(basket)),
      catchError(this.handleError<any>())
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
