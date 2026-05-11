import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  precio?: number;
}

@Injectable({
  providedIn: 'root',
})
export class Productos {

  getProductos(): Observable<Producto[]> {
    const productos: Producto[] = [
      {
        id: 'cepillo-electrico',
        nombre: 'Cepillo Eléctrico Sónico',
        descripcion: 'Cepillo eléctrico para una limpieza dental profunda.',
        imagen: 'assets/img/cepillo-electrico.jpg',
        precio: 39.99
      },
      {
        id: 'kit-blanqueamiento',
        nombre: 'Kit de Blanqueamiento',
        descripcion: 'Kit para mejorar el color de la sonrisa desde casa.',
        imagen: 'assets/img/kit-blanqueamiento.jpg',
        precio: 24.99
      },
      {
        id: 'irrigador-bucal',
        nombre: 'Irrigador Bucal',
        descripcion: 'Dispositivo para limpiar zonas difíciles entre dientes y encías.',
        imagen: 'assets/img/irrigador-bucal.jpg',
        precio: 49.99
      }
    ];

    return of(productos);
  }
}
