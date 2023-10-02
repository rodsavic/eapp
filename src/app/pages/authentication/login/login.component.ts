import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { Credentials } from 'src/app/models/credentials.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  //styleUrls: ['./login.component.css']
})

export class LoginComponent{
  creds: Credentials ={
    username: '',
    password: ''
  };
  
  constructor(private snack:MatSnackBar,private authService: AuthService, private router: Router) {}
  
  
  formSubmit() {
    console.log('Ingresa al formSybmit',this.creds);
    this.authService.login(this.creds).subscribe(response =>{
      this.router.navigate(['/'])
    },
    err => {
        console.log('Hubo un error de autenticación');
        this.snack.open('Hubo un error de autenticación', 'Cerrar', {
          duration: 3000,
        });

    })
  }
}  

