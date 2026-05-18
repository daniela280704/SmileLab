import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
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
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterModule]
})
export class RegistroPage implements OnInit {
  registroForm: FormGroup;
  isSubmitting = false;
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
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      apellidos: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9,15}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {}

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
        this.imagenPerfil = `data:image/${image.format};base64,${image.base64String}`;
      }
    } catch (error) {
      console.error('Error al tomar foto', error);
      this.presentToast('No se pudo obtener la imagen', 'warning');
    }
  }

  async onRegister() {
    if (this.registroForm.invalid) return;

    this.isSubmitting = true;
    const loading = await this.loadingCtrl.create({
      message: 'Creando cuenta...',
      spinner: 'circles'
    });
    await loading.present();

    const { email, password, nombre, apellidos, telefono } = this.registroForm.value;

    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

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
      this.router.navigateByUrl('/favoritos');

    } catch (error: any) {
      await loading.dismiss();
      let message = 'Ocurrió un error al registrarse';
      if (error.code === 'auth/email-already-in-use') {
        message = 'El correo ya está en uso';
      }
      this.presentToast(message, 'danger');
    } finally {
      this.isSubmitting = false;
    }
  }

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
