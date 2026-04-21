import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/services/data';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class InicioComponent implements OnInit {
  private dataService = inject(DataService);
  inicio: any = null;

  ngOnInit() {
    this.dataService.getInicio().subscribe(data => this.inicio = data);
  }
}
