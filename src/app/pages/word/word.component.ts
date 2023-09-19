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
import { Observable, map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PalabraService } from 'src/app/services/palabra.service';
import { PageEvent } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { WordCreateComponent } from './word-create/word-create.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { format, parse, isDate, isValid } from 'date-fns';
import { WordUpdateComponent } from './word-update/word-update.component';

export interface DialogData {
  contenido: string;
  dificultad: string;
  aprendido: boolean;
  idTipo: number;
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
    idTipo: 1,
  };

  filter: any = {
    word: '',
    level: '',
    learned: '',
    startDate: null,
    endDate: null,
  };

  dificultadOptions: string[] = ['Easy', 'Medium', 'Hard'];
  estadoOptions: string[] = ['Yes', 'No'];
  selectedWord: any;

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
    private snack: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getInitialWords();
  }

  getInitialWords() {
    this.palabraService.getPalabra().subscribe((words: any[]) => {
      this.words = words;
      // Muestra las palabras sin filtros en la página actual
      this.displayedWords = this.words.slice(0, this.pageSize);
    });
  }
  /*
  searchWords() {
    const url = `${this.backendUrl}/palabrafrases/buscar`;
    
    const params: any = {
      contenido: this.filter.word,
      dificultad: this.filter.level,
      aprendido: this.filter.learned
    };
  
    // Verifica si startDate es una fecha válida antes de formatearla
    if (isDate(this.filter.startDate) && isValid(this.filter.startDate)) {
      params.fechaInicio = format(this.filter.startDate, 'yyyy-MM-dd');
    }
    
    // Verifica si endDate es una fecha válida antes de formatearla
    if (isDate(this.filter.endDate) && isValid(this.filter.endDate)) {
      params.fechaFin = format(this.filter.endDate, 'yyyy-MM-dd');
    }
  
    return this.http.get(url, { params }).pipe(
      map((response: any) => {
        this.words = response ? Object.values(response) : [];
        return this.words;
      })
    );
  }
  */
  openWordCreateDialog(): void {
    const dialogRef = this.dialog.open(WordCreateComponent, {
      width: '75%',
      height: '75%',
      data: this.data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
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
    });
  }

  onPageChange($event: any) {
    this.pageSize = $event.pageSize;
    this.currentPage = $event.pageIndex;
    const startIndex = this.currentPage * this.pageSize;
    this.displayedWords = this.words.slice(startIndex, startIndex + this.pageSize);
  }
  /*
  loadInitialWords() {
    this.getWords().subscribe(() => {
      this.displayedWords = this.words.slice(0, this.pageSize);
    });
  }
  */
  onSubmit() {
    // Realiza la búsqueda con los filtros y actualiza las palabras mostradas
    this.palabraService.filtrarPalabra(this.filter).subscribe((words: any[]) => {
      this.words = words;
      // Restablece la página actual al 0 cuando se aplican los filtros
      this.currentPage = 0;
      // Muestra las palabras filtradas en la página actual
      this.displayedWords = this.words.slice(0, this.pageSize);
    });
  }
}