import { Component, OnInit, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DataService } from '../../core/services/data';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent implements OnInit {
  private auth = inject(Auth);
  private router = inject(Router);
  private dataService = inject(DataService);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });
  errorMessage: string | null = null;

  ngOnInit(): void {}

  async onLogin() {
    this.zone.run(async () => {
      this.errorMessage = null;

      if (this.loginForm.invalid) {
        this.errorMessage = 'Por favor, introduce un correo y contraseña válidos.';
        this.cdr.detectChanges();
        return;
      }

      const { email, password } = this.loginForm.value;
      try {
        const userCredential = await signInWithEmailAndPassword(this.auth, email!, password!);
        this.dataService.getUsuarioProfile(userCredential.user.uid).pipe(take(1)).subscribe(profile => {
          this.zone.run(() => {
            if (profile && profile.rol === 'admin') {
              this.router.navigate(['/admin-crear-producto']);
            } else {
              this.router.navigate(['/perfil']);
            }
          });
        });
      } catch (error) {
        this.errorMessage = 'Credenciales incorrectas. Por favor, inténtelo de nuevo.';
        this.cdr.detectChanges();
      }
    });
  }
}
