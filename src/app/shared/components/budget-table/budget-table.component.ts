import { Component, Input } from '@angular/core';
import { BudgetService } from '../../../core/services/budget.service';
import { BudgetCategory } from '../../models/budget-category';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { Utils } from '../../utils/utils';

@Component({
  selector: 'app-budget-table',
  imports: [NgFor, FormsModule],
  templateUrl: './budget-table.component.html',
  styleUrl: './budget-table.component.css',
})
export class BudgetTableComponent {
  datastore: BudgetCategory[] = [];
  dateRange: string[] = [];

  constructor(private service: BudgetService) {}

  ngOnInit() {
    this.getInitData();
  }

  getInitData() {
    this.service.getData().subscribe({
      next: (res) => {
        this.datastore = res;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {},
    });
  }

  onDateChange(startMonth: number, endMonth: number) {
    this.dateRange = Utils.getMonthsInRange(startMonth, endMonth);
  }

  onInputChange() {}
}
