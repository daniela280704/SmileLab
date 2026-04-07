import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-contacto',
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

  enviarDatos() {
    if (this.registroForm.valid) {
      alert('¡Formulario válido!\n\nDatos a enviar a Firebase en el Sprint 3:\n' + JSON.stringify(this.registroForm.value, null, 2));
      // Aquí irá la lógica de subida a Firebase Database
    } else {
      alert('El formulario tiene errores. Revisa los campos marcados en rojo.');
      this.registroForm.markAllAsTouched();
    }
  }
}
