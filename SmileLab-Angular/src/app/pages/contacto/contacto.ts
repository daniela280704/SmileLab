import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Database, ref, push } from '@angular/fire/database';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css',
})
export class Contacto {
  registroForm = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    telefono: new FormControl('', [Validators.required, Validators.pattern('[0-9]{9}')]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    fechaCita: new FormControl('', Validators.required),
    horaCita: new FormControl('', Validators.required),
    motivoCita: new FormControl('', [Validators.required, Validators.minLength(5)]),
    profesional: new FormControl('', Validators.required),
  });

  constructor(private database: Database, private auth: Auth) {}

  async enviarDatos() {
    if (this.registroForm.valid) {
      try {
        const { email, password } = this.registroForm.value;
        
        // 1. Crear usuario real en Firebase Authentication
        if (email && password) {
          await createUserWithEmailAndPassword(this.auth, email, password);
        }

        // 2. Guardar mensaje/cita en Realtime Database
        const listRef = ref(this.database, 'mensajes');
        await push(listRef, this.registroForm.value);

        alert('¡Te hemos registrado con éxito! Tu cita ha sido agendada en Firebase.');
        this.registroForm.reset();
      } catch (error: any) {
        console.error('Error al registrar/enviar:', error);
        if (error.code === 'auth/email-already-in-use') {
          alert('Este correo ya está registrado. Por favor, inicia sesión.');
        } else {
          alert('Error al conectar con Firebase. Revisa la consola.');
        }
      }
    } else {
      alert('El formulario tiene errores. Revisa los campos.');
      this.registroForm.markAllAsTouched();
    }
  }
}
