import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth, onAuthStateChanged, signOut, User } from '@angular/fire/auth';
import { DataService } from '../../core/services/data';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  usuarioLogueado: User | null = null;
  userProfile: any = null;
  menuAbierto = false;
  private unsubscribeAuth!: () => void;
  private dataService = inject(DataService);

  constructor(private auth: Auth, private router: Router) {}

  ngOnInit(): void {
    this.unsubscribeAuth = onAuthStateChanged(this.auth, (user) => {
      this.usuarioLogueado = user;
      if (user) {
        this.dataService.getUsuarioProfile(user.uid).subscribe((profile: any) => {
          this.userProfile = profile;
        });
      } else {
        this.userProfile = null;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.unsubscribeAuth) {
      this.unsubscribeAuth();
    }
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
}
