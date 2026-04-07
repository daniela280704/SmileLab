import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Contacto } from './pages/contacto/contacto';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Contacto],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('SmileLab-Angular');
}
