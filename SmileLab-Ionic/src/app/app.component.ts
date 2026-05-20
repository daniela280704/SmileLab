/**
 * @fileoverview Componente raíz (App Component) de la aplicación.
 * Punto de entrada principal que carga el ion-app y el ion-router-outlet.
 */
import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {}
}
