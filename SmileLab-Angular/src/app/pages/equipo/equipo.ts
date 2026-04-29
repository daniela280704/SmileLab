// Controlador del componente Equipo
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/services/data';

@Component({
  selector: 'app-equipo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './equipo.html',
  styleUrl: './equipo.css'
})
export class EquipoComponent implements OnInit {
  private dataService = inject(DataService);
  private cdr = inject(ChangeDetectorRef);
  equipo: any = null;

  ngOnInit() {
    this.dataService.getEquipo().subscribe(data => {
      if (data && data.miembros) {
        const filteredData = { ...data };
        filteredData.miembros = data.miembros.filter((m: any) => !m.ocultoEnPagina);
        this.equipo = filteredData;
      } else {
        this.equipo = data;
      }
      this.cdr.detectChanges();
    });
  }
}
