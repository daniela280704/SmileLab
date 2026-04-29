// Punto de entrada principal de la aplicación Angular
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Inicializamos la aplicación con el componente raíz y la configuración global
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
