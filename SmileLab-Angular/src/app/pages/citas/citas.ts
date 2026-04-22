import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '../../core/services/data';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './citas.html',
  styleUrl: './citas.css',
})
export class CitasComponent {
  private dataService = inject(DataService);

  perfil$ = this.dataService.userProfile$;
  citas$ = this.dataService.userCitas$;
}
