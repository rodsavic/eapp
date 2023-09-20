import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class SignificadoService {
  private backendUrl = 'http://localhost:8081/significados'; // Reemplaza con la URL de tu backend

  constructor(private http: HttpClient) { }

  // Método para registrar un significado en el backend
  registrarSignificado(data: any): Observable<any> {
    const url = `${this.backendUrl}/`;
    return this.http.post(url, data);
  }

  getSignificadosByPalabraId(idPalabraFrase: number): Observable<any> {
    console.log("Ingresa a getSignificadosByPalabraId");
    const url = `${this.backendUrl}/palabra/${idPalabraFrase}`;
    console.log("Retorna del get: ",this.http.get(url))
    return this.http.get(url);
  }

  
  eliminarSignificado(idSignificado: number): Observable<any> {
    const url = `${this.backendUrl}/${idSignificado}`;
    return this.http.delete(url);
  }

  /*
  // Método para obtener el ID de una palabra o frase por su contenido
  getPalabraFraseIdByContenido(contenido: string): Observable<number> {
    const url = `${this.backendUrl}/buscarPorContenido/${contenido}`;
    return this.http.get<number>(url);
  }
  */
}

