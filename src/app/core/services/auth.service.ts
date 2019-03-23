import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';

import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = `${environment.API_URL}/user`;
  private currentUser: Observable<User>; // private value of current user
  public currentUserSubject: BehaviorSubject<User>; // for reactive response without reload page

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<any> {
    const url = `${this.authUrl}/login`;
    return this.http.post<any>(url, {
      username: username,
      password: password
    }).pipe(
      map(body => {
        const user = JSON.parse(body);
        if (user && user.token) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
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
    this.currentUserSubject.next(null);
  }

  handleError<T>() {
    return (error: any): Observable<T> => {
      console.error(error);
      return throwError(error);
    };
  }
}
