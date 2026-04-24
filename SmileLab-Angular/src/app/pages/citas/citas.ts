import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Database, ref, onValue, off } from '@angular/fire/database';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { DataService } from '../../core/services/data';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './citas.html',
  styleUrl: './citas.css',
})
export class CitasComponent implements OnInit, OnDestroy {
  private db = inject(Database);
  private auth = inject(Auth);
  private dataService = inject(DataService);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  perfil: any = null;
  citas: any[] | null = null;

  private authUnsubscribe: any;
  private citasRef: any;
  private perfilRef: any;
  private allCitasSub: any;

  ngOnInit() {
    this.authUnsubscribe = onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // 1. Cargar Perfil para saber el Rol
        this.perfilRef = ref(this.db, `usuarios/${user.uid}`);
        onValue(this.perfilRef, (snapshot) => {
          this.zone.run(() => {
            this.perfil = snapshot.val();
            
            // 2. Dependiendo del rol, cargamos unas citas u otras
            if (this.perfil?.rol === 'admin') {
              this.cargarCitasParaAdmin(this.perfil.nombre);
            } else {
              this.cargarCitasParaPaciente(user.uid);
            }
            this.cdr.detectChanges();
          });
        });
      } else {
        this.zone.run(() => {
          this.citas = [];
          this.perfil = null;
          this.cdr.detectChanges();
        });
      }
    });
  }

  private cargarCitasParaPaciente(uid: string) {
    if (this.citasRef) off(this.citasRef);
    this.citasRef = ref(this.db, `citas/${uid}`);
    onValue(this.citasRef, (snapshot) => {
      this.zone.run(() => {
        const data = snapshot.val();
        this.citas = data ? Object.entries(data).map(([key, val]: [string, any]) => ({ id: key, ...val })) : [];
        this.cdr.detectChanges();
      });
    });
  }

  private cargarCitasParaAdmin(adminNombre: string) {
    // Si ya estamos escuchando todas, no hace falta re-suscribirse (aunque el nombre cambie)
    if (this.allCitasSub) return;

    this.allCitasSub = this.dataService.getAllCitas().subscribe(allCitas => {
      this.zone.run(() => {
        // Filtramos las citas donde el profesional coincide con el nombre del admin
        this.citas = allCitas.filter(c => c.profesional === adminNombre);
        this.cdr.detectChanges();
      });
    });
  }

  ngOnDestroy() {
    if (this.authUnsubscribe) this.authUnsubscribe();
    if (this.citasRef) off(this.citasRef);
    if (this.perfilRef) off(this.perfilRef);
    if (this.allCitasSub) this.allCitasSub.unsubscribe();
  }
}
