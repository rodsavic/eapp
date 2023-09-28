import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, Subject, map } from 'rxjs';
import { Credentials } from '../models/credentials.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private backendUrl = 'http://localhost:8081';

  

  public loginStatusSubjec = new Subject<boolean>();

  constructor(private http:HttpClient) { }

  login(creds:Credentials){
    return this.http.post(`${this.backendUrl}/login`,creds,{ 
      observe: 'response'
    }).pipe(map((response:HttpResponse<any>)=>{
      const body = response.body;
      const header = response.headers;

      const bearerToken = header.get('Authorization')!;
      const token = bearerToken.replace('Bearer ', '');

      localStorage.setItem('token',token)
      return body;
    }))
  }

  
/*
  //generamos el token
  public generateToken(userData:any){
    console.log('Ingresa a generateToKen - authService')
    return this.http.post(`${this.backendUrl}/generate-token`,userData);
  }*/
  /*
  public getCurrentUser(){
    return this.http.get(`${this.backendUrl}/actual-usuario`);
  }
  */
  //iniciamos sesión y establecemos el token en el localStorage
  public loginUser(token:any){
    localStorage.setItem('token',token);
    return true;
  }

  public isLoggedIn(){
    let tokenStr = localStorage.getItem('token');
    if(tokenStr == undefined || tokenStr == '' || tokenStr == null){
      return false;
    }else{
      return true;
    }
  }

  //cerranis sesion y eliminamos el token del localStorage
  public logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return true;
  }

  //obtenemos el token
  public getToken(){
    return localStorage.getItem('token');
  }

  public setUser(user:any){
    localStorage.setItem('user', JSON.stringify(user));
  }

  public getUser(){
    let userStr = localStorage.getItem('user');
    if(userStr != null){
      return JSON.parse(userStr);
    }else{
      this.logout();
      return null;
    }
  }
  /*
  public getUserRole(){
    let user = this.getUser();
    return user.authorities[0].authority;
  }
  */
}

