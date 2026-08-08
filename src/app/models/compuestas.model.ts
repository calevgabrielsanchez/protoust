import { ContenidoIndice } from "./contenidoIndice.model";
import { Creatura } from "./creatura.model";
import { Cultura } from "./cultura.model";
import { Indice } from "./indice.model";
import { Mundo } from "./mundo.model";
import { Personaje } from "./personaje.model";
import { Saga } from "./saga.model";
import { Tomo } from "./tomo.model";
import { Universo } from "./universo.model";

export interface MundoConUniverso extends Mundo {
  universo: Universo;
}

export interface CulturaConMundo extends Cultura {
  mundo: Mundo;
}

export interface PersonajeConMundo extends Personaje {
  mundo: Mundo;
}

export interface CreaturaConMundo extends Creatura {
  mundo: Mundo;
}

export interface CulturaConMundo extends Cultura {
  mundo: Mundo;
}

export interface SagaConUniverso extends Saga {
  universo: Universo;
}

export interface TomoConSaga extends Tomo {
  saga: Saga;
}

export interface IndiceConTomo extends Indice {
  tomo: Tomo;
}
