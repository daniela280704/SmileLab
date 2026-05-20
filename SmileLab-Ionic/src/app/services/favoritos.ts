/**
 * @fileoverview Servicio de persistencia local de favoritos.
 * Utiliza Capacitor SQLite en dispositivos nativos y LocalStorage como fallback en web.
 */
import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class Favoritos {
  // Instancia de conexión con SQLite nativo
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  // Referencia a la base de datos abierta
  private db!: SQLiteDBConnection;
  // Indica si la base de datos ha terminado de inicializarse
  private isReady = false;

  constructor(private auth: Auth) {
    this.initDatabase();
  }

  // Obtiene el ID del usuario actual de Firebase, o 'guest' si no hay sesión
  private getUserId(): string {
    return this.auth.currentUser?.uid || 'guest';
  }

  // Obtiene los favoritos del LocalStorage (Fallback para web)
  private getWebFavoritos(): string[] {
    const saved = localStorage.getItem(`favoritos_web_${this.getUserId()}`);
    return saved ? JSON.parse(saved) : [];
  }

  // Guarda la lista de favoritos en LocalStorage (Fallback para web)
  private saveWebFavoritos(favs: string[]) {
    localStorage.setItem(`favoritos_web_${this.getUserId()}`, JSON.stringify(favs));
  }

  // Inicializa la base de datos SQLite y crea la tabla si no existe
  private async initDatabase() {
    try {
      const platform = Capacitor.getPlatform();

      if (platform === 'web') {
        this.isReady = true;
        return;
      }

      const isConn = await this.sqlite.isConnection('favoritos_db_v2', false);
      if (isConn.result) {
        this.db = await this.sqlite.retrieveConnection('favoritos_db_v2', false);
      } else {
        this.db = await this.sqlite.createConnection('favoritos_db_v2', false, 'no-encryption', 1, false);
      }

      const isOpen = await this.db.isDBOpen();
      if (!isOpen.result) {
        await this.db.open();
      }

      const schema = `
        CREATE TABLE IF NOT EXISTS user_favorites (
          userId TEXT NOT NULL,
          productoId TEXT NOT NULL,
          PRIMARY KEY (userId, productoId)
        );
      `;
      await this.db.execute(schema);
      this.isReady = true;
    } catch (err) {
      console.error('Error initializing database', err);
    }
  }

  // Asegura que la base de datos esté lista antes de hacer cualquier consulta
  private async ensureDbReady() {
    if (!this.isReady) {
      await this.initDatabase();
    }
  }

  // Devuelve un array con los IDs de todos los productos marcados como favoritos
  async getFavoritosIds(): Promise<string[]> {
    await this.ensureDbReady();
    
    if (Capacitor.getPlatform() === 'web' || !this.db) {
      return this.getWebFavoritos();
    }

    try {
      const userId = this.getUserId();
      const res = await this.db.query('SELECT productoId FROM user_favorites WHERE userId = ?', [userId]);
      return res.values ? res.values.map((v: any) => v.productoId) : [];
    } catch (err) {
      console.error('Error getting favorites', err);
      return this.getWebFavoritos();
    }
  }

  // Alterna el estado de favorito de un producto (lo añade si no está, lo borra si está)
  async toggleFavorito(productoId: string): Promise<boolean> {
    await this.ensureDbReady();
    
    const esFav = await this.esFavorito(productoId);
    const userId = this.getUserId();

    if (Capacitor.getPlatform() === 'web' || !this.db) {
      let favs = this.getWebFavoritos();
      if (esFav) {
        favs = favs.filter(id => id !== productoId);
      } else {
        favs.push(productoId);
      }
      this.saveWebFavoritos(favs);
      return !esFav;
    }

    try {
      if (esFav) {
        await this.db.run('DELETE FROM user_favorites WHERE userId = ? AND productoId = ?', [userId, productoId]);
        return false;
      } else {
        await this.db.run('INSERT INTO user_favorites (userId, productoId) VALUES (?, ?)', [userId, productoId]);
        return true;
      }
    } catch (err) {
      console.error('Error toggling favorite', err);
      return esFav;
    }
  }

  // Comprueba de forma booleana si un producto concreto está en favoritos
  async esFavorito(productoId: string): Promise<boolean> {
    await this.ensureDbReady();

    if (Capacitor.getPlatform() === 'web' || !this.db) {
      return this.getWebFavoritos().includes(productoId);
    }

    try {
      const userId = this.getUserId();
      const res = await this.db.query('SELECT productoId FROM user_favorites WHERE userId = ? AND productoId = ?', [userId, productoId]);
      return res.values ? res.values.length > 0 : false;
    } catch (err) {
      console.error('Error checking favorite status', err);
      return this.getWebFavoritos().includes(productoId);
    }
  }
}
