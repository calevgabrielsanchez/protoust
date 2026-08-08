import { Component, inject, signal, viewChild, ElementRef, DestroyRef, WritableSignal } from '@angular/core';
import { Universo } from '../../models/universo.model';

import { RxdbService } from '../../services/rxdb.service';
import { AsyncPipe, CommonModule } from '@angular/common';
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
  faCircleInfo, faSquarePlus, faBaby, faDragon, faMeteor, faSkullCrossbones, faTrashCan, faPenFancy
} from '@fortawesome/free-solid-svg-icons';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-main.component',
  imports: [AsyncPipe, CommonModule, FormsModule, TextPlusComponent, ClickTextarea, FaIconComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {
  /*****************************************
   * Variables Iconos del front
   * ***************************************
   */

  private destroyRef = inject(DestroyRef);

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
  /*****************************************
   * Variables Internas
   * ***************************************
   */
  mundo: boolean = true
  Universos: Universo[] = [];

  public dbService = inject(RxdbService)

  mostrarTextPlus: boolean = false;
  textoAEditar: string = ""
  private textPlusPromiseResolver: ((texto: string) => void) | null = null;
  private textareaRef = viewChild.required<ElementRef<HTMLTextAreaElement>>('queDiferente');
  textareaSeleccionada: WritableSignal<HTMLTextAreaElement | null> = signal<HTMLTextAreaElement | null>(null);

  selectUniverso!: Universo;

  //Variables mundo
  todosMundo: Mundo[] = []
  mundosFiltrados!: Mundo[]
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
  selectMundo = this.vacioMundo

  todosCultura: Cultura[] = []
  culturasFiltrados!: Cultura[]
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
  selectCultura = this.vacioCultura

  todosPersonaje: Personaje[] = []
  persoanjesFiltrados!: Personaje[]
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
  selectPersonaje = this.vacioPersonaje

  todosCreatura: Creatura[] = []
  creaturasFiltrados!: Creatura[]
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
  selectCreatura = this.vacioCreatura

  todosSaga: Saga[] = []
  sagaFiltrados!: Saga[]
  vacioSaga: Saga = {
    id: '',
    universoId: '',
    nombre: '',
    detalles: '',
    imagen: '',

    updatedAt: 0,
    _deleted: false
  };
  selectSaga = this.vacioSaga

  todosTomo: Tomo[] = []
  tomoFiltrados!: Tomo[]
  vacioTomo: Tomo = {
    id: '',
    sagaId: '',
    nombre: '',
    detalles: '',
    imagen: '',

    updatedAt: 0,
    _deleted: false
  };
  selectTomo = this.vacioTomo

  todosIndice: Indice[] = []
  indiceFiltrados!: Indice[]
  vacioIndice: Indice = {
    id: '',
    tomoId: '',
    nombre: '',
    detalles: '',
    imagen: '',

    updatedAt: 0,
    _deleted: false
  };
  selectIndice = this.vacioIndice

  todosContenidoIndice: ContenidoIndice[] = []
  contenidoIndiceFiltrados!: ContenidoIndice[]
  vacioContenidoIndice: ContenidoIndice = {
    id: '',
    indiceId: '',
    contenido: '',
    indice: '',
    nombre: '',

    updatedAt: 0,
    _deleted: false
  };
  selectContenidoIndice = this.vacioContenidoIndice

  /*****************************************
   * Constructor y funciones de iniciacion
   * ***************************************
   */


  ngOnInit() {
    this.cargarBaseDeDatos()
  }

  cargarBaseDeDatos() {

    const delay = setInterval(() => {

      this.dbService.mundo$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (mundosEnMemoria) => {
          console.log("¡Mundos!", mundosEnMemoria)
          this.todosMundo = mundosEnMemoria
        }
      });

      this.dbService.cultura$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (culturaEnMemoria) => {
          console.log("¡Cultura!", culturaEnMemoria)
          this.todosCultura = culturaEnMemoria
        }
      });

      this.dbService.personaje$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (personajeEnMemoria) => {
            console.log("¡Personaje!", personajeEnMemoria)
            this.todosPersonaje = personajeEnMemoria
          }
        });

      this.dbService.creatura$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (creaturaEnMemoria) => {
          console.log("¡creatura!", creaturaEnMemoria)
          this.todosCreatura = creaturaEnMemoria
        }
      });

      this.dbService.saga$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (sagaEnMemoria) => {
          console.log("¡saga!", sagaEnMemoria)
          this.todosSaga = sagaEnMemoria
        }
      });

      this.dbService.tomo$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (tomoEnMemoria) => {
          console.log("¡tomo!", tomoEnMemoria)
          this.todosTomo = tomoEnMemoria
        }
      });

      this.dbService.indice$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (indiceEnMemoria) => {
          console.log("¡indice!", indiceEnMemoria)
          this.todosIndice = indiceEnMemoria
        }
      });

      this.dbService.contenidoIndice$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (contenidoIndiceEnMemoria) => {
          console.log("¡contenido de índice!", contenidoIndiceEnMemoria)
          this.todosContenidoIndice = contenidoIndiceEnMemoria
        }
      });

      clearInterval(delay)
    }, 800);//interval

  }


  /*****************************************
   * Funciones del formulario
   * ***************************************
   */

  onGuardarCambios() {

    this.todosMundo.forEach((obj) => {
      this.dbService.editarMundo(obj.id, obj)
    })

    this.todosCultura.forEach((obj) => {
      this.dbService.editarCultura(obj.id, obj)
    })

    this.todosPersonaje.forEach((obj) => {
      this.dbService.editarPersonaje(obj.id, obj)
    })

    this.todosCreatura.forEach((obj) => {
      this.dbService.editarCreatura(obj.id, obj)
    })

    this.todosSaga.forEach((obj) => {
      this.dbService.editarSaga(obj.id, obj)
    })

    this.todosTomo.forEach((obj) => {
      this.dbService.editarTomo(obj.id, obj)
    })

    this.todosIndice.forEach((obj) => {
      this.dbService.editarIndice(obj.id, obj)
    })

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
    const nameMundo = prompt("Intoruce el nombre del nuevo Mundo", 'Mundo')
    if (nameMundo && nameMundo.trim() !== '' && this.selectUniverso?.id.length > 0) {
      const newMundo = this.vacioMundo
      newMundo.nombre = nameMundo
      newMundo.universoId = this.selectUniverso?.id
      newMundo.id = this.getId()
      this.todosMundo.push(newMundo);
      this.dbService.crearMundo(newMundo.id, this.selectUniverso?.id, nameMundo, '', '', '', '', '', '', '', '')
      this.llenarMundo()
    }
  }

  onNuevocultura() {
    const nameCultura = prompt("Intoruce el nombre de la nueva cultura", 'Cultura')
    if (nameCultura && nameCultura.trim() !== '' && this.selectMundo?.id.length > 0) {
      const newCultura = this.vacioCultura
      newCultura.id = this.getId()
      newCultura.nombre = nameCultura
      newCultura.mundoId = this.selectMundo?.id
      this.todosCultura.push(newCultura);
      this.dbService.crearCultura(newCultura.id, this.selectMundo?.id, nameCultura, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '')
      this.llenarCulturas()
    }
  }

  onNuevoPersonaje() {
    const namePersonaje = prompt("Intoruce el nombre del nuevo Personaje", 'Personaje')
    if (namePersonaje && namePersonaje.trim() !== '' && this.selectCultura?.id.length > 0) {
      const newPersonaje = this.vacioPersonaje
      newPersonaje.nombre = namePersonaje
      newPersonaje.culturaId = this.selectCultura?.id
      newPersonaje.id = this.getId()
      this.todosPersonaje.push(newPersonaje);
      this.dbService.crearPersonaje(newPersonaje.id, this.selectCultura?.id, namePersonaje, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '')
      this.llenarPersonajes()
    }
  }

  onNuevaCreatura() {
    const nameCreatura = prompt("Introduce el nombre de la nueva Creatura", 'Creatura');
    if (nameCreatura && nameCreatura.trim() !== '' && this.selectMundo?.id.length > 0) {
      const newCreatura = this.vacioCreatura
      newCreatura.nombre = nameCreatura
      newCreatura.mundoId = this.selectMundo?.id
      newCreatura.id = this.getId()
      this.todosCreatura.push(newCreatura);
      this.dbService.crearCreatura(newCreatura.id, this.selectMundo.id, nameCreatura.trim(), '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
      this.llenarCreaturas()
    }
  }

  onNuevoSaga() {
    const nameSaga = prompt("Intoruce el nombre del nuevo Saga", 'Saga')
    if (nameSaga && nameSaga.trim() !== '' && this.selectUniverso?.id.length > 0) {
      const newSaga = this.vacioSaga
      newSaga.nombre = nameSaga
      newSaga.universoId = this.selectUniverso?.id
      newSaga.id = this.getId()
      this.todosSaga.push(newSaga);
      this.dbService.crearSaga(newSaga.id, this.selectUniverso?.id, nameSaga, '', '')
      this.llenarSaga();
    }
  }

  onNuevoTomo() {
    const nameTomo = prompt("Intoruce el nombre del nuevo Tomo", 'Tomo')
    if (nameTomo && nameTomo.trim() !== '' && this.selectSaga?.id.length > 0) {
      const newTomo = this.vacioTomo
      newTomo.nombre = nameTomo
      newTomo.sagaId = this.selectSaga?.id
      newTomo.id = this.getId()
      this.todosTomo.push(newTomo);
      this.dbService.crearTomo(newTomo.id, this.selectSaga?.id, nameTomo, '', '')
      this.llenarTomo();
    }
  }

  onNuevoIndice() {
    const nameIndice = prompt("Intoruce el nombre del nuevo Indice", 'Indice')
    if (nameIndice && nameIndice.trim() !== '' && this.selectTomo?.id.length > 0) {
      const newIndice = this.vacioIndice
      newIndice.nombre = nameIndice
      newIndice.tomoId = this.selectTomo?.id
      newIndice.id = this.getId()
      this.todosIndice.push(newIndice);
      this.dbService.crearIndice(newIndice.id, this.selectTomo?.id, nameIndice, '', '')
      this.llenarIndice();
    }
  }

  onNuevoUniverso() {
    const nameUniverso = prompt("Intoruce el nombre del nuevo universo", 'Universo:')
    if (nameUniverso && nameUniverso.trim() !== '') {

      this.dbService.crearUniverso(nameUniverso, '', '');

      // Creamos el objeto asignándole el valor capturado al atributo 'nombre'
      const fechaId = new Date()
      const id = fechaId.getDay().toString() + fechaId.getMonth().toString() + fechaId.getFullYear().toString() +
        fechaId.getHours().toString() + fechaId.getMinutes().toString() + fechaId.getSeconds().toString();
      const universoNew: Universo = {
        id: id,
        nombre: nameUniverso.trim(),
        detalles: "",
        imagen: "",
        updatedAt: 0,
        _deleted: false
      };
      this.Universos.push(universoNew)
      console.log('Universo', this.Universos);

    }
  }

  /********************************* Select ************************************************/

  onSelectUniverso(event: any | string) {
    const idCapturado = this.eventToStr(event)

    if (!idCapturado || idCapturado === '0') {
      this.mundosFiltrados = [];
      return;
    }
    // 1. Extraemos el arreglo plano actual de universos desde el BehaviorSubject
    const listaUniversos = this.dbService.universo$.getValue()

    // 2. Buscamos el objeto Universo completo que coincida con el ID seleccionado
    const universoEncontrado = listaUniversos.find(u => u.id === idCapturado);

    if (universoEncontrado) {
      // 3. SETEAMOS tu variable de clase con el objeto real completo
      this.selectUniverso = universoEncontrado;
    }
    this.llenarSaga()
    this.llenarMundo()
  }

  onSelectMundo(event: any | string) {
    const mundoId = this.eventToStr(event);
    this.selectMundo = this.buscarMundoId(mundoId);
    this.llenarCulturas()
    this.llenarCreaturas()
  }

  onSelectCultura(event: any | string) {
    const culturaId = this.eventToStr(event);
    this.selectCultura = this.buscarCulturaId(culturaId);
    console.log("cultura seleccionado:", this.selectCultura)
    this.llenarPersonajes()
  }

  onSelectPersonaje(event: any) {
    const personajeId = this.eventToStr(event);
    this.selectPersonaje = this.buscarPersonajeId(personajeId);
    console.log("personaje seleccionado:", this.selectPersonaje)
  }

  onSelectCreatura(event: any) {
    const creaturaId = this.eventToStr(event);
    this.selectCreatura = this.buscarCreaturaId(creaturaId);
    console.log("creatura seleccionado:", this.selectCreatura);
    this.llenarCreaturas();
  }

  onSelectSaga(event: any) {
    const sagaId = this.eventToStr(event);
    this.selectSaga = this.buscarSagaId(sagaId);
    console.log("Saga seleccionado:", this.selectSaga);
    this.llenarTomo();
  }

  onSelectTomo(event: any) {
    const tomoId = this.eventToStr(event);
    this.selectTomo = this.buscarTomoId(tomoId);
    console.log("Tomo seleccionado:", this.selectTomo);
    this.llenarIndice();
  }

  onSelectIndice(event: any) {
    const indiceId = this.eventToStr(event);
    this.selectIndice = this.buscarIndiceId(indiceId);
    console.log("Indice seleccionado:", this.selectIndice);
    //this.llenarIndice();
  }

  async onAddContenidoIndice(indiceId: string, indiceNombre: string, i: number) {
    const contenidoIndice = this.buscarContenidoIndiceId(indiceId, indiceNombre);
    console.log("Contenido de Indice seleccionado:", contenidoIndice);
    if (contenidoIndice) {
      this.selectContenidoIndice = contenidoIndice;
      await this.abrirTextPlus(this.selectContenidoIndice.contenido);
    } else {
      const contenido = await this.abrirTextPlus('');
      const newContenidoIndice = { ...this.vacioContenidoIndice };
      newContenidoIndice.contenido = contenido;
      newContenidoIndice.indiceId = indiceId;
      newContenidoIndice.indice = indiceNombre;
      newContenidoIndice.nombre = indiceNombre;
      newContenidoIndice.id = this.getId();
      this.todosContenidoIndice.push(newContenidoIndice);
      const indice = i.toString();
      this.dbService.crearContenidoIndice(newContenidoIndice.id, indiceId, contenido, indice, indiceNombre);
    }
  }

  //funciones para eliminar elementos
  onEliminarUniverso() {
    if (this.selectUniverso && this.selectUniverso.id) {
      const confirmDelete = confirm(`¿Estás seguro de que deseas eliminar el universo "${this.selectUniverso.nombre}"?`);
      if (confirmDelete) {
        this.dbService.eliminarUniversoPorId(this.selectUniverso.id);
        this.Universos = this.Universos.filter(u => u.id !== this.selectUniverso.id);
        this.selectUniverso = { id: '', nombre: '', detalles: '', imagen: '', updatedAt: 0, _deleted: false };
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
        this.todosMundo = this.todosMundo.filter(m => m.id !== this.selectMundo.id);
        this.selectMundo = { id: '', universoId: '', nombre: '', diferente: '', detalles: '', imagen: '', funciona: '', reglas: '', geografia: '', historia: '', eventEspeciales: '', updatedAt: 0, _deleted: false };
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
        this.todosCultura = this.todosCultura.filter(c => c.id !== this.selectCultura.id);
        this.selectCultura = { id: '', nombre: '', detalles: '', imagen: '', mundoId: '', costumbres: '', religiones: '', idioma: '', vestimenta: '', comida: '', valores: '', castas: '', armas: '', diasFestivos: '', historia: '', sistemaPolitico: '', comoObtienePoder: '', dinero: '', recursos: '', viajan: '', updatedAt: 0, _deleted: false };
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
        this.todosPersonaje = this.todosPersonaje.filter(p => p.id !== this.selectPersonaje.id);
        this.selectPersonaje = { id: '', nombre: '', detalles: '', imagen: '', culturaId: '', personales: '', enfermedad: '', traumas: '', pasado: '', presente: '', futuro: '', personalidad: '', seductor: '', hobbie: '', amor: '', odio: '', ignora: '', familia: '', amigos: '', parejas: '', updatedAt: 0, _deleted: false };
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
        this.todosCreatura = this.todosCreatura.filter(c => c.id !== this.selectCreatura.id);
        this.selectCreatura = { id: '', nombre: '', detalles: '', imagen: '', mundoId: '', rol: '', habitat: '', forma: '', habilidades: '', comunica: '', reproduce: '', come: '', importantePara: '', familia: '', comportamiento: '', cicloVida: '', inteligencia: '', ecosistema: '', curiocidad: '', sociedad: '', updatedAt: 0, _deleted: false };
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
        this.todosSaga = this.todosSaga.filter(s => s.id !== this.selectSaga.id);
        this.selectSaga = { id: '', universoId: '', nombre: '', detalles: '', imagen: '', updatedAt: 0, _deleted: false };
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
        this.todosTomo = this.todosTomo.filter(t => t.id !== this.selectTomo.id);
        this.selectTomo = { id: '', sagaId: '', nombre: '', detalles: '', imagen: '', updatedAt: 0, _deleted: false };
        alert('Tomo eliminado correctamente.');
      }
    } else {
      alert('No hay un tomo seleccionado para eliminar.');
    }
  }

  onEliminarIndice() {
    if (this.selectIndice && this.selectIndice.id) {
      const confirmDelete = confirm(`¿Estás seguro de que deseas eliminar el índice "${this.selectIndice.nombre}"?`);
      if (confirmDelete) {
        this.dbService.eliminarIndicePorId(this.selectIndice.id);
        this.todosIndice = this.todosIndice.filter(i => i.id !== this.selectIndice.id);
        this.selectIndice = { id: '', tomoId: '', nombre: '', detalles: '', imagen: '', updatedAt: 0, _deleted: false };
        alert('Índice eliminado correctamente.');
      }
    } else {
      alert('No hay un índice seleccionado para eliminar.');
    }
  } 



  /***************************
   *    Funciones Internas   *
   ***************************/

  buscarSagaId(id: string): Saga {
    const todasSagas = this.dbService.saga$.getValue();

    const sagaEncontrada = <Saga>todasSagas.find(m => m.id.trim() === id.trim());

    return sagaEncontrada;
  }

  buscarMundoId(id: string): Mundo {
    return <Mundo>this.todosMundo.find(m => m.id.trim() === id.trim())
  }

  buscarCulturaId(id: string): Cultura {
    console.log(this.todosCultura, "idc")
    return <Cultura>this.todosCultura.find(m => m.id.trim() === id.trim())
  }

  buscarPersonajeId(id: string): Personaje {
    const personajeEncontrado = <Personaje>this.todosPersonaje.find(m => m.id.trim() === id.trim())
    return personajeEncontrado
  }

  buscarCreaturaId(id: string): Creatura {
    const creaturaEncontrada = <Creatura>this.todosCreatura.find(m => m.id.trim() === id.trim());
    return creaturaEncontrada;
  }

  buscarTomoId(id: string): Tomo {
    const tomoEncontrado = <Tomo>this.todosTomo.find(m => m.id.trim() === id.trim())
    return tomoEncontrado
  }

  buscarIndiceId(id: string): Indice {
    const indiceEncontrado = <Indice>this.todosIndice.find(m => m.id.trim() === id.trim())
    return indiceEncontrado
  }

  buscarContenidoIndiceId(idIndice: string, indiceNombre: string): ContenidoIndice {
    const contenidoEncontrado = <ContenidoIndice>this.todosContenidoIndice.find(m => m.nombre === indiceNombre.trim() && m.indiceId === idIndice)
    return contenidoEncontrado
  }

  /******************************** Llenar *********************************/

  llenarMundo() {
    const idUniverso = this.selectUniverso.id
    if (!idUniverso || idUniverso === '0') {
      this.mundosFiltrados = [];
      return;
    }
    console.log("llenarMundos", this.todosMundo)
    this.selectMundo = this.vacioMundo
    this.mundosFiltrados = this.todosMundo.filter(m => m.universoId.trim() === idUniverso.trim());
  }

  llenarCulturas() {
    const idMundo = this.selectMundo.id
    if (!idMundo || idMundo === '0') {
      this.culturasFiltrados = [];
      return;
    }
    console.log("llenarCulturas", this.todosCultura)
    this.selectCreatura = this.vacioCreatura
    this.culturasFiltrados = this.todosCultura.filter(m => m.mundoId.trim() === idMundo.trim());
  }

  llenarPersonajes() {
    const idCultura = this.selectCultura.id
    console.log("llenarPersoanje", idCultura)
    if (!idCultura || idCultura === '0') {
      this.persoanjesFiltrados = [];
      return;
    }
    this.selectPersonaje = this.vacioPersonaje
    this.persoanjesFiltrados = this.todosPersonaje.filter(m => m.culturaId.trim() === idCultura.trim());
  }

  llenarCreaturas() {
    const idMundo = this.selectMundo.id;
    if (!idMundo || idMundo === '0') {
      this.creaturasFiltrados = [];
      return;
    }
    this.selectCreatura = this.vacioCreatura
    this.creaturasFiltrados = this.todosCreatura.filter(m => m.mundoId.trim() === idMundo.trim());
  }



  llenarSaga() {
    const idUniverso = this.selectUniverso.id;
    if (!idUniverso || idUniverso === '0') {
      this.sagaFiltrados = [];
      return;
    }
    this.selectSaga = this.vacioSaga
    this.sagaFiltrados = this.todosSaga.filter(m => m.universoId.trim() === idUniverso.trim());
  }

  llenarTomo() {
    const idSaga = this.selectSaga.id;

    if (!idSaga || idSaga === '0') {
      this.tomoFiltrados = [];
      return;
    }
    this.selectTomo = this.vacioTomo
    this.tomoFiltrados = this.todosTomo.filter(m => m.sagaId.trim() === idSaga.trim());
  }

  llenarIndice() {
    const idTomo = this.selectTomo.id;

    if (!idTomo || idTomo === '0') {
      this.indiceFiltrados = [];
      return;
    }
    this.selectIndice = this.vacioIndice
    this.indiceFiltrados = this.todosIndice.filter(m => m.tomoId.trim() === idTomo.trim());
  }

  eventToStr(event: any | string): string {
    let objetcId: string;


    if (typeof event === 'string') {
      objetcId = event
    } else if (event && event.target && event.target.value) {
      objetcId = event.target.value
    } else {
      console.error('El formato del argumento no es válido:', event)
      return '';
    }
    if (objetcId == 'defaultId') {

    }
    console.log(objetcId, 'objetcId')
    return objetcId
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
    console.log(this.textoAEditar);
    this.closeTextPlus(this.textoAEditar);
  }

  aceptar() {
    const elementoTextarea = this.textareaSeleccionada();

    if (elementoTextarea) {
      elementoTextarea.value = this.textoAEditar;
      elementoTextarea.dispatchEvent(new Event('input', { bubbles: true }));
    }

    this.closeTextPlus(this.textoAEditar);
    console.log("text area", elementoTextarea);
  }

  abrirEditarText() {
    this.textoAEditar = this.textareaSeleccionada()?.value || '';
    this.mostrarTextPlus = true;
  }
}
