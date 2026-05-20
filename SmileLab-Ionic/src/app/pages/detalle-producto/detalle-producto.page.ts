/**
 * @fileoverview Controlador de la pantalla de detalle de producto.
 * Muestra la información ampliada de un artículo y permite alternar su estado de favorito almacenado localmente en SQLite.
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonButton,
  IonSkeletonText,
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
    IonButton,
    IonSkeletonText,
    IonIcon
  ],
})
export class DetalleProductoPage implements OnInit {

  // Referencia al ion-content para controlar el scroll de forma programática
  @ViewChild(IonContent, { static: false }) content!: IonContent;

  // Datos del producto cargado desde Firestore (null mientras carga)
  producto: Producto | null = null;
  // Indica si los datos todavía se están cargando (muestra el skeleton)
  cargando = true;
  // Indica si el producto actual está marcado como favorito en SQLite
  esFavorito = false;

  constructor(
    private route: ActivatedRoute,
    private productosService: Productos,
    private favoritosService: Favoritos
  ) {
    addIcons({ heart, heartOutline });
  }

  // Obtiene el ID del producto desde la ruta, carga su estado de favorito y sus datos de Firestore
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

  // Se ejecuta al terminar la transición de entrada: fuerza el scroll al inicio de la página
  ionViewDidEnter() {
    if (this.content) {
      this.content.scrollToTop(0);
    }
  }

  // Añade o elimina el producto de favoritos en SQLite y actualiza el estado del botón
  async toggleFavorito() {
    if (this.producto) {
      this.esFavorito = await this.favoritosService.toggleFavorito(this.producto.id);
    }
  }
}
