/**
 * @fileoverview Controlador de la pantalla de registro.
 * Permite crear nuevos usuarios en Firebase Auth, elegir foto de perfil con Capacitor Camera y guardar datos en Firestore.
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController, IonContent, IonInput, IonSpinner, IonIcon } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { addIcons } from 'ionicons';
import { camera } from 'ionicons/icons';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, IonContent, IonInput, IonSpinner, IonIcon]
})
export class RegistroPage implements OnInit {

  // Formulario reactivo con los campos de nombre, apellidos, email, teléfono y contraseña
  registroForm: FormGroup;

  // Controla si el formulario está siendo enviado para deshabilitar el botón
  isSubmitting = false;

  // Almacena la imagen de perfil seleccionada en formato Base64
  imagenPerfil: string | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    addIcons({ camera });

    // Inicialización del formulario con validaciones por campo
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      apellidos: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9,15}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {}

  // Abre la cámara o galería del dispositivo usando Capacitor Camera y guarda la imagen en Base64
  async tomarFoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Prompt,
        promptLabelHeader: 'Foto de perfil',
        promptLabelCancel: 'Cancelar',
        promptLabelPhoto: 'Elegir de la galería',
        promptLabelPicture: 'Tomar foto'
      });

      if (image.base64String) {
        // Construye la cadena Base64 con el tipo de imagen para previsualización y almacenamiento
        this.imagenPerfil = `data:image/${image.format};base64,${image.base64String}`;
      }
    } catch (error) {
      console.error('Error al tomar foto', error);
      this.presentToast('No se pudo obtener la imagen', 'warning');
    }
  }

  // Método principal que crea el usuario en Firebase Auth y guarda sus datos en Firestore
  async onRegister() {
    if (this.registroForm.invalid) return;

    this.isSubmitting = true;

    // Muestra un indicador de carga mientras se procesa el registro
    const loading = await this.loadingCtrl.create({
      message: 'Creando cuenta...',
      spinner: 'circles'
    });
    await loading.present();

    const { email, password, nombre, apellidos, telefono } = this.registroForm.value;

    try {
      // Crea el usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // Guarda información extra del usuario (nombre, apellidos, foto...) en Cloud Firestore
      // Guardar información extra en Firestore
      await setDoc(doc(this.firestore, 'usuarios', user.uid), {
        uid: user.uid,
        nombre,
        apellidos,
        email,
        telefono,
        imagenPerfil: this.imagenPerfil,
        fechaRegistro: new Date().toISOString()
      });

      await loading.dismiss();
      this.presentToast('Registro completado con éxito', 'success');

      // Redirige a la pantalla maestro de favoritos tras el registro exitoso
      this.router.navigateByUrl('/favoritos');

    } catch (error: any) {
      await loading.dismiss();
      let message = 'Ocurrió un error al registrarse';

      // Gestión del error cuando el correo ya está registrado en Firebase
      if (error.code === 'auth/email-already-in-use') {
        message = 'El correo ya está en uso';
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
