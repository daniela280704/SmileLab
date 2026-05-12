import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class Favoritos {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private isReady = false;

  private webFavoritos: string[] = [];

  constructor() {
    this.initDatabase();
    // Cargar de localStorage si estamos en web para que la prueba funcione
    if (Capacitor.getPlatform() === 'web') {
      const saved = localStorage.getItem('favoritos_web');
      this.webFavoritos = saved ? JSON.parse(saved) : [];
    }
  }

  private async initDatabase() {
    try {
      const platform = Capacitor.getPlatform();

      if (platform === 'web') {
        this.isReady = true; // Marcamos como listo para usar el fallback
        return;
      }

      this.db = await this.sqlite.createConnection('favoritos_db', false, 'no-encryption', 1, false);
      await this.db.open();

      const schema = `
        CREATE TABLE IF NOT EXISTS favorites (
          id TEXT PRIMARY KEY NOT NULL
        );
      `;
      await this.db.execute(schema);
      this.isReady = true;
    } catch (err) {
      console.error('Error initializing database', err);
    }
  }

  private async ensureDbReady() {
    if (!this.isReady) {
      await this.initDatabase();
    }
  }

  async getFavoritosIds(): Promise<string[]> {
    await this.ensureDbReady();
    
    if (Capacitor.getPlatform() === 'web' || !this.db) {
      return this.webFavoritos;
    }

    try {
      const res = await this.db.query('SELECT id FROM favorites');
      return res.values ? res.values.map((v: any) => v.id) : [];
    } catch (err) {
      console.error('Error getting favorites', err);
      return this.webFavoritos;
    }
  }

  async toggleFavorito(productoId: string): Promise<boolean> {
    await this.ensureDbReady();
    
    const esFav = await this.esFavorito(productoId);

    if (Capacitor.getPlatform() === 'web' || !this.db) {
      if (esFav) {
        this.webFavoritos = this.webFavoritos.filter(id => id !== productoId);
      } else {
        this.webFavoritos.push(productoId);
      }
      localStorage.setItem('favoritos_web', JSON.stringify(this.webFavoritos));
      return !esFav;
    }

    try {
      if (esFav) {
        await this.db.run('DELETE FROM favorites WHERE id = ?', [productoId]);
        return false;
      } else {
        await this.db.run('INSERT INTO favorites (id) VALUES (?)', [productoId]);
        return true;
      }
    } catch (err) {
      console.error('Error toggling favorite', err);
      return esFav;
    }
  }

  async esFavorito(productoId: string): Promise<boolean> {
    await this.ensureDbReady();

    if (Capacitor.getPlatform() === 'web' || !this.db) {
      return this.webFavoritos.includes(productoId);
    }

    try {
      const res = await this.db.query('SELECT id FROM favorites WHERE id = ?', [productoId]);
      return res.values ? res.values.length > 0 : false;
    } catch (err) {
      console.error('Error checking favorite status', err);
      return this.webFavoritos.includes(productoId);
    }
  }
}
