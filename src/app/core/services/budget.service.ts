import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BudgetCategory } from '../../shared/models/budget-category';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private jsonUrl = '/assets/data/budget.json';

  constructor(private http: HttpClient) {}

  getData(): Observable<BudgetCategory[]> {
    return this.http.get<BudgetCategory[]>(this.jsonUrl);
  }
}
