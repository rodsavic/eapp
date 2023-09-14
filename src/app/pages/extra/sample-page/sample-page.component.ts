import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-sample-page',
  templateUrl: './sample-page.component.html'
})
export class AppSamplePageComponent implements OnInit {
  private backendUrl = 'http://localhost:8081';
  significados: any[];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getSignificados().subscribe(data => {
      this.significados = data;
    });
  }

  getSignificados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.backendUrl}/significados`)
      .pipe(map(response => {
        if (response) {
          return Object.values(response);
        }
        return [];
      }));
  }
}
