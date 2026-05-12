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
} from '@ionic/angular/standalone';

import { Productos, Producto } from '../../services/productos';

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
  ],
})
export class DetalleProductoPage implements OnInit {

  producto: Producto | null = null;
  cargando = true;

  constructor(
    private route: ActivatedRoute,
    private productosService: Productos
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productosService.getProductoById(id).subscribe((producto) => {
        this.producto = producto;
        this.cargando = false;
      });
    }
  }
}
