import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 Validateur : Mot de passe fort
 Règles :
 - Minimum 8 caractères
 - Au moins 1 majuscule
 - Au moins 1 minuscule
 - Au moins 1 chiffre
 - Au moins 1 caractère spécial
 */
export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const hasMinLength = value.length >= 8;

    const passwordValid = 
      hasUpperCase && 
      hasLowerCase && 
      hasNumeric && 
      hasSpecial && 
      hasMinLength;

    return !passwordValid 
      ? { 
          passwordStrength: {
            hasUpperCase,
            hasLowerCase,
            hasNumeric,
            hasSpecial,
            hasMinLength
          }
        } 
      : null;
  };
}

/**
 Validateur : Confirmation de mot de passe
 Vérifie que "password" et "confirmPassword" sont identiques
 */
export function passwordVerify(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (!password || !confirmPassword) {
    return null;
  }

  return password === confirmPassword ? null : { passwordVerif: true };
}

/**
 Validateur : Email personnalisé (plus strict que Validators.email)
 */
export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    // Regex email RFC 5322 simplifié
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return emailRegex.test(value) ? null : { invalidEmail: true };
  };
}