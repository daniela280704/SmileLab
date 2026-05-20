/**
 * @fileoverview Servicio de acceso al catálogo de productos.
 * Lee la colección 'productos' desde Firestore de manera reactiva.
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Firestore, collection, collectionData, doc, docData } from '@angular/fire/firestore';

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

  constructor(private firestore: Firestore) {}

  // Obtiene el catálogo completo de productos de forma reactiva
  getProductos(): Observable<Producto[]> {
    const productosRef = collection(this.firestore, 'productos');
    return collectionData(productosRef, { idField: 'id' }) as Observable<Producto[]>;
  }

  // Obtiene un único producto por su ID
  getProductoById(id: string): Observable<Producto> {
    const productoRef = doc(this.firestore, 'productos', id);
    return docData(productoRef, { idField: 'id' }) as Observable<Producto>;
  }
}
