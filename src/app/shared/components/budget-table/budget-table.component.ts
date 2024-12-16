import { Component, Input } from '@angular/core';
import { BudgetService } from '../../../core/services/budget.service';
import { BudgetCategory } from '../../models/budget-category';

@Component({
  selector: 'app-budget-table',
  imports: [],
  templateUrl: './budget-table.component.html',
  styleUrl: './budget-table.component.css',
})
export class BudgetTableComponent {
  datastore: BudgetCategory[] = [];
  constructor(private service: BudgetService) {}

  ngOnInit() {
    this.service.getData().subscribe({
      next: (res) => {
        this.datastore = res;
        console.log(this.datastore);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {},
    });
  }

  onDateChange(startMonth: number, endMonth: number) {
    console.log(startMonth + '===' + endMonth);
  }
}
