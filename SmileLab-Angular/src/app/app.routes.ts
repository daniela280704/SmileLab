import { Routes } from '@angular/router';
import { Contacto } from './pages/contacto/contacto';
import { Citas } from './pages/citas/citas';
import { AdminCrearProducto } from './pages/admin-crear-producto/admin-crear-producto';
import { Login } from './pages/login/login';
import { Inicio } from './pages/inicio/inicio';
import { Servicios } from './pages/servicios/servicios';
import { Equipo } from './pages/equipo/equipo';
import { Productos } from './pages/productos/productos';


export const routes: Routes = [
  { path: '', component: Inicio },           // ← raíz = inicio
  { path: 'servicios', component: Servicios },
  { path: 'equipo', component: Equipo },
  { path: 'productos', component: Productos },
  { path: 'contacto', component: Contacto },
  { path: 'citas', component: Citas },
  { path: 'admin/crear-producto', component: AdminCrearProducto },
  { path: 'login', component: Login },
];
