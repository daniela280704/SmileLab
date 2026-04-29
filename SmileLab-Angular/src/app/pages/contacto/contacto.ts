// Controlador del componente Contacto
import { Component, OnInit, inject, AfterViewInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth, createUserWithEmailAndPassword, onAuthStateChanged, User } from '@angular/fire/auth';
import { DataService } from '../../core/services/data';
import { first, firstValueFrom } from 'rxjs';

import { RouterLink, RouterLinkActive, Router } from '@angular/router';

declare var flatpickr: any;

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css',
})
export class ContactoComponent implements OnInit, AfterViewInit {
  private auth = inject(Auth);
  private dataService = inject(DataService);
  private router = inject(Router);

  profesionales: any[] = [];

  usuarioLogueado: User | null = null;
  perfilLogueado: any = null;
  registroForm = new FormGroup({
    nombre: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(\S+\s+\S+.*)$/)
    ]),
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
  showSuccessModal = false;

  ngOnInit(): void {
    this.dataService.getEquipo().pipe(first()).subscribe(data => {
      if (data && data.miembros) {
        this.profesionales = data.miembros;
      }
    });

    onAuthStateChanged(this.auth, (user) => {
      this.usuarioLogueado = user;
      if (user) {
        this.dataService.userProfile$.subscribe(p => this.perfilLogueado = p);
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
    setTimeout(() => {
      if (typeof flatpickr !== 'undefined') {
        flatpickr('#appointment-day', {
          dateFormat: 'Y-m-d',
          minDate: 'today',
          onChange: (selectedDates: any, dateStr: string) => {
            this.registroForm.get('fechaCita')?.setValue(dateStr);
          }
        });
        flatpickr('#appointment-time', {
          enableTime: true,
          noCalendar: true,
          dateFormat: 'H:i',
          time_24hr: true,
          onChange: (selectedDates: any, timeStr: string) => {
            this.registroForm.get('horaCita')?.setValue(timeStr);
          }
        });
      } else {
        console.warn('Flatpickr no está definido.');
      }
    }, 200);
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
      } else {
        await this.guardarCita(this.usuarioLogueado.uid);
      }
      this.showSuccessModal = true;
      this.registroForm.reset();
      this.isLoading = false;
    } catch (error: any) {
      this.errorMsg = 'Error: ' + error.message;
      this.isLoading = false;
    }
  }

  cerrarModal() {
    this.showSuccessModal = false;
  }

  irACitas() {
    this.router.navigate(['/citas']);
  }

  private async guardarCita(uid: string) {
    const values = this.registroForm.value;

    const perfil = await firstValueFrom(this.dataService.userProfile$);
    const nombreCompleto = values.nombre || perfil?.nombre || this.usuarioLogueado?.displayName || 'Paciente';

    await this.dataService.addCita({
      usuarioId: uid,
      nombre: nombreCompleto,
      fecha: values.fechaCita,
      hora: values.horaCita,
      servicio: values.motivoCita,
      profesional: values.profesional,
      estado: 'pendiente',
      fechaCreacion: new Date().toISOString()
    }).toPromise();
  }
}
