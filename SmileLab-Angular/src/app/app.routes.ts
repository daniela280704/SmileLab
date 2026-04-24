import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

import { InicioComponent } from './pages/inicio/inicio';
import { EquipoComponent } from './pages/equipo/equipo';
import { ServiciosComponent } from './pages/servicios/servicios';
import { ProductosComponent } from './pages/productos/productos';
import { ProductoDetalle } from './pages/productos/detalle/producto-detalle';
import { ContactoComponent } from './pages/contacto/contacto';
import { LoginComponent } from './pages/login/login';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { CitasComponent } from './pages/citas/citas';
import { AdminCrearProducto } from './pages/admin-crear-producto/admin-crear-producto';
import { RegistroComponent } from './pages/registro/registro';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent },
  { path: 'equipo', component: EquipoComponent },
  { path: 'servicios', component: ServiciosComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'productos/:id', component: ProductoDetalle },
  { path: 'contacto', component: ContactoComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'perfil', component: PerfilComponent, canActivate: [authGuard] },
  { path: 'citas', component: CitasComponent, canActivate: [authGuard] },
  { path: 'admin-crear-producto', component: AdminCrearProducto, canActivate: [adminGuard] },
  { path: '**', redirectTo: 'inicio' }
];
