import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/services/data';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio implements OnInit {
  private dataService = inject(DataService);
  inicio: any = null;

  ngOnInit() {
    this.dataService.getInicio().subscribe(data => this.inicio = data);
  }
}
