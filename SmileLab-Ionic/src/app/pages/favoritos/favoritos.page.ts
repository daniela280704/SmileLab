import { Component, OnInit } from '@angular/core';
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

  productos: Producto[] = [];
  favoritosIds: string[] = [];
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

  async cerrarSesion() {
    await signOut(this.auth);
    this.router.navigateByUrl('/login');
  }
}
