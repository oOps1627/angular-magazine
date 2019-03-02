import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.scss']
})
export class RegisterComponent implements OnInit {
  hide = true;
  registerForm: FormGroup;
  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.registerForm = new FormGroup({
      'username': new FormControl(null, Validators.required),
      'password': new FormControl(null, [
        Validators.required,
        Validators.minLength(4)
      ]),
      'firstName': new FormControl(null, Validators.required)
    });
  }

  register(): void {
    if (this.registerForm.valid) {
      const newUser = this.registerForm.value;
      this.authService.register(newUser).subscribe(() => {
        this.authService.login(newUser.username, newUser.password).subscribe(data => {
          this.router.navigate(['/']);
        });
      });
    }
  }

}
