import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DataService {
  private http = inject(HttpClient);
  private apiUrl = 'db.json';

  getInicio(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(map(data => data.inicio));
  }

  getServicios(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(map(data => data.servicios));
  }

  getEquipo(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(map(data => data.equipo));
  }

  getProductos(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl).pipe(map(data => data.productos.items));
  }
}
