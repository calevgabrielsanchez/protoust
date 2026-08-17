import { describe, expect, it, vi, beforeEach } from 'vitest';
import { Filesystem } from '@capacitor/filesystem';
import { LocalCsvService } from './local-csv.service';

describe('LocalCsvService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('guarda y recupera una tabla local en CSV', async () => {
    const service = new LocalCsvService();
    const csv = 'id,nombre,updatedAt\nu1,Alpha,123\nu2,Beta,456';

    vi.spyOn(Filesystem, 'writeFile').mockResolvedValue({ uri: 'file://test/protoust_csv_universo.csv' } as any);
    vi.spyOn(Filesystem, 'readFile').mockResolvedValue({ data: csv } as any);

    await service.saveTable('universo', [
      { id: 'u1', nombre: 'Alpha', updatedAt: 123 },
      { id: 'u2', nombre: 'Beta', updatedAt: 456 }
    ]);

    const rows = await service.loadTable('universo');

    expect(rows).toHaveLength(2);
    expect(rows[0]).toEqual({ id: 'u1', nombre: 'Alpha', updatedAt: 123 });
    expect(rows[1]).toEqual({ id: 'u2', nombre: 'Beta', updatedAt: 456 });
  });
});

