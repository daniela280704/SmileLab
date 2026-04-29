// Controlador del componente Servicios
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/services/data';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './servicios.html',
  styleUrl: './servicios.css'
})
export class ServiciosComponent implements OnInit {
  private dataService = inject(DataService);
  private cdr = inject(ChangeDetectorRef);
  servicios: any = null;
  itemExpandido: number | null = null;

  ngOnInit() {
    this.dataService.getServicios().subscribe(data => {
      this.servicios = data;
      this.cdr.detectChanges();
    });
  }

  toggleExpand(index: number) {
    if (this.itemExpandido === index) {
      this.itemExpandido = null;
    } else {
      this.itemExpandido = index;
    }
  }
}
