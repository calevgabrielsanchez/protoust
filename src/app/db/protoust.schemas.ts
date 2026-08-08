import { RxJsonSchema } from 'rxdb';
import { Universo } from '../models/universo.model';
import { Mundo } from '../models/mundo.model';
import { Cultura } from '../models/cultura.model';
import { Personaje } from '../models/personaje.model';
import { Creatura } from '../models/creatura.model';
import { Saga } from '../models/saga.model';
import { Tomo } from '../models/tomo.model';
import { Indice } from '../models/indice.model';
import { ContenidoIndice } from '../models/contenidoIndice.model';

// --- ESQUEMAS JSON PARA RXDB ---
export const UNIVERSO_SCHEMA: RxJsonSchema<Universo> = {
    title: 'universo schema',
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: { type: 'string', maxLength: 50 },
        nombre: { type: 'string' },
        detalles: { type: 'string' },
        imagen: { type: 'string' },

        updatedAt: { type: 'integer' },
        _deleted: { type: 'boolean' }
    },
    required: ['id', 'nombre', 'updatedAt']
};

export const MUNDO_SCHEMA: RxJsonSchema<Mundo> = {
    title: 'mundo schema',
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: { type: 'string', maxLength: 100 },
        universoId: { type: 'string', maxLength: 100 },
        nombre: { type: 'string' },
        detalles: { type: 'string' },
        imagen: { type: 'string' },

        diferente: { type: 'string' },
        funciona: { type: 'string' },
        reglas: { type: 'string' },
        geografia: { type: 'string' },
        historia: { type: 'string' },
        eventEspeciales: { type: 'string' },

        updatedAt: { type: 'integer' },
        _deleted: { type: 'boolean' }
    },
    required: ['id', 'universoId', 'nombre', 'updatedAt']
};

export const CULTURA_SCHEMA: RxJsonSchema<Cultura> = {
    title: 'cultura schema',
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: { type: 'string', maxLength: 100 },
        mundoId: { type: 'string', maxLength: 100 },
        nombre: { type: 'string' },
        detalles: { type: 'string' },
        imagen: { type: 'string' },

        costumbres: { type: 'string' },
        religiones: { type: 'string' },
        idioma: { type: 'string' },
        vestimenta: { type: 'string' },
        comida: { type: 'string' },
        valores: { type: 'string' },
        castas: { type: 'string' },
        armas: { type: 'string' },
        diasFestivos: { type: 'string' },
        historia: { type: 'string' },
        sistemaPolitico: { type: 'string' },
        comoObtienePoder: { type: 'string' },
        dinero: { type: 'string' },
        recursos: { type: 'string' },
        viajan: { type: 'string' },

        updatedAt: { type: 'integer' },
        _deleted: { type: 'boolean' }
    },
    required: ['id', 'mundoId', 'nombre', 'updatedAt']
}

export const PERSONAJE_SCHEMA: RxJsonSchema<Personaje> = {
    title: 'personaje schema',
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: { type: 'string', maxLength: 100 },
        culturaId: { type: 'string', maxLength: 100 },
        nombre: { type: 'string' },
        detalles: { type: 'string' },
        imagen: { type: 'string' },

        personales: { type: 'string' },
        enfermedad: { type: 'string' },
        traumas: { type: 'string' },
        pasado: { type: 'string' },
        presente: { type: 'string' },
        futuro: { type: 'string' },
        personalidad: { type: 'string' },
        seductor: { type: 'string' },
        hobbie: { type: 'string' },
        amor: { type: 'string' },
        odio: { type: 'string' },
        ignora: { type: 'string' },
        familia: { type: 'string' },
        amigos: { type: 'string' },
        parejas: { type: 'string' },

        updatedAt: { type: 'integer' },
        _deleted: { type: 'boolean' }
    },
    required: ['id', 'culturaId', 'nombre', 'updatedAt']
}

export const CREATURA_SCHEMA: RxJsonSchema<Creatura> = {
    title: 'creatura schema',
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: { type: 'string', maxLength: 100 },
        mundoId: { type: 'string', maxLength: 100 },
        nombre: { type: 'string' },
        detalles: { type: 'string' },
        imagen: { type: 'string' },

        rol: { type: 'string' },
        habitat: { type: 'string' },
        forma: { type: 'string' },
        habilidades: { type: 'string' },
        comunica: { type: 'string' },
        reproduce: { type: 'string' },
        come: { type: 'string' },
        importantePara: { type: 'string' },
        familia: { type: 'string' },
        comportamiento: { type: 'string' },
        cicloVida: { type: 'string' },
        inteligencia: { type: 'string' },
        ecosistema: { type: 'string' },
        curiocidad: { type: 'string' },
        sociedad: { type: 'string' },

        updatedAt: { type: 'integer' },
        _deleted: { type: 'boolean' }
    },
    required: ['id', 'mundoId', 'nombre', 'updatedAt']
}

export const SAGA_SCHEMA: RxJsonSchema<Saga> = {
    title: 'saga schema',
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: { type: 'string', maxLength: 50 }, // Ajustado a string para compatibilidad relacional en RxDB
        nombre: { type: 'string' },
        detalles: { type: 'string' },
        imagen: { type: 'string' },

        universoId: { type: 'string' }, // Llave foránea hacia el Universo

        updatedAt: { type: 'integer' },
        _deleted: { type: 'boolean' }
    },
    required: ['id', 'nombre', 'universoId', 'updatedAt']
};

export const TOMO_SCHEMA: RxJsonSchema<Tomo> = {
    title: 'tomo schema',
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: { type: 'string', maxLength: 50 }, // Ajustado a string para compatibilidad relacional en RxDB
        nombre: { type: 'string' },
        detalles: { type: 'string' },
        imagen: { type: 'string' },

        sagaId: { type: 'string' }, // Llave foránea hacia saga

        updatedAt: { type: 'integer' },
        _deleted: { type: 'boolean' }
    },
    required: ['id', 'nombre', 'sagaId', 'updatedAt']
};

export const INDICE_SCHEMA: RxJsonSchema<Indice> = {
    title: 'indice schema',
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: { type: 'string', maxLength: 50 },
        nombre: { type: 'string' },
        detalles: { type: 'string' },
        imagen: { type: 'string' },

        tomoId: { type: 'string' }, 

        updatedAt: { type: 'integer' },
        _deleted: { type: 'boolean' }
    },
    required: ['id', 'nombre', 'tomoId', 'updatedAt']
};

export const CONTENIDO_INDICE_SCHEMA: RxJsonSchema<ContenidoIndice> = {
    title: 'contenido indice schema',
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: { type: 'string', maxLength: 50 },
        contenido: { type: 'string' },
        indice: { type: 'string' },
        nombre: { type: 'string' },

        indiceId: { type: 'string' }, 

        updatedAt: { type: 'integer' },
        _deleted: { type: 'boolean' }
    },
    required: ['id' ,'indiceId', 'updatedAt']
};