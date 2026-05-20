/**
 * @fileoverview Servicio global de autenticación.
 * Envuelve el estado de autenticación de Firebase Auth y permite comprobar el usuario actual.
 */
import { Injectable } from '@angular/core';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Emite el estado actual del usuario (User si está logueado, null si no)
  private user$ = new BehaviorSubject<User | null>(null);

  // Indica si la autenticación de Firebase ya ha sido inicializada
  private initialized$ = new BehaviorSubject<boolean>(false);

  constructor(private auth: Auth) {
    // Escucha los cambios de estado de autenticación de Firebase
    onAuthStateChanged(this.auth, (user) => {
      this.user$.next(user);
      this.initialized$.next(true);
    });
  }

  // Retorna un observable para saber cuándo Firebase está listo
  isInitialized(): Observable<boolean> {
    return this.initialized$.asObservable();
  }

  // Retorna un observable con los datos del usuario actual
  getUser(): Observable<User | null> {
    return this.user$.asObservable();
  }

  // Devuelve true de forma síncrona si hay un usuario logueado
  isLoggedIn(): boolean {
    return this.auth.currentUser !== null;
  }
}
