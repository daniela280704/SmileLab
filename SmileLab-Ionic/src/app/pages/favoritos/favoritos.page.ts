/**
 * @fileoverview Controlador de la pantalla principal (Maestro de favoritos).
 * Muestra el catálogo de productos consultando Firestore y destaca los favoritos guardados en la base de datos local SQLite.
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
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
import { heart, heartOutline, logOutOutline, personCircleOutline } from 'ionicons/icons';

import { Productos, Producto } from '../../services/productos';
import { Favoritos } from '../../services/favoritos';
import { AuthService } from '../../services/auth.service';
import { Auth, signOut } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

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
    IonButtons,
    IonButton,
    IonIcon
  ]
})
export class FavoritosPage implements OnInit {

  // Referencia al ion-content para poder controlar el scroll de forma programática
  @ViewChild(IonContent, { static: false }) content!: IonContent;

  // Lista completa de productos cargados desde Firestore
  productos: Producto[] = [];
  // IDs de los productos marcados como favoritos en SQLite
  favoritosIds: string[] = [];
  // Nombre del usuario autenticado mostrado en la cabecera
  nombreUsuario: string = '';

  constructor(
    private productosService: Productos,
    private favoritosService: Favoritos,
    private router: Router,
    private authService: AuthService,
    private auth: Auth,
    private firestore: Firestore
  ) {
    addIcons({ heart, heartOutline, logOutOutline, personCircleOutline });
  }

  // Inicializa la página: carga favoritos y se suscribe al usuario y al catálogo de Firestore
  async ngOnInit() {
    await this.cargarFavoritos();

    this.authService.getUser().subscribe(async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(this.firestore, 'usuarios', user.uid));
          if (userDoc.exists()) {
            this.nombreUsuario = userDoc.data()?.['nombre'];
          } else {
            this.nombreUsuario = user.email?.split('@')[0] || 'Usuario';
          }
        } catch (e) {
          this.nombreUsuario = user.email?.split('@')[0] || 'Usuario';
        }
      }
    });

    this.productosService.getProductos().subscribe(productos => {
      console.log('Productos Firestore:', productos);

      productos.forEach(producto => {
        console.log('Producto:', producto.nombre, 'ID:', producto.id);
      });

      this.productos = productos;
    });
  }

  // Se ejecuta cada vez que la página se muestra: recarga el estado de favoritos
  async ionViewWillEnter() {
    await this.cargarFavoritos();
  }

  // Se ejecuta al terminar la transición de entrada: fuerza el scroll al inicio de la página
  ionViewDidEnter() {
    if (this.content) {
      this.content.scrollToTop(0);
    }
  }

  // Obtiene los IDs de favoritos desde SQLite y los almacena localmente
  async cargarFavoritos() {
    const favoritos = await this.favoritosService.getFavoritosIds();

    this.favoritosIds = favoritos.map(id => String(id));

    console.log('Favoritos locales:', this.favoritosIds);
  }

  // Comprueba si un producto está marcado como favorito comparando su ID con la lista local
  esFavorito(productoId: string): boolean {
    return this.favoritosIds.includes(String(productoId));
  }

  // Navega a la pantalla de detalle pasando el ID del producto como parámetro de ruta
  verDetalle(producto: Producto) {
    this.router.navigate(['/detalle-producto', producto.id]);
  }

  // Añade o elimina el producto de favoritos en SQLite y recarga el estado
  async toggleFavorito(producto: Producto, event: Event) {
    event.stopPropagation();
    await this.favoritosService.toggleFavorito(producto.id);
    await this.cargarFavoritos();
  }

  // Cierra la sesión de Firebase y redirige al usuario a la pantalla de login
  async cerrarSesion() {
    await signOut(this.auth);
    this.router.navigateByUrl('/login');
  }
}
