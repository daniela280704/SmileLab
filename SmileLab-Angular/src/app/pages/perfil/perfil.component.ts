import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth, signOut } from '@angular/fire/auth';
import { Router, RouterLink } from '@angular/router';
import { DataService } from '../../core/services/data';
import { Observable } from 'rxjs';

export interface UserProfile {
  nombre?: string;
  email?: string;
  telefono?: string;
  rol?: string;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  private auth = inject(Auth);
  private dataService = inject(DataService);
  private router = inject(Router);

  perfil$: Observable<UserProfile | null> = this.dataService.userProfile$;

  ngOnInit(): void {}

  logout(): void {
    signOut(this.auth).then(() => {
      this.router.navigate(['/login']);
    });
  }
}
