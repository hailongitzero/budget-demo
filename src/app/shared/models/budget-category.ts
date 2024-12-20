import { BudgetDetail } from './budget-detail';

export interface BudgetCategory {
  Category: string;
  Type: string;
  Details?: BudgetDetail | any;
  Sum?: any;
}
