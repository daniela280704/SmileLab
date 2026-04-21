import { Injectable, inject } from '@angular/core';
import { Database, ref, onValue, push, set } from '@angular/fire/database';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

// Datos de respaldo (fallback) cuando Firebase no tiene contenido estático
import inicioData from './data-fallback/inicio.json';
import equipoData from './data-fallback/equipo.json';
import serviciosData from './data-fallback/servicios.json';
import productosData from './data-fallback/productos.json';

@Injectable({ providedIn: 'root' })
export class DataService {
  private db = inject(Database);

  // ─── CONTENIDO ESTÁTICO (desde Firebase con fallback a JSON local) ──────────

  getInicio(): Observable<any> {
    return new Observable(subscriber => {
      const dbRef = ref(this.db, 'inicio');
      const unsubscribe = onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        subscriber.next(data ?? inicioData);
      }, () => subscriber.next(inicioData));
      return () => unsubscribe();
    });
  }

  getEquipo(): Observable<any> {
    return new Observable(subscriber => {
      const dbRef = ref(this.db, 'equipo');
      const unsubscribe = onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        subscriber.next(data ?? equipoData);
      }, () => subscriber.next(equipoData));
      return () => unsubscribe();
    });
  }

  getServicios(): Observable<any> {
    return new Observable(subscriber => {
      const dbRef = ref(this.db, 'servicios');
      const unsubscribe = onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        subscriber.next(data ?? serviciosData);
      }, () => subscriber.next(serviciosData));
      return () => unsubscribe();
    });
  }

  // ─── CONTENIDO DINÁMICO (solo desde Firebase Realtime Database) ─────────────

  getProductos(): Observable<any[]> {
    return new Observable(subscriber => {
      const productosRef = ref(this.db, 'productos');
      const unsubscribe = onValue(productosRef, (snapshot) => {
        const data = snapshot.val();
        // Intentar manejar tanto si es un objeto con IDs como claves, como si es el formato de db.json
        let lista: any[] = [];
        if (data) {
          if (data.items && Array.isArray(data.items)) {
            lista = data.items;
          } else {
            lista = Object.entries(data).map(([key, val]: [string, any]) => ({ id: key, ...val }));
          }
        }
        subscriber.next(lista.length > 0 ? lista : productosData.items);
      }, () => subscriber.next(productosData.items));
      return () => unsubscribe();
    });
  }

  getProductoById(id: string): Observable<any> {
    return this.getProductos().pipe(
      map(productos => productos.find(p => p.id === id))
    );
  }

  // ─── GESTIÓN DE USUARIOS Y ROLES ──────────────────────────────────────────

  setUsuarioProfile(uid: string, profile: any): Observable<void> {
    const userRef = ref(this.db, `usuarios/${uid}`);
    return from(set(userRef, profile));
  }

  getUsuarioProfile(uid: string): Observable<any> {
    const userRef = ref(this.db, `usuarios/${uid}`);
    return new Observable(subscriber => {
      const unsubscribe = onValue(userRef, (snapshot) => {
        subscriber.next(snapshot.val());
      });
      return () => unsubscribe();
    });
  }

  // ─── GESTIÓN DE CITAS ─────────────────────────────────────────────────────

  getCitasByUsuario(uid: string): Observable<any[]> {
    return new Observable(subscriber => {
      const citasRef = ref(this.db, 'citas');
      const unsubscribe = onValue(citasRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) {
          subscriber.next([]);
          return;
        }
        const lista = Object.entries(data)
          .map(([key, val]: [string, any]) => ({ id: key, ...val }))
          .filter((cita: any) => cita.usuarioId === uid);
        subscriber.next(lista);
      });
      return () => unsubscribe();
    });
  }

  addCita(cita: any): Observable<any> {
    const citasRef = ref(this.db, 'citas');
    return from(push(citasRef, cita));
  }
}
