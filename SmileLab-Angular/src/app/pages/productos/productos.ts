// Controlador del componente Productos
import { Component, OnInit, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/services/data';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class ProductosComponent implements OnInit {
  private dataService = inject(DataService);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);
  productos: any[] = [];

  ngOnInit() {
    this.dataService.getProductos().subscribe(data => {
      this.zone.run(() => {
        this.productos = data;
        this.cdr.detectChanges();
      });
    });
  }
}
