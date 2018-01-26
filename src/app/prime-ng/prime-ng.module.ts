import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule, ProgressSpinnerModule, CalendarModule } from 'primeng/primeng';

@NgModule({
  imports: [
    CommonModule,
    ChartModule,
    ProgressSpinnerModule,
    CalendarModule
  ],
  exports: [CalendarModule, ProgressSpinnerModule, ChartModule],
  declarations: []
})
export class PrimeNgModule { }
