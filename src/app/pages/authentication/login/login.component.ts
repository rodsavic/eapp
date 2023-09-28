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
  userData = {
    username: '',
    password: ''
  };

  creds: Credentials ={
    username: '',
    password: ''
  };

  errorMessage: string = 'ERROR!!'; // Declarar la propiedad errorMessage
  
  constructor(private snack:MatSnackBar,private authService: AuthService, private router: Router) {}
  
  
  formSubmit() {
    console.log('Ingresa al formSybmit',this.userData);
    this.authService.login(this.userData).subscribe(response =>{
      this.router.navigate(['/'])
    })
  
      
   
      
  }
}  

