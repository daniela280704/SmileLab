import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { DataService } from '../../core/services/data';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './citas.html',
  styleUrl: './citas.css',
})
export class CitasComponent implements OnInit {
  private auth = inject(Auth);
  private dataService = inject(DataService);

  usuarioLogueado: User | null = null;
  misCitas: any[] = [];

  citasForm = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
    fecha: new FormControl('', Validators.required),
    hora: new FormControl('', Validators.required),
    servicio: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    onAuthStateChanged(this.auth, (user) => {
      this.usuarioLogueado = user;
      if (user) {
        this.dataService.getCitasByUsuario(user.uid).subscribe(citas => {
          this.misCitas = citas;
        });

        if (user.displayName) {
          this.citasForm.patchValue({ nombre: user.displayName });
        }
      }
    });
  }

  async enviarCita() {
    if (this.citasForm.valid && this.usuarioLogueado) {
      try {
        const nuevaCita = {
          ...this.citasForm.value,
          usuarioId: this.usuarioLogueado.uid,
          fechaRegistro: new Date().toISOString(),
          estado: 'pendiente'
        };

        this.dataService.addCita(nuevaCita).subscribe({
          next: () => {
            alert('¡Cita solicitada con éxito!');
            this.citasForm.reset();
          },
          error: (err) => {
            console.error('Error enviando cita:', err);
            alert('Hubo un error al programar la cita.');
          }
        });
      } catch (error) {
        console.error('Error enviando cita:', error);
        alert('Hubo un error inesperado.');
      }
    } else {
      alert('Por favor, rellena todos los campos correctamente.');
      this.citasForm.markAllAsTouched();
    }
  }
}
