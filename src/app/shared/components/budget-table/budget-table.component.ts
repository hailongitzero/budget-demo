import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { BudgetService } from '../../../core/services/budget.service';
import { BudgetCategory } from '../../models/budget-category';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { Utils } from '../../utils/utils';
import { NameConfirmComponent } from '../name-confirm/name-confirm.component';

@Component({
  selector: 'app-budget-table',
  imports: [NgFor, NgIf, FormsModule, NameConfirmComponent],
  templateUrl: './budget-table.component.html',
  styleUrl: './budget-table.component.css',
})
export class BudgetTableComponent {
  @Input() startMonth: number = 1;
  @Input() endMonth: number = 1;
  datastore: BudgetCategory[] = [];
  dateRange: string[] = [];
  openModal: boolean = false;
  applyAll = {
    masterCategory: '',
    subCategory: '',
    index: 0,
    month: '',
    value: 0,
  };

  constructor(private service: BudgetService, private elRef: ElementRef) {}

  ngOnInit() {
    this.getInitData();
  }

  getInitData() {
    this.service.getData().subscribe({
      next: (res) => {
        this.datastore = res;
        this.delayLoading();
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {},
    });

    this.onDateChange(this.startMonth, this.endMonth);
  }

  delayLoading() {
    setTimeout(() => {
      const firstNumberInput = this.elRef.nativeElement.querySelector(
        'input[type="number"]'
      );
      if (firstNumberInput) {
        firstNumberInput.focus();
      }
    }, 1000);
  }

  onDateChange(startMonth: number, endMonth: number) {
    this.dateRange = Utils.getMonthsInRange(startMonth, endMonth);
  }

  onInputChange(e: any) {
    this.calculateBudget();
  }

  addSubCategory(masterCategory: string, subCategory: string) {
    let masterObject = this.datastore.find(
      (x) => x.Category === masterCategory
    );
    let subObject = masterObject?.Details.find(
      (x: any) => x.Category === subCategory
    );
    if (subObject == null) {
      return;
    }
    subObject.Details.push(Utils.subObject);
  }

  addParentCategory(masterCategory: string) {
    let masterObject = this.datastore.find(
      (x) => x.Category === masterCategory
    );
    if (masterObject) {
      masterObject.Details.push(Utils.masterObject);
    }
  }

  removeSubCategory(
    masterCategory: string,
    subCategory: string,
    index: number
  ) {
    let masterObject = this.datastore.find(
      (x) => x.Category === masterCategory
    );
    let subObject = masterObject?.Details.find(
      (x: any) => x.Category === subCategory
    );
    if (subObject == null) {
      return;
    }
    subObject.Details.splice(index, 1);
    this.calculateBudget();
  }

  removeMasterCategory(masterCategory: string, index: number) {
    let masterObject = this.datastore.find(
      (x) => x.Category === masterCategory
    );
    if (masterObject) {
      masterObject.Details.splice(index, 1);
    }
    this.calculateBudget();
  }

  calculateBudget() {
    let totalIncome: any = {};
    Utils.months.forEach((month) => {
      totalIncome[month] = 0;
    });
    //reset total
    this.resetTotal();

    this.datastore.forEach((item) => {
      if (item.Type === 'master') {
        if (item.Category === 'Income') {
          Utils.months.forEach((month) => {
            item.Sum[month] = 0;
          });
        }

        item.Details.forEach((subItem: BudgetCategory) => {
          Utils.months.forEach((month) => {
            subItem.Sum[month] = 0;
          });
          subItem.Details.forEach((detail: { [x: string]: any }) => {
            Utils.months.forEach((month) => {
              subItem.Sum[month] += detail[month] || 0;
              // Total Expenses
              if (item.Category === 'Expenses') {
                this.datastore[this.datastore.length - 1].Details[0].Details[0][
                  month
                ] += detail[month] || 0;
              }
              // Profit / Loss
              if (item.Category === 'Income') {
                totalIncome[month] += detail[month] || 0;
                item.Sum[month] += detail[month] || 0;
              }
            });
          });
        });
      } else {
        return;
      }
    });

    this.calculateTotal(totalIncome);
  }

  resetTotal() {
    Utils.months.forEach((month) => {
      this.datastore[this.datastore.length - 1].Details[0].Details[0][
        month
      ] = 0;
      this.datastore[this.datastore.length - 1].Details[1].Details[0][
        month
      ] = 0;
      this.datastore[this.datastore.length - 1].Details[2].Details[0][
        month
      ] = 0;
      this.datastore[this.datastore.length - 1].Details[3].Details[0][
        month
      ] = 0;
    });
  }

  calculateTotal(totalIncome: any) {
    Utils.months.forEach((month, idx) => {
      // profit
      this.datastore[this.datastore.length - 1].Details[1].Details[0][month] =
        totalIncome[month] -
        this.datastore[this.datastore.length - 1].Details[0].Details[0][month];
      // opening blance
      if (idx > 0) {
        this.datastore[this.datastore.length - 1].Details[2].Details[0][month] =
          this.datastore[this.datastore.length - 1].Details[3].Details[0][
            Utils.months[idx - 1]
          ];
      } else {
        this.datastore[this.datastore.length - 1].Details[2].Details[0][
          month
        ] = 0;
      }
      // Closing blance
      this.datastore[this.datastore.length - 1].Details[3].Details[0][month] =
        this.datastore[this.datastore.length - 1].Details[1].Details[0][month] +
        this.datastore[this.datastore.length - 1].Details[2].Details[0][month];
    });
  }

  @HostListener('keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault(); // Prevent default tab behavior
      this.moveFocus(-1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault(); // Prevent default tab behavior
      this.moveFocus(1);
    }
  }

  moveFocus(direction: number) {
    const focusableElements = Array.from(
      document.querySelectorAll('input[type="number"]')
    ) as HTMLElement[];
    const currentIndex = focusableElements.findIndex(
      (el) => el === document.activeElement
    );
    const nextIndex =
      (currentIndex + direction + focusableElements.length) %
      focusableElements.length;

    focusableElements[nextIndex].focus();
  }

  onRightClick(
    event: MouseEvent,
    masterCategory: string,
    subCategory: string,
    index: number,
    month: string,
    value: number
  ): void {
    event.preventDefault();
    this.applyAll = {
      masterCategory: masterCategory,
      subCategory: subCategory,
      index: index,
      month: month,
      value: value,
    };
    this.openModal = true;
  }

  closePopup() {
    this.applyAll = {
      masterCategory: '',
      subCategory: '',
      index: 0,
      month: '',
      value: 0,
    };
    this.openModal = false;
  }

  confirmAll() {
    this.openModal = false;
    this.datastore.forEach((master) => {
      if (master.Category === this.applyAll.masterCategory) {
        master.Details.forEach((sub: BudgetCategory) => {
          if (sub.Category === this.applyAll.subCategory) {
            Utils.months.forEach((month) => {
              sub.Details[this.applyAll.index][month] = this.applyAll.value;
            });
          }
        });
      }
    });
    this.calculateBudget();
  }
}
