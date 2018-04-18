import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule, ProgressSpinnerModule, CalendarModule, AutoCompleteModule } from 'primeng/primeng';

@NgModule({
  imports: [
    CommonModule,
    ChartModule,
    ProgressSpinnerModule,
    CalendarModule,
    AutoCompleteModule
  ],
  exports: [CalendarModule, ProgressSpinnerModule, ChartModule, AutoCompleteModule],
  declarations: []
})
export class PrimeNgModule { }
