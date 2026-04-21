import { Injectable, inject } from '@angular/core';
import { Database, ref, onValue, push, set } from '@angular/fire/database';
import { Storage, ref as sRef, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

// Datos de respaldo (fallback) cuando Firebase no tiene contenido estático
import inicioData from './data-fallback/inicio.json';
import equipoData from './data-fallback/equipo.json';
import serviciosData from './data-fallback/servicios.json';
import footerData from './data-fallback/footer.json';

@Injectable({ providedIn: 'root' })
export class DataService {
  private db = inject(Database);
  private storage = inject(Storage);

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

  getFooter(): Observable<any> {
    return new Observable(subscriber => {
      const dbRef = ref(this.db, 'footer');
      const unsubscribe = onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        subscriber.next(data ?? footerData);
      }, () => subscriber.next(footerData));
      return () => unsubscribe();
    });
  }

  // ─── CONTENIDO DINÁMICO (solo desde Firebase Realtime Database) ─────────────

  getProductos(): Observable<any[]> {
    return new Observable(subscriber => {
      const productosRef = ref(this.db, 'productos/items');
      const unsubscribe = onValue(productosRef, (snapshot) => {
        const data = snapshot.val();
        const lista = data
          ? Object.entries(data).map(([key, val]: [string, any]) => ({ id: key, ...val }))
          : [];
        subscriber.next(lista);
      }, () => subscriber.next([]));
      return () => unsubscribe();
    });
  }

  addProductoConImagen(producto: any, imagen: File): Observable<any> {
    const filePath = `productos/${Date.now()}_${imagen.name}`;
    const fileRef = sRef(this.storage, filePath);

    // 1. Subir imagen a Storage
    return from(uploadBytes(fileRef, imagen)).pipe(
      // 2. Obtener URL de descarga
      switchMap(() => from(getDownloadURL(fileRef))),
      // 3. Guardar datos en Realtime Database
      switchMap((url) => {
        const finalProduct = { ...producto, imagen: url, fechaCreacion: new Date().toISOString() };
        const productosRef = ref(this.db, 'productos/items');
        return from(push(productosRef, finalProduct));
      })
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
