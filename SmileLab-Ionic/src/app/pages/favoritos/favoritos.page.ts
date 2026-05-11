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
  IonToolbar
} from '@ionic/angular/standalone';

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
    IonCardContent
  ]
})
export class FavoritosPage implements OnInit {

  productos: Producto[] = [];
  favoritosIds: string[] = [];

  constructor(
    private productosService: Productos,
    private favoritosService: Favoritos,
    private router: Router
  ) {}

  async ngOnInit() {
    this.favoritosIds = await this.favoritosService.getFavoritosIds();

    this.productosService.getProductos().subscribe(productos => {
      console.log('Productos Firestore:', productos);
      this.productos = productos;
    });
  }

  esFavorito(productoId: string): boolean {
    return this.favoritosIds.includes(productoId);
  }

  verDetalle(producto: Producto) {
    this.router.navigate(['/detalle-producto', producto.id]);
  }
}
