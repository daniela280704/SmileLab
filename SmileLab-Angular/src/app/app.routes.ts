import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { EquipoComponent } from './pages/equipo/equipo.component';
import { ServiciosComponent } from './pages/servicios/servicios.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { LoginComponent } from './pages/login/login.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { CitasComponent } from './pages/citas/citas.component';
import { AdminCrearProductoComponent } from './pages/admin-crear-producto/admin-crear-producto.component';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent },
  { path: 'equipo', component: EquipoComponent },
  { path: 'servicios', component: ServiciosComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'login', component: LoginComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'citas', component: CitasComponent },
  { path: 'admin-crear-producto', component: AdminCrearProductoComponent },
  { path: '**', redirectTo: 'inicio' }
];
