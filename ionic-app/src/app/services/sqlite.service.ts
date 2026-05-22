import { Injectable } from '@angular/core';

/**
 * Servicio SQLite — almacenamiento local de datos de usuario.
 *
 * Tablas:
 *   favoritos (peliculaId, userId)
 *   vistos    (peliculaId, userId)
 *   notas     (peliculaId, userId, texto, fechaModificacion)
 *
 * En dispositivo real/emulador → @capacitor-community/sqlite
 * En navegador web             → localStorage como fallback
 */
@Injectable({ providedIn: 'root' })
export class SqliteService {

  private readonly DB  = 'cineapp.db';
  private nativo = false;

  // ── LocalStorage keys (fallback web) ──
  private readonly KEY_FAV   = 'cineapp_favoritos';
  private readonly KEY_VISTO = 'cineapp_vistos';
  private readonly KEY_NOTA  = 'cineapp_notas';

  async init() {
    try {
      const { CapacitorSQLite } = await import('@capacitor-community/sqlite');
      await CapacitorSQLite.createConnection({
        database: this.DB, encrypted: false, mode: 'no-encryption', version: 2, readonly: false
      });
      await CapacitorSQLite.open({ database: this.DB });
      await CapacitorSQLite.execute({
        database: this.DB,
        statements: `
          CREATE TABLE IF NOT EXISTS favoritos (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            peliculaId TEXT NOT NULL,
            userId     TEXT NOT NULL,
            UNIQUE(peliculaId, userId)
          );
          CREATE TABLE IF NOT EXISTS vistos (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            peliculaId TEXT NOT NULL,
            userId     TEXT NOT NULL,
            fecha      TEXT NOT NULL DEFAULT (datetime('now')),
            UNIQUE(peliculaId, userId)
          );
          CREATE TABLE IF NOT EXISTS notas (
            id                INTEGER PRIMARY KEY AUTOINCREMENT,
            peliculaId        TEXT NOT NULL,
            userId            TEXT NOT NULL,
            texto             TEXT NOT NULL DEFAULT '',
            fechaModificacion TEXT NOT NULL DEFAULT (datetime('now')),
            UNIQUE(peliculaId, userId)
          );
        `
      });
      this.nativo = true;
    } catch {
      this.nativo = false;
    }
  }

  // ══════════════════════════════════════════
  // FAVORITOS
  // ══════════════════════════════════════════

  async addFav(peliculaId: string, userId: string) {
    if (this.nativo) {
      const { CapacitorSQLite } = await import('@capacitor-community/sqlite');
      await CapacitorSQLite.run({
        database: this.DB,
        statement: `INSERT OR IGNORE INTO favoritos (peliculaId, userId) VALUES (?,?);`,
        values: [peliculaId, userId]
      });
    } else {
      const list = this.ls(this.KEY_FAV);
      if (!list.find((f: any) => f.peliculaId === peliculaId && f.userId === userId)) {
        list.push({ peliculaId, userId });
        this.lsSave(this.KEY_FAV, list);
      }
    }
  }

  /** @deprecated usa addFav — alias para compatibilidad */
  async add(peliculaId: string, userId: string) { return this.addFav(peliculaId, userId); }

  async removeFav(peliculaId: string, userId: string) {
    if (this.nativo) {
      const { CapacitorSQLite } = await import('@capacitor-community/sqlite');
      await CapacitorSQLite.run({
        database: this.DB,
        statement: `DELETE FROM favoritos WHERE peliculaId=? AND userId=?;`,
        values: [peliculaId, userId]
      });
    } else {
      this.lsSave(this.KEY_FAV,
        this.ls(this.KEY_FAV).filter((f: any) => !(f.peliculaId === peliculaId && f.userId === userId)));
    }
  }

  /** @deprecated usa removeFav */
  async remove(peliculaId: string, userId: string) { return this.removeFav(peliculaId, userId); }

  async getIds(userId: string): Promise<string[]> {
    if (this.nativo) {
      const { CapacitorSQLite } = await import('@capacitor-community/sqlite');
      const r = await CapacitorSQLite.query({
        database: this.DB,
        statement: `SELECT peliculaId FROM favoritos WHERE userId=?;`,
        values: [userId]
      });
      return (r.values ?? []).map((x: any) => x.peliculaId);
    }
    return this.ls(this.KEY_FAV)
      .filter((f: any) => f.userId === userId)
      .map((f: any) => f.peliculaId);
  }

  async isFav(peliculaId: string, userId: string): Promise<boolean> {
    if (this.nativo) {
      const { CapacitorSQLite } = await import('@capacitor-community/sqlite');
      const r = await CapacitorSQLite.query({
        database: this.DB,
        statement: `SELECT COUNT(*) as n FROM favoritos WHERE peliculaId=? AND userId=?;`,
        values: [peliculaId, userId]
      });
      return (r.values?.[0]?.n ?? 0) > 0;
    }
    return this.ls(this.KEY_FAV).some((f: any) => f.peliculaId === peliculaId && f.userId === userId);
  }

  // ══════════════════════════════════════════
  // VISTOS
  // ══════════════════════════════════════════

  async addVisto(peliculaId: string, userId: string) {
    if (this.nativo) {
      const { CapacitorSQLite } = await import('@capacitor-community/sqlite');
      await CapacitorSQLite.run({
        database: this.DB,
        statement: `INSERT OR IGNORE INTO vistos (peliculaId, userId) VALUES (?,?);`,
        values: [peliculaId, userId]
      });
    } else {
      const list = this.ls(this.KEY_VISTO);
      if (!list.find((f: any) => f.peliculaId === peliculaId && f.userId === userId)) {
        list.push({ peliculaId, userId, fecha: new Date().toISOString() });
        this.lsSave(this.KEY_VISTO, list);
      }
    }
  }

  async removeVisto(peliculaId: string, userId: string) {
    if (this.nativo) {
      const { CapacitorSQLite } = await import('@capacitor-community/sqlite');
      await CapacitorSQLite.run({
        database: this.DB,
        statement: `DELETE FROM vistos WHERE peliculaId=? AND userId=?;`,
        values: [peliculaId, userId]
      });
    } else {
      this.lsSave(this.KEY_VISTO,
        this.ls(this.KEY_VISTO).filter((f: any) => !(f.peliculaId === peliculaId && f.userId === userId)));
    }
  }

  async getVistosIds(userId: string): Promise<string[]> {
    if (this.nativo) {
      const { CapacitorSQLite } = await import('@capacitor-community/sqlite');
      const r = await CapacitorSQLite.query({
        database: this.DB,
        statement: `SELECT peliculaId FROM vistos WHERE userId=?;`,
        values: [userId]
      });
      return (r.values ?? []).map((x: any) => x.peliculaId);
    }
    return this.ls(this.KEY_VISTO)
      .filter((f: any) => f.userId === userId)
      .map((f: any) => f.peliculaId);
  }

  async isVisto(peliculaId: string, userId: string): Promise<boolean> {
    if (this.nativo) {
      const { CapacitorSQLite } = await import('@capacitor-community/sqlite');
      const r = await CapacitorSQLite.query({
        database: this.DB,
        statement: `SELECT COUNT(*) as n FROM vistos WHERE peliculaId=? AND userId=?;`,
        values: [peliculaId, userId]
      });
      return (r.values?.[0]?.n ?? 0) > 0;
    }
    return this.ls(this.KEY_VISTO).some((f: any) => f.peliculaId === peliculaId && f.userId === userId);
  }

  // ══════════════════════════════════════════
  // NOTAS PERSONALES
  // ══════════════════════════════════════════

  async saveNota(peliculaId: string, userId: string, texto: string) {
    if (this.nativo) {
      const { CapacitorSQLite } = await import('@capacitor-community/sqlite');
      await CapacitorSQLite.run({
        database: this.DB,
        statement: `INSERT INTO notas (peliculaId, userId, texto, fechaModificacion)
                    VALUES (?,?,?,datetime('now'))
                    ON CONFLICT(peliculaId, userId)
                    DO UPDATE SET texto=excluded.texto, fechaModificacion=excluded.fechaModificacion;`,
        values: [peliculaId, userId, texto]
      });
    } else {
      const list = this.ls(this.KEY_NOTA)
        .filter((n: any) => !(n.peliculaId === peliculaId && n.userId === userId));
      list.push({ peliculaId, userId, texto, fechaModificacion: new Date().toISOString() });
      this.lsSave(this.KEY_NOTA, list);
    }
  }

  async getNota(peliculaId: string, userId: string): Promise<string> {
    if (this.nativo) {
      const { CapacitorSQLite } = await import('@capacitor-community/sqlite');
      const r = await CapacitorSQLite.query({
        database: this.DB,
        statement: `SELECT texto FROM notas WHERE peliculaId=? AND userId=?;`,
        values: [peliculaId, userId]
      });
      return r.values?.[0]?.texto ?? '';
    }
    const found = this.ls(this.KEY_NOTA)
      .find((n: any) => n.peliculaId === peliculaId && n.userId === userId);
    return found?.texto ?? '';
  }

  async deleteNota(peliculaId: string, userId: string) {
    if (this.nativo) {
      const { CapacitorSQLite } = await import('@capacitor-community/sqlite');
      await CapacitorSQLite.run({
        database: this.DB,
        statement: `DELETE FROM notas WHERE peliculaId=? AND userId=?;`,
        values: [peliculaId, userId]
      });
    } else {
      this.lsSave(this.KEY_NOTA,
        this.ls(this.KEY_NOTA).filter((n: any) => !(n.peliculaId === peliculaId && n.userId === userId)));
    }
  }

  // ══════════════════════════════════════════
  // Helpers localStorage
  // ══════════════════════════════════════════
  private ls(key: string): any[] {
    try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
  }
  private lsSave(key: string, data: any[]) {
    localStorage.setItem(key, JSON.stringify(data));
  }
}
