import { Component, OnInit, inject, AfterViewInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth, createUserWithEmailAndPassword, onAuthStateChanged, User } from '@angular/fire/auth';
import { DataService } from '../../core/services/data';

import { RouterLink, RouterLinkActive, Router } from '@angular/router';

declare var flatpickr: any;

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css',
})
export class ContactoComponent implements OnInit, AfterViewInit {
  private auth = inject(Auth);
  private dataService = inject(DataService);
  private router = inject(Router);
  
  usuarioLogueado: User | null = null;
  registroForm = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    telefono: new FormControl('', [Validators.required, Validators.pattern('[0-9]{9}')]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    fechaCita: new FormControl('', [Validators.required]),
    horaCita: new FormControl('', [Validators.required]),
    motivoCita: new FormControl('', [Validators.required, Validators.minLength(5)]),
    profesional: new FormControl('', [Validators.required]),
  });

  errorMsg: string | null = null;
  successMsg: string | null = null;
  isLoading = false;

  ngOnInit(): void {
    onAuthStateChanged(this.auth, (user) => {
      this.usuarioLogueado = user;
      if (user) {
        this.registroForm.patchValue({ email: user.email });
        this.registroForm.get('nombre')?.clearValidators();
        this.registroForm.get('password')?.clearValidators();
        this.registroForm.get('telefono')?.clearValidators();
      } else {
        this.registroForm.get('nombre')?.setValidators([Validators.required, Validators.minLength(3)]);
        this.registroForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
        this.registroForm.get('telefono')?.setValidators([Validators.required, Validators.pattern('[0-9]{9}')]);
      }
      this.registroForm.get('nombre')?.updateValueAndValidity();
      this.registroForm.get('password')?.updateValueAndValidity();
      this.registroForm.get('telefono')?.updateValueAndValidity();
    });
  }

  ngAfterViewInit(): void {
    if (typeof flatpickr !== 'undefined') {
      flatpickr('#appointment-day', {
        dateFormat: 'Y-m-d',
        minDate: 'today'
      });
      flatpickr('#appointment-time', {
        enableTime: true,
        noCalendar: true,
        dateFormat: 'H:i',
        time_24hr: true
      });
    }
  }

  async enviarDatos() {
    this.errorMsg = null;
    this.successMsg = null;

    if (this.registroForm.invalid) {
      this.errorMsg = 'Por favor, rellena todos los campos obligatorios.';
      return;
    }

    this.isLoading = true;
    const values = this.registroForm.value;
    
    try {
      if (!this.usuarioLogueado) {
        // Registro + Cita
        const userCredential = await createUserWithEmailAndPassword(
          this.auth,
          values.email!,
          values.password!
        );
        
        await this.dataService.setUsuarioProfile(userCredential.user.uid, {
          nombre: values.nombre,
          email: values.email,
          telefono: values.telefono,
          rol: 'usuario'
        }).toPromise();

        await this.guardarCita(userCredential.user.uid);
        this.successMsg = '¡Bienvenido! Registro completado y cita agendada.';
      } else {
        // Solo Cita
        await this.guardarCita(this.usuarioLogueado.uid);
        this.successMsg = '¡Tu cita ha sido confirmada!';
      }
      
      this.registroForm.reset();
      
      setTimeout(() => {
        this.router.navigate(['/citas']);
      }, 2000);

    } catch (error: any) {
      this.errorMsg = 'Error: ' + error.message;
    } finally {
      this.isLoading = false;
    }
  }

  private async guardarCita(uid: string) {
    const values = this.registroForm.value;
    await this.dataService.addCita({
      usuarioId: uid,
      nombre: values.nombre || this.usuarioLogueado?.displayName || 'Paciente',
      fecha: values.fechaCita,
      hora: values.horaCita,
      servicio: values.motivoCita,
      profesional: values.profesional,
      estado: 'pendiente',
      fechaCreacion: new Date().toISOString()
    }).toPromise();
  }
}
