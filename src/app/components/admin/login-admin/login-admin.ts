import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../Services/auth-citoyen-service';
import { Router } from '@angular/router';
import { emailValidator, passwordValidator } from '../../../Services/login-validation';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.html',
  imports: [FormsModule, ReactiveFormsModule,CommonModule], 
})
export class LoginAdmin {
  
  loginForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  isLoading = false;
  isPasswordVisible = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        emailValidator()
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        passwordValidator()
      ]],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = 'Connexion réussie ! Redirection...';
          
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Erreur de connexion. Vérifiez vos identifiants.';
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
    const passwordInput = document.getElementById('mot-de-passe') as HTMLInputElement;
    if (passwordInput) {
      passwordInput.type = this.isPasswordVisible ? 'text' : 'password';
    }
  }

  // Getters
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}