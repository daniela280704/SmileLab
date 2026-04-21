import { Routes } from '@angular/router';

import { Inicio } from './pages/inicio/inicio';
import { Equipo } from './pages/equipo/equipo';
import { Servicios } from './pages/servicios/servicios';
import { Productos } from './pages/productos/productos';
import { Contacto } from './pages/contacto/contacto';
import { Login } from './pages/login/login';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { Citas } from './pages/citas/citas';
import { AdminCrearProducto } from './pages/admin-crear-producto/admin-crear-producto';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },

  { path: 'inicio', component: Inicio },
  { path: 'equipo', component: Equipo },
  { path: 'servicios', component: Servicios },
  { path: 'productos', component: Productos },
  { path: 'contacto', component: Contacto },
  { path: 'login', component: Login },
  { path: 'perfil', component: PerfilComponent },
  { path: 'citas', component: Citas },
  { path: 'admin-crear-producto', component: AdminCrearProducto },

  { path: '**', redirectTo: 'inicio' }
];
