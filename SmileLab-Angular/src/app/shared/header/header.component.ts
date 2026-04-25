import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth, authState, signOut } from '@angular/fire/auth';
import { DataService } from '../../core/services/data';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, FooterComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  private auth = inject(Auth);
  private dataService = inject(DataService);
  private router = inject(Router);

  usuarioLogueado$ = authState(this.auth);
  userProfile$ = this.dataService.userProfile$;
  menuAbierto = false;

  ngOnInit(): void {}

  irAPerfil(): void {
    this.router.navigate(['/perfil']);
    this.cerrarMenu();
  }

  async cerrarSesion(): Promise<void> {
    await signOut(this.auth);
    this.menuAbierto = false;
    this.router.navigate(['/inicio']);
  }

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
    if (this.menuAbierto) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  }

  cerrarMenu(): void {
    this.menuAbierto = false;
    document.body.classList.remove('menu-open');
  }

  getFirstName(fullName: string | undefined | null): string {
    if (!fullName) return '';
    const parts = fullName.trim().split(' ');
    if (parts.length > 1 && (parts[0] === 'Dr.' || parts[0] === 'Dra.')) {
      return parts[1];
    }
    return parts[0];
  }
}
