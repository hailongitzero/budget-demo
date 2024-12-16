import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DateSelect } from '../../shared/models/date-select';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  private jsonUrl = '/assets/data/date.json';

  constructor(private http: HttpClient) {}

  getData(): Observable<DateSelect[]> {
    return this.http.get<DateSelect[]>(this.jsonUrl);
  }
}
