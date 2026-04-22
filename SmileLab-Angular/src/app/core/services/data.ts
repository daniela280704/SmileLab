import { Injectable, inject, NgZone } from '@angular/core';
import { Database, ref, onValue, push, set } from '@angular/fire/database';
import { Storage, ref as sRef, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// Datos de respaldo (fallback)
import inicioData from './data-fallback/inicio.json';
import equipoData from './data-fallback/equipo.json';
import serviciosData from './data-fallback/servicios.json';
import footerData from './data-fallback/footer.json';

@Injectable({ providedIn: 'root' })
export class DataService {
  private db = inject(Database);
  private storage = inject(Storage);
  private auth = inject(Auth);
  private zone = inject(NgZone);

  // BehaviorSubject que mantiene el perfil cargado permanentemente
  private profileSubject = new BehaviorSubject<any>(null);
  public userProfile$ = this.profileSubject.asObservable();

  // BehaviorSubject para las citas (empieza con [] para no bloquear el template)
  private citasSubject = new BehaviorSubject<any[]>([]);
  public userCitas$ = this.citasSubject.asObservable();

  constructor() {
    // Escuchar cambios de autenticación globalmente
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // En cuanto hay usuario, escuchamos su perfil de forma permanente
        const uRef = ref(this.db, `usuarios/${user.uid}`);
        onValue(uRef, (snapshot) => {
          this.zone.run(() => {
            this.profileSubject.next(snapshot.val());
          });
        });

        // También escuchamos sus citas permanentemente
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
      onValue(dbRef, (snapshot) => this.zone.run(() => subscriber.next(snapshot.val() ?? equipoData)), () => this.zone.run(() => subscriber.next(equipoData)));
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
          const lista = data ? Object.entries(data).map(([key, val]: [string, any]) => ({ id: key, ...val })) : [];
          subscriber.next(lista);
        });
      }, () => this.zone.run(() => subscriber.next([])));
    });
  }

  getProductoById(id: string): Observable<any> {
    return new Observable(subscriber => {
      const pRef = ref(this.db, `productos/items/${id}`);
      onValue(pRef, (snapshot) => this.zone.run(() => subscriber.next(snapshot.val())));
    });
  }

  addProductoConImagen(producto: any, imagen: File): Observable<any> {
    const filePath = `productos/${Date.now()}_${imagen.name}`;
    const fileRef = sRef(this.storage, filePath);
    return from(uploadBytes(fileRef, imagen)).pipe(
      switchMap(() => from(getDownloadURL(fileRef))),
      switchMap((url) => {
        const finalProduct = { ...producto, imagen: url, fechaCreacion: new Date().toISOString() };
        return from(push(ref(this.db, 'productos/items'), finalProduct));
      })
    );
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

  getCitasByUsuario(uid: string): Observable<any[]> {
    return this.userCitas$ as Observable<any[]>;
  }

  addCita(cita: any): Observable<any> {
    const uid = cita.usuarioId;
    return from(push(ref(this.db, `citas/${uid}`), cita));
  }
}
