import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  constructor(private auth: Auth, private router: Router) {}

  async ingresar() {
    if (this.loginForm.valid) {
      try {
        const { email, password } = this.loginForm.value;
        if (email && password) {
          await signInWithEmailAndPassword(this.auth, email, password);
          alert('¡Bienvenido de nuevo!');
          this.router.navigate(['/citas']);
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
