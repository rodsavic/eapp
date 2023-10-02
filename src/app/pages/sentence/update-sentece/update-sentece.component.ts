import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SentenceService } from 'src/app/services/sentence.service';

@Component({
  selector: 'app-update-sentece',
  templateUrl: './update-sentece.component.html',
  //styleUrls: ['./update-sentece.component.css']
})
export class UpdateSenteceComponent implements OnInit{

  texto: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<UpdateSenteceComponent>,
    private snack: MatSnackBar,
    private sentenceService: SentenceService,
  ) {
    this.texto = data.palabra;
   }
  
  
   ngOnInit(): void {
    
  }
  


  cancelar() {
    // Cierra el diálogo sin guardar nada
    this.dialogRef.close();

  }

}
