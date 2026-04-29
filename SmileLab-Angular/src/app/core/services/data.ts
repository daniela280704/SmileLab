// Servicio centralizado para gestionar las llamadas a Firebase
import { Injectable, inject, NgZone } from '@angular/core';
import { Database, ref, onValue, push, set } from '@angular/fire/database';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';


import inicioData from './data-fallback/inicio.json';
import equipoData from './data-fallback/equipo.json';
import serviciosData from './data-fallback/servicios.json';
import footerData from './data-fallback/footer.json';
import productosData from './data-fallback/productos.json';

@Injectable({ providedIn: 'root' })
export class DataService {
  private db = inject(Database);
  private auth = inject(Auth);
  private zone = inject(NgZone);

  private profileSubject = new BehaviorSubject<any>(null);
  public userProfile$ = this.profileSubject.asObservable();

  private citasSubject = new BehaviorSubject<any[]>([]);
  public userCitas$ = this.citasSubject.asObservable();

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        const uRef = ref(this.db, `usuarios/${user.uid}`);
        onValue(uRef, (snapshot) => {
          this.zone.run(() => {
            this.profileSubject.next(snapshot.val());
          });
        });

        const citasRef = ref(this.db, `citas/${user.uid}`);
        onValue(citasRef, (snapshot) => {
          this.zone.run(() => {
            const data = snapshot.val();
            const lista = data ? Object.entries(data).map(([key, val]: [string, any]) => ({ id: key, ...val })) : [];
            this.citasSubject.next(lista);
          });
        });
      } else {
        this.zone.run(() => {
          this.profileSubject.next(null);
          this.citasSubject.next([]);
        });
      }
    });
  }

  getInicio(): Observable<any> {
    return new Observable(subscriber => {
      const dbRef = ref(this.db, 'inicio');
      onValue(dbRef, (snapshot) => this.zone.run(() => subscriber.next(snapshot.val() ?? inicioData)), () => this.zone.run(() => subscriber.next(inicioData)));
    });
  }

  getEquipo(): Observable<any> {
    return new Observable(subscriber => {
      const dbRef = ref(this.db, 'equipo');
      onValue(dbRef, (snapshot) => {
        this.zone.run(() => {
          let data = snapshot.val();

          if (!data || !data.miembros || JSON.stringify(data.miembros) !== JSON.stringify(equipoData.miembros)) {
            set(dbRef, equipoData).catch(err => console.error("Error actualizando equipo en Firebase:", err));
            data = equipoData;
          }

          subscriber.next(data);
        });
      }, () => this.zone.run(() => subscriber.next(equipoData)));
    });
  }

  getServicios(): Observable<any> {
    return new Observable(subscriber => {
      const dbRef = ref(this.db, 'servicios');
      onValue(dbRef, (snapshot) => this.zone.run(() => subscriber.next(snapshot.val() ?? serviciosData)), () => this.zone.run(() => subscriber.next(serviciosData)));
    });
  }

  getFooter(): Observable<any> {
    return new Observable(subscriber => {
      const dbRef = ref(this.db, 'footer');
      onValue(dbRef, (snapshot) => this.zone.run(() => subscriber.next(snapshot.val() ?? footerData)), () => this.zone.run(() => subscriber.next(footerData)));
    });
  }

  getProductos(): Observable<any[]> {
    return new Observable(subscriber => {
      const productosRef = ref(this.db, 'productos/items');
      onValue(productosRef, (snapshot) => {
        this.zone.run(() => {
          const data = snapshot.val();
          const firebaseList = data ? Object.entries(data).map(([key, val]: [string, any]) => ({ id: key, ...val })) : [];

          // Combinamos los productos que vienen de Firebase con los del JSON local por si hay nuevos
          const combined = [...firebaseList];
          productosData.items.forEach((localProd: any) => {
            if (!combined.some(p => p.id === localProd.id)) {
              combined.push(localProd);
            }
          });

          subscriber.next(combined);
        });
      }, () => this.zone.run(() => subscriber.next(productosData.items)));
    });
  }

  getProductoById(id: string): Observable<any> {
    return new Observable(subscriber => {
      const pRef = ref(this.db, `productos/items/${id}`);
      onValue(pRef, (snapshot) => {
        this.zone.run(() => {
          let data = snapshot.val();
          if (!data) {
            data = productosData.items.find((p: any) => p.id === id);
          }
          subscriber.next(data);
        });
      });
    });
  }

  addProductoConImagen(producto: any, imagen: File): Observable<any> {
    return new Observable(subscriber => {
      const reader = new FileReader();
      reader.onload = () => {
        // Convertimos la imagen a Base64 para guardarla directamente en la base de datos de texto
        const base64String = reader.result as string;
        const finalProduct = {
          ...producto,
          imagen: base64String,
          fechaCreacion: new Date().toISOString()
        };
        push(ref(this.db, 'productos/items'), finalProduct)
          .then(() => {
            this.zone.run(() => {
              subscriber.next(null);
              subscriber.complete();
            });
          })
          .catch(err => {
            this.zone.run(() => subscriber.error(err));
          });
      };
      reader.onerror = (err) => this.zone.run(() => subscriber.error(err));
      reader.readAsDataURL(imagen);
    });
  }

  setUsuarioProfile(uid: string, profile: any): Observable<void> {
    return from(set(ref(this.db, `usuarios/${uid}`), profile));
  }

  getUsuarioProfile(uid: string): Observable<any> {
    return new Observable(subscriber => {
      const uRef = ref(this.db, `usuarios/${uid}`);
      const unsubscribe = onValue(uRef, (snapshot) => {
        this.zone.run(() => subscriber.next(snapshot.val()));
      }, (error) => this.zone.run(() => subscriber.error(error)));
      return () => unsubscribe();
    });
  }

  getAllCitas(): Observable<any[]> {
    return new Observable(subscriber => {
      const citasRef = ref(this.db, 'citas');
      onValue(citasRef, (snapshot) => {
        this.zone.run(() => {
          const allData = snapshot.val();
          if (!allData) {
            subscriber.next([]);
            return;
          }

          // Extraemos todas las citas de todos los usuarios iterando sobre el árbol JSON de Firebase
          const lista: any[] = [];
          Object.entries(allData).forEach(([userId, userCitas]: [string, any]) => {
            Object.entries(userCitas).forEach(([citaId, cita]: [string, any]) => {
              lista.push({ id: citaId, userId, ...cita });
            });
          });
          subscriber.next(lista);
        });
      }, (error) => this.zone.run(() => subscriber.error(error)));
    });
  }

  addCita(cita: any): Observable<any> {
    const uid = cita.usuarioId;
    return from(push(ref(this.db, `citas/${uid}`), cita));
  }
}
