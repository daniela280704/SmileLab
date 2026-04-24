import { Component, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { ProductsGridComponent } from './shared/products-grid/products-grid';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ProductsGridComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('SmileLab-Angular');
  mostrarProductos = true;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects;
      // No mostrar en login, perfil ni en la página principal de la tienda (/productos)
      // Pero SÍ mostrar en el detalle de producto (/productos/id)
      this.mostrarProductos = !url.includes('login') && !url.includes('perfil') && url !== '/productos';
    });
  }
}