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
import {MatDatepickerModule} from '@angular/material/datepicker';

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

  //dificultadControl = new FormControl<WordComponent | null>(null, Validators.required);
  //selectFormControl = new FormControl('', Validators.required);
  dificultadOptions: string[] = ['Easy', 'Medium', 'Hard'];
  estadoOptions: string[] = ['Yes','No'];

  pageSize = 5; // Cantidad de elementos por página
  pageSizeOptions: number[] = [5, 10, 25, 100]; // Opciones de cantidad de elementos por página
  currentPage = 0; // Página actual


  constructor(private http: HttpClient, public dialog: MatDialog, private palabraService: PalabraService) { }

  ngOnInit(): void {
    this.getWords().subscribe(data => {
      // Filtrar los datos para mostrar solo los de tipo 1 (palabras)
      this.words = data.filter(item => item.idTipo === 1);
    });
  }

  getWords(): Observable<any[]> {
    return this.http.get(`${this.backendUrl}/palabrafrases`)
      .pipe(map(response => {
        if (response) {
          return Object.values(response);
        }
        return [];
      }));
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '75%',
      height: '75%',
      data: this.data
    });



    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);

    });
  }

  // Método para manejar los cambios de página
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  onSubmit() {
    this.getWords();
  }

}



@Component({
  selector: 'create-word',
  templateUrl: './create-word.html',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule
  ],
})
export class DialogOverviewExampleDialog {
  data: DialogData;
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    private palabraService: PalabraService
  ) {
    this.data = {
      contenido: '',
      dificultad: '',
      aprendido: false,
      idTipo: 1,
    };
  }

  onSubmit(): void {
    // Llamar al servicio para enviar los datos
    this.palabraService.registrarPalabra(this.data).subscribe(response => {
      console.log('Palabra registrada con éxito', response);
      // Puedes realizar otras acciones aquí después de guardar los datos
      this.dialogRef.close(response); // Cierra el cuadro de diálogo y pasa la respuesta al componente padre
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

