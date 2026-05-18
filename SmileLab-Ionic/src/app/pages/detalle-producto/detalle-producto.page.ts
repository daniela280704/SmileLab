import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonSkeletonText,
  IonFab,
  IonFabButton,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';

import { Productos, Producto } from '../../services/productos';
import { Favoritos } from '../../services/favoritos';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.page.html',
  styleUrls: ['./detalle-producto.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonSkeletonText,
    IonFab,
    IonFabButton,
    IonIcon
  ],
})
export class DetalleProductoPage implements OnInit {

  producto: Producto | null = null;
  cargando = true;
  esFavorito = false;

  constructor(
    private route: ActivatedRoute,
    private productosService: Productos,
    private favoritosService: Favoritos
  ) {
    addIcons({ heart, heartOutline });
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // Comprobar estado de favorito al cargar
      this.esFavorito = await this.favoritosService.esFavorito(id);

      this.productosService.getProductoById(id).subscribe((producto) => {
        this.producto = producto;
        this.cargando = false;
      });
    }
  }

  async toggleFavorito() {
    if (this.producto) {
      this.esFavorito = await this.favoritosService.toggleFavorito(this.producto.id);
    }
  }
}
