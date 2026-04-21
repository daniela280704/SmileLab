import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '../../core/services/data';

import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-productos',
  standalone: true,
<<<<<<< HEAD
  imports: [CommonModule, RouterLink],
=======
  imports: [CommonModule, RouterLink, RouterLinkActive],
>>>>>>> df2e572caa5c1b684272348d4959c6dd89c8013c
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
