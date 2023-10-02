import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, Subject, map } from 'rxjs';
import { Credentials } from '../models/credentials.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private backendUrl = 'http://localhost:8081';

  
  constructor(private http:HttpClient) { }

  // Método para iniciar sesión.
  login(creds: Credentials) {
    // Realizamos una petición POST al endpoint de login en nuestro backend con las credenciales proporcionadas.
    return this.http.post(`${this.backendUrl}/login`, creds, {
      observe: 'response' // Observamos toda la respuesta HTTP, no solo el cuerpo.
    }).pipe(map((response: HttpResponse<any>) => {
      // Extraemos el cuerpo y los headers de la respuesta.
      const body = response.body;
      const header = response.headers;

      // Extraemos el token de autorización del header.
      const bearerToken = header.get('Authorization')!;
      // Limpiamos el token de la palabra 'Bearer '.
      const token = bearerToken.replace('Bearer ', '');

      // Guardamos el token en localStorage.
      localStorage.setItem('token', token)
      // Retornamos el cuerpo de la respuesta.
      return body;
    }))
  }

  // Método para verificar si un usuario está logueado.
  public isLoggedIn() {
    // Obtenemos el token de localStorage.
    let tokenStr = localStorage.getItem('token');
    // Si el token no está definido, está vacío o es null, retornamos false, indicando que el usuario no está logueado.
    if (tokenStr == undefined || tokenStr == '' || tokenStr == null) {
      return false;
    } else {
      // De lo contrario, retornamos true, indicando que el usuario está logueado.
      return true;
    }
  }

  // Método para cerrar sesión.
  public logout() {
    // Eliminamos el token y el usuario de localStorage, cerrando así la sesión.
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return true;
  }

  // Método para obtener el token de localStorage.
  public getToken() {
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

