import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/services/data';

import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
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
