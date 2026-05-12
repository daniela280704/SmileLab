import { Injectable } from '@angular/core';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user$ = new BehaviorSubject<User | null>(null);

  private initialized$ = new BehaviorSubject<boolean>(false);

  constructor(private auth: Auth) {
    onAuthStateChanged(this.auth, (user) => {
      this.user$.next(user);
      this.initialized$.next(true);
    });
  }

  isInitialized(): Observable<boolean> {
    return this.initialized$.asObservable();
  }

  getUser(): Observable<User | null> {
    return this.user$.asObservable();
  }

  isLoggedIn(): boolean {
    return this.auth.currentUser !== null;
  }
}
