import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule, ProgressSpinnerModule, CalendarModule, AutoCompleteModule, DropdownModule } from 'primeng/primeng';

@NgModule({
  imports: [
    CommonModule,
    ChartModule,
    ProgressSpinnerModule,
    CalendarModule,
    AutoCompleteModule,
    DropdownModule
  ],
  exports: [CalendarModule, ProgressSpinnerModule, ChartModule, AutoCompleteModule, DropdownModule],
  declarations: []
})
export class PrimeNgModule { }
