import { Component, inject, Signal, signal } from '@angular/core';
import {
  faSave, faFileHalfDashed, faGlobe, faBook, faEarthAmericas, faScroll, faImage,
  faCircleInfo, faSquarePlus, faBaby, faDragon, faMeteor, faSkullCrossbones, faTrashCan, faPenFancy,
  faDownload, faUpload, faRefresh, faBrain, faBug, faUserSecret, faShrimp, faArrowsSpin
} from '@fortawesome/free-solid-svg-icons';
import { TextPlusComponent } from '../text-plus.component/text-plus.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

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

  private http = inject(HttpClient);

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

  mostrarTextPlus: boolean = false;
  textoAEditar: string = "";

  palabras = signal<any[]>([]);
  datosConvertidos: any[] = [];

  ejercicios = signal<any[]>([]);
  arquetipos = signal<any[]>([]);

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

  ngOnInit(){
    this.obtenerEjercicio();
    this.obtenerArquetipo();
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
          listaPalabras.push(...this.obtenerElementosAleatorios(datos,numero));
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

  private convertirCsvAObjeto(texto: string): any[] {
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
  arquetipoSeleccionado.descripcion + "\nFrase: "+ 
  arquetipoSeleccionado.frase_tipica +"\nEjemplos: "+arquetipoSeleccionado.ejemplos;
  }

  onArquetipoAleatorio(){
    //generar un número aleatorio entre 0 y el tamaño del arreglo de arquetipos
    const indiceAleatorio = Math.floor(Math.random() * this.arquetipos().length);
    const arquetipoAleatorio = this.arquetipos()[indiceAleatorio];
    this.descripcionArquetipoSeleccionado = arquetipoAleatorio.categoria + "\n" + 
    arquetipoAleatorio.descripcion + "\nFrase: "+ 
    arquetipoAleatorio.frase_tipica +"\nEjemplos: "+arquetipoAleatorio.ejemplos;
    //seleccionar el arquetipo aleatorio en el select
    const selectElement = document.getElementById("arquetipo") as HTMLSelectElement;
    selectElement.value = arquetipoAleatorio.id.toString();
  }

}
