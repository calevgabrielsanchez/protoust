import { Injectable, inject } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { Universo } from '../models/universo.model';
import { Mundo } from '../models/mundo.model';
import { Cultura } from '../models/cultura.model';
import { Personaje } from '../models/personaje.model';
import { Creatura } from '../models/creatura.model';
import { Saga } from '../models/saga.model';
import { Tomo } from '../models/tomo.model';
import { Indice } from '../models/indice.model';
import { ContenidoIndice } from '../models/contenidoIndice.model';
import { Personalidad } from '../models/personalidad.model';
import { Valores } from '../models/valores.model';
import { Miedos } from '../models/miedos.model';
import { Emociones } from '../models/emociones.modelo';
import { Memoria } from '../models/memoria.modelo';
import { Creatividad } from '../models/creatividad.modelo';
import { Dibujo } from '../models/dibujo.model';
import { LocalCsvService } from './local-csv.service';

@Injectable({
    providedIn: 'root'
})
export class SupabaseService {
    private supabase: SupabaseClient;

    private dbReady: Promise<void>;

    private readonly tablasSinGuion = ['personalidad', 'valores', 'miedos', 'emociones'];

    private readonly TABLA_POR_CLAVE: Record<string, string> = {
        universo: 'universo',
        mundo: 'mundo',
        cultura: 'cultura',
        personaje: 'personaje',
        creatura: 'creatura',
        saga: 'saga',
        tomo: 'tomo',
        indice: 'indice',
        contenidoIndice: 'contenido_indice',
        personalidad: 'personalidad',
        valores: 'valores',
        miedos: 'miedos',
        emociones: 'emociones',
        creatividad: 'creatividad',
        dibujo: 'dibujo',
        memoria: 'memoria'
    };

    // Canales reactivos para que los componentes de Angular escuchen los datos
    public universo$ = new BehaviorSubject<Universo[]>([]);
    public mundo$ = new BehaviorSubject<Mundo[]>([]);
    public cultura$ = new BehaviorSubject<Cultura[]>([]);
    public personaje$ = new BehaviorSubject<Personaje[]>([]);
    public creatura$ = new BehaviorSubject<Creatura[]>([]);
    public saga$ = new BehaviorSubject<Saga[]>([]);
    public tomo$ = new BehaviorSubject<Tomo[]>([]);
    public indice$ = new BehaviorSubject<Indice[]>([]);
    public contenidoIndice$ = new BehaviorSubject<ContenidoIndice[]>([]);
    public personalidad$ = new BehaviorSubject<Personalidad[]>([]);
    public valores$ = new BehaviorSubject<Valores[]>([]);
    public miedos$ = new BehaviorSubject<Miedos[]>([]);
    public emociones$ = new BehaviorSubject<Emociones[]>([]);
    public creatividad$ = new BehaviorSubject<Creatividad[]>([]);
    public dibujo$ = new BehaviorSubject<Dibujo[]>([]);
    public memoria$ = new BehaviorSubject<Memoria[]>([]);

    private localCsv = inject(LocalCsvService);

    constructor() {
        this.supabase = createClient(
            'https://qwqddhyrjdujgypsxirl.supabase.co',
            'sb_publishable_XO-Atj3pA2-WKBZ66w3JRA_ous1OZMB',
            {
                auth: {
                    persistSession: false,
                    autoRefreshToken: false
                }
            }
        );

        this.dbReady = this.refrescarDatos().catch(error => {
            console.error('No se pudieron cargar los datos de Supabase al iniciar:', error);
        });
    }

    async verificarConexionSupabase() {
        try {
            const { data, error } = await this.supabase.from('universo').select('*').limit(1);
            console.log('Verificación Supabase:', { data, error });

            if (error) {
                console.error('Supabase no respondió correctamente:', error);
                return { ok: false, data: null, error };
            }

            return { ok: true, data, error: null };
        } catch (error) {
            console.error('Error al conectar con Supabase:', error);
            return { ok: false, data: null, error };
        }
    }

    async subirASupabase() {
        return this.sincronizarConSupabase();
    }

    async sincronizarCSVTemplateSupabase(): Promise<boolean> {
        const conexion = await this.verificarConexionSupabase();
        if (!conexion.ok) {
            alert('No se pudo conectar a Supabase.');
            return false;
        }

        const plantillas: { archivo: string; tabla: string; idKey: string }[] = [
            { archivo: 'personalidades', tabla: 'personalidad', idKey: 'mbti' },
            { archivo: 'valores', tabla: 'valores', idKey: 'nombre' },
            { archivo: 'miedos', tabla: 'miedos', idKey: 'nombre' },
            { archivo: 'emociones', tabla: 'emociones', idKey: 'nombre' },
        ];

        try {
            for (const { archivo, tabla, idKey } of plantillas) {
                const response = await fetch(`/template/${archivo}.csv`);
                const texto = await response.text();
                const filas = this.localCsv.fromCsv<object>(texto).map(fila => ({
                    ...fila,
                    id: (fila as any)[idKey] ?? `${archivo}_${Math.random().toString(36).slice(2, 7)}`,
                    updatedAt: Date.now(),
                    _deleted: false
                }));

                const { error } = await this.supabase
                    .from(tabla)
                    .upsert(filas.map(fila => this.aSnake(fila as any, tabla)));

                if (error) {
                    throw error;
                }
            }

            await this.refrescarDatos();
            return true;
        } catch (error) {
            console.error('Error sincronizando CSV template a Supabase:', error);
            alert('Hubo un problema al sincronizar los templates con Supabase.');
            return false;
        }
    }

    async sincronizarConSupabase(): Promise<boolean> {
        const conexion = await this.verificarConexionSupabase();
        if (!conexion.ok) {
            alert('No se pudo conectar a Supabase. Revisa la tabla y la configuración.');
            return false;
        }

        try {
            await this.refrescarDatos();
            console.log('¡Sincronización completada con éxito!');
            return true;
        } catch (error) {
            console.error('Error al sincronizar:', error);
            alert('Hubo un problema al subir los datos.');
            return false;
        }
    }

    async importarTablasATrxDB(tablas: Record<string, object[]>): Promise<void> {
        await this.dbReady;

        for (const [clave, filas] of Object.entries(tablas)) {
            const tabla = this.TABLA_POR_CLAVE[clave];
            if (!tabla || !filas || filas.length === 0) {
                continue;
            }
            const { error } = await this.supabase
                .from(tabla)
                .upsert(filas.map(fila => this.aSnake(fila as any, tabla)));
            if (error) {
                throw error;
            }
        }

        await this.refrescarDatos();
    }

    async sincronizarDesdeSupabase(): Promise<Record<string, any[]> | null> {
        console.log('Descargando datos desde Supabase hacia CSV...');

        await this.dbReady;

        const conexion = await this.verificarConexionSupabase();
        if (!conexion.ok) {
            alert('No se pudo conectar a Supabase. Revisa la tabla y la configuración.');
            return null;
        }

        try {
            return await this.obtenerTablas();
        } catch (error) {
            console.error('Error al descargar desde Supabase:', error);
            alert('Hubo un problema al descargar los datos.');
            return null;
        }
    }

    async refrescarDatos(): Promise<void> {
        const tablas = await this.obtenerTablas();
        this.universo$.next(tablas['universo'] as Universo[]);
        this.mundo$.next(tablas['mundo'] as Mundo[]);
        this.cultura$.next(tablas['cultura'] as Cultura[]);
        this.personaje$.next(tablas['personaje'] as Personaje[]);
        this.creatura$.next(tablas['creatura'] as Creatura[]);
        this.saga$.next(tablas['saga'] as Saga[]);
        this.tomo$.next(tablas['tomo'] as Tomo[]);
        this.indice$.next(tablas['indice'] as Indice[]);
        this.contenidoIndice$.next(tablas['contenidoIndice'] as ContenidoIndice[]);
        this.personalidad$.next(tablas['personalidad'] as Personalidad[]);
        this.valores$.next(tablas['valores'] as Valores[]);
        this.miedos$.next(tablas['miedos'] as Miedos[]);
        this.emociones$.next(tablas['emociones'] as Emociones[]);
        this.creatividad$.next(tablas['creatividad'] as Creatividad[]);
        this.dibujo$.next(tablas['dibujo'] as Dibujo[]);
        this.memoria$.next(tablas['memoria'] as Memoria[]);
    }

    private async obtenerTablas(): Promise<Record<string, any[]>> {
        const [universos, mundos, culturas, personajes, creaturas, sagas, tomos, indices, contenidos, personalidades, valoresList, miedosList, emocionesList, creatividadList, dibujos, memorias] = await Promise.all([
            this.traerRegistros('universo', r => ({
                id: r.id,
                nombre: r.nombre,
                detalles: r.detalles,
                imagen: r.imagen,
                updatedAt: Number(r.updated_at),
                _deleted: false
            })),
            this.traerRegistros('mundo', r => ({
                id: r.id,
                universoId: r.universo_id,
                nombre: r.nombre,
                detalles: r.detalles,
                imagen: r.imagen,
                diferente: r.diferente,
                funciona: r.funciona,
                reglas: r.reglas,
                geografia: r.geografia,
                historia: r.historia,
                eventEspeciales: r.event_especiales,
                updatedAt: Number(r.updated_at),
                _deleted: false
            })),
            this.traerRegistros('cultura', r => ({
                id: r.id,
                mundoId: r.mundo_id,
                nombre: r.nombre,
                detalles: r.detalles,
                imagen: r.imagen,
                costumbres: r.costumbres,
                religiones: r.religiones,
                idioma: r.idioma,
                vestimenta: r.vestimenta,
                comida: r.comida,
                valores: r.valores,
                castas: r.castas,
                armas: r.armas,
                diasFestivos: r.dias_festivos,
                historia: r.historia,
                sistemaPolitico: r.sistema_politico,
                comoObtienePoder: r.como_obtiene_poder,
                dinero: r.dinero,
                recursos: r.recursos,
                viajan: r.viajan,
                updatedAt: Number(r.updated_at),
                _deleted: false
            })),
            this.traerRegistros('personaje', r => ({
                id: r.id,
                culturaId: r.cultura_id,
                nombre: r.nombre,
                detalles: r.detalles,
                imagen: r.imagen,
                personales: r.personales,
                enfermedad: r.enfermedad,
                traumas: r.traumas,
                pasado: r.pasado,
                presente: r.presente,
                futuro: r.futuro,
                personalidad: r.personalidad,
                seductor: r.seductor,
                hobbie: r.hobbie,
                amor: r.amor,
                odio: r.odio,
                ignora: r.ignora,
                familia: r.familia,
                amigos: r.amigos,
                parejas: r.parejas,
                updatedAt: Number(r.updated_at),
                _deleted: false
            })),
            this.traerRegistros('creatura', r => ({
                id: r.id,
                mundoId: r.mundo_id,
                nombre: r.nombre,
                detalles: r.detalles,
                imagen: r.imagen,
                rol: r.rol,
                habitat: r.habitat,
                forma: r.forma,
                habilidades: r.habilidades,
                comunica: r.comunica,
                reproduce: r.reproduce,
                come: r.come,
                importantePara: r.importante_para,
                familia: r.familia,
                comportamiento: r.comportamiento,
                cicloVida: r.ciclo_vida,
                inteligencia: r.inteligencia,
                ecosistema: r.ecosistema,
                curiocidad: r.curiocidad,
                sociedad: r.sociedad,
                updatedAt: Number(r.updated_at),
                _deleted: false
            })),
            this.traerRegistros('saga', r => ({
                id: r.id,
                universoId: r.universo_id,
                nombre: r.nombre,
                detalles: r.detalles,
                imagen: r.imagen,
                updatedAt: Number(r.updated_at),
                _deleted: false
            })),
            this.traerRegistros('tomo', r => ({
                id: r.id,
                sagaId: r.saga_id,
                nombre: r.nombre,
                detalles: r.detalles,
                imagen: r.imagen,
                updatedAt: Number(r.updated_at),
                _deleted: false
            })),
            this.traerRegistros('indice', r => ({
                id: r.id,
                tomoId: r.tomo_id,
                nombre: r.nombre,
                detalles: r.detalles,
                imagen: r.imagen,
                updatedAt: Number(r.updated_at),
                _deleted: false
            })),
            this.traerRegistros('contenido_indice', r => ({
                id: r.id,
                indiceId: r.indice_id,
                contenido: r.contenido,
                indice: r.indice,
                nombre: r.nombre,
                updatedAt: Number(r.updated_at),
                _deleted: false
            })),
            this.traerRegistros('personalidad', r => ({
                id: r.id,
                detalles: r.detalles,
                imagen: r.imagen,
                mbti: r.mbti,
                colorForma: r.colorforma,
                oficio: r.oficio,
                descripcion: r.descripcion,
                comoSon: r.comoson,
                cualidad: r.cualidad,
                dondeEncaja: r.dondeencaja,
                habilidad: r.habilidad,
                valores: r.valores,
                pareja: r.pareja,
                traumas: r.traumas,
                enfermedad: r.enfermedad,
                danan: r.danan,
                CaleVRije: r.calevrije,
                funcion: r.funcion,
                grupo: r.grupo,
                updatedAt: Number(r.updated_at),
                _deleted: false
            }), { orden: 'updated_at', filtrarBorrados: false }),
            this.traerRegistros('valores', r => ({
                id: r.id,
                nombre: r.nombre,
                descripcion: r.descripcion,
                frase: r.frase,
                creatura: r.creatura,
                detalles: r.detalles,
                imagen: r.imagen,
                updatedAt: Number(r.updated_at),
                _deleted: false
            }), { orden: 'updated_at', filtrarBorrados: false }),
            this.traerRegistros('miedos', r => ({
                id: r.id,
                nombre: r.nombre,
                descripcion: r.descripcion,
                frase: r.frase,
                creatura: r.creatura,
                detalles: r.detalles,
                imagen: r.imagen,
                updatedAt: Number(r.updated_at),
                _deleted: false
            }), { orden: 'updated_at', filtrarBorrados: false }),
            this.traerRegistros('emociones', r => ({
                id: r.id,
                nombre: r.nombre,
                descripcion: r.descripcion,
                frase: r.frase,
                creatura: r.creatura,
                detalles: r.detalles,
                imagen: r.imagen,
                updatedAt: Number(r.updated_at),
                _deleted: false
            }), { orden: 'updated_at', filtrarBorrados: false }),
            this.traerRegistros('creatividad', r => ({
                id: r.id,
                nombre: r.nombre,
                desarrollo: r.desarrollo,
                updatedAt: Number(r.updated_at),
                _deleted: false
            })),
            this.traerRegistros('dibujo', r => ({
                id: r.id,
                nombre: r.nombre,
                detalles: r.detalles,
                imagen: r.imagen,
                dibujo: r.dibujo,
                historia: r.historia,
                updatedAt: Number(r.updated_at),
                _deleted: false
            })),
            this.traerRegistros('memoria', r => ({
                id: r.id,
                unoPalabra: r.uno_palabra,
                unoDescripcion: r.uno_descripcion,
                dosPalabra: r.dos_palabra,
                dosDescripcion: r.dos_descripcion,
                tresPalabra: r.tres_palabra,
                tresDescripcion: r.tres_descripcion,
                cuatroPalabra: r.cuatro_palabra,
                cuatroDescripcion: r.cuatro_descripcion,
                cincoPalabra: r.cinco_palabra,
                cincoDescripcion: r.cinco_descripcion,
                seisPalabra: r.seis_palabra,
                seisDescripcion: r.seis_descripcion,
                sietePalabra: r.siete_palabra,
                sieteDescripcion: r.siete_descripcion,
                ochoPalabra: r.ocho_palabra,
                ochoDescripcion: r.ocho_descripcion,
                nuevePalabra: r.nueve_palabra,
                nueveDescripcion: r.nueve_descripcion,
                diezPalabra: r.diez_palabra,
                diezDescripcion: r.diez_descripcion,
                oncePalabra: r.once_palabra,
                onceDescripcion: r.once_descripcion,
                docePalabra: r.doce_palabra,
                doceDescripcion: r.doce_descripcion,
                trecePalabra: r.trece_palabra,
                treceDescripcion: r.trece_descripcion,
                catorcePalabra: r.catorce_palabra,
                catorceDescripcion: r.catorce_descripcion,
                quincePalabra: r.quince_palabra,
                quinceDescripcion: r.quince_descripcion,
                dieciseisPalabra: r.dieciseis_palabra,
                dieciseisDescripcion: r.dieciseis_descripcion,
                diecisietePalabra: r.diecisiete_palabra,
                diecisieteDescripcion: r.diecisiete_descripcion,
                dieciochoPalabra: r.dieciocho_palabra,
                dieciochoDescripcion: r.dieciocho_descripcion,
                diecinuevePalabra: r.diecinueve_palabra,
                diecinueveDescripcion: r.diecinueve_descripcion,
                veintePalabra: r.veinte_palabra,
                veinteDescripcion: r.veinte_descripcion,
                updatedAt: Number(r.updated_at),
                _deleted: false
            }))
        ]);

        return {
            universo: universos,
            mundo: mundos,
            cultura: culturas,
            personaje: personajes,
            creatura: creaturas,
            saga: sagas,
            tomo: tomos,
            indice: indices,
            contenidoIndice: contenidos,
            personalidad: personalidades,
            valores: valoresList,
            miedos: miedosList,
            emociones: emocionesList,
            creatividad: creatividadList,
            dibujo: dibujos,
            memoria: memorias
        };
    }

    private async traerRegistros<T>(
        tabla: string,
        mapear: (fila: any) => T,
        opciones: { orden?: string; filtrarBorrados?: boolean } = {}
    ): Promise<T[]> {
        const orden = opciones.orden ?? 'updated_at';
        const filtrarBorrados = opciones.filtrarBorrados ?? true;

        const { data, error } = await this.supabase
            .from(tabla)
            .select('*')
            .order(orden, { ascending: true });

        if (error) {
            throw error;
        }

        return (data || [])
            .filter(r => !filtrarBorrados || !r.is_deleted)
            .map(mapear);
    }

    private aSnake(fila: any, tabla: string): any {
        const especial = this.tablasSinGuion.includes(tabla);
        const out: any = {};
        for (const [clave, valor] of Object.entries(fila)) {
            if (clave === 'updatedAt') {
                out['updated_at'] = (valor as number) ?? Date.now();
            } else if (clave === '_deleted') {
                if (!especial) {
                    out['is_deleted'] = !!valor;
                }
            } else {
                out[especial ? clave.toLowerCase() : clave.replace(/([A-Z])/g, '_$1').toLowerCase()] = valor;
            }
        }
        if (out['updated_at'] === undefined) {
            out['updated_at'] = Date.now();
        }
        if (especial) {
            delete out['is_deleted'];
        } else if (out['is_deleted'] === undefined) {
            out['is_deleted'] = false;
        }
        return out;
    }

    private async eliminarPorId(tabla: string, id: string): Promise<void> {
        if (this.tablasSinGuion.includes(tabla)) {
            const { error } = await this.supabase.from(tabla).delete().eq('id', id);
            if (error) {
                throw error;
            }
            return;
        }
        const { error } = await this.supabase
            .from(tabla)
            .update({ is_deleted: true, updated_at: Date.now() })
            .eq('id', id);
        if (error) {
            throw error;
        }
    }

    async eliminarUniversoPorId(id: string) {
        try {
            await this.eliminarPorId('universo', id);
            await this.refrescarDatos();
            console.log(`Universo con ID ${id} eliminado correctamente.`);
        } catch (error) {
            console.error(`Error al eliminar el universo con ID ${id}:`, error);
        }
    }

    async eliminarMundoPorId(id: string) {
        try {
            await this.eliminarPorId('mundo', id);
            await this.refrescarDatos();
            console.log(`Mundo con ID ${id} eliminado correctamente.`);
        } catch (error) {
            console.error(`Error al eliminar el mundo con ID ${id}:`, error);
        }
    }

    async eliminarCulturaPorId(id: string) {
        try {
            await this.eliminarPorId('cultura', id);
            await this.refrescarDatos();
            console.log(`Cultura con ID ${id} eliminada correctamente.`);
        } catch (error) {
            console.error(`Error al eliminar la cultura con ID ${id}:`, error);
        }
    }

    async eliminarPersonajePorId(id: string) {
        try {
            await this.eliminarPorId('personaje', id);
            await this.refrescarDatos();
            console.log(`Personaje con ID ${id} eliminado correctamente.`);
        } catch (error) {
            console.error(`Error al eliminar el personaje con ID ${id}:`, error);
        }
    }

    async eliminarCreaturaPorId(id: string) {
        try {
            await this.eliminarPorId('creatura', id);
            await this.refrescarDatos();
            console.log(`Creatura con ID ${id} eliminada correctamente.`);
        } catch (error) {
            console.error(`Error al eliminar la creatura con ID ${id}:`, error);
        }
    }

    async eliminarSagaPorId(id: string) {
        try {
            await this.eliminarPorId('saga', id);
            await this.refrescarDatos();
            console.log(`Saga con ID ${id} eliminada correctamente.`);
        } catch (error) {
            console.error(`Error al eliminar la saga con ID ${id}:`, error);
        }
    }

    async eliminarTomoPorId(id: string) {
        try {
            await this.eliminarPorId('tomo', id);
            await this.refrescarDatos();
            console.log(`Tomo con ID ${id} eliminado correctamente.`);
        } catch (error) {
            console.error(`Error al eliminar el tomo con ID ${id}:`, error);
        }
    }

    async eliminarIndicePorId(id: string) {
        try {
            await this.eliminarPorId('indice', id);
            await this.refrescarDatos();
            console.log(`Índice con ID ${id} eliminado correctamente.`);
        } catch (error) {
            console.error(`Error al eliminar el índice con ID ${id}:`, error);
        }
    }

    async eliminarContenidoIndicePorId(id: string) {
        try {
            await this.eliminarPorId('contenido_indice', id);
            await this.refrescarDatos();
            console.log(`Contenido de índice con ID ${id} eliminado correctamente.`);
        } catch (error) {
            console.error(`Error al eliminar el contenido de índice con ID ${id}:`, error);
        }
    }

    async eliminarPersonalidadPorId(id: string) {
        try {
            await this.eliminarPorId('personalidad', id);
            await this.refrescarDatos();
            console.log(`Personalidad con ID ${id} eliminada correctamente.`);
        } catch (error) {
            console.error(`Error al eliminar la personalidad con ID ${id}:`, error);
        }
    }

    async eliminarValoresPorId(id: string) {
        try {
            await this.eliminarPorId('valores', id);
            await this.refrescarDatos();
            console.log(`Valores con ID ${id} eliminados correctamente.`);
        } catch (error) {
            console.error(`Error al eliminar los valores con ID ${id}:`, error);
        }
    }

    async eliminarMiedosPorId(id: string) {
        try {
            await this.eliminarPorId('miedos', id);
            await this.refrescarDatos();
            console.log(`Miedos con ID ${id} eliminados correctamente.`);
        } catch (error) {
            console.error(`Error al eliminar los miedos con ID ${id}:`, error);
        }
    }

    async eliminarEmocionesPorId(id: string) {
        try {
            await this.eliminarPorId('emociones', id);
            await this.refrescarDatos();
            console.log(`Emociones con ID ${id} eliminadas correctamente.`);
        } catch (error) {
            console.error(`Error al eliminar las emociones con ID ${id}:`, error);
        }
    }

    async eliminarMemoriaPorId(id: string) {
        try {
            await this.eliminarPorId('memoria', id);
            await this.refrescarDatos();
            console.log(`Memoria con ID ${id} eliminada correctamente.`);
        } catch (error) {
            console.error(`Error al eliminar la memoria con ID ${id}:`, error);
        }
    }
}