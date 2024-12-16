import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DateSelectComponent } from './shared/components/date-select/date-select.component';
import { BudgetTableComponent } from './shared/components/budget-table/budget-table.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DateSelectComponent, BudgetTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  @ViewChild('budgetTable') budgetTable: BudgetTableComponent | undefined;
  title = 'budget-demo';
  startMonth: number = 1;
  endMonth: number = 12;

  constructor() {}

  ngOnInit() {}

  onDateChange() {
    console.log('s:' + this.startMonth + '===' + this.endMonth);
    this.budgetTable?.onDateChange(this.startMonth, this.endMonth);
  }
}
