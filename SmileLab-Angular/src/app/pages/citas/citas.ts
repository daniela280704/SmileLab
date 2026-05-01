// Controlador del componente Citas
import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Firestore, doc, collection, query, where, onSnapshot } from '@angular/fire/firestore';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { DataService } from '../../core/services/data';
import { firstValueFrom, Subscription } from 'rxjs';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './citas.html',
  styleUrl: './citas.css',
})
export class CitasComponent implements OnInit, OnDestroy {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private dataService = inject(DataService);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  perfil: any = null;
  citas: any[] | null = null;

  private authUnsubscribe: any;
  private citasUnsub: (() => void) | null = null;
  private perfilUnsub: (() => void) | null = null;
  private allCitasSub: Subscription | null = null;

  ngOnInit() {
    this.authUnsubscribe = onAuthStateChanged(this.auth, (user) => {
      // Limpiamos listeners previos para evitar errores de permisos al cerrar sesión
      if (this.perfilUnsub) this.perfilUnsub();
      if (this.citasUnsub) this.citasUnsub();
      if (this.allCitasSub) this.allCitasSub.unsubscribe();

      if (user) {
        // Leemos el perfil del usuario desde Firestore con onSnapshot
        const userDocRef = doc(this.firestore, `usuarios/${user.uid}`);
        this.perfilUnsub = onSnapshot(
          userDocRef,
          snapshot => {
            this.zone.run(() => {
              this.perfil = snapshot.data() ?? null;

              if (this.perfil?.rol === 'admin') {
                this.cargarCitasParaAdmin(this.perfil.nombre);
              } else {
                this.cargarCitasParaPaciente(user.uid);
              }
              this.cdr.detectChanges();
            });
          },
          err => {
            if (err.code !== 'permission-denied') {
              console.error('[Firestore] Error perfil en citas:', err.message);
            }
          }
        );
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
    if (this.citasUnsub) this.citasUnsub();

    // Filtramos la colección "citas" por el UID del usuario actual
    const citasQuery = query(collection(this.firestore, 'citas'), where('usuarioId', '==', uid));

    this.citasUnsub = onSnapshot(
      citasQuery,
      snapshot => {
        this.zone.run(() => {
          const rawCitas = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          this.citas = this.procesarYOrdenarCitas(rawCitas);
          this.cdr.detectChanges();
        });
      },
      err => {
        if (err.code !== 'permission-denied') {
          console.error('[Firestore] Error citas paciente:', err.message);
        }
      }
    );
  }

  private cargarCitasParaAdmin(adminNombre: string) {
    if (this.allCitasSub) return;

    this.allCitasSub = this.dataService.getAllCitas().subscribe(allCitas => {
      this.zone.run(() => {
        // Solo nos interesan las citas asignadas a este administrador
        let filteredCitas = allCitas.filter(c => c['profesional'] === adminNombre);

        const enrichedCitasPromises = filteredCitas.map(async (cita) => {
          if (cita['usuarioId']) {
            const perfilUsuario = await firstValueFrom(this.dataService.getUsuarioProfile(cita['usuarioId']));
            if (perfilUsuario && perfilUsuario.nombre) {
              return { ...cita, nombre: perfilUsuario.nombre };
            }
          }
          return cita;
        });

        Promise.all(enrichedCitasPromises).then(enrichedList => {
          this.zone.run(() => {
            this.citas = this.procesarYOrdenarCitas(enrichedList);
            this.cdr.detectChanges();
          });
        });
      });
    });
  }

  private procesarYOrdenarCitas(citasList: any[]): any[] {
    const now = new Date();

    const conFecha = citasList.map(cita => {
      const f = cita['fecha'] || cita['fechaCita'] || '1970-01-01';
      const h = cita['hora'] || cita['horaCita'] || '00:00';
      const d = new Date(`${f}T${h}`);
      return { ...cita, fullDate: d };
    });

    // Separamos las citas que ya pasaron (histórico) de las que están por venir
    const completadas = conFecha.filter(c => c['estado'] !== 'cancelada' && c.fullDate < now);
    const futurasYCanceladas = conFecha.filter(c => c['estado'] === 'cancelada' || c.fullDate >= now);

    completadas.sort((a, b) => b.fullDate.getTime() - a.fullDate.getTime());
    const soloUltimaCompletada = completadas.slice(0, 1).map(c => ({ ...c, displayEstado: 'Completada' }));

    futurasYCanceladas.sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime());

    // Solo la cita futura más inmediata debe aparecer como "Próxima", el resto quedan "Pendientes"
    let foundProxima = false;
    const futurasProcesadas = futurasYCanceladas.map(cita => {
      if (cita['estado'] === 'cancelada') {
        cita.displayEstado = 'Cancelada';
      } else {
        if (!foundProxima) {
          cita.displayEstado = 'Próxima';
          foundProxima = true;
        } else {
          cita.displayEstado = 'Pendiente';
        }
      }
      return cita;
    });

    const resultado = [...soloUltimaCompletada, ...futurasProcesadas];
    return resultado.sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime());
  }

  ngOnDestroy() {
    if (this.authUnsubscribe) this.authUnsubscribe();
    if (this.citasUnsub) this.citasUnsub();
    if (this.perfilUnsub) this.perfilUnsub();
    if (this.allCitasSub) this.allCitasSub.unsubscribe();
  }
}
