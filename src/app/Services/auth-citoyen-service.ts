import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../environments/environment';
import { RegisterRequest } from '../Models/auth/register-request';
import { OtpRequest } from '../Models/auth/otp.request';
import { LoginRequest } from '../Models/auth/login-request';
import { AuthResponse } from '../Models/auth/auth-response';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly httpClient = inject(HttpClient);

  private readonly baseUrl = environment.apiUrl;

  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';


  /**
   * Inscription
   */
  register(data: RegisterRequest): Observable<unknown> {

    return this.httpClient.post(`${this.baseUrl}/comptes/inscription/`,data);
  }


  /**
   * Vérification OTP
   */
  verifyOtp(data: OtpRequest): Observable<unknown> {

    return this.httpClient.post(`${this.baseUrl}/comptes/verification-otp/`,data);
  }


  /**
   * Connexion
   */
  login(data: LoginRequest): Observable<AuthResponse> {

    return this.httpClient.post<AuthResponse>(`${this.baseUrl}/token/`,data)
      .pipe(
        tap((response) => {
          this.saveTokens(
            response.access,
            response.refresh
          );
        })
      );
  }


  /**
   * Enregistrer les tokens
   */
  private saveTokens(accessToken: string,refreshToken: string): void {

    localStorage.setItem(this.ACCESS_TOKEN_KEY,accessToken);

    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }


  /**
   * Récupérer le access token
   */
  getAccessToken(): string | null {

    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }


  /**
   * Récupérer le refresh token
   */
  getRefreshToken(): string | null {

    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }


  /**
   * Vérifier si l'utilisateur est connecté
   */
  isAuthenticated(): boolean {
    return this.getAccessToken() !== null;
  }


  /**
   * Déconnexion locale
   */
  logout(): void {

    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }
}
