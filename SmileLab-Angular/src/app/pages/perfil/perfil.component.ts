// Controlador del componente Perfil.component
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth, signOut } from '@angular/fire/auth';
import { Router, RouterLink } from '@angular/router';
import { DataService } from '../../core/services/data';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

export interface UserProfile {
  uid?: string;
  nombre?: string;
  email?: string;
  telefono?: string;
  rol?: string;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  private auth = inject(Auth);
  private dataService = inject(DataService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  perfil$: Observable<UserProfile | null> = this.dataService.userProfile$;
  
  proximaCita: any = null;
  doctorHabitual: string = 'No especificado';
  
  ngOnInit(): void {
    // Escuchamos las citas del usuario para calcular la próxima cita y el doctor habitual
    this.dataService.userCitas$.subscribe(citas => {
      if (!citas || citas.length === 0) {
        this.proximaCita = null;
        this.doctorHabitual = 'No especificado';
        this.cdr.detectChanges();
        return;
      }

      const now = new Date();
      
      // Calcular próxima cita (solo futuras y no canceladas)
      const citasFuturas = citas
        .filter(c => c.estado !== 'cancelada')
        .map(c => {
          const f = c.fecha || c.fechaCita || '1970-01-01';
          const h = c.hora || c.horaCita || '00:00';
          return { ...c, fullDate: new Date(`${f}T${h}`) };
        })
        .filter(c => c.fullDate >= now)
        .sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime());

      this.proximaCita = citasFuturas.length > 0 ? citasFuturas[0] : null;

      // Calcular doctor habitual contando quién aparece más veces en el historial
      const doctoresCount: { [key: string]: number } = {};
      let maxCount = 0;
      let doctorTop = 'No especificado';

      citas.filter(c => c.estado !== 'cancelada' && c.profesional).forEach(c => {
        doctoresCount[c.profesional] = (doctoresCount[c.profesional] || 0) + 1;
        if (doctoresCount[c.profesional] > maxCount) {
          maxCount = doctoresCount[c.profesional];
          doctorTop = c.profesional;
        }
      });

      this.doctorHabitual = maxCount > 0 ? doctorTop : 'No especificado';
      
      this.cdr.detectChanges();
    });
  }
  
  logout(): void {
    signOut(this.auth).then(() => {
      this.router.navigate(['/login']);
    });
  }

  getFirstName(fullName: string | undefined | null): string {
    if (!fullName) return '';
    const parts = fullName.trim().split(' ');
    if (parts.length > 1 && (parts[0] === 'Dr.' || parts[0] === 'Dra.')) {
      return parts[1];
    }
    return parts[0];
  }
}
