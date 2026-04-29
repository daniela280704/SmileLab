// Guard de seguridad para proteger rutas: Admin.guard
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { DataService } from '../services/data';
import { take } from 'rxjs/operators';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const dataService = inject(DataService);
  const router = inject(Router);

  return new Promise<boolean>((resolve) => {
    // Escuchamos el estado de autenticación de Firebase para saber si hay un usuario activo
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) {
        dataService.getUsuarioProfile(user.uid).pipe(take(1)).subscribe(profile => {
          if (profile?.rol === 'admin') {
            resolve(true);
          } else {
            // Si está logeado pero no es admin, lo mandamos a su perfil normal
            router.navigate(['/perfil']);
            resolve(false);
          }
        });
      } else {
        router.navigate(['/login']);
        resolve(false);
      }
    });
  });
};
