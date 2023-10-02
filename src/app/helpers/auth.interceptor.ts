import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
  ) { }

  // Método intercept que se ejecutará cada vez que se haga una petición HTTP.
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // Obtenemos el token de autorización utilizando el método getToken de authService.
    const token = this.authService.getToken();

    // Si el token existe, procedemos a clonar la petición HTTP.
    if (token) {
      // Clonamos la petición HTTP original y le añadimos el header de autorización con el token.
      const cloned = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`)
      });

      // Pasamos la nueva petición clonada al siguiente middleware en la cadena.
      return next.handle(cloned);
    }

    // Si no hay token, pasamos la petición original al siguiente middleware en la cadena.
    return next.handle(request);
  }
}
