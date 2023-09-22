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

export interface DialogData {
  contenido: string;
  dificultad: string;
  aprendido: boolean;
  codTipo: string;
}

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  //styleUrls: ['./word.component.css']
})
export class WordComponent implements OnInit {
  //private backendUrl = 'http://localhost:8081';

  words: any[] = [];
  data: DialogData = {
    contenido: '',
    dificultad: '',
    aprendido: false,
    codTipo: '',
  };

  filter: any = {
    word: '',
    level: '',
    learned: '',
    codTipo:'',
    startDate: null,
    endDate: null,
  };

  tipoOptions: Tipo[];
  displayedWordsWithTypes: any[] = [];
  dificultadOptions: string[] = ['Easy', 'Medium', 'Hard'];
  estadoOptions: string[] = ['Yes', 'No'];
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
    // Obtén el ID de la palabra seleccionada
    const palabraId = word.idPalabraFrase;
  
    this.significadoService.getSignificadosByPalabraId(palabraId)
      .subscribe((significados: any[]) => {
        // Extrae los IDs de significados y almacénalos en un arreglo
        const significadoIds = significados.map(significado => significado.idSignificado);
        console.log("Ids de significados obtenidos:", significadoIds);
  
        // Verifica si hay significados antes de eliminar
        if (significadoIds.length > 0) {
          // Itera sobre los IDs de significados y elimina cada uno
          for (const id of significadoIds) {
            this.significadoService.eliminarSignificado(id).subscribe(() => {
              console.log("Significado eliminado correctamente");
            });
          }
        }
  
        // Una vez eliminados los significados (o si no había ninguno), elimina la palabra
        this.palabraService.eliminarPalabra(palabraId).subscribe(() => {
          // Actualiza la lista de palabras después de eliminar
          this.getInitialWords();
          // O muestra un mensaje de éxito
          this.snack.open('Palabra eliminada correctamente', 'Cerrar', {
            duration: 3000,
          });
        });
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
}