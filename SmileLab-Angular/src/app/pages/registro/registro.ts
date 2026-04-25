import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Auth, createUserWithEmailAndPassword, updateProfile } from '@angular/fire/auth';
import { DataService } from '../../core/services/data';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class RegistroComponent {
  private auth = inject(Auth);
  private dataService = inject(DataService);
  private router = inject(Router);

  registroForm = new FormGroup({
    nombre: new FormControl('', [
      Validators.required, 
      Validators.pattern(/^(\S+\s+\S+.*)$/)
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    telefono: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{9,15}$')]),
    adminCode: new FormControl(''), // Campo opcional para el código secreto
  });

  errorMsg: string | null = null;
  successMsg: string | null = null;
  isLoading = false;

  // Código secreto para ser administrador (puedes cambiarlo aquí)
  private readonly SECRET_ADMIN_CODE = 'SMILE_ADMIN_2026';

  async onRegistro() {
    if (this.registroForm.invalid) return;

    this.isLoading = true;
    this.errorMsg = null;
    this.successMsg = null;

    const { nombre, email, password, telefono, adminCode } = this.registroForm.value;

    try {
      // 1. Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(this.auth, email!, password!);
      
      // 2. Actualizar nombre en el perfil de Auth
      await updateProfile(userCredential.user, { displayName: nombre });

      // 3. Determinar rol
      const rol = adminCode === this.SECRET_ADMIN_CODE ? 'admin' : 'usuario';

      // 4. Guardar perfil en Realtime Database
      await this.dataService.setUsuarioProfile(userCredential.user.uid, {
        nombre,
        email,
        telefono,
        rol: rol,
        fechaRegistro: new Date().toISOString()
      }).toPromise();

      // 5. Mostrar mensaje y redirigir según el rol
      this.successMsg = rol === 'admin' ? '¡Registro de Administrador exitoso!' : '¡Cuenta creada con éxito!';
      
      setTimeout(() => {
        if (rol === 'admin') {
          this.router.navigate(['/admin-crear-producto']);
        } else {
          this.router.navigate(['/perfil']);
        }
      }, 2000);

    } catch (error: any) {
      console.error(error);
      this.errorMsg = 'Error al crear la cuenta. Es posible que el email ya esté en uso.';
    } finally {
      this.isLoading = false;
    }
  }
}
