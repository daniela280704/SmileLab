import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
  IonBadge,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';

import { Productos, Producto } from '../../services/productos';
import { Favoritos } from '../../services/favoritos';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonLabel,
    IonImg,
    IonBadge,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButtons,
    IonButton,
    IonIcon
  ]
})
export class FavoritosPage implements OnInit {

  productos: Producto[] = [];
  favoritosIds: string[] = [];

  constructor(
    private productosService: Productos,
    private favoritosService: Favoritos,
    private router: Router
  ) {
    addIcons({ heart, heartOutline });
  }

  async ngOnInit() {
    await this.cargarFavoritos();

    this.productosService.getProductos().subscribe(productos => {
      console.log('Productos Firestore:', productos);

      productos.forEach(producto => {
        console.log('Producto:', producto.nombre, 'ID:', producto.id);
      });

      this.productos = productos;
    });
  }

  async ionViewWillEnter() {
    await this.cargarFavoritos();
  }

  async cargarFavoritos() {
    const favoritos = await this.favoritosService.getFavoritosIds();

    this.favoritosIds = favoritos.map(id => String(id));

    console.log('Favoritos locales:', this.favoritosIds);
  }

  esFavorito(productoId: string): boolean {
    return this.favoritosIds.includes(String(productoId));
  }

  verDetalle(producto: Producto) {
    this.router.navigate(['/detalle-producto', producto.id]);
  }

  async toggleFavorito(producto: Producto, event: Event) {
    event.stopPropagation();
    await this.favoritosService.toggleFavorito(producto.id);
    await this.cargarFavoritos();
  }
}
