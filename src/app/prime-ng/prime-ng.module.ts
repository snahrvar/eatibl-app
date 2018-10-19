import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule, ProgressSpinnerModule, CalendarModule, AutoCompleteModule, DropdownModule } from 'primeng/primeng';
import {SlideshowModule} from 'ng-simple-slideshow';

@NgModule({
  imports: [
    CommonModule,
    ChartModule,
    ProgressSpinnerModule,
    CalendarModule,
    AutoCompleteModule,
    DropdownModule,
    SlideshowModule //Not from primeng
  ],
  exports: [CalendarModule, ProgressSpinnerModule, ChartModule, AutoCompleteModule, DropdownModule, SlideshowModule],
  declarations: []
})
export class PrimeNgModule { }
