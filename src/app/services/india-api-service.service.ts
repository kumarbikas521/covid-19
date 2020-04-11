import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as data from '../../assets/URL.json';
import { from } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class IndiaApiServiceService {

  constructor(private http: HttpClient) { }

  getIndiaData() {
    return this.http.get<any>(data.india);
  }
}
