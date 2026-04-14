import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/services/data';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule],
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
