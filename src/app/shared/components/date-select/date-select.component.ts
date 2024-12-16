import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DateSelect } from '../../models/date-select';
import { DateService } from '../../../core/services/date.service';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-select',
  imports: [NgFor, FormsModule],
  templateUrl: './date-select.component.html',
  styleUrl: './date-select.component.css',
})
export class DateSelectComponent {
  @Input() date: number | undefined;
  @Output() dateChange = new EventEmitter<number>();
  @Output() onChange = new EventEmitter();
  datastore: DateSelect[] = [];

  constructor(protected dateService: DateService) {}

  ngOnInit() {
    this.dateService.getData().subscribe({
      next: (res) => {
        this.datastore = res;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {},
    });
  }

  onDateChange(e: any) {
    this.dateChange.emit(this.date);
    this.onChange.emit();
  }
}
