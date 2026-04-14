import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/services/data';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class Productos implements OnInit {
  private dataService = inject(DataService);
  productos: any[] = [];

  ngOnInit() {
    this.dataService.getProductos().subscribe(data => this.productos = data);
  }
}
