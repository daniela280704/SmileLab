import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { DataService } from '../../core/services/data';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  private auth = inject(Auth);
  private dataService = inject(DataService);

  usuario: User | null = null;
  perfil: any = null;

  ngOnInit(): void {
    onAuthStateChanged(this.auth, (user) => {
      this.usuario = user;
      if (user) {
        this.dataService.getUsuarioProfile(user.uid).subscribe(data => {
          this.perfil = data;
        });
      }
    });
  }
}
