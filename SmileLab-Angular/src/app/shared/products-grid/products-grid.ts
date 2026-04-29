// Controlador del componente Products grid
import { Component, OnInit, inject, ChangeDetectorRef, NgZone, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '../../core/services/data';

@Component({
  selector: 'app-products-grid',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './products-grid.html',
  styleUrl: './products-grid.css'
})
export class ProductsGridComponent implements OnInit {
  @Input() limit: number = 3;
  private dataService = inject(DataService);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);
  productos: any[] = [];

  ngOnInit() {
    this.dataService.getProductos().subscribe(data => {
      this.zone.run(() => {
        this.productos = [...data]
          .sort(() => 0.5 - Math.random())
          .slice(0, this.limit);
        this.cdr.detectChanges();
      });
    });
  }
}
