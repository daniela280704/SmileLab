/**
 * @fileoverview Guard de autenticación para proteger rutas privadas.
 * Utiliza el AuthService para verificar si hay un usuario logueado antes de permitir el acceso.
 */
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { filter, map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Espera a que Firebase inicialice antes de comprobar la sesión
  return authService.isInitialized().pipe(
    filter(initialized => initialized === true),
    take(1),
    map(() => {
      // Si hay usuario, permite el acceso
      if (authService.isLoggedIn()) {
        return true;
      }
      // Si no hay usuario, redirige al login y deniega el acceso
      router.navigate(['/login']);
      return false;
    })
  );
};
