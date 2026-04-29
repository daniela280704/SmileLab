// Guard de seguridad para proteger rutas: Auth.guard
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { onAuthStateChanged } from '@angular/fire/auth';

export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  return new Promise<boolean>((resolve) => {
    // Comprobamos con Firebase si hay un token de sesión válido
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) {
        // Permitimos el acceso a la ruta protegida (ej: Perfil, Citas)
        resolve(true);
      } else {
        // Si no está logeado, lo expulsamos a la pantalla de login
        router.navigate(['/login']);
        resolve(false);
      }
    });
  });
};
