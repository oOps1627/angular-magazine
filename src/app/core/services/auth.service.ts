import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Observable, of, throwError} from 'rxjs';
import {User} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = `${environment.API_URL}/users`;
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<User> {
    const url = `${this.authUrl}/login`;
    return this.http.post<any>(url, {
      username: username,
      password: password
    }).pipe(map(user => {
      if (user && user.token) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
        return user;
    }),
      catchError(this.handleError<User>())
    );
  }

  register(newUser): Observable<any> {
    const url = `${this.authUrl}/register`;
    return this.http.post<any>(url, {
      username: newUser.username,
      password: newUser.password,
      firstName: newUser.firstName
    }).pipe(
      catchError(this.handleError<User>())
    );
  }

  logout() {
    localStorage.removeItem('currentUser');
  }

  handleError<T> () {
    return (error: any): Observable<T> => {
      console.error(error);
      return throwError(error);
    };
  }
}
