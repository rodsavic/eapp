import { HttpClient, HttpParams  } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Tipo } from "../models/tipo.model";

@Injectable({
  providedIn: 'root'
})

export class TipoService {
  private backendUrl = 'http://localhost:8081/tipos'; // Reemplaza con la URL de tu backend

  constructor(private http: HttpClient) { }

  // Método para registrar un tipo en el backend
  registrarTipo(data: Tipo): Observable<any> {
    const url = `${this.backendUrl}/`;
    return this.http.post(url, data);
  }

  // Metodo para actualizar tipo
  updateTipo(id: number, data: Tipo): Observable<any> {
    const url = `${this.backendUrl}/${id}`;
    return this.http.put(url, data);
  }

  //Metodo para eliminar tipo
  eliminarTipo(id: string): Observable<any> {
    const url = `${this.backendUrl}/${id}`;
    return this.http.delete(url);
  }


  getTipo(): Observable<any> {
    const url = `${this.backendUrl}/`;

    return this.http.get(url);
  }

  getTipoByCod(codTipo: string){
    const url = `${this.backendUrl}/${codTipo}`;
    return this.http.get(url);
  }

  getTipoPorCategoria(idCategoria: number): Observable<Tipo[]>{
    const url = `${this.backendUrl}/categoria/${idCategoria}`;
    return this.http.get<Tipo[]>(url);
  }
  /*
  filtrarPalabra(filter: any): Observable<any> {
    const url = `${this.backendUrl}/buscar`;

    // Construir los parámetros de búsqueda según los valores del filtro
    let params = new HttpParams();
    if (filter.word) {
      params = params.set('contenido', filter.word);
    }
    if (filter.level) {
      params = params.set('dificultad', filter.level);
    }
    if (filter.learned) {
      params = params.set('aprendido', filter.learned);
    }
    if (filter.startDate) {
      params = params.set('fechaInicio', filter.startDate.toISOString());
    }
    if (filter.endDate) {
      params = params.set('fechaFin', filter.endDate.toISOString());
    }

    return this.http.get(url, { params });
  }
  */
 /*
  // Método para obtener el ID de una palabra o frase por su contenido
  getPalabraFraseIdByContenido(contenido: string): Observable<number> {
    const url = `${this.backendUrl}/buscarPorContenido/${contenido}`;
    return this.http.get<number>(url);
  }
  */
}

