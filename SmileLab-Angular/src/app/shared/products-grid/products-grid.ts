import { Component, OnInit, inject } from '@angular/core';
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
  productos: any[] = [];

  ngOnInit() {
    this.dataService.getProductos().subscribe(data => this.productos = data);
  }
}
