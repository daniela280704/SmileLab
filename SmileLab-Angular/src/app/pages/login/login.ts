import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { DataService } from '../../core/services/data';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private auth = inject(Auth);
  private router = inject(Router);
  private dataService = inject(DataService);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  async ingresar() {
    if (this.loginForm.valid) {
      try {
        const { email, password } = this.loginForm.value;
        if (email && password) {
          const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
          
          // Obtener perfil para redirigir según el rol
          this.dataService.getUsuarioProfile(userCredential.user.uid).pipe(take(1)).subscribe(profile => {
            alert(`¡Bienvenido, ${profile?.nombre || 'Usuario'}!`);
            
            if (profile?.rol === 'admin') {
              this.router.navigate(['/admin-crear-producto']);
            } else {
              this.router.navigate(['/citas']);
            }
          });
        }
      } catch (error: any) {
        console.error('Error al iniciar sesión:', error);
        alert('Credenciales incorrectas o problema de red.');
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
