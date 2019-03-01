import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.css']
})
export class HeaderComponent implements OnInit {
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  isAuth = false;
  constructor (private authService: AuthService) {}

  ngOnInit(): void {
    if (this.currentUser && this.currentUser.token) {
      this.isAuth = true;
    }
  }

  logout() {
    this.authService.logout();
    location.reload();
  }
}
