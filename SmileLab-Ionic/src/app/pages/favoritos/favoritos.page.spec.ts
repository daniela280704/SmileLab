/**
 * @fileoverview Pruebas unitarias para la página de favoritos (catálogo principal).
 * Verifica la correcta creación de la página y su integración.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoritosPage } from './favoritos.page';

describe('FavoritosPage', () => {
  let component: FavoritosPage;
  let fixture: ComponentFixture<FavoritosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoritosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
