import { Component, OnInit, inject, ChangeDetectorRef, NgZone } from '@angular/core';
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
  private dataService = inject(DataService);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);
  productos: any[] = [];

  ngOnInit() {
    this.dataService.getProductos().subscribe(data => {
      this.zone.run(() => {
        // Barajar y coger exactamente 3
        this.productos = [...data]
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        this.cdr.detectChanges();
      });
    });
  }
}
