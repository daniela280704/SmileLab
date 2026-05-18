import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class Favoritos {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private isReady = false;

  constructor(private auth: Auth) {
    this.initDatabase();
  }

  private getUserId(): string {
    return this.auth.currentUser?.uid || 'guest';
  }

  private getWebFavoritos(): string[] {
    const saved = localStorage.getItem(`favoritos_web_${this.getUserId()}`);
    return saved ? JSON.parse(saved) : [];
  }

  private saveWebFavoritos(favs: string[]) {
    localStorage.setItem(`favoritos_web_${this.getUserId()}`, JSON.stringify(favs));
  }

  private async initDatabase() {
    try {
      const platform = Capacitor.getPlatform();

      if (platform === 'web') {
        this.isReady = true;
        return;
      }

      this.db = await this.sqlite.createConnection('favoritos_db_v2', false, 'no-encryption', 1, false);
      await this.db.open();

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

  private async ensureDbReady() {
    if (!this.isReady) {
      await this.initDatabase();
    }
  }

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
