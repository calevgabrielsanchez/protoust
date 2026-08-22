import { Component, inject, Signal, signal } from '@angular/core';
import {
  faSave, faFileHalfDashed, faGlobe, faBook, faEarthAmericas, faScroll, faImage,
  faCircleInfo, faSquarePlus, faBaby, faDragon, faMeteor, faSkullCrossbones, faTrashCan, faPenFancy,
  faDownload, faUpload, faRefresh, faBrain, faBug, faUserSecret, faShrimp, faArrowsSpin, faEye, faBookOpen
} from '@fortawesome/free-solid-svg-icons';
import { TextPlusComponent } from '../text-plus.component/text-plus.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import {
  AfterViewInit,
  ElementRef,
  ViewChild
} from '@angular/core';


@Component({
  selector: 'app-creatividad.component',
  imports: [TextPlusComponent, FaIconComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './creatividad.component.html',
  styleUrl: './creatividad.component.css',
})
export class CreatividadComponent {

  camposSemanticos: FormGroup;
  ejercicio = [];
  descripcionEjercicioSeleccionado: string = "";
  descripcionArquetipoSeleccionado: string = "";

  http = inject(HttpClient);

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

  mostrarTextPlus: boolean = false;
  textoAEditar: string = "";

  palabras = signal<any[]>([]);
  datosConvertidos: any[] = [];

  ejercicios = signal<any[]>([]);
  arquetipos = signal<any[]>([]);

  historia: string[] = [];

  inputId: number = 0;

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
      varias: new FormControl(false)
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
    this.mostrarTextPlus = false;
    /* if (this.textPlusPromiseResolver) {
       this.textPlusPromiseResolver(resolvedValue);
       this.textPlusPromiseResolver = null;
     }*/
  }

  aceptar() {

    this.historia[this.inputId - 1] = this.textoAEditar;
    console.log(this.textoAEditar)
    this.mostrarTextPlus = false;
    /* const elementoTextarea = elementotareaSeleccionada();
 
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

  onClickMente() {
    window.location.href = '/mente';
  }

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

  creatividad: boolean = false;
  memoria: boolean = false;
  matematicas: boolean = false;
  dibujo: boolean = true;
  selectJuego(juego: string) {
    this.creatividad = false;
    this.memoria = false;
    this.matematicas = false;
    this.dibujo = false;
    switch (juego) {
      case 'creatividad':
        this.creatividad = true;
        break;
      case 'memoria':
        this.memoria = true;
        break;
      case 'matematicas':
        this.matematicas = true;
        break;
      case 'dibujo':
        this.dibujo = true;
        break;
    }
  }
  //-----------------------------------------------------Memoria-----------------------------------------------------
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
            (input as HTMLInputElement).value = palabrasAleatorias[i].todasPalabras;
            this.historia.push(palabrasAleatorias[i].todasPalabras);
            console.log(palabrasAleatorias[i].todasPalabras);
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
    this.mostrarTextPlus = true;
  }

  escribirTodaHistoria() {
    let texto = '';
    for (let i = 0; i < 20; i++) {
      texto = texto + '>----------------' + (i + 1) + '----------------<\n';
      texto = texto + this.historia[i] + "\n";
    }
    console.log(texto);
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
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

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

    const fontSize = 570;


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
        'bold 570px Arial';


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

}
