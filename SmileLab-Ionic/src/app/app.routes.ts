/**
 * @fileoverview Definición de las rutas globales de la aplicación Ionic.
 * Incluye la protección de rutas mediante AuthGuard para áreas privadas.
 */
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Rutas públicas (no requieren autenticación)
  {
    path: 'registro',
    loadComponent: () => import('./pages/registro/registro.page').then(m => m.RegistroPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  // Redirección por defecto
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  // Rutas privadas (protegidas por authGuard)
  {
    path: 'favoritos',
    loadComponent: () => import('./pages/favoritos/favoritos.page').then(m => m.FavoritosPage),
    canActivate: [authGuard]
  },
  {
    path: 'detalle-producto/:id',
    loadComponent: () => import('./pages/detalle-producto/detalle-producto.page').then(m => m.DetalleProductoPage),
    canActivate: [authGuard]
  },
];
