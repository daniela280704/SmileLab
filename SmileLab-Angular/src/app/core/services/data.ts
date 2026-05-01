// Servicio centralizado para gestionar las llamadas a Firebase
import { Injectable, inject, NgZone } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  onSnapshot,
  addDoc,
  setDoc,
  query,
  where
} from '@angular/fire/firestore';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Observable, from, BehaviorSubject } from 'rxjs';

import inicioData from './data-fallback/inicio.json';
import equipoData from './data-fallback/equipo.json';
import serviciosData from './data-fallback/servicios.json';
import footerData from './data-fallback/footer.json';
import productosData from './data-fallback/productos.json';

@Injectable({ providedIn: 'root' })
export class DataService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private zone = inject(NgZone);

  private profileSubject = new BehaviorSubject<any>(null);
  public userProfile$ = this.profileSubject.asObservable();

  private citasSubject = new BehaviorSubject<any[]>([]);
  public userCitas$ = this.citasSubject.asObservable();

  // Guardamos las funciones para cancelar las suscripciones
  private profileUnsub: (() => void) | null = null;
  private userCitasUnsub: (() => void) | null = null;

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      // Limpiamos suscripciones anteriores si existen
      if (this.profileUnsub) this.profileUnsub();
      if (this.userCitasUnsub) this.userCitasUnsub();

      if (user) {
        // Escuchamos el documento del usuario en la colección "usuarios"
        const userDocRef = doc(this.firestore, `usuarios/${user.uid}`);
        this.profileUnsub = onSnapshot(userDocRef,
          snapshot => this.zone.run(() => this.profileSubject.next(snapshot.data() ?? null)),
          err => {
            // Solo logueamos el error si no es por falta de permisos al cerrar sesión
            if (err.code !== 'permission-denied') {
              console.error('[Firestore] Error perfil usuario:', err.message);
            }
          }
        );

        // Escuchamos las citas del usuario filtradas por su UID
        const citasQuery = query(collection(this.firestore, 'citas'), where('usuarioId', '==', user.uid));
        this.userCitasUnsub = onSnapshot(citasQuery,
          snapshot => {
            const lista = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            this.zone.run(() => this.citasSubject.next(lista));
          },
          err => {
            if (err.code !== 'permission-denied') {
              console.error('[Firestore] Error citas usuario:', err.message);
            }
          }
        );
      } else {
        this.zone.run(() => {
          this.profileSubject.next(null);
          this.citasSubject.next([]);
        });
      }
    });
  }

  // Método auxiliar: lee un documento de Firestore con fallback al JSON local
  private getDocConFallback<T>(ruta: string, fallback: T): Observable<T> {
    return new Observable<T>(subscriber => {
      // Emitimos los datos locales mientras Firestore responde
      subscriber.next(fallback);

      const docRef = doc(this.firestore, ruta);
      const unsub = onSnapshot(
        docRef,
        snapshot => {
          this.zone.run(() => {
            if (snapshot.exists()) {
              subscriber.next(snapshot.data() as T);
            }
          });
        },
        err => {
          console.error(`[Firestore] Error al leer ${ruta}:`, err.code, '-', err.message);
        }
      );

      return () => unsub();
    });
  }

  getInicio(): Observable<any> {
    return this.getDocConFallback('inicio/datos', inicioData);
  }

  getEquipo(): Observable<any> {
    return this.getDocConFallback('equipo/datos', equipoData);
  }

  getServicios(): Observable<any> {
    return this.getDocConFallback('servicios/datos', serviciosData);
  }

  getFooter(): Observable<any> {
    return this.getDocConFallback('footer/datos', footerData);
  }

  getProductos(): Observable<any[]> {
    return new Observable<any[]>(subscriber => {
      // Emitimos los datos locales de inmediato
      subscriber.next(productosData.items);

      const productosRef = collection(this.firestore, 'productos');
      const unsub = onSnapshot(
        productosRef,
        snapshot => {
          this.zone.run(() => {
            if (!snapshot.empty) {
              const firebaseList = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
              // Combinamos productos de Firestore con los locales si hay alguno nuevo
              const combined = [...firebaseList];
              productosData.items.forEach((localProd: any) => {
                if (!combined.some(p => p['id'] === localProd.id)) {
                  combined.push(localProd);
                }
              });
              subscriber.next(combined);
            }
          });
        },
        err => console.error('[Firestore] Error productos:', err.code, '-', err.message)
      );

      return () => unsub();
    });
  }

  getProductoById(id: string): Observable<any> {
    const fallback = productosData.items.find((p: any) => p.id === id) ?? null;
    return new Observable(subscriber => {
      // Solo emitimos datos locales si el producto existe en el JSON
      if (fallback) {
        subscriber.next(fallback);
      }

      const docRef = doc(this.firestore, `productos/${id}`);
      const unsub = onSnapshot(
        docRef,
        snapshot => {
          this.zone.run(() => {
            if (snapshot.exists()) {
              // El producto existe en Firestore, lo usamos
              subscriber.next({ id: snapshot.id, ...snapshot.data() });
            } else {
              // No existe en Firestore ni en local: emitimos null para mostrar el error
              subscriber.next(fallback);
            }
          });
        },
        err => console.error('[Firestore] Error producto:', err.message)
      );

      return () => unsub();
    });
  }

  addProductoConImagen(producto: any, imagen: File): Observable<any> {
    return new Observable(subscriber => {
      const reader = new FileReader();
      reader.onload = () => {
        // Convertimos la imagen a Base64 para guardarla en Firestore
        const base64String = reader.result as string;
        const finalProduct = {
          ...producto,
          imagen: base64String,
          fechaCreacion: new Date().toISOString()
        };
        addDoc(collection(this.firestore, 'productos'), finalProduct)
          .then(() => {
            this.zone.run(() => {
              subscriber.next(null);
              subscriber.complete();
            });
          })
          .catch(err => this.zone.run(() => subscriber.error(err)));
      };
      reader.onerror = err => this.zone.run(() => subscriber.error(err));
      reader.readAsDataURL(imagen);
    });
  }

  setUsuarioProfile(uid: string, profile: any): Observable<void> {
    const docRef = doc(this.firestore, `usuarios/${uid}`);
    return from(setDoc(docRef, profile, { merge: true }));
  }

  getUsuarioProfile(uid: string): Observable<any> {
    return new Observable(subscriber => {
      const docRef = doc(this.firestore, `usuarios/${uid}`);
      const unsub = onSnapshot(
        docRef,
        snapshot => this.zone.run(() => subscriber.next(snapshot.data() ?? null)),
        err => this.zone.run(() => subscriber.error(err))
      );
      return () => unsub();
    });
  }

  getAllCitas(): Observable<any[]> {
    // En Firestore, todas las citas están en una única colección plana
    return new Observable<any[]>(subscriber => {
      const citasRef = collection(this.firestore, 'citas');
      const unsub = onSnapshot(
        citasRef,
        snapshot => {
          const lista = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          this.zone.run(() => subscriber.next(lista));
        },
        err => this.zone.run(() => subscriber.error(err))
      );
      return () => unsub();
    });
  }

  addCita(cita: any): Observable<any> {
    // Guardamos la cita como un nuevo documento en la colección "citas"
    return from(addDoc(collection(this.firestore, 'citas'), cita));
  }
}
