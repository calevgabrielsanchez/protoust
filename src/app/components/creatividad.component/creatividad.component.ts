import { Component, inject, Signal, signal } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import {
  faSave, faFileHalfDashed, faGlobe, faBook, faEarthAmericas, faScroll, faImage,
  faCircleInfo, faSquarePlus, faBaby, faDragon, faMeteor, faSkullCrossbones, faTrashCan,
  faPenFancy,
  faDownload, faUpload, faRefresh, faBrain, faBug, faUserSecret, faShrimp, faArrowsSpin,
  faEye, faFolderOpen,
  faBookOpen, faEraser, faTextHeight
} from '@fortawesome/free-solid-svg-icons';
import { TextPlusComponent } from '../text-plus.component/text-plus.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Memoria } from '../../models/memoria.modelo';
import { LocalCsvService } from '../../services/local-csv.service';

import {
  AfterViewInit,
  ElementRef,
  ViewChild
} from '@angular/core';
import { Dibujo } from '../../models/dibujo.model';
import { Creatividad } from '../../models/creatividad.modelo';


@Component({
  selector: 'app-creatividad.component',
  imports: [TextPlusComponent, FaIconComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './creatividad.component.html',
  styleUrl: './creatividad.component.css',
})
export class CreatividadComponent {

  camposSemanticos: FormGroup;
  controlesTienda: FormGroup;
  ejercicio = [];
  descripcionEjercicioSeleccionado: string = "";
  descripcionArquetipoSeleccionado: string = "";

  http = inject(HttpClient);
  localCsv = inject(LocalCsvService);
  cdr = inject(ChangeDetectorRef);
  memoria = {} as Memoria;
  dibujoModel = {} as Dibujo;
  creatividadModel = {} as Creatividad;

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
  faBrain = faBrain;
  faBug = faBug;
  faUserSecret = faUserSecret;
  faShrimp = faShrimp;
  faArrowsSpin = faArrowsSpin;
  faEye = faEye
  faBookOpen = faBookOpen;
  faEraser = faEraser;
  faTextHeight = faTextHeight;
  faFolderOpen = faFolderOpen;

  mostrarTextPlus = signal(false);
  textoAEditar: string = "";

  palabras = signal<any[]>([]);
  datosConvertidos: any[] = [];

  ejercicios = signal<any[]>([]);
  arquetipos = signal<any[]>([]);

  historia: string[] = [];

  inputId: number = 0;

  resultadoTienda: number = 0;
  operacionResultado: string = '';
  controlTextPlus: string = "";

  creatividad: boolean = true;
  memoriaB: boolean = false;
  matematicas: boolean = false;
  dibujo: boolean = false;
  //=========================================================
  //                FUNCIONES
  //=========================================================

  constructor() {
    this.camposSemanticos = new FormGroup({
      animales: new FormControl(false),
      adjetivos: new FormControl(false),
      hombre: new FormControl(false),
      lugares: new FormControl(false),
      mujer: new FormControl(false),
      oficios: new FormControl(false),
      pronombres: new FormControl(false),
      sustantivos: new FormControl(false),
      transporte: new FormControl(false),
      verbos: new FormControl(false),
      varias: new FormControl(false),
      todas: new FormControl(false)
    });

    this.controlesTienda = new FormGroup({
      decimal: new FormControl(false),
      tienda: new FormControl(false),
      suma: new FormControl(true),
      resta: new FormControl(false),
      multiplicacion: new FormControl(false),
      divicion: new FormControl(false),
      juegoSeleccionada: new FormControl('operaciones')
    });

  }

  ngOnInit() {
    this.obtenerEjercicio();
    this.obtenerArquetipo();
    //----------------Memoria---------------
    this.crearTablaMemoria();
    //Crear el memoria
    for (let i = 0; i < 20; i++) {
      this.historia.push('');
    }

  }

  cerrar() {
    this.closeTextPlus(this.textoAEditar);
  }

  closeTextPlus(resolvedValue: string) {
    this.mostrarTextPlus.set(false);
    /* if (this.textPlusPromiseResolver) {
       this.textPlusPromiseResolver(resolvedValue);
       this.textPlusPromiseResolver = null;
     }*/
  }

  
  aceptar() {
    switch (this.controlTextPlus) {
      case 'memoria':
        this.historia[this.inputId - 1] = this.textoAEditar;
        console.log(this.textoAEditar)
        this.mostrarTextPlus.set(false);
        break;
      case 'dibujo':
        this.dibujoModel.historia = this.textoAEditar;
        console.log(this.textoAEditar)
        this.mostrarTextPlus.set(false);
        break;
       case 'creatividad':
        this.creatividadModel.desarrollo = this.textoAEditar;
        console.log(this.textoAEditar)
        this.mostrarTextPlus.set(false);
        break; 
    }

  }

  abrirEditarText() {
    // this.textoAEditar = this.textareaSeleccionada()?.value || '';
    this.mostrarTextPlus.set(true);
    this.cdr.detectChanges();
  }

  onClickCaleVRije() {
    window.location.href = '/';
  }

  onClickMente() {
    window.location.href = '/mente';
  }
  //==========================================================
  //                       Ejercicios Creatividad
  //=========================================================
  onGenerarPalabras() {

    let numeroMsg = prompt("Ingrese el número de palabras a generar:", "5");
    let numero = parseInt(numeroMsg || '');

    const adjetivos = this.camposSemanticos.get('adjetivos')?.value;
    const animales = this.camposSemanticos.get('animales')?.value;
    const hombre = this.camposSemanticos.get('hombre')?.value;
    const lugares = this.camposSemanticos.get('lugares')?.value;
    const mujer = this.camposSemanticos.get('mujer')?.value;
    const oficios = this.camposSemanticos.get('oficios')?.value;
    const pronombres = this.camposSemanticos.get('pronombres')?.value;
    const sustantivos = this.camposSemanticos.get('sustantivos')?.value;
    const transporte = this.camposSemanticos.get('transporte')?.value;
    const verbos = this.camposSemanticos.get('verbos')?.value;
    const varias = this.camposSemanticos.get('varias')?.value;
    const todas = this.camposSemanticos.get('todas')?.value;

    let peticiones: any = {};

    // 2. Construyes dinámicamente las peticiones solo para los checkboxes que estén marcados (true)
    if (adjetivos) peticiones.adjetivos = this.http.get('/csv/adjetivos.csv', { responseType: 'text' });
    if (animales) peticiones.animales = this.http.get('/csv/animales.csv', { responseType: 'text' });
    if (hombre) peticiones.hombre = this.http.get('/csv/hombre.csv', { responseType: 'text' });
    if (lugares) peticiones.lugares = this.http.get('/csv/lugares.csv', { responseType: 'text' });
    if (mujer) peticiones.mujer = this.http.get('/csv/mujer.csv', { responseType: 'text' });
    if (oficios) peticiones.oficios = this.http.get('/csv/oficios.csv', { responseType: 'text' });
    if (pronombres) peticiones.pronombres = this.http.get('/csv/pronombres.csv', { responseType: 'text' });
    if (sustantivos) peticiones.sustantivos = this.http.get('/csv/sustantivos.csv', { responseType: 'text' });
    if (transporte) peticiones.transporte = this.http.get('/csv/transporte.csv', { responseType: 'text' });
    if (verbos) peticiones.verbos = this.http.get('/csv/verbos.csv', { responseType: 'text' });
    if (varias) peticiones.varias = this.http.get('/csv/varias.csv', { responseType: 'text' });
    if (todas) peticiones.todas = this.http.get('/csv/todasPalabras.csv', { responseType: 'text' });

    // Si ninguna casilla está seleccionada, vaciamos el signal y salimos
    if (Object.keys(peticiones).length === 0) {
      this.palabras.set([]);
      return;
    }

    // 3. forkJoin espera a que todas las peticiones activas respondan en paralelo
    forkJoin(peticiones).subscribe({
      next: (resultados: any) => {
        let listaPalabras: any[] = [];

        // Procesamos cada resultado si la petición fue realizada
        if (resultados.adjetivos) {
          const datos = this.convertirCsvAObjeto(resultados.adjetivos);
          listaPalabras.push(...this.obtenerElementosAleatorios(datos, numero));
        }
        if (resultados.animales) {
          const datos = this.convertirCsvAObjeto(resultados.animales);
          listaPalabras.push(...this.obtenerElementosAleatorios(datos, numero));
        }
        if (resultados.hombre) {
          const datos = this.convertirCsvAObjeto(resultados.hombre);
          listaPalabras.push(...this.obtenerElementosAleatorios(datos, numero));
        }
        if (resultados.lugares) {
          const datos = this.convertirCsvAObjeto(resultados.lugares);
          listaPalabras.push(...this.obtenerElementosAleatorios(datos, numero));
        }
        if (resultados.mujer) {
          const datos = this.convertirCsvAObjeto(resultados.mujer);
          listaPalabras.push(...this.obtenerElementosAleatorios(datos, numero));
        }
        if (resultados.oficios) {
          const datos = this.convertirCsvAObjeto(resultados.oficios);
          listaPalabras.push(...this.obtenerElementosAleatorios(datos, numero));
        }
        if (resultados.pronombres) {
          const datos = this.convertirCsvAObjeto(resultados.pronombres);
          listaPalabras.push(...this.obtenerElementosAleatorios(datos, numero));
        }
        if (resultados.sustantivos) {
          const datos = this.convertirCsvAObjeto(resultados.sustantivos);
          listaPalabras.push(...this.obtenerElementosAleatorios(datos, numero));
        }
        if (resultados.transporte) {
          const datos = this.convertirCsvAObjeto(resultados.transporte);
          listaPalabras.push(...this.obtenerElementosAleatorios(datos, numero));
        }
        if (resultados.verbos) {
          const datos = this.convertirCsvAObjeto(resultados.verbos);
          listaPalabras.push(...this.obtenerElementosAleatorios(datos, numero));
        }
        if (resultados.varias) {
          const datos = this.convertirCsvAObjeto(resultados.varias);
          listaPalabras.push(...this.obtenerElementosAleatorios(datos, numero));
        }

        if (resultados.todas) {
          const datos = this.convertirCsvAObjeto(resultados.todas);
          listaPalabras.push(...this.obtenerElementosAleatorios(datos, numero));
        }

        // 4. Actualizamos el Signal con la lista completa de elementos planos
        this.palabras.set(listaPalabras);
        console.log('Signal actualizado:', this.palabras());
      },
      error: (err) => {
        console.error('Error al cargar los archivos CSV:', err);
      }
    });
  }

  convertirCsvAObjeto(texto: string): any[] {
    // Separar por saltos de línea (\r\n o \n)
    const lineas = texto.trim().split(/\r?\n/);
    if (lineas.length === 0) return [];

    // La primera línea contiene los encabezados (propiedades del objeto)
    const encabezados = lineas[0].split(',').map(h => h.trim());
    const resultados: any[] = [];

    // Recorrer el resto de las líneas (los datos)
    for (let i = 1; i < lineas.length; i++) {
      const valores = lineas[i].split(',').map(v => v.trim());
      const objetoTemporal: any = {};

      encabezados.forEach((encabezado, index) => {
        objetoTemporal[encabezado] = valores[index] || '';
      });

      resultados.push(objetoTemporal);
    }

    return resultados;
  }

  obtenerElementosAleatorios(datos: any[], n: number): any[] {
    // Hacemos una copia del arreglo original para no mutarlo directamente
    const copia = [...datos];

    // Algoritmo de mezcla de Fisher-Yates
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }

    // Devolvemos la cantidad 'n' solicitada (limitada al tamaño total del arreglo)
    return copia.slice(0, n);
  }

  obtenerEjercicio() {
    this.http.get('/json/ejerciciosCreatividad.json', { responseType: 'text' }).subscribe({
      next: (jsonText) => {
        const ejercicios = JSON.parse(jsonText);
        this.ejercicios.set(ejercicios);
      },
      error: (err) => {
        console.error('Error al leer el JSON ejercicios:', err);
      }
    });
  }

  obtenerArquetipo() {
    this.http.get('/json/arquetipos.json', { responseType: 'text' }).subscribe({
      next: (jsonText) => {
        const arquetipos = JSON.parse(jsonText);
        this.arquetipos.set(arquetipos);
      },
      error: (err) => {
        console.error('Error al leer el JSON arquetipos:', err);
      }
    });
  }

  onSelectEjercicio($event: any) {
    const idSeleccionado = $event.target.value;
    const ejercicioSeleccionado = this.ejercicios().find(
      (item) => item.id == idSeleccionado
    );
    this.descripcionEjercicioSeleccionado = ejercicioSeleccionado.descripcion;
  }

  onSelectArquetipo($event: any) {
    const idSeleccionado = $event.target.value;
    const arquetipoSeleccionado = this.arquetipos().find(
      (item) => item.id == idSeleccionado
    );
    console.log(arquetipoSeleccionado);
    this.descripcionArquetipoSeleccionado = arquetipoSeleccionado.categoria + "\n" +
      arquetipoSeleccionado.descripcion + "\nFrase: " +
      arquetipoSeleccionado.frase_tipica + "\nEjemplos: " + arquetipoSeleccionado.ejemplos;
  }

  onArquetipoAleatorio() {
    //generar un número aleatorio entre 0 y el tamaño del arreglo de arquetipos
    const indiceAleatorio = Math.floor(Math.random() * this.arquetipos().length);
    const arquetipoAleatorio = this.arquetipos()[indiceAleatorio];
    this.descripcionArquetipoSeleccionado = arquetipoAleatorio.categoria + "\n" +
      arquetipoAleatorio.descripcion + "\nFrase: " +
      arquetipoAleatorio.frase_tipica + "\nEjemplos: " + arquetipoAleatorio.ejemplos;
    //seleccionar el arquetipo aleatorio en el select
    const selectElement = document.getElementById("arquetipo") as HTMLSelectElement;
    selectElement.value = arquetipoAleatorio.id.toString();
  }

  selectJuego(juego: string) {
    this.creatividad = false;
    this.memoriaB = false;
    this.matematicas = false;
    this.dibujo = false;
    switch (juego) {
      case 'creatividad':
        this.creatividad = true;
        break;
      case 'memoria':
        this.memoriaB = true;
        break;
      case 'matematicas':
        this.matematicas = true;
        break;
      case 'dibujo':
        this.dibujo = true;
        break;
    }
  }

  onEscribirEjercicioCreatividad() {
    this.controlTextPlus='creatividad';
    this.mostrarTextPlus.set(true);
    let ejercicioTextInput = document.getElementById("ejercicio") as HTMLSelectElement;
    let titulo = ejercicioTextInput.options[ejercicioTextInput.selectedIndex].text;
    let arquetipoTextInput = document.getElementById("arquetipo") as HTMLSelectElement;
    let arquetipo = arquetipoTextInput.options[arquetipoTextInput.selectedIndex].text;
    let palabras = this.palabras().map(p => p.palabra).join("\n");
    this.textoAEditar = "#" + titulo + "\n" + this.descripcionEjercicioSeleccionado + "\n" +
      "#" + arquetipo + "\n" + this.descripcionArquetipoSeleccionado + "\n" +
      "#Palabras" + "\n" + palabras + "\n ----------------------Empieza----------------------";
    console.log(this.textoAEditar);
  }

  onGuardarCreatividad() {
    const nombre = prompt('Ponle un nombre a esta creación:')?.trim();

    if (!nombre) {
      console.error('❌ Se canceló el guardado: no se proporcionó un nombre.');
      return;
    }

    this.creatividadModel = {
      id: nombre + '_' + this.generarAleatorioId(),
      nombre,
      desarrollo: this.textoAEditar,
      updatedAt: Date.now(),
      _deleted: false
    };

    this.localCsv.loadTable<Creatividad>('creatividad').then(existentes => {
      const filas = [...existentes.filter(c => c.id !== this.creatividadModel.id), this.creatividadModel];
      return this.localCsv.saveTable('creatividad', filas).then(() => {
        console.log('📦 Creatividad guardada en local:', this.creatividadModel);
        alert('✅ Creatividad guardada correctamente.');
      });
    }).catch(err => {
      console.error('❌ Error al guardar la creatividad:', err);
    });
  }

  async onAbrirCreatividad() {
    const creaciones = await this.localCsv.loadTable<Creatividad>('creatividad');

    if (creaciones.length === 0) {
      alert('No hay creaciones guardadas.');
      return;
    }

    const lista = creaciones.map((creacion, i) => `${i + 1}.- ${creacion.nombre}`).join('\n');
    const indice = prompt('¿Qué creación quieres abrir?\n\n' + lista + '\n\nEscribe el número:')?.trim();

    if (!indice) {
      return;
    }

    const numero = parseInt(indice, 10);
    if (isNaN(numero) || numero < 1 || numero > creaciones.length) {
      alert('Índice inválido.');
      return;
    }

    const seleccionada = creaciones[numero - 1];
    this.textoAEditar = seleccionada.desarrollo;
    this.abrirEditarText();

    console.log('📖 Creatividad abierta:', seleccionada);
  }

  //=============================================================
  //---------------------------Memoria-------------------------------
  //===============================================================
  tablaMemoria = signal<any[]>([]);
  crearTablaMemoria() {
    let peticionesMemori: any = {};
    peticionesMemori.tablaMemoria = this.http.get('/csv/memoria.csv', { responseType: 'text' });
    forkJoin(peticionesMemori).subscribe({
      next: (resultados: any) => {
        if (resultados.tablaMemoria) {
          const datos = this.convertirCsvAObjeto(resultados.tablaMemoria);
          this.tablaMemoria.set(datos);
          console.log(datos)
        }
      },
      error: (err) => {
        console.error('Error al cargar el archivo CSV de memoria:', err);
      }
    });
  }
  ocultarPalabra($event: any) {
    const elemento = $event.currentTarget as HTMLElement;
    const id = elemento.getAttribute('data-id');

    console.log(id);
    const inputText = document.getElementById(id || '');

    if (inputText) {
      inputText.classList.toggle('oculto-text');
    }

  }

  alternarPalabra() {
    this.http.get('/csv/todasPalabras.csv', { responseType: 'text' })
      .subscribe({
        next: (resultado) => {

          const datos = this.convertirCsvAObjeto(resultado);
          const palabrasAleatorias = this.obtenerElementosAleatorios(datos, 20)
          const inputs = document.querySelectorAll('.input-text');

          this.historia = [];

          inputs.forEach((input, i) => {
            (input as HTMLInputElement).value = palabrasAleatorias[i].palabra;
            this.historia.push(palabrasAleatorias[i].palabra);
            console.log(palabrasAleatorias[i].palabra);
          });
        },
        error: (err) => {
          console.error('Error al cargar el archivo CSV:', err);
        }
      });
  }

  ocultarTodasPalabra() {
    const inputs = document.querySelectorAll('.input-text');
    inputs.forEach((input, i) => {
      // (input as HTMLInputElement).value = palabrasAleatorias[i].todasPalabras;
      input.classList.toggle('oculto-text');
    });
  }

  escribirHistoria($event: any) {
    const elemento = $event.currentTarget as HTMLElement;
    const id = elemento.getAttribute('data-id');
    const numeroId = id?.substring(4, 5);
    this.inputId = parseInt(numeroId || '')
    const inputText = document.getElementById(id || '');
    if ((this.historia[this.inputId - 1] != (inputText as HTMLInputElement).value) && (this.historia[this.inputId - 1] != '')) {
      this.textoAEditar = this.historia[this.inputId - 1];
    } else {
      this.textoAEditar = (inputText as HTMLInputElement).value
    }
    this.controlTextPlus='memoria';
    this.mostrarTextPlus.set(true);
  }

  escribirTodaHistoria() {
    let texto = '';
    for (let i = 0; i < 20; i++) {
      texto = texto + '>----------------' + (i + 1) + '----------------<\n';
      texto = texto + this.historia[i] + "\n";
    }
    this.controlTextPlus='memoria';
    this.textoAEditar = texto;
    this.mostrarTextPlus.set(true);
  }

  guardarMemoria() {
    const nombre = prompt('Ponle un nombre a esta memoria:')?.trim();

    if (!nombre) {
      console.error('❌ Se canceló el guardado: no se proporcionó un nombre.');
      return;
    }

    const aleatorio = this.generarAleatorioId();
    this.memoria.id = nombre + '_' + aleatorio;

    const palabras = ['uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez',
      'once', 'doce', 'trece', 'catorce', 'quince', 'dieciseis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte'];

    palabras.forEach((nombreCampo, indice) => {
      const inputText = document.getElementById('text' + (indice + 1)) as HTMLInputElement;
      const palabra = inputText?.value ?? '';
      const descripcion = this.historia[indice] ?? '';

      (this.memoria as any)[nombreCampo + 'Palabra'] = palabra;
      (this.memoria as any)[nombreCampo + 'Descripcion'] = descripcion;
    });

    this.memoria.updatedAt = Date.now();
    this.memoria._deleted = false;

    this.localCsv.loadTable<Memoria>('memoria').then(existentes => {
      const filas = [...existentes, this.memoria as unknown as Memoria];
      return this.localCsv.saveTable('memoria', filas).then(() => {
        console.log('📦 Memoria guardada en local:', this.memoria);
        alert('✅ Memoria guardada correctamente.');
      });
    }).catch(err => {
      console.error('❌ Error al guardar la memoria:', err);
    });
  }

  async abrirMemoria() {
    const memorias = await this.localCsv.loadTable<Memoria>('memoria');

    if (memorias.length === 0) {
      alert('No hay memorias guardadas.');
      return;
    }

    const lista = memorias.map((memoria, i) => `${i + 1}.- ${memoria.id}`).join('\n');
    const indice = prompt('¿Qué memoria quieres abrir?\n\n' + lista + '\n\nEscribe el número:')?.trim();

    if (!indice) {
      return;
    }

    const numero = parseInt(indice, 10);
    if (isNaN(numero) || numero < 1 || numero > memorias.length) {
      alert('Índice inválido.');
      return;
    }

    const memoria = memorias[numero - 1];
    const palabras = ['uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez',
      'once', 'doce', 'trece', 'catorce', 'quince', 'dieciseis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte'];

    palabras.forEach((nombreCampo, i) => {
      const inputText = document.getElementById('text' + (i + 1)) as HTMLInputElement;
      if (inputText) {
        inputText.value = (memoria as any)[nombreCampo + 'Palabra'] ?? '';
      }
      this.historia[i] = (memoria as any)[nombreCampo + 'Descripcion'] ?? '';
    });

    console.log('📖 Memoria abierta:', memoria);
  }
  //---------------------------------------------------dibujo ------------------------------

  // ============================================================
  // CANVAS
  // ============================================================

  @ViewChild('canvas')
  canvas?: ElementRef<HTMLCanvasElement>;

  ctx?: CanvasRenderingContext2D;

  isDrawing = false;


  // ============================================================
  // CARACTERES ALEATORIOS
  // ============================================================

  randomCharacter = '';

  characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!"#$%&/()=?¡¿*+{}-_.:,;<>|@';

  // ============================================================
  // OBTENER CANVAS
  // ============================================================

  getCanvasElement(): HTMLCanvasElement | null {

    /*
     * Primero intentamos utilizar @ViewChild si existe.
     */

    if (this.canvas?.nativeElement) {
      return this.canvas.nativeElement;
    }


    /*
     * Si @ViewChild todavía no está disponible,
     * buscamos el canvas por su clase.
     */

    const element = document.querySelector(
      'canvas.canvas-dibujo'
    );


    if (element instanceof HTMLCanvasElement) {
      return element;
    }


    console.error(
      'No se encontró el elemento canvas.'
    );

    return null;
  }


  // ============================================================
  // OBTENER CANVAS DESDE EL EVENTO
  // ============================================================

  getCanvasFromEvent(
    event: PointerEvent
  ): HTMLCanvasElement | null {

    const target = event.currentTarget;


    if (target instanceof HTMLCanvasElement) {
      return target;
    }


    return null;
  }


  // ============================================================
  // CONFIGURAR CANVAS
  // ============================================================

  configureCanvas(
    context: CanvasRenderingContext2D
  ): void {

    context.lineWidth = 5;

    context.lineCap = 'round';

    context.lineJoin = 'round';

    context.strokeStyle = '#000000';
  }


  // ============================================================
  // GENERAR CARÁCTER ALEATORIO
  // ============================================================

  generateRandomCharacter(): void {

    const index = Math.floor(
      Math.random() * this.characters.length
    );


    this.randomCharacter =
      this.characters[index];


    /*
     * Dibujamos el nuevo carácter.
     */

    this.drawCharacter();
  }


  // ============================================================
  // DIBUJAR CARÁCTER
  // ============================================================

  drawCharacter(): void {

    const canvas =
      this.getCanvasElement();


    if (!canvas) {
      console.error(
        'No se encontró el canvas para dibujar el carácter.'
      );

      return;
    }


    const context =
      canvas.getContext('2d');


    if (!context) {

      console.error(
        'No se pudo obtener el contexto 2D del canvas.'
      );

      return;
    }


    /*
     * Guardamos el contexto.
     */

    this.ctx = context;


    /*
     * Limpiar canvas.
     */

    context.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );


    // ========================================================
    // CARÁCTER
    // ========================================================

    /*
     * Canvas:
     *
     * 500 x 800
     *
     * Área total:
     *
     * 400,000 px²
     *
     * El tamaño visual del carácter se aproxima
     * al 58% del área.
     */

    const fontSize = 450;


    context.save();


    context.font =
      `bold ${fontSize}px Arial`;


    context.textAlign =
      'center';


    context.textBaseline =
      'middle';


    context.fillStyle =
      '#000000';


    /*
     * Dibujar carácter exactamente
     * en el centro.
     */

    context.fillText(
      this.randomCharacter,
      canvas.width / 2,
      canvas.height / 2
    );


    context.restore();


    /*
     * Volver a configurar el pincel
     * para que el usuario pueda dibujar.
     */

    this.configureCanvas(context);
  }


  // ============================================================
  // COMENZAR DIBUJO
  // ============================================================

  startDrawing(
    event: PointerEvent
  ): void {

    event.preventDefault();


    /*
     * Obtenemos directamente el canvas
     * que recibió el evento.
     *
     * Esto evita el problema:
     *
     * this.canvas.nativeElement
     *
     * undefined.
     */

    const canvas =
      this.getCanvasFromEvent(event);


    if (!canvas) {

      console.error(
        'El evento no proviene de un canvas.'
      );

      return;
    }


    /*
     * Obtener contexto.
     */

    const context =
      canvas.getContext('2d');


    if (!context) {

      console.error(
        'No se pudo obtener el contexto 2D.'
      );

      return;
    }


    this.ctx =
      context;


    this.isDrawing =
      true;


    /*
     * Configuración del pincel.
     */

    this.configureCanvas(
      context
    );


    /*
     * Obtener posición del dedo
     * o mouse.
     */

    const position =
      this.getPointerPosition(
        event,
        canvas
      );


    /*
     * Comenzar trazo.
     */

    context.beginPath();


    context.moveTo(
      position.x,
      position.y
    );


    /*
     * Capturar el puntero.
     *
     * Esto mejora el dibujo cuando
     * el dedo/mouse sale momentáneamente
     * del canvas.
     */

    try {

      canvas.setPointerCapture(
        event.pointerId
      );

    } catch {

      // Algunos dispositivos pueden no soportarlo.
    }
  }


  // ============================================================
  // DIBUJAR
  // ============================================================

  draw(
    event: PointerEvent
  ): void {

    if (
      !this.isDrawing ||
      !this.ctx
    ) {

      return;
    }


    event.preventDefault();


    const canvas =
      this.getCanvasFromEvent(event);


    if (!canvas) {
      return;
    }


    const position =
      this.getPointerPosition(
        event,
        canvas
      );


    /*
     * Dibujar línea.
     */

    this.ctx.lineTo(
      position.x,
      position.y
    );


    this.ctx.stroke();
  }


  // ============================================================
  // FINALIZAR DIBUJO
  // ============================================================

  stopDrawing(
    event?: PointerEvent
  ): void {

    if (!this.isDrawing) {
      return;
    }


    this.isDrawing =
      false;


    /*
     * Cerrar el trazo solamente
     * si existe contexto.
     */

    if (this.ctx) {

      this.ctx.closePath();
    }


    /*
     * Liberar el puntero.
     */

    if (
      event &&
      event.currentTarget instanceof HTMLCanvasElement
    ) {

      const canvas =
        event.currentTarget;


      try {

        canvas.releasePointerCapture(
          event.pointerId
        );

      } catch {

        // El puntero puede ya estar liberado.
      }
    }
  }


  // ============================================================
  // POSICIÓN DEL PUNTERO
  // ============================================================

  getPointerPosition(
    event: PointerEvent,
    canvas: HTMLCanvasElement
  ): {
    x: number;
    y: number;
  } {

    const rect =
      canvas.getBoundingClientRect();


    /*
     * Escalado.
     *
     * Esto permite que funcione correctamente
     * aunque el canvas visualmente tenga
     * un tamaño diferente al interno.
     */

    const scaleX =
      canvas.width / rect.width;


    const scaleY =
      canvas.height / rect.height;


    return {

      x:
        (event.clientX - rect.left)
        * scaleX,

      y:
        (event.clientY - rect.top)
        * scaleY
    };
  }


  // ============================================================
  // LIMPIAR DIBUJO
  // ============================================================

  clearDrawing(): void {

    const canvas =
      this.getCanvasElement();


    if (!canvas) {
      return;
    }


    const context =
      canvas.getContext('2d');


    if (!context) {
      return;
    }


    /*
     * Limpiar todo.
     */

    context.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );


    /*
     * Volver a dibujar el carácter.
     */

    if (this.randomCharacter) {

      context.save();


      context.font =
        'bold 450px Arial';


      context.textAlign =
        'center';


      context.textBaseline =
        'middle';


      context.fillStyle =
        '#000000';


      context.fillText(
        this.randomCharacter,
        canvas.width / 2,
        canvas.height / 2
      );


      context.restore();


      /*
       * Restaurar configuración del pincel.
       */

      this.configureCanvas(
        context
      );
    }
  }


  // ============================================================
  // NUEVO CARÁCTER
  // ============================================================

  nuevoCaracter(): void {

    this.generateRandomCharacter();
  }

  // ============================================================
  // GUARDAR / ABRIR DIBUJO
  // ============================================================

  guardarDibujo() {
    const canvas = this.getCanvasElement();
    if (!canvas) {
      console.error('No se encontró el canvas para guardar.');
      return;
    }
    const nombre = prompt('Ponle un nombre a este dibujo:')?.trim();

    if (!nombre) {
      console.error('❌ Se canceló el guardado: no se proporcionó un nombre.');
      return;
    }

    const aleatorio = this.generarAleatorioId();

    this.dibujoModel.id = nombre + '_' + aleatorio;
    this.dibujoModel.dibujo = canvas.toDataURL('image/png');
    this.dibujoModel.updatedAt = Date.now();
    this.dibujoModel._deleted = false;

    this.localCsv.loadTable<Dibujo>('dibujo').then(existentes => {
      const filas = [...existentes.filter(d => d.id !== this.dibujoModel.id), this.dibujoModel];
      return this.localCsv.saveTable('dibujo', filas).then(() => {
        console.log('📦 Dibujo guardado en local:', this.dibujoModel);
        alert('✅ Dibujo guardado correctamente.');
      });
    }).catch(err => {
      console.error('❌ Error al guardar el dibujo:', err);
    });
  }

  async abrirDibujo() {
    const dibujos = await this.localCsv.loadTable<Dibujo>('dibujo');

    if (dibujos.length === 0) {
      alert('No hay dibujos guardados.');
      return;
    }

    const lista = dibujos.map((dibujo, i) => `${i + 1}.- ${dibujo.id}`).join('\n');
    const indice = prompt('¿Qué dibujo quieres abrir?\n\n' + lista + '\n\nEscribe el número:')?.trim();

    if (!indice) {
      return;
    }

    const numero = parseInt(indice, 10);
    if (isNaN(numero) || numero < 1 || numero > dibujos.length) {
      alert('Índice inválido.');
      return;
    }

    const seleccionado = dibujos[numero - 1];
    this.dibujoModel = { ...seleccionado };

    const canvas = this.getCanvasElement();
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const imagen = new Image();
    imagen.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(imagen, 0, 0, canvas.width, canvas.height);
      this.configureCanvas(ctx);
    };
    imagen.src = seleccionado.dibujo;

    console.log('📖 Dibujo abierto:', seleccionado);
  }

  // ============================================================
  // MATEMATICAS
  // ============================================================

  generarJuegMatematicTienda() {
    const decimal = this.controlesTienda.get('decimal')?.value;
    const tienda = this.controlesTienda.get('tienda')?.value;
    const suma = this.controlesTienda.get('suma')?.value;
    const resta = this.controlesTienda.get('resta')?.value;
    const multiplicacion = this.controlesTienda.get('multiplicacion')?.value;
    const divicion = this.controlesTienda.get('divicion')?.value;

    let operaciones = ['+', '-', '*', '/'];
    let aleatorioOperaciones = []

    if (suma) { aleatorioOperaciones.push(0); }
    if (resta) aleatorioOperaciones.push(1);
    if (multiplicacion) aleatorioOperaciones.push(2);
    if (divicion) aleatorioOperaciones.push(3);
    const indiceAleatorio = Math.floor(Math.random() * aleatorioOperaciones.length);
    const valorAleatorio = aleatorioOperaciones[indiceAleatorio];

    const operacion = operaciones[valorAleatorio];

    let numero1 = 0;
    let numero2 = 0;
    let resultado = 0;
    if (decimal) {
      const numeroAleatorio: number = Number((Math.random() * (99.9 - 10.0) + 10.0).toFixed(1));
      numero1 = tienda ? this.resultadoTienda : numeroAleatorio;
      const numeroAleatorio2: number = Number((Math.random() * (99.9 - 10.0) + 10.0).toFixed(1));
      numero2 = numeroAleatorio2;
    } else {
      const numeroAleatorio3: number = Math.floor(Math.random() * 99) + 1;
      numero1 = tienda ? this.resultadoTienda : numeroAleatorio3;
      const numeroAleatorio4: number = Math.floor(Math.random() * 99) + 1;
      numero2 = numeroAleatorio4;
      console.log(numero1, numero2)
    }

    switch (operacion) {
      case '+':
        resultado = numero1 + numero2
        break;
      case '-':
        resultado = numero1 - numero2
        break;
      case '*':
        resultado = numero1 * numero2
        break;
      case '/':
        resultado = numero1 / numero2
        break;
    }
    this.resultadoTienda = resultado;

    const inputText1 = document.getElementById('numero1');
    (inputText1 as HTMLInputElement).value = numero1.toString();
    const inputText2 = document.getElementById('numero2');
    (inputText2 as HTMLInputElement).value = numero2.toString();
    const operacionText = document.getElementById('operacion');
    (operacionText as HTMLInputElement).value = operacion;
    const resultadoText = document.getElementById('resultado');
    (resultadoText as HTMLInputElement).value = '';
  }

  mostrarResultado() {
    alert(this.resultadoTienda);
  }

  onEnterResultadoTienda() {
    const resultadoText = document.getElementById('resultado');
    const resultado = (resultadoText as HTMLInputElement).value;
    if (parseFloat(resultado) == this.resultadoTienda || this.operacionResultado == resultado) {
      (resultadoText as HTMLInputElement).value = '';
    } else {
      alert("Te fallo amigo, vuelve a intentarlo. ntp.");
      (resultadoText as HTMLInputElement).value = '';
    }

  }
  generarJuegMatematicPorcentaje() {
    const decimal = this.controlesTienda.get('decimal')?.value;

    let numero1 = 0;
    let numero2 = 0;
    let resultado = 0;
    if (decimal) {
      const numeroAleatorio: number = Number((Math.random() * (99.9 - 10.0) + 10.0).toFixed(1));
      numero1 = numeroAleatorio;
      const numeroAleatorio2: number = Math.floor(Math.random() * 10) + 1;
      numero2 = numeroAleatorio2;
    } else {
      const numeroAleatorio3: number = Math.floor(Math.random() * 99) + 1;
      numero1 = numeroAleatorio3;
      const numeroAleatorio4: number = Math.floor(Math.random() * 10) + 1;
      numero2 = numeroAleatorio4;
    }

    resultado = (numero2 / 100) * numero1;

    const inputText1 = document.getElementById('numero1');
    (inputText1 as HTMLInputElement).value = numero2.toString();
    const inputText2 = document.getElementById('numero2');
    (inputText2 as HTMLInputElement).value = numero1.toString();
    const operacionText = document.getElementById('operacion');
    (operacionText as HTMLInputElement).value = '%';
    const resultadoText = document.getElementById('resultado');
    (resultadoText as HTMLInputElement).value = '';

    this.resultadoTienda = parseFloat((resultado).toFixed(1));
  }

  generarJuegMatematicRaiz() {
    const numeroAleatorio3: number = Math.floor(Math.random() * 99) + 1;
    const resultado = Math.sqrt(numeroAleatorio3);
    const inputText1 = document.getElementById('numero1');
    (inputText1 as HTMLInputElement).value = numeroAleatorio3.toString();
    const operacionText = document.getElementById('operacion');
    (operacionText as HTMLInputElement).value = 'Raiz';
    const inputText2 = document.getElementById('numero2');
    (inputText2 as HTMLInputElement).value = '';
    this.resultadoTienda = parseFloat((resultado).toFixed(1));
    const resultadoText = document.getElementById('resultado');
    (resultadoText as HTMLInputElement).value = '';
  }

  generarJuegMatematicCompletar() {
    const decimal = this.controlesTienda.get('decimal')?.value;
    const tienda = this.controlesTienda.get('tienda')?.value;
    const suma = this.controlesTienda.get('suma')?.value;
    const resta = this.controlesTienda.get('resta')?.value;
    const multiplicacion = this.controlesTienda.get('multiplicacion')?.value;
    const divicion = this.controlesTienda.get('divicion')?.value;

    let operaciones = ['+', '-', '*', '/'];
    let aleatorioOperaciones = []

    if (suma) { aleatorioOperaciones.push(0); }
    if (resta) aleatorioOperaciones.push(1);
    if (multiplicacion) aleatorioOperaciones.push(2);
    if (divicion) aleatorioOperaciones.push(3);
    const indiceAleatorio = Math.floor(Math.random() * aleatorioOperaciones.length);
    const valorAleatorio = aleatorioOperaciones[indiceAleatorio];

    const operacion = operaciones[valorAleatorio];

    let numero1 = 0;
    let numero2 = 0;
    let resultado = 0;
    if (decimal) {
      const numeroAleatorio: number = Number((Math.random() * (99.9 - 10.0) + 10.0).toFixed(1));
      numero1 = tienda ? this.resultadoTienda : numeroAleatorio;
      const numeroAleatorio2: number = Number((Math.random() * (99.9 - 10.0) + 10.0).toFixed(1));
      numero2 = numeroAleatorio2;
    } else {
      const numeroAleatorio3: number = Math.floor(Math.random() * 99) + 1;
      numero1 = tienda ? this.resultadoTienda : numeroAleatorio3;
      const numeroAleatorio4: number = Math.floor(Math.random() * 99) + 1;
      numero2 = numeroAleatorio4;
      console.log(numero1, numero2)
    }

    switch (operacion) {
      case '+':
        resultado = numero1 + numero2
        break;
      case '-':
        resultado = numero1 - numero2
        break;
      case '*':
        resultado = numero1 * numero2
        break;
      case '/':
        resultado = numero1 / numero2
        break;
    }
    this.resultadoTienda = -1;
    this.operacionResultado = operacion;

    const inputText1 = document.getElementById('numero1');
    (inputText1 as HTMLInputElement).value = numero1.toString();
    const inputText2 = document.getElementById('numero2');
    (inputText2 as HTMLInputElement).value = resultado.toString();
    const operacionText = document.getElementById('operacion');
    (operacionText as HTMLInputElement).value = numero2.toString();
    const resultadoText = document.getElementById('resultado');
    //(resultadoText as HTMLInputElement).value = ;
  }

  escribirHistoriaDibujo() {
    this.textoAEditar = this.dibujoModel.historia;
    this.controlTextPlus='dibujo';
    this.mostrarTextPlus.set(true);
  }

  //-===========================================================
  //Matematicas
  //============================================================

  generarJuegMatematic() {
    const operacionElegida = this.controlesTienda.get('juegoSeleccionada')?.value;
    console.log(operacionElegida)
    switch (operacionElegida) {
      case 'operaciones':
        this.generarJuegMatematicTienda();
        break;
      case 'raiz':
        this.generarJuegMatematicRaiz();
        break;
      case 'porcentaje':
        this.generarJuegMatematicPorcentaje();
        break;
      case 'completar':
        this.generarJuegMatematicCompletar();
        break;
    }
  }

  generarAleatorioId():string{
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789';
    const aleatorio = Array.from(
      { length: 3 },
      () => caracteres[Math.floor(Math.random() * caracteres.length)]
    ).join('');
    return aleatorio;
  }
}
