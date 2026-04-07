import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './citas.html',
  styleUrl: './citas.css',
})
export class Citas {
  citasForm = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
    fecha: new FormControl('', Validators.required),
    hora: new FormControl('', Validators.required),
    servicio: new FormControl('', Validators.required),
  });

  constructor(private firestore: Firestore) {}

  async enviarCita() {
    if (this.citasForm.valid) {
      try {
        const colRef = collection(this.firestore, 'citas');
        await addDoc(colRef, this.citasForm.value);
        alert('¡Cita solicitada con éxito!');
        this.citasForm.reset();
      } catch (error) {
        console.error('Error enviando cita:', error);
        alert('Hubo un error al programar la cita. Revisa la consola.');
      }
    } else {
      alert('Por favor, rellena todos los campos correctamente.');
      this.citasForm.markAllAsTouched();
    }
  }
}
