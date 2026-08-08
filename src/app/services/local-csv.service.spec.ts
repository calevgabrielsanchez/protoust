import { describe, expect, it, beforeEach } from 'vitest';
import { LocalCsvService } from './local-csv.service';

describe('LocalCsvService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('guarda y recupera una tabla local en CSV', async () => {
    const service = new LocalCsvService();

    await service.saveTable('universo', [
      { id: 'u1', nombre: 'Alpha', updatedAt: 123 },
      { id: 'u2', nombre: 'Beta', updatedAt: 456 }
    ]);

    const rows = await service.loadTable('universo');

    expect(rows).toHaveLength(2);
    expect(rows[0].id).toBe('u1');
    expect(rows[1].nombre).toBe('Beta');
  });
});
