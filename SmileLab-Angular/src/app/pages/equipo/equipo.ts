import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/services/data';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-equipo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './equipo.html',
  styleUrl: './equipo.css'
})
export class EquipoComponent implements OnInit {
  private dataService = inject(DataService);
  equipo: any = null;

  ngOnInit() {
    this.dataService.getEquipo().subscribe(data => this.equipo = data);
  }
}
