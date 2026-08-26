import { Component, inject, signal } from '@angular/core';
import {
  faSave, faFileHalfDashed, faGlobe, faBook, faEarthAmericas, faScroll, faImage,
  faCircleInfo, faSquarePlus, faBaby, faDragon, faMeteor, faSkullCrossbones, faTrashCan, faPenFancy,
  faDownload, faUpload, faRefresh, faUser, faPersonChalkboard, faPersonHiking, faPersonDressBurst
} from '@fortawesome/free-solid-svg-icons';
import { TextPlusComponent } from '../text-plus.component/text-plus.component';
import { Personalidad } from '../../models/personalidad.model';
import { Valores } from '../../models/valores.model';
import { Miedos } from '../../models/miedos.model';
import { Emociones } from '../../models/emociones.modelo';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RxdbService } from '../../services/rxdb.service';
import { LocalCsvService } from '../../services/local-csv.service';

@Component({
  selector: 'app-mente.component',
  imports: [FormsModule, FaIconComponent, CommonModule, TextPlusComponent, FaIconComponent, FaIconComponent, FormsModule],

  templateUrl: './mente.component.html',
  styleUrl: './mente.component.css',
})
export class MenteComponent {
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
  faUser = faUser;
  faPersonChalkboard = faPersonChalkboard;
  faPersonHiking = faPersonHiking;
  faPersonDressBurst = faPersonDressBurst;

  mostrarTextPlus: boolean = false;
  textoAEditar: string = "";

  personalidadVacia: Personalidad = {
    id: '',
    imagen: '',
    detalles: '',
    mbti: '',
    colorForma: '',
    oficio: '',
    descripcion: '',
    comoSon: '',
    cualidad: '',
    dondeEncaja: '',
    habilidad: '',
    valores: '',
    pareja: '',
    traumas: '',
    enfermedad: '',
    danan: '',
    CaleVRije: '',
    funcion: '',
    grupo: '',
    updatedAt: 0,
    _deleted: false
  };

  personalidadSeleccionada: Personalidad = this.personalidadVacia;

  personalidadDiv = true;
  valoresDiv = false;
  emocionesDiv = false;
  miedosDiv = false;

  public dbService = inject(RxdbService);
  public csvService = inject(LocalCsvService);

  personalidades = signal<Personalidad[]>([]);

  valoresVacio: Valores = {
    id: '',
    nombre: '',
    descripcion: '',
    frase: '',
    creatura: '',
    detalles: '',
    imagen: '',
  };

  valoresSeleccionado: Valores = this.valoresVacio;
  todosValores = signal<Valores[]>([]);

  miedosVacio: Miedos = {
    id: '',
    nombre: '',
    descripcion: '',
    frase: '',
    creatura: '',
    detalles: '',
    imagen: '',
  };

  miedosSeleccionado: Miedos = this.miedosVacio;
  todosMiedos = signal<Miedos[]>([]);

  emocionesVacia: Emociones = {
    id: '',
    nombre: '',
    descripcion: '',
    frase: '',
    creatura: '',
    detalles: '',
    imagen: '',
  };

  emocionesSeleccionada: Emociones = this.emocionesVacia;
  todasEmociones = signal<Emociones[]>([]);

  ngOnInit() {
    // this.cargarPersonalidades();
  }

  async cargarValores() {
    const tablas = await this.csvService.loadAllTables<object>(['valores']);
    this.todosValores.set(tablas['valores'] as Valores[] ?? []);
  }

  async cargarMiedos() {
    const tablas = await this.csvService.loadAllTables<object>(['miedos']);
    this.todosMiedos.set(tablas['miedos'] as Miedos[] ?? []);
  }

  async cargarEmociones() {
    const tablas = await this.csvService.loadAllTables<object>(['emociones']);
    this.todasEmociones.set(tablas['emociones'] as Emociones[] ?? []);
  }

  async cargarPersonalidades() {
    const tablas = await this.csvService.loadAllTables<object>(['personalidad']);
    this.personalidades.set(tablas['personalidad'] as Personalidad[] ?? []);
  }

  cerrar() {
    this.closeTextPlus(this.textoAEditar);
  }

  private closeTextPlus(resolvedValue: string) {
    this.mostrarTextPlus = false;
    /* if (this.textPlusPromiseResolver) {
       this.textPlusPromiseResolver(resolvedValue);
       this.textPlusPromiseResolver = null;
     }*/
  }

  aceptar() {
    /* const elementoTextarea = this.textareaSeleccionada();
 
     if (elementoTextarea) {
       elementoTextarea.value = this.textoAEditar;
       elementoTextarea.dispatchEvent(new Event('input', { bubbles: true }));
     }
 
     this.closeTextPlus(this.textoAEditar);*/
  }

  abrirEditarText() {
    // this.textoAEditar = this.textareaSeleccionada()?.value || '';
    this.mostrarTextPlus = true;
  }

  onClickCaleVRije() {
    window.location.href = '/';
  }
  onClickCreatividad() {
    window.location.href = '/creatividad';
  }

  onSelectPersonalidad(event: any) {
    const id = this.eventToStr(event);
    if (!id || id === '0') {
      this.personalidadSeleccionada = this.personalidadVacia;
      return;
    }
    this.personalidadSeleccionada = this.personalidades().find(p => p.id === id) ?? this.personalidadVacia;
  }

  eventToStr(event: any): string {
    if (typeof event === 'string') {
      return event;
    }
    if (event && event.target && event.target.value) {
      return event.target.value;
    }
    return '';
  }

  onSelecionarSeccion(seccion: string) {
    console.log(this.personalidadDiv)
    this.personalidadDiv = false;
    this.valoresDiv = false;
    this.emocionesDiv = false;
    this.miedosDiv = false;
    switch (seccion) {
      case 'personalidad':
        this.personalidadDiv = true;
        break;
      case 'valores':
        this.valoresDiv = true;
        break;
      case 'miedos':
        this.miedosDiv = true;
        break;
      case 'emociones':
        this.emocionesDiv = true;
        break;
    }
  }

}
