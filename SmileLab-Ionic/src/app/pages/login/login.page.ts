/**
 * @fileoverview Controlador de la pantalla de inicio de sesión.
 * Gestiona la autenticación de usuarios existentes mediante Firebase Auth.
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController, IonContent, IonInput, IonSpinner } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { addIcons } from 'ionicons';
import { medicalOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, IonContent, IonInput, IonSpinner]
})
export class LoginPage implements OnInit {

  // Formulario reactivo con los campos de email y contraseña
  loginForm: FormGroup;

  // Controla si el formulario está siendo enviado para deshabilitar el botón
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    addIcons({ medicalOutline });

    // Inicialización del formulario con validaciones de email obligatorio y contraseña requerida
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() {}

  // Método principal que gestiona el inicio de sesión contra Firebase Authentication
  async onLogin() {
    if (this.loginForm.invalid) return;

    this.isSubmitting = true;

    // Muestra un indicador de carga mientras se procesa la autenticación
    const loading = await this.loadingCtrl.create({
      message: 'Iniciando sesión...',
      spinner: 'circles'
    });
    await loading.present();

    const { email, password } = this.loginForm.value;

    try {
      // Autenticación con Firebase usando email y contraseña
      await signInWithEmailAndPassword(this.auth, email, password);
      await loading.dismiss();
      this.presentToast('Bienvenido de nuevo', 'success');

      // Redirige a la pantalla maestro de favoritos tras el login exitoso
      this.router.navigateByUrl('/favoritos');
    } catch (error: any) {
      await loading.dismiss();
      let message = 'Error al iniciar sesión';

      // Gestión de errores específicos de Firebase Auth
      // Firebase auth error codes
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        message = 'Email o contraseña incorrectos';
      }
      this.presentToast(message, 'danger');
    } finally {
      this.isSubmitting = false;
    }
  }

  // Muestra un mensaje toast temporal en la parte inferior de la pantalla
  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}
