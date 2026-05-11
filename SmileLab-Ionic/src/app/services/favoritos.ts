import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Favoritos {

  private favoritosIds: string[] = ['cepillo-electrico'];

  async getFavoritosIds(): Promise<string[]> {
    return this.favoritosIds;
  }

  async esFavorito(productoId: string): Promise<boolean> {
    return this.favoritosIds.includes(productoId);
  }
}
