import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sentence } from 'src/app/models/sentence.model';
import { PalabraService } from 'src/app/services/palabra.service';
import { SentenceService } from 'src/app/services/sentence.service';
import { CreateSenteceComponent } from './create-sentece/create-sentece.component';
import { UpdateSenteceComponent } from './update-sentece/update-sentece.component';

@Component({
  selector: 'app-sentence',
  templateUrl: './sentence.component.html',
  //styleUrls: ['./sentence.component.css']
})
export class SentenceComponent implements OnInit {

  sentence: any[] = [];
  //idSentence: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<SentenceComponent>,
    private palabraService: PalabraService,
    private snack: MatSnackBar,
    private sentenceService: SentenceService,
  ) { }

  ngOnInit(): void {
    this.getInitialSenteces();
  }

  getInitialSenteces() {
    this.sentenceService.getSentence(this.data["id"]).subscribe((sentences: any) => {
      this.sentence = sentences;

      /*forkJoin(requests).subscribe((results: any[]) => {
        this.displayedWordsWithTypes = results.slice(0, this.pageSize);
      });*/
    });
  }

  // Función para abrir el diálogo de crear
  openSentenceCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateSenteceComponent, {
      width: '40%',
      height: '40%',
      data: this.data,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.getInitialSenteces();
    });
  }

  // Función para abrir el diálogo de modificar
  openSentenceUpdateDialog(dIdOracion: number, dTexto: string): void {
    const dialogRef = this.dialog.open(UpdateSenteceComponent, {
      width: '40%',
      height: '40%',
      data: { id: dIdOracion, palabra: dTexto },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.getInitialSenteces();
    });
  }


  deleteSentence(id: number): void {

    this.sentenceService.deleteSentence(id).subscribe(() => {
      // Actualiza la lista de oraciones después de eliminar
      this.getInitialSenteces();
      // O muestra un mensaje de éxito
      this.snack.open('Oracion eliminada correctamente', 'Cerrar', {
        duration: 3000,
      });
    });
  }

  cancelar() {
    // Cierra el diálogo sin guardar nada
    this.dialogRef.close();

  }
}
