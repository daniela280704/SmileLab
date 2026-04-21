import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/services/data';

import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './servicios.html',
  styleUrl: './servicios.css'
})
export class Servicios implements OnInit {
  private dataService = inject(DataService);
  servicios: any = null;

  ngOnInit() {
    this.dataService.getServicios().subscribe(data => this.servicios = data);
  }
}
