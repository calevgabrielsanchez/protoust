import { Component, inject, signal, WritableSignal } from '@angular/core';
import { Universo } from '../../models/universo.model';

import { RxdbService } from '../../services/rxdb.service';
import { LocalCsvService } from '../../services/local-csv.service';
import { CommonModule } from '@angular/common';
import { Mundo } from '../../models/mundo.model';

import { FormsModule } from '@angular/forms';

import { Cultura } from '../../models/cultura.model';
import { Personaje } from '../../models/personaje.model';
import { Creatura } from '../../models/creatura.model';
import { Saga } from '../../models/saga.model';
import { Tomo } from '../../models/tomo.model';
import { Indice } from '../../models/indice.model';

import { TextPlusComponent } from '../text-plus.component/text-plus.component';
import { ClickTextarea } from '../../directives/click-textarea';
import { ContenidoIndice } from '../../models/contenidoIndice.model';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faSave, faFileHalfDashed, faGlobe, faBook, faEarthAmericas, faScroll, faImage,
  faCircleInfo, faSquarePlus, faBaby, faDragon, faMeteor, faSkullCrossbones, faTrashCan, faPenFancy,
  faDownload, faUpload, faRefresh, faLevelDown
} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-main.component',
  imports: [CommonModule, FormsModule, TextPlusComponent, ClickTextarea, FaIconComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {
  /*****************************************
   * Variables Iconos del front
   * ***************************************
   */
  faSave = faSave;
  faFileHalfDashed = faFileHalfDashed;
  faGlobe = faGlobe;
  faBook = faBook;
  faEarthAmericas = faEarthAmericas;
  faScroll = faScroll;
  faImage = faImage;
  faCircleInfo = faCircleInfo;
  faSquarePlus = faSquarePlus;
  faBaby = faBaby;
  faDragon = faDragon;
  faMeteor = faMeteor;
  faSkullCrossbones = faSkullCrossbones;
  faTrashCan = faTrashCan;
  faPenFancy = faPenFancy;
  faDownload = faDownload;
  faUpload = faUpload;
  faRefresh = faRefresh;
  faLevelDown = faLevelDown;
  /*****************************************
   * Variables Internas
   * ***************************************
   */
  mundo: boolean = true;

  public dbService = inject(RxdbService);
  public csvService = inject(LocalCsvService);

  mostrarTextPlus: boolean = false;
  textoAEditar: string = "";
  private textPlusPromiseResolver: ((texto: string) => void) | null = null;
  textareaSeleccionada: WritableSignal<HTMLTextAreaElement | null> = signal<HTMLTextAreaElement | null>(null);

  todosUniverso = signal<Universo[]>([]);
  vacioUniverso: Universo = {
    id: '',
    nombre: '',
    detalles: '',
    imagen: '',
    updatedAt: 0,
    _deleted: false
  };
  selectUniverso = this.vacioUniverso;

  //Variables mundo
  todosMundo = signal<Mundo[]>([]);
  mundosFiltrados!: Mundo[];
  vacioMundo: Mundo = {
    id: '',
    universoId: '',
    nombre: '',
    diferente: '',
    detalles: '',
    imagen: '',
    funciona: '',
    reglas: '',
    geografia: '',
    historia: '',
    eventEspeciales: '',
    updatedAt: 0,
    _deleted: false
  };
  selectMundo = this.vacioMundo;

  todosCultura = signal<Cultura[]>([]);
  culturasFiltrados!: Cultura[];
  vacioCultura: Cultura = {
    id: '',
    nombre: '',
    detalles: '',
    imagen: '',

    mundoId: '',

    costumbres: '',
    religiones: '',
    idioma: '',
    vestimenta: '',
    comida: '',
    valores: '',
    castas: '',
    armas: '',
    diasFestivos: '',
    historia: '',
    sistemaPolitico: '',
    comoObtienePoder: '',
    dinero: '',
    recursos: '',
    viajan: '',

    updatedAt: 0,
    _deleted: false
  }
  selectCultura = this.vacioCultura;

  todosPersonaje = signal<Personaje[]>([]);
  persoanjesFiltrados!: Personaje[];
  vacioPersonaje: Personaje = {
    id: '',
    nombre: '',
    detalles: '',
    imagen: '',

    culturaId: '',

    personales: '',
    enfermedad: '',
    traumas: '',
    pasado: '',
    presente: '',
    futuro: '',
    personalidad: '',
    seductor: '',
    hobbie: '',
    amor: '',
    odio: '',
    ignora: '',
    familia: '',
    amigos: '',
    parejas: '',

    updatedAt: 0,
    _deleted: false
  }
  selectPersonaje = this.vacioPersonaje;

  todosCreatura = signal<Creatura[]>([]);
  creaturasFiltrados!: Creatura[];
  vacioCreatura: Creatura = {
    id: '',
    nombre: '',
    detalles: '',
    imagen: '',
    mundoId: '',
    rol: '',
    habitat: '',
    forma: '',
    habilidades: '',
    comunica: '',
    reproduce: '',
    come: '',
    importantePara: '',
    familia: '',
    comportamiento: '',
    cicloVida: '',
    inteligencia: '',
    ecosistema: '',
    curiocidad: '',
    sociedad: '',
    updatedAt: 0,
    _deleted: false
  };
  selectCreatura = this.vacioCreatura;

  todosSaga = signal<Saga[]>([]);
  sagaFiltrados!: Saga[];
  vacioSaga: Saga = {
    id: '',
    universoId: '',
    nombre: '',
    detalles: '',
    imagen: '',

    updatedAt: 0,
    _deleted: false
  };
  selectSaga = this.vacioSaga;

  todosTomo = signal<Tomo[]>([]);
  tomoFiltrados!: Tomo[];
  vacioTomo: Tomo = {
    id: '',
    sagaId: '',
    nombre: '',
    detalles: '',
    imagen: '',

    updatedAt: 0,
    _deleted: false
  };
  selectTomo = this.vacioTomo;

  todosIndice = signal<Indice[]>([]);
  indiceFiltrados!: Indice[];
  vacioIndice: Indice = {
    id: '',
    tomoId: '',
    nombre: '',
    detalles: '',
    imagen: '',

    updatedAt: 0,
    _deleted: false
  };
  selectIndice = this.vacioIndice;

  todosContenidoIndice = signal<ContenidoIndice[]>([]);
  contenidoIndiceFiltrados!: ContenidoIndice[];
  vacioContenidoIndice: ContenidoIndice = {
    id: '',
    indiceId: '',
    contenido: '',
    indice: '',
    nombre: '',

    updatedAt: 0,
    _deleted: false
  };

  /*****************************************
   * Constructor y funciones de iniciacion
   * ***************************************
   */


  ngOnInit() {
    this.cargarTablasCSV();
  }

  async onSincronizarCSVToBD() {
    await this.onGuardarCambios();
    await this.dbService.importarTablasATrxDB(this.obtenerTablasCSV());
    const resultado = await this.dbService.sincronizarConSupabase();
    alert(resultado
      ? 'Datos guardados y sincronizados con la nube correctamente.'
      : 'No se pudieron sincronizar los datos con la nube.');
  }

  async onSincronizarBDToCSV() {
    const tablas = await this.dbService.sincronizarDesdeSupabase();
    if (!tablas) {
      return;
    }

    const locales = await this.csvService.loadAllTables<object>(['universo', 'mundo', 'cultura', 'personaje', 'creatura', 'saga', 'tomo', 'indice', 'contenidoIndice']);

    const universos = this.fusionar(locales['universo'] as Universo[] ?? [], tablas['universo'] as Universo[] ?? []);
    const mundos = this.fusionar(locales['mundo'] as Mundo[] ?? [], tablas['mundo'] as Mundo[] ?? []);
    const culturas = this.fusionar(locales['cultura'] as Cultura[] ?? [], tablas['cultura'] as Cultura[] ?? []);
    const personajes = this.fusionar(locales['personaje'] as Personaje[] ?? [], tablas['personaje'] as Personaje[] ?? []);
    const creaturas = this.fusionar(locales['creatura'] as Creatura[] ?? [], tablas['creatura'] as Creatura[] ?? []);
    const sagas = this.fusionar(locales['saga'] as Saga[] ?? [], tablas['saga'] as Saga[] ?? []);
    const tomos = this.fusionar(locales['tomo'] as Tomo[] ?? [], tablas['tomo'] as Tomo[] ?? []);
    const indices = this.fusionar(locales['indice'] as Indice[] ?? [], tablas['indice'] as Indice[] ?? []);
    const contenidos = this.fusionar(locales['contenidoIndice'] as ContenidoIndice[] ?? [], tablas['contenidoIndice'] as ContenidoIndice[] ?? []);

    await this.csvService.saveAllTables<object>({
      universo: universos,
      mundo: mundos,
      cultura: culturas,
      personaje: personajes,
      creatura: creaturas,
      saga: sagas,
      tomo: tomos,
      indice: indices,
      contenidoIndice: contenidos
    });

    this.todosUniverso.set(this.unicos(universos));
    this.todosMundo.set(this.unicos(mundos));
    this.todosCultura.set(this.unicos(culturas));
    this.todosPersonaje.set(this.unicos(personajes));
    this.todosCreatura.set(this.unicos(creaturas));
    this.todosSaga.set(this.unicos(sagas));
    this.todosTomo.set(this.unicos(tomos));
    this.todosIndice.set(this.unicos(indices));
    this.todosContenidoIndice.set(this.unicos(contenidos));

    alert('Datos descargados: solo se agregaron los registros de la nube que faltaban en tus archivos locales.');
  }

  async cargarTablasCSV() {
    const tablas = await this.csvService.loadAllTables<object>(['universo', 'mundo', 'cultura', 'personaje', 'creatura', 'saga', 'tomo', 'indice', 'contenidoIndice']);

    this.todosUniverso.set(this.unicos(tablas['universo'] as Universo[] ?? []));
    this.todosMundo.set(this.unicos(tablas['mundo'] as Mundo[] ?? []));
    this.todosCultura.set(this.unicos(tablas['cultura'] as Cultura[] ?? []));
    this.todosPersonaje.set(this.unicos(tablas['personaje'] as Personaje[] ?? []));
    this.todosCreatura.set(this.unicos(tablas['creatura'] as Creatura[] ?? []));
    this.todosSaga.set(this.unicos(tablas['saga'] as Saga[] ?? []));
    this.todosTomo.set(this.unicos(tablas['tomo'] as Tomo[] ?? []));
    this.todosIndice.set(this.unicos(tablas['indice'] as Indice[] ?? []));
    this.todosContenidoIndice.set(this.unicos(tablas['contenidoIndice'] as ContenidoIndice[] ?? []));
  }

  private unicos<T extends { id?: string }>(items: T[]): T[] {
    return (items || []).filter((item, index, array) =>
      array.findIndex(otro => otro?.id === item?.id) === index
    );
  }

  private fusionar<T extends { id?: string }>(locales: T[], nube: T[]): T[] {
    const idsLocales = new Set((locales || []).map(item => item?.id).filter(Boolean));
    const faltantes = (nube || []).filter(item => !idsLocales.has(item.id));
    return [...(locales || []), ...faltantes];
  }

  /*****************************************
   * Funciones del formulario
   * ***************************************
   */

  async onGuardarCambios() {
    await this.csvService.saveAllTables(this.obtenerTablasCSV());
    alert('Se guardaron los cambios a CSV con exito')
  }

  private obtenerTablasCSV(): Record<string, object[]> {
    return {
      universo: this.todosUniverso(),
      mundo: this.todosMundo(),
      cultura: this.todosCultura(),
      personaje: this.todosPersonaje(),
      creatura: this.todosCreatura(),
      saga: this.todosSaga(),
      tomo: this.todosTomo(),
      indice: this.todosIndice(),
      contenidoIndice: this.todosContenidoIndice(),
    };
  }

  onMundoHistoria(val: string) {
    if (val == 'mundo') {
      this.mundo = true
    } else {
      this.mundo = false
    }
  }

  /********************************* Nuevos ************************************************/

  onNuevoMundo() {
    const nameMundo = prompt("Introduce el nombre del nuevo Mundo", 'Mundo')
    if (nameMundo && nameMundo.trim() !== '' && this.selectUniverso?.id.length > 0) {
      const newMundo = { ...this.vacioMundo }
      newMundo.nombre = nameMundo.trim()
      newMundo.universoId = this.selectUniverso.id
      newMundo.id = this.getId()
      this.todosMundo.update(arr => [...arr, newMundo]);
      this.llenarMundo()
    }
  }

  onNuevocultura() {
    const nameCultura = prompt("Introduce el nombre de la nueva cultura", 'Cultura')
    if (nameCultura && nameCultura.trim() !== '' && this.selectMundo?.id.length > 0) {
      const newCultura = { ...this.vacioCultura }
      newCultura.id = this.getId()
      newCultura.nombre = nameCultura.trim()
      newCultura.mundoId = this.selectMundo.id
      this.todosCultura.update(arr => [...arr, newCultura]);
      this.llenarCulturas()
    }
  }

  onNuevoPersonaje() {
    const namePersonaje = prompt("Introduce el nombre del nuevo Personaje", 'Personaje')
    if (namePersonaje && namePersonaje.trim() !== '' && this.selectCultura?.id.length > 0) {
      const newPersonaje = { ...this.vacioPersonaje }
      newPersonaje.nombre = namePersonaje.trim()
      newPersonaje.culturaId = this.selectCultura.id
      newPersonaje.id = this.getId()
      this.todosPersonaje.update(arr => [...arr, newPersonaje]);
      this.llenarPersonajes()
    }
  }

  onNuevaCreatura() {
    const nameCreatura = prompt("Introduce el nombre de la nueva Creatura", 'Creatura');
    if (nameCreatura && nameCreatura.trim() !== '' && this.selectMundo?.id.length > 0) {
      const newCreatura = { ...this.vacioCreatura }
      newCreatura.nombre = nameCreatura.trim()
      newCreatura.mundoId = this.selectMundo.id
      newCreatura.id = this.getId()
      this.todosCreatura.update(arr => [...arr, newCreatura]);
      this.llenarCreaturas()
    }
  }

  onNuevoSaga() {
    const nameSaga = prompt("Introduce el nombre del nuevo Saga", 'Saga')
    if (nameSaga && nameSaga.trim() !== '' && this.selectUniverso?.id.length > 0) {
      const newSaga = { ...this.vacioSaga }
      newSaga.nombre = nameSaga.trim()
      newSaga.universoId = this.selectUniverso.id
      newSaga.id = this.getId()
      this.todosSaga.update(arr => [...arr, newSaga]);
      this.llenarSaga();
    }
  }

  onNuevoTomo() {
    const nameTomo = prompt("Introduce el nombre del nuevo Tomo", 'Tomo')
    if (nameTomo && nameTomo.trim() !== '' && this.selectSaga?.id.length > 0) {
      const newTomo = { ...this.vacioTomo }
      newTomo.nombre = nameTomo.trim()
      newTomo.sagaId = this.selectSaga.id
      newTomo.id = this.getId()
      this.todosTomo.update(arr => [...arr, newTomo]);
      this.llenarTomo();
    }
  }

  onNuevoIndice() {
    const nameIndice = prompt("Introduce el nombre del nuevo Indice", 'Indice')
    if (nameIndice && nameIndice.trim() !== '' && this.selectTomo?.id.length > 0) {
      const newIndice = { ...this.vacioIndice }
      newIndice.nombre = nameIndice.trim()
      newIndice.tomoId = this.selectTomo.id
      newIndice.id = this.getId()
      this.todosIndice.update(arr => [...arr, newIndice]);
      this.llenarIndice();
    }
  }

  onNuevoUniverso() {
    const nameUniverso = prompt("Introduce el nombre del nuevo universo", 'Universo:')
    if (nameUniverso && nameUniverso.trim() !== '') {
      const id = this.getId();
      this.todosUniverso.update(arr => [...arr, {
        id: id,
        nombre: nameUniverso.trim(),
        detalles: "",
        imagen: "",
        updatedAt: Date.now(),
        _deleted: false
      }]);
    }
  }

  /********************************* Select ************************************************/

  onSelectUniverso(event: any | string) {
    const idCapturado = this.eventToStr(event)

    if (!idCapturado || idCapturado === '0') {
      this.selectUniverso = this.vacioUniverso;
      this.mundosFiltrados = [];
      this.sagaFiltrados = [];
      this.tomoFiltrados = [];
      this.indiceFiltrados = [];
      this.selectMundo = this.vacioMundo;
      this.selectSaga = this.vacioSaga;
      this.selectTomo = this.vacioTomo;
      this.selectIndice = this.vacioIndice;
      return;
    }

    this.selectUniverso = this.dbService.universo$.getValue().find(u => u.id === idCapturado) ?? this.vacioUniverso;

    this.llenarSaga()
    this.llenarMundo()
    this.tomoFiltrados = [];
    this.indiceFiltrados = [];
    this.selectTomo = this.vacioTomo;
    this.selectIndice = this.vacioIndice;
  }

  onSelectMundo(event: any | string) {
    const mundoId = this.eventToStr(event);
    if (!mundoId || mundoId === '0') {
      this.selectMundo = this.vacioMundo;
      this.culturasFiltrados = [];
      this.creaturasFiltrados = [];
      this.selectCultura = this.vacioCultura;
      this.selectCreatura = this.vacioCreatura;
      return;
    }
    this.selectMundo = this.buscarMundoId(mundoId);
    this.llenarCulturas()
    this.llenarCreaturas()
  }

  onSelectCultura(event: any | string) {
    const culturaId = this.eventToStr(event);
    if (!culturaId || culturaId === '0') {
      this.selectCultura = this.vacioCultura;
      this.persoanjesFiltrados = [];
      this.selectPersonaje = this.vacioPersonaje;
      return;
    }
    this.selectCultura = this.buscarCulturaId(culturaId);
    this.llenarPersonajes()
  }

  onSelectPersonaje(event: any) {
    const personajeId = this.eventToStr(event);
    if (!personajeId || personajeId === '0') {
      this.selectPersonaje = this.vacioPersonaje;
      return;
    }
    this.selectPersonaje = this.buscarPersonajeId(personajeId);
  }

  onSelectCreatura(event: any) {
    const creaturaId = this.eventToStr(event);
    if (!creaturaId || creaturaId === '0') {
      this.selectCreatura = this.vacioCreatura;
      return;
    }
    this.selectCreatura = this.buscarCreaturaId(creaturaId);
  }

  onSelectSaga(event: any) {
    const sagaId = this.eventToStr(event);
    if (!sagaId || sagaId === '0') {
      this.selectSaga = this.vacioSaga;
      this.tomoFiltrados = [];
      this.indiceFiltrados = [];
      this.selectTomo = this.vacioTomo;
      this.selectIndice = this.vacioIndice;
      return;
    }
    this.selectSaga = this.buscarSagaId(sagaId);
    this.llenarTomo();
  }

  onSelectTomo(event: any) {
    const tomoId = this.eventToStr(event);
    if (!tomoId || tomoId === '0') {
      this.selectTomo = this.vacioTomo;
      this.indiceFiltrados = [];
      this.selectIndice = this.vacioIndice;
      return;
    }
    this.selectTomo = this.buscarTomoId(tomoId);
    this.llenarIndice();
  }

  onSelectIndice(event: any) {
    const indiceId = this.eventToStr(event);
    if (!indiceId || indiceId === '0') {
      this.selectIndice = this.vacioIndice;
      return;
    }
    this.selectIndice = this.buscarIndiceId(indiceId);
  }

  async onAddContenidoIndice(indiceId: string, indiceNombre: string, i: number) {
    const contenidoIndice = this.buscarContenidoIndiceId(indiceId, indiceNombre);
    if (contenidoIndice) {
      const contenido = await this.abrirTextPlus(contenidoIndice.contenido);
      contenidoIndice.contenido = contenido;
    } else {
      const contenido = await this.abrirTextPlus('');
      if (!contenido || !contenido.trim()) {
        return;
      }
      const newContenidoIndice = { ...this.vacioContenidoIndice };
      newContenidoIndice.contenido = contenido;
      newContenidoIndice.indiceId = indiceId;
      newContenidoIndice.indice = i.toString();
      newContenidoIndice.nombre = indiceNombre;
      newContenidoIndice.id = this.getId();
      newContenidoIndice.updatedAt = Date.now();
      this.todosContenidoIndice.update(arr => [...arr, newContenidoIndice]);
    }
  }

  //funciones para eliminar elementos
  onEliminarUniverso() {
    if (this.selectUniverso && this.selectUniverso.id) {
      const confirmDelete = confirm(`¿Estás seguro de que deseas eliminar el universo "${this.selectUniverso.nombre}"?`);
      if (confirmDelete) {
        this.dbService.eliminarUniversoPorId(this.selectUniverso.id);
        this.todosUniverso.set(this.todosUniverso().filter(u => u.id !== this.selectUniverso.id));
        this.selectUniverso = this.vacioUniverso;
        this.selectMundo = this.vacioMundo;
        this.selectSaga = this.vacioSaga;
        this.mundosFiltrados = [];
        this.sagaFiltrados = [];
        this.tomoFiltrados = [];
        this.indiceFiltrados = [];
        alert('Universo eliminado correctamente.');
      }
    } else {
      alert('No hay un universo seleccionado para eliminar.');
    }
  }

  onEliminarMundo() {
    if (this.selectMundo && this.selectMundo.id) {
      const confirmDelete = confirm(`¿Estás seguro de que deseas eliminar el mundo "${this.selectMundo.nombre}"?`);
      if (confirmDelete) {
        this.dbService.eliminarMundoPorId(this.selectMundo.id);
        this.todosMundo.set(this.todosMundo().filter(m => m.id !== this.selectMundo.id));
        this.selectMundo = this.vacioMundo;
        this.culturasFiltrados = [];
        this.creaturasFiltrados = [];
        this.selectCultura = this.vacioCultura;
        this.selectCreatura = this.vacioCreatura;
        alert('Mundo eliminado correctamente.');
      }
    } else {
      alert('No hay un mundo seleccionado para eliminar.');
    }
  }

  onEliminarCultura() {
    if (this.selectCultura && this.selectCultura.id) {
      const confirmDelete = confirm(`¿Estás seguro de que deseas eliminar la cultura "${this.selectCultura.nombre}"?`);
      if (confirmDelete) {
        this.dbService.eliminarCulturaPorId(this.selectCultura.id);
        this.todosCultura.set(this.todosCultura().filter(c => c.id !== this.selectCultura.id));
        this.selectCultura = this.vacioCultura;
        this.persoanjesFiltrados = [];
        this.selectPersonaje = this.vacioPersonaje;
        alert('Cultura eliminada correctamente.');
      }
    } else {
      alert('No hay una cultura seleccionada para eliminar.');
    }
  }

  onEliminarPersonaje() {
    if (this.selectPersonaje && this.selectPersonaje.id) {
      const confirmDelete = confirm(`¿Estás seguro de que deseas eliminar el personaje "${this.selectPersonaje.nombre}"?`);
      if (confirmDelete) {
        this.dbService.eliminarPersonajePorId(this.selectPersonaje.id);
        this.todosPersonaje.set(this.todosPersonaje().filter(p => p.id !== this.selectPersonaje.id));
        this.selectPersonaje = this.vacioPersonaje;
        alert('Personaje eliminado correctamente.');
      }
    } else {
      alert('No hay un personaje seleccionado para eliminar.');
    }
  }

  onEliminarCreatura() {
    if (this.selectCreatura && this.selectCreatura.id) {
      const confirmDelete = confirm(`¿Estás seguro de que deseas eliminar la creatura "${this.selectCreatura.nombre}"?`);
      if (confirmDelete) {
        this.dbService.eliminarCreaturaPorId(this.selectCreatura.id);
        this.todosCreatura.set(this.todosCreatura().filter(c => c.id !== this.selectCreatura.id));
        this.selectCreatura = this.vacioCreatura;
        alert('Creatura eliminada correctamente.');
      }
    } else {
      alert('No hay una creatura seleccionada para eliminar.');
    }
  }

  onEliminarSaga() {
    if (this.selectSaga && this.selectSaga.id) {
      const confirmDelete = confirm(`¿Estás seguro de que deseas eliminar la saga "${this.selectSaga.nombre}"?`);
      if (confirmDelete) {
        this.dbService.eliminarSagaPorId(this.selectSaga.id);
        this.todosSaga.set(this.todosSaga().filter(s => s.id !== this.selectSaga.id));
        this.selectSaga = this.vacioSaga;
        this.tomoFiltrados = [];
        this.indiceFiltrados = [];
        this.selectTomo = this.vacioTomo;
        this.selectIndice = this.vacioIndice;
        alert('Saga eliminada correctamente.');
      }
    } else {
      alert('No hay una saga seleccionada para eliminar.');
    }
  }

  onEliminarTomo() {
    if (this.selectTomo && this.selectTomo.id) {
      const confirmDelete = confirm(`¿Estás seguro de que deseas eliminar el tomo "${this.selectTomo.nombre}"?`);
      if (confirmDelete) {
        this.dbService.eliminarTomoPorId(this.selectTomo.id);
        this.todosTomo.set(this.todosTomo().filter(t => t.id !== this.selectTomo.id));
        this.selectTomo = this.vacioTomo;
        this.indiceFiltrados = [];
        this.selectIndice = this.vacioIndice;
        alert('Tomo eliminado correctamente.');
      }
    } else {
      alert('No hay un tomo seleccionado para eliminar.');
    }
  }

  onEliminarIndice(indice: Indice) {
    if (indice && indice.id) {
      const confirmDelete = confirm(`¿Estás seguro de que deseas eliminar el índice "${indice.nombre}"?`);
      if (confirmDelete) {
        this.dbService.eliminarIndicePorId(indice.id);
        this.todosIndice.set(this.todosIndice().filter(i => i.id !== indice.id));
        if (this.selectIndice?.id === indice.id) {
          this.selectIndice = this.vacioIndice;
        }
        this.llenarIndice();
        alert('Índice eliminado correctamente.');
      }
    } else {
      alert('No se pudo eliminar el índice.');
    }
  }

  onCambiarTituloIndice(indice: Indice) {
    indice.nombre = prompt("Introduce el nuevo nombre del índice", indice.nombre) || indice.nombre;
  }

  async onUniversoDetalles(universo: Universo) {
    const contenido = await this.abrirTextPlus(universo.detalles);
    universo.detalles = contenido;
    console.log(contenido);
  }

  async onMundoDetalles(mundo: Mundo) {
    const contenido = await this.abrirTextPlus(mundo.detalles);
    mundo.detalles = contenido;
    console.log(contenido);
  }

  async onPersonajeDetalles(personaje: Personaje) {
    const contenido = await this.abrirTextPlus(personaje.detalles);
    personaje.detalles = contenido;
    console.log(contenido);
  }

  async onCreaturaDetalles(creatura: Creatura) {
    const contenido = await this.abrirTextPlus(creatura.detalles);
    creatura.detalles = contenido;
    console.log(contenido);
  }

  async onSagaDetalles(saga: Saga) {
    const contenido = await this.abrirTextPlus(saga.detalles);
    saga.detalles = contenido;
    console.log(contenido);
  }

  async onTomoDetalles(tomo: Tomo) {
    const contenido = await this.abrirTextPlus(tomo.detalles);
    tomo.detalles = contenido;
    console.log(contenido);
  }

  async onIndiceDetalles(indice: Indice) {
    const contenido = await this.abrirTextPlus(indice.detalles);
    indice.detalles = contenido;
    console.log(contenido);
  }

  async onCulturaDetalles(cultura: Cultura) {
    const contenido = await this.abrirTextPlus(cultura.detalles);
    cultura.detalles = contenido;
    console.log(contenido);
  }

  mundoShow: boolean = true;
  onMundoShow() {
    this.mundoShow = !this.mundoShow;
  }

  culturaShow: boolean = true;
  onCulturaShow() {
    this.culturaShow = !true;
    this.creturaShow = !false;
  }

  creturaShow: boolean = true;
  onCreaturaShow() {
    this.culturaShow = true;
    this.creturaShow = false;
  }
  /***************************
   *    Funciones Internas   *
   ***************************/

  buscarSagaId(id: string): Saga {
    return this.todosSaga().find(m => m.id.trim() === id.trim()) ?? this.vacioSaga;
  }

  buscarMundoId(id: string): Mundo {
    return this.todosMundo().find(m => m.id.trim() === id.trim()) ?? this.vacioMundo;
  }

  buscarCulturaId(id: string): Cultura {
    return this.todosCultura().find(m => m.id.trim() === id.trim()) ?? this.vacioCultura;
  }

  buscarPersonajeId(id: string): Personaje {
    return this.todosPersonaje().find(m => m.id.trim() === id.trim()) ?? this.vacioPersonaje;
  }

  buscarCreaturaId(id: string): Creatura {
    return this.todosCreatura().find(m => m.id.trim() === id.trim()) ?? this.vacioCreatura;
  }

  buscarTomoId(id: string): Tomo {
    return this.todosTomo().find(m => m.id.trim() === id.trim()) ?? this.vacioTomo;
  }

  buscarIndiceId(id: string): Indice {
    return this.todosIndice().find(m => m.id.trim() === id.trim()) ?? this.vacioIndice;
  }

  buscarContenidoIndiceId(idIndice: string, indiceNombre: string): ContenidoIndice | null {
    return this.todosContenidoIndice().find(m => m.nombre === indiceNombre.trim() && m.indiceId === idIndice) ?? null;
  }

  /******************************** Llenar *********************************/

  llenarMundo() {
    const idUniverso = this.selectUniverso.id
    if (!idUniverso || idUniverso === '0') {
      this.mundosFiltrados = [];
      return;
    }
    this.selectMundo = this.vacioMundo
    this.mundosFiltrados = this.todosMundo().filter(m => (m.universoId ?? '').trim() === idUniverso.trim());
  }

  llenarCulturas() {
    const idMundo = this.selectMundo.id
    if (!idMundo || idMundo === '0') {
      this.culturasFiltrados = [];
      return;
    }
    this.selectCreatura = this.vacioCreatura
    this.culturasFiltrados = this.todosCultura().filter(m => (m.mundoId ?? '').trim() === idMundo.trim());
  }

  llenarPersonajes() {
    const idCultura = this.selectCultura.id
    if (!idCultura || idCultura === '0') {
      this.persoanjesFiltrados = [];
      return;
    }
    this.selectPersonaje = this.vacioPersonaje
    this.persoanjesFiltrados = this.todosPersonaje().filter(m => (m.culturaId ?? '').trim() === idCultura.trim());
  }

  llenarCreaturas() {
    const idMundo = this.selectMundo.id;
    if (!idMundo || idMundo === '0') {
      this.creaturasFiltrados = [];
      return;
    }
    this.selectCreatura = this.vacioCreatura
    this.creaturasFiltrados = this.todosCreatura().filter(m => (m.mundoId ?? '').trim() === idMundo.trim());
  }



  llenarSaga() {
    const idUniverso = this.selectUniverso.id;
    if (!idUniverso || idUniverso === '0') {
      this.sagaFiltrados = [];
      return;
    }
    this.selectSaga = this.vacioSaga
    this.sagaFiltrados = this.todosSaga().filter(m => (m.universoId ?? '').trim() === idUniverso.trim());
  }

  llenarTomo() {
    const idSaga = this.selectSaga.id;

    if (!idSaga || idSaga === '0') {
      this.tomoFiltrados = [];
      return;
    }
    this.selectTomo = this.vacioTomo
    this.tomoFiltrados = this.todosTomo().filter(m => (m.sagaId ?? '').trim() === idSaga.trim());
  }

  llenarIndice() {
    const idTomo = this.selectTomo.id;

    if (!idTomo || idTomo === '0') {
      this.indiceFiltrados = [];
      return;
    }
    this.selectIndice = this.vacioIndice
    this.indiceFiltrados = this.todosIndice().filter(m => (m.tomoId ?? '').trim() === idTomo.trim());
  }

  eventToStr(event: any | string): string {
    if (typeof event === 'string') {
      return event;
    }

    if (event && event.target && event.target.value) {
      return event.target.value;
    }

    console.error('El formato del argumento no es válido:', event);
    return '';
  }

  getId(): string {
    const ahora = Date.now();
    return ahora + '_' + Math.random().toString(36).substring(2, 5)
  }

  //////Text-plus
  abrirTextPlus(texto: string): Promise<string> {
    this.textoAEditar = texto;
    this.mostrarTextPlus = true;
    return new Promise(resolve => {
      this.textPlusPromiseResolver = resolve;
    });
  }

  private closeTextPlus(resolvedValue: string) {
    this.mostrarTextPlus = false;
    if (this.textPlusPromiseResolver) {
      this.textPlusPromiseResolver(resolvedValue);
      this.textPlusPromiseResolver = null;
    }
  }

  cerrar() {
    this.closeTextPlus(this.textoAEditar);
  }

  aceptar() {
    const elementoTextarea = this.textareaSeleccionada();

    if (elementoTextarea) {
      elementoTextarea.value = this.textoAEditar;
      elementoTextarea.dispatchEvent(new Event('input', { bubbles: true }));
    }

    this.closeTextPlus(this.textoAEditar);
  }

  abrirEditarText() {
    this.textoAEditar = this.textareaSeleccionada()?.value || '';
    this.mostrarTextPlus = true;
  }
  onClickCreatividad() {
    window.location.href = '/creatividad';
  }

  onClickMente() {
    window.location.href = '/mente';
  }
}
