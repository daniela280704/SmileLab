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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) {
        // Verificar el rol en la base de datos
        dataService.getUsuarioProfile(user.uid).pipe(take(1)).subscribe(profile => {
          if (profile?.rol === 'admin') {
            resolve(true);
          } else {
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
