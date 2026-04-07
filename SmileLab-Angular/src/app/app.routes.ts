import { Routes } from '@angular/router';
import { Contacto } from './pages/contacto/contacto';
import { Citas } from './pages/citas/citas';
import { AdminCrearProducto } from './pages/admin-crear-producto/admin-crear-producto';
import { Login } from './pages/login/login';

export const routes: Routes = [
  { path: 'contacto', component: Contacto },
  { path: 'citas', component: Citas },
  { path: 'admin/crear-producto', component: AdminCrearProducto },
  { path: 'login', component: Login },
  { path: '', redirectTo: '/contacto', pathMatch: 'full' }
];
