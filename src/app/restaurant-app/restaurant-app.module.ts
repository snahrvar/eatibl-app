import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingsComponent } from './bookings/bookings.component';
import {Routes, RouterModule} from "@angular/router";
import { ProgressSpinnerModule, CalendarModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import {MatListModule} from '@angular/material';

const routes: Routes = [
  { path: 'restaurant/:restaurantId/bookings', component: BookingsComponent }
];

@NgModule({
  imports: [
    CommonModule,
    ProgressSpinnerModule,
    CalendarModule,
    FormsModule,
    MatListModule,
    RouterModule.forRoot(routes)
  ],
  declarations: [BookingsComponent]
})
export class RestaurantAppModule { }

export const restaurantComponents = [BookingsComponent];
