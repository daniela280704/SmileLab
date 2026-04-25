import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Database, ref, onValue, off } from '@angular/fire/database';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { DataService } from '../../core/services/data';
import { firstValueFrom } from 'rxjs';

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
        let rawCitas = data ? Object.entries(data).map(([key, val]: [string, any]) => ({ id: key, ...val })) : [];
        this.citas = this.procesarYOrdenarCitas(rawCitas);
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
        let filteredCitas = allCitas.filter(c => c.profesional === adminNombre);
        
        // Enriquecemos cada cita con el nombre real del usuario desde la tabla /usuarios
        const enrichedCitasPromises = filteredCitas.map(async (cita) => {
          if (cita.userId) {
            const perfilUsuario = await firstValueFrom(this.dataService.getUsuarioProfile(cita.userId));
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
    
    // 1. Primero calculamos la fecha real y el estado base para cada cita
    const conFecha = citasList.map(cita => {
      const f = cita.fecha || cita.fechaCita || '1970-01-01';
      const h = cita.hora || cita.horaCita || '00:00';
      const d = new Date(`${f}T${h}`);
      return { ...cita, fullDate: d };
    });

    // 2. Separamos completadas de futuras/canceladas
    const completadas = conFecha.filter(c => c.estado !== 'cancelada' && c.fullDate < now);
    const futurasYCanceladas = conFecha.filter(c => c.estado === 'cancelada' || c.fullDate >= now);

    // 3. De las completadas, solo nos quedamos con la MÁS RECIENTE
    completadas.sort((a, b) => b.fullDate.getTime() - a.fullDate.getTime());
    const soloUltimaCompletada = completadas.slice(0, 1).map(c => ({ ...c, displayEstado: 'Completada' }));

    // 4. Procesamos las futuras para marcar cuál es "Próxima" y cuáles "Pendiente"
    // Las ordenamos de más cercana a más lejana
    futurasYCanceladas.sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime());
    
    let foundProxima = false;
    const futurasProcesadas = futurasYCanceladas.map(cita => {
      if (cita.estado === 'cancelada') {
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

    // 5. Unimos todo y devolvemos ordenado cronológicamente
    const resultado = [...soloUltimaCompletada, ...futurasProcesadas];
    return resultado.sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime());
  }

  ngOnDestroy() {
    if (this.authUnsubscribe) this.authUnsubscribe();
    if (this.citasRef) off(this.citasRef);
    if (this.perfilRef) off(this.perfilRef);
    if (this.allCitasSub) this.allCitasSub.unsubscribe();
  }
}
