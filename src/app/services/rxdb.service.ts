import { Injectable } from '@angular/core';
import { createRxDatabase, RxDatabase, RxCollection } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { replicateRxCollection, RxReplicationState } from 'rxdb/plugins/replication';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
    UNIVERSO_SCHEMA, MUNDO_SCHEMA, CULTURA_SCHEMA, PERSONAJE_SCHEMA, CREATURA_SCHEMA,
    SAGA_SCHEMA, TOMO_SCHEMA, INDICE_SCHEMA, CONTENIDO_INDICE_SCHEMA
} from '../db/protoust.schemas';
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

@Injectable({
    providedIn: 'root'
})
export class RxdbService {
    private supabase: SupabaseClient;
    private db!: RxDatabase;

    private version: string = 'v35';
    private versionBase: string = 'v35';

    private dbReady!: Promise<void>;

    private replicas: {
        universo?: RxReplicationState<Universo, any>;
        mundo?: RxReplicationState<Mundo, any>;
        cultura?: RxReplicationState<Cultura, any>;
        personaje?: RxReplicationState<Personaje, any>;
        creatura?: RxReplicationState<Creatura, any>;
        saga?: RxReplicationState<Saga, any>;
        tomo?: RxReplicationState<Tomo, any>;
        indice?: RxReplicationState<Indice, any>;
        contenidoIndice?: RxReplicationState<ContenidoIndice, any>;
    } = {};

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

    private colecciones!: {
        universo: RxCollection<Universo>;
        mundo: RxCollection<Mundo>;
        cultura: RxCollection<Cultura>;
        personaje: RxCollection<Personaje>;
        creatura: RxCollection<Creatura>;
        saga: RxCollection<Saga>;
        tomo: RxCollection<Tomo>;
        indice: RxCollection<Indice>;
        contenidoIndice: RxCollection<ContenidoIndice>;
    };

    constructor() {
        // Inicialización del cliente de Supabase con tu llave pública anon
        //       this.supabase = createClient('https://qwqddhyrjdujgypsxirl.supabase.co', 'sb_publishable_XO-Atj3pA2-WKBZ66w3JRA_ous1OZMB');
        this.supabase = createClient(
            'https://qwqddhyrjdujgypsxirl.supabase.co',
            'sb_publishable_XO-Atj3pA2-WKBZ66w3JRA_ous1OZMB',
            {
                auth: {
                    persistSession: false, // Desactiva sesiones basura en modo desarrollo
                    autoRefreshToken: false
                }
            }
        );
        this.dbReady = this.initDatabase();
    }

    private async initDatabase() {

        // No borramos la base local cada vez que se inicia la app.
        // Eso hacía que todo se vaciara automáticamente al arrancar.
        // Si quieres reset manual, hazlo desde un método explícito. 

        // 1. Crear base de datos local
        this.db = await createRxDatabase({
            name: 'protoust_sqlite_db_' + this.versionBase,
            storage: getRxStorageDexie()
        });

        // 2. Registrar colecciones relacionales
        this.colecciones = await this.db.addCollections({
            universo: { schema: UNIVERSO_SCHEMA },
            mundo: { schema: MUNDO_SCHEMA },
            cultura: { schema: CULTURA_SCHEMA },
            personaje: { schema: PERSONAJE_SCHEMA },
            creatura: { schema: CREATURA_SCHEMA },
            saga: { schema: SAGA_SCHEMA },
            tomo: { schema: TOMO_SCHEMA },
            indice: { schema: INDICE_SCHEMA },
            contenidoIndice: { schema: CONTENIDO_INDICE_SCHEMA }
        });

        // 3. Suscribirse a los datos locales activos (mapeando a _deleted nativo de RxDB)
        this.colecciones.universo.find({ selector: { _deleted: false } }).$.subscribe(docs => {
            const data = docs.map(d => d.toJSON() as Universo);
            this.universo$.next(data);
        });

        this.colecciones.mundo.find({ selector: { _deleted: false } }).$.subscribe(docs => {
            const data = docs.map(d => d.toJSON() as Mundo);
            this.mundo$.next(data);
        });

        this.colecciones.cultura.find({ selector: { _deleted: false } }).$.subscribe(docs => {
            const data = docs.map(d => d.toJSON() as Cultura);
            this.cultura$.next(data);
        });

        this.colecciones.personaje.find({ selector: { _deleted: false } }).$.subscribe(docs => {
            const data = docs.map(d => d.toJSON() as Personaje);
            this.personaje$.next(data);
        });

        this.colecciones.creatura.find({ selector: { _deleted: false } }).$.subscribe(docs => {
            const data = docs.map(d => d.toJSON() as Creatura);
            this.creatura$.next(data);
        });

        this.colecciones.saga.find({ selector: { _deleted: false } }).$.subscribe(docs => {
            const data = docs.map(d => d.toJSON() as Saga);
            this.saga$.next(data);
        });

        this.colecciones.tomo.find({ selector: { _deleted: false } }).$.subscribe(docs => {
            const data = docs.map(d => d.toJSON() as Tomo);
            this.tomo$.next(data);
        });

        this.colecciones.indice.find({ selector: { _deleted: false } }).$.subscribe(docs => {
            const data = docs.map(d => d.toJSON() as Indice);
            this.indice$.next(data);
        });

        this.colecciones.contenidoIndice.find({ selector: { _deleted: false } }).$.subscribe(docs => {
            const data = docs.map(d => d.toJSON() as ContenidoIndice);
            this.contenidoIndice$.next(data);
        });

        this.inicializarReplicacionSupabase();
        await this.verificarConexionLocal();
    }

    private inicializarReplicacionSupabase() {
        this.sincronizarUniversos(this.colecciones.universo);
        this.sincronizarMundos(this.colecciones.mundo);
        this.sincronizarCultura(this.colecciones.cultura);
        this.sincronizarPersonaje(this.colecciones.personaje);
        this.sincronizarCreatura(this.colecciones.creatura);
        this.sincronizarSaga(this.colecciones.saga);
        this.sincronizarTomo(this.colecciones.tomo);
        this.sincronizarIndice(this.colecciones.indice);
        this.sincronizarContenidoIndice(this.colecciones.contenidoIndice);
    }

    async verificarConexionLocal() {
        if (!this.db) {
            console.warn('RxDB local aún no está inicializada.');
            return false;
        }

        try {
            const info = await this.db.name; // Solo para verificar que la base de datos está accesible
            console.log('DB local creada:', info);
            console.log('Colecciones de RxDB:', Object.keys(this.db.collections));
            return true;
        } catch (error) {
            console.error('Error al consultar la DB local:', error);
            return false;
        }
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
        console.warn('Sincronización automática desactivada. Usa sincronizarConSupabase() para subir el estado local al backend.');
    }

    async sincronizarConSupabase() {
        console.log('Iniciando sincronización manual hacia Supabase...');

        await this.dbReady;

        const conexion = await this.verificarConexionSupabase();
        if (!conexion.ok) {
            alert('No se pudo conectar a Supabase. Revisa la tabla y la configuración.');
            return false;
        }

        try {
            await this.asegurarReplicas();
            await Promise.all(Object.values(this.replicas).map(estado => this.esperarSincronizacion(estado)));
            console.log('¡Sincronización completada con éxito!');
            return true;
        } catch (error) {
            console.error('Error al sincronizar:', error);
            alert('Hubo un problema al subir los datos.');
            return false;
        }
    }

    private async asegurarReplicas() {
        const reconstruir = (estado?: RxReplicationState<any, any>): boolean =>
            !estado || estado.isStopped();

        if (reconstruir(this.replicas.universo)) {
            this.replicas.universo = this.sincronizarUniversos(this.colecciones.universo);
        }
        if (reconstruir(this.replicas.mundo)) {
            this.replicas.mundo = this.sincronizarMundos(this.colecciones.mundo);
        }
        if (reconstruir(this.replicas.cultura)) {
            this.replicas.cultura = this.sincronizarCultura(this.colecciones.cultura);
        }
        if (reconstruir(this.replicas.personaje)) {
            this.replicas.personaje = this.sincronizarPersonaje(this.colecciones.personaje);
        }
        if (reconstruir(this.replicas.creatura)) {
            this.replicas.creatura = this.sincronizarCreatura(this.colecciones.creatura);
        }
        if (reconstruir(this.replicas.saga)) {
            this.replicas.saga = this.sincronizarSaga(this.colecciones.saga);
        }
        if (reconstruir(this.replicas.tomo)) {
            this.replicas.tomo = this.sincronizarTomo(this.colecciones.tomo);
        }
        if (reconstruir(this.replicas.indice)) {
            this.replicas.indice = this.sincronizarIndice(this.colecciones.indice);
        }
        if (reconstruir(this.replicas.contenidoIndice)) {
            this.replicas.contenidoIndice = this.sincronizarContenidoIndice(this.colecciones.contenidoIndice);
        }
    }

    private async esperarSincronizacion(estado: RxReplicationState<any, any>): Promise<void> {
        await estado.start();
        await Promise.race([
            estado.awaitInSync(),
            new Promise<void>((_, reject) =>
                setTimeout(() => reject(new Error('Timeout de sincronización')), 60000)
            )
        ]);
    }

    async importarTablasATrxDB(tablas: Record<string, object[]>): Promise<void> {
        await this.dbReady;
        for (const [nombre, filas] of Object.entries(tablas)) {
            const coleccion = this.colecciones[nombre as keyof typeof this.colecciones];
            if (!coleccion || !filas || filas.length === 0) {
                continue;
            }
            await coleccion.bulkUpsert(filas as any[]);
        }
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
            const [universos, mundos, culturas, personajes, creaturas, sagas, tomos, indices, contenidos] = await Promise.all([
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
                contenidoIndice: contenidos
            };
        } catch (error) {
            console.error('Error al descargar desde Supabase:', error);
            alert('Hubo un problema al descargar los datos.');
            return null;
        }
    }

    private async traerRegistros<T>(tabla: string, mapear: (fila: any) => T): Promise<T[]> {
        const { data, error } = await this.supabase
            .from(tabla)
            .select('*')
            .order('updated_at', { ascending: true });

        if (error) {
            throw error;
        }

        return (data || [])
            .filter(r => !r.is_deleted)
            .map(mapear);
    }

    // --- MÉTODOS CRUD RELACIONALES ---

    //***************************
    // *   Metodos de creacion **
    // ********** ***************/
    async crearUniverso(id: string, nombre: string, detalles: string, imagen: string) {
        const ahora = Date.now();
        return await this.db['universo'].insert({
            id: id,
            nombre: nombre.trim(),
            detalles: detalles.trim(),
            imagen: imagen.trim(),
            updatedAt: ahora,
            _deleted: false // RxDB requiere estrictamente usar el guion bajo
        });
    }

    // --- EDITAR UNIVERSO ---
    async editarUniverso(id: string, camposAActualizar: Partial<Universo>) {
        const documento = await this.db['universo'].findOne({ selector: { id } }).exec();
        if (documento) {
            await documento.patch({
                ...camposAActualizar,
                updatedAt: Date.now()
            });
        }
    }

    //Crud Mundo
    async crearMundo(
        id: string,
        universoId: string,
        nombre: string,
        detalles: string,
        imagen: string,
        diferente: string,
        funciona: string,
        reglas: string,
        geografia: string,
        historia: string,
        eventEspeciales: string
    ) {
        const ahora = Date.now();
        await this.db['mundo'].insert({
            id: id,
            universoId: universoId,
            nombre: nombre.trim(),
            detalles: detalles,
            imagen: imagen,
            diferente: diferente,
            funciona: funciona,
            reglas: reglas,
            geografia: geografia,
            historia: historia,
            eventEspeciales: eventEspeciales,
            updatedAt: ahora,
            _deleted: false
        });
    }

    // --- EDITAR MUNDO (Soporte para tu editor de tablas) ---
    async editarMundo(id: string, camposAActualizar: Partial<Mundo>) {
        const documento = await this.db['mundo'].findOne({ selector: { id } }).exec();
        if (documento) {
            await documento.patch({
                ...camposAActualizar,
                updatedAt: Date.now()
            });
        }
    }

    //Crud Cultura
    async crearCultura(
        id: string,
        mundoId: string,
        nombre: string,
        detalles: string,
        imagen: string,
        costumbres: string,
        religiones: string,
        idioma: string,
        vestimenta: string,
        comida: string,
        valores: string,
        castas: string,
        armas: string,
        diasFestivos: string,
        historia: string,
        sistemaPolitico: string,
        comoObtienePoder: string,
        dinero: string,
        recursos: string,
        viajan: string
    ) {
        const ahora = Date.now();
        await this.db['cultura'].insert({
            id: id,
            mundoId: mundoId,
            nombre: nombre,
            detalles: detalles,
            imagen: imagen,
            costumbres: costumbres,
            religiones: religiones,
            idioma: idioma,
            vestimenta: vestimenta,
            comida: comida,
            valores: valores,
            castas: castas,
            armas: armas,
            diasFestivos: diasFestivos,
            historia: historia,
            sistemaPolitico: sistemaPolitico,
            comoObtienePoder: comoObtienePoder,
            dinero: dinero,
            recursos: recursos,
            viajan: viajan,
            updatedAt: ahora,
            _deleted: false

        });
    }

    async editarCultura(id: string, camposAActualizar: Partial<Cultura>) {
        const documento = await this.db['cultura'].findOne({ selector: { id } }).exec();
        if (documento) {
            await documento.patch({
                ...camposAActualizar,
                updatedAt: Date.now()
            });
        }
    }

    //Crud Creatura
    async crearCreatura(
        id: string,
        mundoId: string,
        nombre: string,
        detalles: string,
        imagen: string,

        rol: string,
        habitat: string,
        forma: string,
        habilidades: string,
        comunica: string,
        reproduce: string,
        come: string,
        importantePara: string,
        familia: string,
        comportamiento: string,
        cicloVida: string,
        inteligencia: string,
        ecosistema: string,
        curiocidad: string,
        sociedad: string
    ) {
        const ahora = Date.now();
        await this.db['creatura'].insert({
            id: id,
            mundoId: mundoId,
            nombre: nombre,
            detalles: detalles,
            imagen: imagen,

            rol: rol,
            habitat: habitat,
            forma: forma,
            habilidades: habilidades,
            comunica: comunica,
            reproduce: reproduce,
            come: come,
            importantePara: importantePara,
            familia: familia,
            comportamiento: comportamiento,
            cicloVida: cicloVida,
            inteligencia: inteligencia,
            ecosistema: ecosistema,
            curiocidad: curiocidad,
            sociedad: sociedad,

            updatedAt: ahora,
            _deleted: false

        });
    }

    async editarCreatura(id: string, camposAActualizar: Partial<Creatura>) {
        const documento = await this.db['creatura'].findOne({ selector: { id } }).exec();
        if (documento) {
            await documento.patch({
                ...camposAActualizar,
                updatedAt: Date.now()
            });
        }
    }

    //Crud Personaje
    async crearPersonaje(
        id: string,
        culturaId: string,
        nombre: string,
        detalles: string,
        imagen: string,

        personales: string,
        enfermedad: string,
        traumas: string,
        pasado: string,
        presente: string,
        futuro: string,
        personalidad: string,
        seductor: string,
        hobbie: string,
        amor: string,
        odio: string,
        ignora: string,
        familia: string,
        amigos: string,
        parejas: string
    ) {
        const ahora = Date.now();
        await this.db['personaje'].insert({
            id: id,
            culturaId: culturaId,
            nombre: nombre,
            detalles: detalles,
            imagen: imagen,

            personales: personales,
            enfermedad: enfermedad,
            traumas: traumas,
            pasado: pasado,
            presente: presente,
            futuro: futuro,
            personalidad: personalidad,
            seductor: seductor,
            hobbie: hobbie,
            amor: amor,
            odio: odio,
            ignora: ignora,
            familia: familia,
            amigos: amigos,
            parejas: parejas,

            updatedAt: ahora,
            _deleted: false

        });
    }

    async editarPersonaje(id: string, camposAActualizar: Partial<Personaje>) {
        const documento = await this.db['personaje'].findOne({ selector: { id } }).exec();
        if (documento) {
            await documento.patch({
                ...camposAActualizar,
                updatedAt: Date.now()
            });
        }
    }

    //Crud saga
    async crearSaga(
        id: string,
        universoId: string,
        nombre: string,
        detalles: string,
        imagen: string,
    ) {
        const ahora = Date.now();
        await this.db['saga'].insert({
            id: id,
            universoId: universoId,
            nombre: nombre.trim(),
            detalles: detalles,
            imagen: imagen,
            updatedAt: ahora,
            _deleted: false
        });
    }

    // --- EDITAR saga (Soporte para tu editor de tablas) ---
    async editarSaga(id: string, camposAActualizar: Partial<Saga>) {
        const documento = await this.db['saga'].findOne({ selector: { id } }).exec();
        if (documento) {
            await documento.patch({
                ...camposAActualizar,
                updatedAt: Date.now()
            });
        }
    }

    //Crud Tomo
    async crearTomo(
        id: string,
        sagaId: string,
        nombre: string,
        detalles: string,
        imagen: string,
    ) {
        const ahora = Date.now();
        await this.db['tomo'].insert({
            id: id,
            sagaId: sagaId,
            nombre: nombre.trim(),
            detalles: detalles,
            imagen: imagen,
            updatedAt: ahora,
            _deleted: false
        });
    }

    // --- EDITAR tomo (Soporte para tu editor de tablas) ---
    async editarTomo(id: string, camposAActualizar: Partial<Tomo>) {
        const documento = await this.db['tomo'].findOne({ selector: { id } }).exec();
        if (documento) {
            await documento.patch({
                ...camposAActualizar,
                updatedAt: Date.now()
            });
        }
    }

    //Crud indice
    async crearIndice(
        id: string,
        tomoId: string,
        nombre: string,
        detalles: string,
        imagen: string,
    ) {
        const ahora = Date.now();
        await this.db['indice'].insert({
            id: id,
            tomoId: tomoId,
            nombre: nombre.trim(),
            detalles: detalles,
            imagen: imagen,
            updatedAt: ahora,
            _deleted: false
        });
    }

    // --- EDITAR indice (Soporte para tu editor de tablas) ---
    async editarIndice(id: string, camposAActualizar: Partial<Indice>) {
        const documento = await this.db['indice'].findOne({ selector: { id } }).exec();
        if (documento) {
            await documento.patch({
                ...camposAActualizar,
                updatedAt: Date.now()
            });
        }
    }

    //Crud contenidoIndice
    async crearContenidoIndice(
        id: string,
        indiceId: string,
        contenido: string,
        indice: string,
        nombre: string
    ) {
        const ahora = Date.now();
        await this.db['contenidoIndice'].insert({
            id: id,
            indiceId: indiceId,
            contenido: contenido,
            indice: indice,
            nombre: nombre,
            updatedAt: ahora,
            _deleted: false
        });
    }

    // --- EDITAR contenidoIndice (Soporte para tu editor de tablas) ---
    async editarContenidoIndice(id: string, camposAActualizar: Partial<ContenidoIndice>) {
        const documento = await this.db['contenidoIndice'].findOne({ selector: { id } }).exec();
        if (documento) {
            await documento.patch({
                ...camposAActualizar,
                updatedAt: Date.now()
            });
        }
    }

    /***********************
     *   Sincronizaciones 
     * **********************/
    // --- SINCRONIZACIÓN DE UNIVERSOS ---
    private sincronizarUniversos(coleccion: RxCollection<Universo>): RxReplicationState<Universo, any> {
        const replica = replicateRxCollection<Universo, any>({
            collection: coleccion,
            replicationIdentifier: 'sync-universo-' + this.version,
            live: false,
            autoStart: false,
            retryTime: 4000,
            push: {
                handler: async (rows) => {
                    for (const row of rows) {
                        await this.supabase.from('universo').upsert({
                            id: row.newDocumentState.id,
                            nombre: row.newDocumentState.nombre,
                            detalles: row.newDocumentState.detalles,
                            imagen: row.newDocumentState.imagen,
                            updated_at: row.newDocumentState.updatedAt,
                            is_deleted: row.newDocumentState._deleted
                        });
                    }
                    return [];
                }
            },
            pull: {
                handler: async (lastCheckpoint, batchSize) => {
                    const checkpoint = lastCheckpoint as { id: string; updatedAt: number } | null;
                    const lastTime = checkpoint ? checkpoint.updatedAt : 0;

                    const { data } = await this.supabase.from('universo')
                        .select('*')
                        .gt('updated_at', lastTime)
                        .order('updated_at', { ascending: true })
                        .limit(batchSize);

                    const docs: Universo[] = (data || []).map(r => ({
                        id: r.id,
                        nombre: r.nombre,
                        detalles: r.detalles,
                        imagen: r.imagen,
                        updatedAt: Number(r.updated_at),
                        _deleted: r.is_deleted
                    }));

                    return {
                        documents: docs,
                        checkpoint: docs.length > 0 ? { id: docs[docs.length - 1].id, updatedAt: docs[docs.length - 1].updatedAt } : checkpoint
                    };
                }
            }
        });

        replica.error$.subscribe(err => {
            console.error('❌ Error crítico en replicación de Universos:', err);
        });

        this.replicas.universo = replica;
        return replica;
    }

    // --- SINCRONIZACIÓN DE MUNDOS ---
    private sincronizarMundos(coleccion: RxCollection<Mundo>): RxReplicationState<Mundo, any> {
        const replica = replicateRxCollection<Mundo, any>({
            collection: coleccion,
            replicationIdentifier: 'sync-mundo-' + this.version,
            live: false,
            autoStart: false,
            retryTime: 4000,
            push: {
                handler: async (rows) => {
                    for (const row of rows) {
                        await this.supabase.from('mundo').upsert({
                            id: row.newDocumentState.id,
                            universo_id: row.newDocumentState.universoId, // 👈 CORREGIDO: cambiado a universo_id para la nube
                            nombre: row.newDocumentState.nombre,
                            detalles: row.newDocumentState.detalles,
                            imagen: row.newDocumentState.imagen,
                            diferente: row.newDocumentState.diferente,
                            funciona: row.newDocumentState.funciona,
                            reglas: row.newDocumentState.reglas,
                            geografia: row.newDocumentState.geografia,
                            historia: row.newDocumentState.historia,
                            event_especiales: row.newDocumentState.eventEspeciales,
                            updated_at: row.newDocumentState.updatedAt,
                            is_deleted: row.newDocumentState._deleted
                        });
                    }
                    return [];
                }
            },
            pull: {
                handler: async (lastCheckpoint, batchSize) => {
                    const checkpoint = lastCheckpoint as { id: string; updatedAt: number } | null;
                    const lastTime = checkpoint ? checkpoint.updatedAt : 0;

                    const { data } = await this.supabase.from('mundo')
                        .select('*')
                        .gt('updated_at', lastTime)
                        .order('updated_at', { ascending: true })
                        .limit(batchSize);

                    // 👈 CORREGIDO: Completado el mapeo que estaba cortado de forma segura
                    const docs: Mundo[] = (data || []).map(r => ({
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
                        _deleted: r.is_deleted
                    }));

                    return {
                        documents: docs,
                        checkpoint: docs.length > 0 ? { id: docs[docs.length - 1].id, updatedAt: docs[docs.length - 1].updatedAt } : checkpoint
                    };
                }
            }
        });

        replica.error$.subscribe(err => {
            console.error('❌ Error crítico en replicación de Mundos:', err);
        });

        this.replicas.mundo = replica;
        return replica;
    }

    private sincronizarCultura(coleccion: RxCollection<Cultura>): RxReplicationState<Cultura, any> {
        const replica = replicateRxCollection<Cultura, any>({
            collection: coleccion,
            replicationIdentifier: 'sync-cultura-' + this.version,
            live: false,
            autoStart: false,
            retryTime: 4000,
            push: {
                handler: async (rows) => {
                    for (const row of rows) {
                        await this.supabase.from('cultura').upsert({
                            id: row.newDocumentState.id,
                            mundo_id: row.newDocumentState.mundoId, // 👈 CORREGIDO: cambiado a mundo_id para la nube
                            nombre: row.newDocumentState.nombre,
                            detalles: row.newDocumentState.detalles,
                            imagen: row.newDocumentState.imagen,

                            costumbres: row.newDocumentState.costumbres,
                            religiones: row.newDocumentState.religiones,
                            idioma: row.newDocumentState.idioma,
                            vestimenta: row.newDocumentState.vestimenta,
                            comida: row.newDocumentState.comida,
                            valores: row.newDocumentState.valores,
                            castas: row.newDocumentState.castas,
                            armas: row.newDocumentState.armas,
                            dias_festivos: row.newDocumentState.diasFestivos,
                            historia: row.newDocumentState.historia,
                            sistema_politico: row.newDocumentState.sistemaPolitico, // 👈 Mapeado a snake_case para Supabase
                            como_obtiene_poder: row.newDocumentState.comoObtienePoder, // 👈 Mapeado a snake_case para Supabase
                            dinero: row.newDocumentState.dinero,
                            recursos: row.newDocumentState.recursos,
                            viajan: row.newDocumentState.viajan,

                            updated_at: row.newDocumentState.updatedAt,
                            is_deleted: row.newDocumentState._deleted
                        });
                    }
                    return [];
                }
            },
            pull: {
                handler: async (lastCheckpoint, batchSize) => {
                    const checkpoint = lastCheckpoint as { id: string; updatedAt: number } | null;
                    const lastTime = checkpoint ? checkpoint.updatedAt : 0;

                    const { data } = await this.supabase.from('cultura')
                        .select('*')
                        .gt('updated_at', lastTime)
                        .order('updated_at', { ascending: true })
                        .limit(batchSize);

                    // 👈 CORREGIDO: Completado el mapeo que estaba cortado de forma segura
                    const docs: Cultura[] = (data || []).map(r => ({
                        id: r.id,
                        mundoId: r.mundo_id, // 👈 Ajustado según tu mapeo anterior (universo_id en la nube)
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
                        _deleted: r.is_deleted,
                    }));

                    return {
                        documents: docs,
                        checkpoint: docs.length > 0 ? { id: docs[docs.length - 1].id, updatedAt: docs[docs.length - 1].updatedAt } : checkpoint
                    };
                }
            }
        });

        replica.error$.subscribe(err => {
            console.error('❌ Error crítico en replicación de Culturas:', err);
        });

        this.replicas.cultura = replica;
        return replica;
    }

    private sincronizarPersonaje(coleccion: RxCollection<Personaje>): RxReplicationState<Personaje, any> {
        const replica = replicateRxCollection<Personaje, any>({
            collection: coleccion,
            replicationIdentifier: 'sync-personaje-' + this.version,
            live: false,
            autoStart: false,
            retryTime: 4000,
            push: {
                handler: async (rows) => {
                    for (const row of rows) {
                        await this.supabase.from('personaje').upsert({
                            id: row.newDocumentState.id,
                            cultura_id: row.newDocumentState.culturaId, // 👈 CORREGIDO: cambiado a mundo_id para la nube
                            nombre: row.newDocumentState.nombre,
                            detalles: row.newDocumentState.detalles,
                            imagen: row.newDocumentState.imagen,

                            personales: row.newDocumentState.personales,
                            enfermedad: row.newDocumentState.enfermedad,
                            traumas: row.newDocumentState.traumas,
                            pasado: row.newDocumentState.pasado,
                            presente: row.newDocumentState.presente,
                            futuro: row.newDocumentState.futuro,
                            personalidad: row.newDocumentState.personalidad,
                            seductor: row.newDocumentState.seductor,
                            hobbie: row.newDocumentState.hobbie,
                            amor: row.newDocumentState.amor,
                            odio: row.newDocumentState.odio,
                            ignora: row.newDocumentState.ignora,
                            familia: row.newDocumentState.familia,
                            amigos: row.newDocumentState.amigos,
                            parejas: row.newDocumentState.parejas,

                            updated_at: row.newDocumentState.updatedAt,
                            is_deleted: row.newDocumentState._deleted
                        });
                    }
                    return [];
                }
            },
            pull: {
                handler: async (lastCheckpoint, batchSize) => {
                    const checkpoint = lastCheckpoint as { id: string; updatedAt: number } | null;
                    const lastTime = checkpoint ? checkpoint.updatedAt : 0;

                    const { data } = await this.supabase.from('personaje')
                        .select('*')
                        .gt('updated_at', lastTime)
                        .order('updated_at', { ascending: true })
                        .limit(batchSize);

                    // 👈 CORREGIDO: Completado el mapeo que estaba cortado de forma segura
                    const docs: Personaje[] = (data || []).map(r => ({
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
                        _deleted: r.is_deleted,
                    }));

                    return {
                        documents: docs,
                        checkpoint: docs.length > 0 ? { id: docs[docs.length - 1].id, updatedAt: docs[docs.length - 1].updatedAt } : checkpoint
                    };
                }
            }
        });

        replica.error$.subscribe(err => {
            console.error('❌ Error crítico en replicación de Personajes:', err);
        });

        this.replicas.personaje = replica;
        return replica;
    }

    //Sincronizacion de creatura
    private sincronizarCreatura(coleccion: RxCollection<Creatura>): RxReplicationState<Creatura, any> {
        const replica = replicateRxCollection<Creatura, any>({
            collection: coleccion,
            replicationIdentifier: 'sync-creatura-' + this.version,
            live: false,
            autoStart: false,
            retryTime: 4000,
            push: {
                handler: async (rows) => {
                    for (const row of rows) {
                        await this.supabase.from('creatura').upsert({
                            id: row.newDocumentState.id,
                            mundo_id: row.newDocumentState.mundoId,
                            nombre: row.newDocumentState.nombre,
                            detalles: row.newDocumentState.detalles,
                            imagen: row.newDocumentState.imagen,

                            rol: row.newDocumentState.rol,
                            habitat: row.newDocumentState.habitat,
                            forma: row.newDocumentState.forma,
                            habilidades: row.newDocumentState.habilidades,
                            comunica: row.newDocumentState.comunica,
                            reproduce: row.newDocumentState.reproduce,
                            come: row.newDocumentState.come,
                            importante_para: row.newDocumentState.importantePara,
                            familia: row.newDocumentState.familia,
                            comportamiento: row.newDocumentState.comportamiento,
                            ciclo_vida: row.newDocumentState.cicloVida,
                            inteligencia: row.newDocumentState.inteligencia,
                            ecosistema: row.newDocumentState.ecosistema,
                            curiocidad: row.newDocumentState.curiocidad,
                            sociedad: row.newDocumentState.sociedad,

                            updated_at: row.newDocumentState.updatedAt,
                            is_deleted: row.newDocumentState._deleted
                        });
                    }
                    return [];
                }
            },
            pull: {
                handler: async (lastCheckpoint, batchSize) => {
                    const checkpoint = lastCheckpoint as { id: string; updatedAt: number } | null;
                    const lastTime = checkpoint ? checkpoint.updatedAt : 0;

                    const { data } = await this.supabase.from('creatura')
                        .select('*')
                        .gt('updated_at', lastTime)
                        .order('updated_at', { ascending: true })
                        .limit(batchSize);

                    // 👈 CORREGIDO: Completado el mapeo que estaba cortado de forma segura
                    const docs: Creatura[] = (data || []).map(r => ({
                        id: r.id,
                        mundoId: r.mundo_id, // 👈 Ajustado según tu mapeo anterior (universo_id en la nube)
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
                        _deleted: r.is_deleted,
                    }));

                    return {
                        documents: docs,
                        checkpoint: docs.length > 0 ? { id: docs[docs.length - 1].id, updatedAt: docs[docs.length - 1].updatedAt } : checkpoint
                    };
                }
            }
        });

        replica.error$.subscribe(err => {
            console.error('❌ Error crítico en replicación de Creaturas:', err);
        });

        this.replicas.creatura = replica;
        return replica;
    }

    //Sincronizacion de saga
    private sincronizarSaga(coleccion: RxCollection<Saga>): RxReplicationState<Saga, any> {
        const replica = replicateRxCollection<Saga, any>({
            collection: coleccion,
            replicationIdentifier: 'sync-saga-' + this.version,
            live: false,
            autoStart: false,
            retryTime: 4000,
            push: {
                handler: async (rows) => {
                    for (const row of rows) {
                        await this.supabase.from('saga').upsert({
                            id: row.newDocumentState.id,
                            universo_id: row.newDocumentState.universoId,
                            nombre: row.newDocumentState.nombre,
                            detalles: row.newDocumentState.detalles,
                            imagen: row.newDocumentState.imagen,

                            updated_at: row.newDocumentState.updatedAt,
                            is_deleted: row.newDocumentState._deleted
                        });
                    }
                    return [];
                }
            },
            pull: {
                handler: async (lastCheckpoint, batchSize) => {
                    const checkpoint = lastCheckpoint as { id: string; updatedAt: number } | null;
                    const lastTime = checkpoint ? checkpoint.updatedAt : 0;

                    const { data } = await this.supabase.from('saga')
                        .select('*')
                        .gt('updated_at', lastTime)
                        .order('updated_at', { ascending: true })
                        .limit(batchSize);

                    // 👈 CORREGIDO: Completado el mapeo que estaba cortado de forma segura
                    const docs: Saga[] = (data || []).map(r => ({
                        id: r.id,
                        universoId: r.universo_id, // 👈 Ajustado según tu mapeo anterior (universo_id en la nube)
                        nombre: r.nombre,
                        detalles: r.detalles,
                        imagen: r.imagen,

                        updatedAt: Number(r.updated_at),
                        _deleted: r.is_deleted,
                    }));

                    return {
                        documents: docs,
                        checkpoint: docs.length > 0 ? { id: docs[docs.length - 1].id, updatedAt: docs[docs.length - 1].updatedAt } : checkpoint
                    };
                }
            }
        });

        replica.error$.subscribe(err => {
            console.error('❌ Error crítico en replicación de Sagas:', err);
        });

        this.replicas.saga = replica;
        return replica;
    }

    //Sincronizacion de tomo
    private sincronizarTomo(coleccion: RxCollection<Tomo>): RxReplicationState<Tomo, any> {
        const replica = replicateRxCollection<Tomo, any>({
            collection: coleccion,
            replicationIdentifier: 'sync-tomo-' + this.version,
            live: false,
            autoStart: false,
            retryTime: 4000,
            push: {
                handler: async (rows) => {
                    for (const row of rows) {
                        await this.supabase.from('tomo').upsert({
                            id: row.newDocumentState.id,
                            saga_id: row.newDocumentState.sagaId,
                            nombre: row.newDocumentState.nombre,
                            detalles: row.newDocumentState.detalles,
                            imagen: row.newDocumentState.imagen,

                            updated_at: row.newDocumentState.updatedAt,
                            is_deleted: row.newDocumentState._deleted
                        });
                    }
                    return [];
                }
            },
            pull: {
                handler: async (lastCheckpoint, batchSize) => {
                    const checkpoint = lastCheckpoint as { id: string; updatedAt: number } | null;
                    const lastTime = checkpoint ? checkpoint.updatedAt : 0;

                    const { data } = await this.supabase.from('tomo')
                        .select('*')
                        .gt('updated_at', lastTime)
                        .order('updated_at', { ascending: true })
                        .limit(batchSize);

                    // 👈 CORREGIDO: Completado el mapeo que estaba cortado de forma segura
                    const docs: Tomo[] = (data || []).map(r => ({
                        id: r.id,
                        sagaId: r.saga_id,
                        nombre: r.nombre,
                        detalles: r.detalles,
                        imagen: r.imagen,

                        updatedAt: Number(r.updated_at),
                        _deleted: r.is_deleted,
                    }));

                    return {
                        documents: docs,
                        checkpoint: docs.length > 0 ? { id: docs[docs.length - 1].id, updatedAt: docs[docs.length - 1].updatedAt } : checkpoint
                    };
                }
            }
        });

        replica.error$.subscribe(err => {
            console.error('❌ Error crítico en replicación de Tomos:', err);
        });

        this.replicas.tomo = replica;
        return replica;
    }

    //Sincronizacion de indice
    private sincronizarIndice(coleccion: RxCollection<Indice>): RxReplicationState<Indice, any> {
        const replica = replicateRxCollection<Indice, any>({
            collection: coleccion,
            replicationIdentifier: 'sync-indice-' + this.version,
            live: false,
            autoStart: false,
            retryTime: 4000,
            push: {
                handler: async (rows) => {
                    for (const row of rows) {
                        await this.supabase.from('indice').upsert({
                            id: row.newDocumentState.id,
                            tomo_id: row.newDocumentState.tomoId,
                            nombre: row.newDocumentState.nombre,
                            detalles: row.newDocumentState.detalles,
                            imagen: row.newDocumentState.imagen,

                            updated_at: row.newDocumentState.updatedAt,
                            is_deleted: row.newDocumentState._deleted
                        });
                    }
                    return [];
                }
            },
            pull: {
                handler: async (lastCheckpoint, batchSize) => {
                    const checkpoint = lastCheckpoint as { id: string; updatedAt: number } | null;
                    const lastTime = checkpoint ? checkpoint.updatedAt : 0;

                    const { data } = await this.supabase.from('indice')
                        .select('*')
                        .gt('updated_at', lastTime)
                        .order('updated_at', { ascending: true })
                        .limit(batchSize);

                    // 👈 CORREGIDO: Completado el mapeo que estaba cortado de forma segura
                    const docs: Indice[] = (data || []).map(r => ({
                        id: r.id,
                        tomoId: r.tomo_id,
                        nombre: r.nombre,
                        detalles: r.detalles,
                        imagen: r.imagen,

                        updatedAt: Number(r.updated_at),
                        _deleted: r.is_deleted,
                    }));

                    return {
                        documents: docs,
                        checkpoint: docs.length > 0 ? { id: docs[docs.length - 1].id, updatedAt: docs[docs.length - 1].updatedAt } : checkpoint
                    };
                }
            }
        });

        replica.error$.subscribe(err => {
            console.error('❌ Error crítico en replicación de Índices:', err);
        });

        this.replicas.indice = replica;
        return replica;
    }

    async eliminarTodoIndice() {
        try {
            // 1. Obtenemos todos los documentos actuales guardados en la colección de índices
            const documentos = await this.db['indice'].find().exec();

            if (documentos.length === 0) {
                console.log('No hay registros de índice físicos para eliminar.');
                return;
            }

            // 2. Extraemos únicamente los IDs de todos los documentos encontrados
            const idsParaBorrar = documentos.map(doc => doc.primary);

            // 3. Ejecutamos la eliminación física en bloque del disco duro del celular
            await this.db['indice'].bulkRemove(idsParaBorrar);

            // 4. Notificamos al canal reactivo enviando un arreglo vacío para limpiar la interfaz de inmediato
            this.indice$.next([]);

            console.log(`📦 Éxito: Se eliminaron físicamente ${idsParaBorrar.length} registros de la memoria del celular.`);
        } catch (error) {
            console.error('❌ Error al intentar borrar la colección de índices física:', error);
        }
    }

    //Sincronizacion de contenido indice
    private sincronizarContenidoIndice(coleccion: RxCollection<ContenidoIndice>): RxReplicationState<ContenidoIndice, any> {
        const replica = replicateRxCollection<ContenidoIndice, any>({
            collection: coleccion,
            replicationIdentifier: 'sync-contenido-indice-' + this.version,
            live: false,
            autoStart: false,
            retryTime: 4000,
            push: {
                handler: async (rows) => {
                    for (const row of rows) {
                        await this.supabase.from('contenido_indice').upsert({
                            id: row.newDocumentState.id,
                            indice_id: row.newDocumentState.indiceId,
                            contenido: row.newDocumentState.contenido,
                            indice: row.newDocumentState.indice,
                            nombre: row.newDocumentState.nombre,

                            updated_at: row.newDocumentState.updatedAt,
                            is_deleted: row.newDocumentState._deleted
                        });
                    }
                    return [];
                }
            },
            pull: {
                handler: async (lastCheckpoint, batchSize) => {
                    const checkpoint = lastCheckpoint as { id: string; updatedAt: number } | null;
                    const lastTime = checkpoint ? checkpoint.updatedAt : 0;

                    const { data } = await this.supabase.from('contenido_indice')
                        .select('*')
                        .gt('updated_at', lastTime)
                        .order('updated_at', { ascending: true })
                        .limit(batchSize);

                    // 👈 CORREGIDO: Completado el mapeo que estaba cortado de forma segura
                    const docs: ContenidoIndice[] = (data || []).map(r => ({
                        id: r.id,
                        indiceId: r.indice_id,
                        contenido: r.contenido,
                        indice: r.indice,
                        nombre: r.nombre,

                        updatedAt: Number(r.updated_at),
                        _deleted: r.is_deleted,
                    } as ContenidoIndice));

                    return {
                        documents: docs,
                        checkpoint: docs.length > 0 ? { id: docs[docs.length - 1].id, updatedAt: docs[docs.length - 1].updatedAt } : checkpoint
                    };
                }
            }
        });

        replica.error$.subscribe(err => {
            console.error('❌ Error crítico en replicación de Contenido de Índices:', err);
        });

        this.replicas.contenidoIndice = replica;
        return replica;
    }

    async eliminarTodoContenidoIndice() {
        try {
            // 1. Obtenemos todos los documentos actuales guardados en la colección de índices
            const documentos = await this.db['contenido_indice'].find().exec();

            if (documentos.length === 0) {
                console.log('No hay registros de índice físicos para eliminar.');
                return;
            }

            // 2. Extraemos únicamente los IDs de todos los documentos encontrados
            const idsParaBorrar = documentos.map(doc => doc.primary);

            // 3. Ejecutamos la eliminación física en bloque del disco duro del celular
            await this.db['indice'].bulkRemove(idsParaBorrar);

            // 4. Notificamos al canal reactivo enviando un arreglo vacío para limpiar la interfaz de inmediato
            this.indice$.next([]);

            console.log(`📦 Éxito: Se eliminaron físicamente ${idsParaBorrar.length} registros de la memoria del celular.`);
        } catch (error) {
            console.error('❌ Error al intentar borrar la colección de índices física:', error);
        }
    }

    // eliminar elementos de la base de datos
    //Eliminar universo por id
    async eliminarUniversoPorId(id: string) {
        try {
            // Eliminar el universo de la colección
            await this.db['universo'].findOne(id)?.remove();
            console.log(`Universo con ID ${id} eliminado correctamente.`);
        } catch (error) {
            console.error(`Error al eliminar el universo con ID ${id}:`, error);
        }
    }

    //Eliminar mundo por id
    async eliminarMundoPorId(id: string) {
        try {
            // Eliminar el mundo de la colección
            await this.db['mundo'].findOne(id)?.remove();
            console.log(`Mundo con ID ${id} eliminado correctamente.`);
        } catch (error) {
            console.error(`Error al eliminar el mundo con ID ${id}:`, error);
        }
    }

    //Eliminar cultura por id
    async eliminarCulturaPorId(id: string) {
        try {
            // Eliminar la cultura de la colección
            await this.db['cultura'].findOne(id)?.remove();
            console.log(`Cultura con ID ${id} eliminada correctamente.`);
        } catch (error) {
            console.error(`Error al eliminar la cultura con ID ${id}:`, error);
        }
    }

    //Eliminar personaje por id
    async eliminarPersonajePorId(id: string) {
        try {
            // Eliminar el personaje de la colección
            await this.db['personaje'].findOne(id)?.remove();
            console.log(`Personaje con ID ${id} eliminado correctamente.`);
        } catch (error) {
            console.error(`Error al eliminar el personaje con ID ${id}:`, error);
        }
    }

    //Eliminar creatura por id
    async eliminarCreaturaPorId(id: string) {
        try {
            // Eliminar la creatura de la colección
            await this.db['creatura'].findOne(id)?.remove();
            console.log(`Creatura con ID ${id} eliminada correctamente.`);
        } catch (error) {
            console.error(`Error al eliminar la creatura con ID ${id}:`, error);
        }
    }

    //Eliminar saga por id
    async eliminarSagaPorId(id: string) {
        try {
            // Eliminar la saga de la colección
            await this.db['saga'].findOne(id)?.remove();
            console.log(`Saga con ID ${id} eliminada correctamente.`);
        } catch (error) {
            console.error(`Error al eliminar la saga con ID ${id}:`, error);
        }
    }

    //Eliminar tomo por id
    async eliminarTomoPorId(id: string) {
        try {
            // Eliminar el tomo de la colección
            await this.db['tomo'].findOne(id)?.remove();
            console.log(`Tomo con ID ${id} eliminado correctamente.`);
        } catch (error) {
            console.error(`Error al eliminar el tomo con ID ${id}:`, error);
        }
    }

    //Eliminar indice por id
    async eliminarIndicePorId(id: string) {
        try {
            // Eliminar el índice de la colección
            await this.db['indice'].findOne(id)?.remove();
            console.log(`Índice con ID ${id} eliminado correctamente.`);
        } catch (error) {
            console.error(`Error al eliminar el índice con ID ${id}:`, error);
        }
    }

    //Eliminar contenido indice por id
    async eliminarContenidoIndicePorId(id: string) {
        try {
            // Eliminar el contenido del índice de la colección
            await this.db['contenido_indice'].findOne(id)?.remove();
            console.log(`Contenido de índice con ID ${id} eliminado correctamente.`);
        } catch (error) {
            console.error(`Error al eliminar el contenido de índice con ID ${id}:`, error);
        }
    }
}


