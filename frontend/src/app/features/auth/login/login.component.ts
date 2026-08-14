import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';

import { ThemeService } from '../../../core/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLoginMode = true;
  error = '';
  
  formData = {
    name: '',
    email: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router, public themeService: ThemeService) {}

  switchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.error = '';
  }

  onSubmit() {
    if (this.isLoginMode) {
      this.authService.login({ email: this.formData.email, password: this.formData.password })
        .subscribe({
          next: (res) => {
            if (res.hasCompletedOnboarding) {
              this.router.navigate(['/dashboard']);
            } else {
              this.router.navigate(['/onboarding']);
            }
          },
          error: (err) => this.error = err.error || 'Login failed'
        });
    } else {
      this.authService.register(this.formData)
        .subscribe({
          next: () => this.switchMode(),
          error: (err) => this.error = err.error || 'Registration failed'
        });
    }
  }
}
