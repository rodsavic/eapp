import { Dialog } from '@angular/cdk/dialog';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable, forkJoin, map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PalabraService } from 'src/app/services/palabra.service';
import { PageEvent } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { WordCreateComponent } from './word-create/word-create.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { format, parse, isDate, isValid } from 'date-fns';
import { WordUpdateComponent } from './word-update/word-update.component';
import { SignificadoService } from 'src/app/services/significado.service';
import { TipoService } from 'src/app/services/tipo.service';
import { Tipo } from 'src/app/models/tipo.model';
import { PhraseCreateComponent } from './phrase-create/phrase-create.component';
import { SentenceComponent } from '../sentence/sentence.component';
import { Word } from 'src/app/models/word.model';
import { SentenceService } from 'src/app/services/sentence.service';

export interface DialogData {
  contenido: string;
  dificultad: string;
  aprendido: boolean;
  codTipo: string;
  idCategoria: number;
}

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  //styleUrls: ['./word.component.css']
})
export class WordComponent implements OnInit {

  words: Word[] = [];
  data: DialogData = {
    contenido: '',
    dificultad: '',
    aprendido: false,
    codTipo: '',
    idCategoria: 1,
  };

  filter: any = {
    word: '',
    level: '',
    learned: '',
    codTipo: '',
    startDate: null,
    endDate: null,
    idCategoria: null
  };

  tipoOptions: Tipo[];
  displayedWordsWithTypes: any[] = [];
  dificultadOptions: string[] = ['Easy', 'Medium', 'Hard'];
  estadoOptions: string[] = ['Yes', 'No'];
  categoriaOptions: any[] = [
  {id: 1, descripcion: 'Palabra'},
  {id: 2, descripcion: 'Frase'}
];
  selectedWord: any;
  significadosIds: any;

  length = 100;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  currentPage = 0;
  pageIndex: any;
  countG = 5;
  pageG = 0;
  displayedWords: any[] = [];

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private palabraService: PalabraService,
    private snack: MatSnackBar,
    private significadoService: SignificadoService,
    private tipoService: TipoService,
    private sentenceService: SentenceService
  ) { }

  ngOnInit(): void {
    this.getInitialWords();
    this.loadTipos();
  }

  getInitialWords() {
    this.palabraService.getPalabra().subscribe((words: any[]) => {
      this.words = words;

      let requests = words.map(word => {
        return this.tipoService.getTipoByCod(word.codTipo).pipe(
          map((tipo: any) => {
            return { ...word, tipoDescripcion: tipo.descripcion };
          })
        );
      });

      forkJoin(requests).subscribe((results: any[]) => {
        this.displayedWordsWithTypes = results.slice(0, this.pageSize);
      });
    });


  }


  deleteWord(word: any): void {
    // Obtén el ID de la palabra seleccionada.
    const palabraId = word.idPalabraFrase;
    
    // Definición de la función para eliminar significados.
    const deleteSignificados = () => {
      // Se retorna una nueva Promesa.
      return new Promise<void>((resolve, reject) => {
        // Obtén todos los significados asociados a la palabra.
        this.significadoService.getSignificadosByPalabraId(palabraId)
          .subscribe((significados: any[]) => {
            // Si no hay significados asociados, resuelve la Promesa inmediatamente.
            if (significados.length === 0) return resolve();
            
            // Inicializa el contador de significados eliminados.
            let deletedCount = 0;
            // Itera sobre cada significado obtenido.
            for (const significado of significados) {
              // Elimina cada significado individualmente.
              this.significadoService.eliminarSignificado(significado.idSignificado)
                .subscribe(() => {
                  // Si todos los significados han sido eliminados, resuelve la Promesa.
                  if (++deletedCount === significados.length) resolve();
                }, reject); // Si ocurre un error al eliminar, rechaza la Promesa.
            }
          }, reject); // Si ocurre un error al obtener los significados, rechaza la Promesa.
      });
    }
    
    // Definición de la función para eliminar oraciones.
    const deleteOraciones = () => {
      // Se retorna una nueva Promesa.
      return new Promise<void>((resolve, reject) => {
        // Obtén todas las oraciones asociadas a la palabra.
        this.sentenceService.getSentence(palabraId)
          .subscribe((oraciones: any[]) => {
            // Si no hay oraciones asociadas, resuelve la Promesa inmediatamente.
            if (oraciones.length === 0) return resolve();
            
            // Inicializa el contador de oraciones eliminadas.
            let deletedCount = 0;
            // Itera sobre cada oración obtenida.
            for (const oracion of oraciones) {
              // Elimina cada oración individualmente.
              this.sentenceService.deleteSentence(oracion.idOracion)
                .subscribe(() => {
                  // Si todas las oraciones han sido eliminadas, resuelve la Promesa.
                  if (++deletedCount === oraciones.length) resolve();
                }, reject); // Si ocurre un error al eliminar, rechaza la Promesa.
            }
          }, reject); // Si ocurre un error al obtener las oraciones, rechaza la Promesa.
      });
    }
    
    // Definición de la función para eliminar la palabra.
    const deletePalabra = () => {
      // Elimina la palabra.
      this.palabraService.eliminarPalabra(palabraId)
        .subscribe(() => {
          // Refresca la lista de palabras y muestra un mensaje de éxito.
          this.getInitialWords();
          this.snack.open('Palabra eliminada correctamente', 'Cerrar', { duration: 3000, });
        });
    }
    
    // Ejecución secuencial de las funciones de eliminación.
    // Primero elimina significados, luego oraciones y finalmente la palabra.
    // Si ocurre algún error en el proceso, se registra en la consola del navegador.
    deleteSignificados().then(deleteOraciones).then(deletePalabra).catch(err => {
      console.error('Error eliminando palabra:', err);
    });
  }
  
  

  onPageChange($event: any) {
    this.pageSize = $event.pageSize;
    this.currentPage = $event.pageIndex;
    const startIndex = this.currentPage * this.pageSize;
    const paginatedWords = this.words.slice(startIndex, startIndex + this.pageSize);

    // Crear peticiones para cargar los datos de "Type" para las palabras paginadas
    let requests = paginatedWords.map(word => {
      return this.tipoService.getTipoByCod(word.codTipo).pipe(
        map((tipo: any) => {
          return { ...word, tipoDescripcion: tipo.descripcion };
        })
      );
    });

    // Realizar las peticiones y actualizar displayedWordsWithTypes con los resultados
    forkJoin(requests).subscribe((results: any[]) => {
      this.displayedWordsWithTypes = results;
    });
  }

  loadTipos() {
    this.tipoService.getTipoPorCategoria(1).subscribe((tipos: Tipo[]) => {
      this.tipoOptions = tipos;
    });
    console.log('tipoOptions:', this.tipoOptions);

  }

  onSubmit() {
    // Realiza la búsqueda con los filtros y actualiza las palabras mostradas
    this.palabraService.filtrarPalabra(this.filter).subscribe((words: any[]) => {
      this.words = words;
      // Restablece la página actual al 0 cuando se aplican los filtros
      this.currentPage = 0;
      // Muestra las palabras filtradas en la página actual
      this.displayedWordsWithTypes = this.words.slice(0, this.pageSize);
    });
  }

  // Función para abrir el diálogo de creacion de palabra
  openWordCreateDialog(): void {
    const dialogRef = this.dialog.open(WordCreateComponent, {
      width: '75%',
      height: '75%',
      data: this.data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.getInitialWords();
    });
  }


  //SECCION DE DIALOGOS
  // Función para abrir el diálogo de creacion de palabra
  openPhraseCreateDialog(): void {
    const dialogRef = this.dialog.open(PhraseCreateComponent, {
      width: '75%',
      height: '75%',
      data: this.data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.getInitialWords();
    });
  }

  // Función para abrir el diálogo de actualización de palabra
  openWordUpdateDialog(word: any): void {
    this.selectedWord = word; // Almacena la palabra seleccionada en la variable
    const dialogRef = this.dialog.open(WordUpdateComponent, {
      width: '75%',
      height: '75%',
      data: this.selectedWord // Pasa la palabra seleccionada al diálogo
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Edit dialog was closed', result);
      this.getInitialWords();
    });
  }


  // Función para abrir el diálogo de oracion
  openSentenceDialog(idPalabraFrase: number, palabra: string): void {
    const dialogRef = this.dialog.open(SentenceComponent, {
      width: '75%',
      height: '75%',
      data: { id: idPalabraFrase, palabra: palabra }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.getInitialWords();
    });
  }
}