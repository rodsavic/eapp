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
import { format, parse } from 'date-fns';

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
  private backendUrl = 'http://localhost:8081';

  words: any[];
  data: DialogData = {
    contenido: '',
    dificultad: '',
    aprendido: false,
    idTipo: 1,
  }
  filter: any = {
    word: '',
    level: '',
    learned: '',
    startDate: null,
    endDate: null,
  };
  //dificultadControl = new FormControl<WordComponent | null>(null, Validators.required);
  //selectFormControl = new FormControl('', Validators.required);
  dificultadOptions: string[] = ['Easy', 'Medium', 'Hard'];
  estadoOptions: string[] = ['Yes', 'No'];

  length = 100;
  pageSize = 5; // Cantidad de elementos por página
  pageSizeOptions: number[] = [5, 10, 25, 100]; // Opciones de cantidad de elementos por página
  currentPage = 0; // Página actual
  pageIndex: any;
  countG = 5;
  pageG = 0;
  displayedWords: any[] = [];


  constructor(private http: HttpClient,
    public dialog: MatDialog,
    private palabraService: PalabraService,
    private snack: MatSnackBar) { }

  ngOnInit(): void {
    this.loadInitialWords();
  }
  /*
  getWords(): Observable<any[]> {
    return this.http.get(`${this.backendUrl}/palabrafrases`)
      .pipe(map(response => {
        if (response) {
          return Object.values(response);
        }
        return [];
      }));
  }
  */
  /*
  getWords(): Observable<any[]> {
    return this.http.get(`${this.backendUrl}/palabrafrases`)
      .pipe(map(response => {
        if (response) {
          this.words = Object.values(response);
        } else {
          this.words = [];
        }
        return this.words; // Importante devolver las palabras actualizadas
      }));
  }
  */
  getWords() {
    // Construye la URL de la solicitud HTTP con los valores de los filtros
  const url = `${this.backendUrl}/palabrafrases/buscar`;
 
  const params = {
    contenido: this.filter.word,
    dificultad: this.filter.level,
    aprendido: this.filter.learned,
    fechaInicio: format(this.filter.startDate, 'yyyy-MM-dd'),
    fechaFin: format(this.filter.endDate, 'yyyy-MM-dd')
  };

  return this.http.get(url, { params })
    .pipe(map(response => {
      if (response) {
        this.words = Object.values(response);
      } else {
        this.words = [];
      }
      return this.words;
    }));
  }
  


  openDialog(): void {
    const dialogRef = this.dialog.open(WordCreateComponent, {
      width: '75%',
      height: '75%',
      data: this.data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

  // Método para manejar los cambios de página
  onPageChange($event: any) {
    /*
    this.countG = $event.pageSize;
    this.pageG = $event.pageIndex  * $event.pageSize;
    this.getWords();
    */
    // Actualiza la página actual y la cantidad de elementos por página
    this.pageSize = $event.pageSize;
    this.currentPage = $event.pageIndex;

    // Calcula la posición inicial de la página actual
    const startIndex = this.currentPage * this.pageSize;

    // Filtra las palabras para mostrar solo las de la página actual
    this.displayedWords = this.words.slice(startIndex, startIndex + this.pageSize);
  }

  loadInitialWords() {
    this.getWords().subscribe(() => {
      // Filtra las palabras para mostrar solo las de la página actual
      this.displayedWords = this.words.slice(0, this.pageSize);
    });
  }
  /*
  onSubmit() {
    this.getWords();
  }
  */
  onSubmit() {
    this.getWords().subscribe(() => {
      // Filtra las palabras para mostrar solo las de la página actual
      this.displayedWords = this.words.slice(0, this.pageSize);
    });
  }
  
}