import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DataService } from '../../core/services/data';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent implements OnInit {
  private auth = inject(Auth);
  private router = inject(Router);
  private dataService = inject(DataService);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  ngOnInit(): void {}

  async onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      try {
        const userCredential = await signInWithEmailAndPassword(this.auth, email!, password!);
        this.dataService.getUsuarioProfile(userCredential.user.uid).pipe(take(1)).subscribe(profile => {
          if (profile && profile.rol === 'admin') {
            this.router.navigate(['/admin-crear-producto']);
          } else {
            this.router.navigate(['/perfil']);
          }
        });
      } catch (error) {
        alert('Credenciales incorrectas');
      }
    }
  }
}
