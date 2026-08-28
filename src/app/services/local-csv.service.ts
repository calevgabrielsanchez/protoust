import { Injectable } from '@angular/core';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';

export type CsvRecord = Record<string, string | number | boolean | null | undefined>;

@Injectable({
  providedIn: 'root'
})
export class LocalCsvService {
  private readonly prefix = 'protoust_csv_';

  private getFileName(tableName: string): string {
    return `${this.prefix}${tableName}.csv`;
  }

  async hasTable(tableName: string): Promise<boolean> {
    try {
      await Filesystem.stat({
        path: this.getFileName(tableName),
        directory: Directory.Data
      });
      return true;
    } catch {
      return false;
    }
  }

  async deleteTable(tableName: string): Promise<void> {
    await Filesystem.deleteFile({
      path: this.getFileName(tableName),
      directory: Directory.Data
    });
  }

  async clearAllTables(): Promise<void> {
    const result = await Filesystem.readdir({
      path: '',
      directory: Directory.Data
    });

    const files = result.files ?? [];

    await Promise.all(
      files
        .filter(file => file.name.startsWith(this.prefix) && file.name.endsWith('.csv'))
        .map(file => Filesystem.deleteFile({
          path: file.name,
          directory: Directory.Data
        }))
    );
  }

  async saveTable<T extends object>(tableName: string, rows: T[]): Promise<void> {
    const csv = this.toCsv(rows as CsvRecord[]);

    await Filesystem.writeFile({
      path: this.getFileName(tableName),
      data: csv,
      directory: Directory.Data,
      encoding: Encoding.UTF8
    });
  }

  async loadTable<T extends object>(tableName: string): Promise<T[]> {
    try {
      const result = await Filesystem.readFile({
        path: this.getFileName(tableName),
        directory: Directory.Data,
        encoding: Encoding.UTF8
      });

      const raw = this.decodificarContenido(String(result.data ?? ''));
      return this.fromCsv<T>(raw);
    } catch {
      return [];
    }
  }

  async loadAllTables<T extends object>(tableNames: string[]): Promise<Record<string, T[]>> {
    const entries = await Promise.all(
      tableNames.map(async (tableName) => [tableName, await this.loadTable<T>(tableName)] as const)
    );

    return Object.fromEntries(entries) as Record<string, T[]>;
  }

  async saveAllTables<T extends object>(tables: Record<string, T[]>): Promise<void> {
    await Promise.all(
      Object.entries(tables).map(([tableName, rows]) => this.saveTable(tableName, rows))
    );
  }

  toCsv<T extends object>(rows: T[]): string {
    if (!rows || !rows.length) {
      return '';
    }

    const normalizedRows = rows.map((row) => row as Record<string, unknown>);
    const headers = Array.from(
      new Set(normalizedRows.flatMap((row) => Object.keys(row)))
    );

    const escape = (value: unknown): string => {
      if (value === null || value === undefined) {
        return '';
      }

      const text = String(value);
      const normalized = text.replace(/"/g, '""');

      return /[",\r\n]/.test(text) ? `"${normalized}"` : normalized;
    };

    const lines = [headers.join(',')];

    for (const row of normalizedRows) {
      const line = headers.map((header) => escape(row[header])).join(',');
      lines.push(line);
    }

    return lines.join('\n');
  }

  fromCsv<T extends object>(csv: string): T[] {
    if (!csv || !csv.trim()) {
      return [];
    }

    const lines = this.splitLineasCsv(csv)
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length < 2) {
      return [];
    }

    const headers = this.parseCsvLine(lines[0]);
    const results: T[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCsvLine(lines[i]);
      const row: Record<string, unknown> = {};

      headers.forEach((header, index) => {
        const rawValue = values[index] ?? '';
        row[header] = this.parseValue(rawValue);
      });

      results.push(row as T);
    }

    return results;
  }

  private decodificarContenido(datos: string): string {
    try {
      return btoa(atob(datos)) === datos ? atob(datos) : datos;
    } catch {
      return datos;
    }
  }

  private splitLineasCsv(csv: string): string[] {
    const lineas: string[] = [];
    let actual = '';
    let inQuotes = false;
    let i = 0;

    while (i < csv.length) {
      const char = csv[i];

      if (char === '"') {
        if (inQuotes && csv[i + 1] === '"') {
          actual += '""';
          i += 2;
          continue;
        }
        inQuotes = !inQuotes;
        actual += char;
        i++;
        continue;
      }

      // Un salto de línea dentro de un campo entre comillas NO separa filas
      if (char === '\n' && !inQuotes) {
        lineas.push(actual);
        actual = '';
        i++;
        continue;
      }

      if (char === '\r' && !inQuotes) {
        if (csv[i + 1] === '\n') {
          i++;
        }
        lineas.push(actual);
        actual = '';
        i++;
        continue;
      }

      actual += char;
      i++;
    }

    lineas.push(actual);
    return lineas;
  }

  private parseCsvLine(line: string): string[] {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
        continue;
      }

      if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
        continue;
      }

      current += char;
    }

    values.push(current);
    return values;
  }

  private parseValue(value: string): string | number | boolean {
    if (value === '') {
      return '';
    }

    const lower = value.toLowerCase();

    if (lower === 'true') {
      return true;
    }

    if (lower === 'false') {
      return false;
    }

    if (!Number.isNaN(Number(value)) && value.trim() !== '') {
      return Number(value);
    }

    return value;
  }
}

