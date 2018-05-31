import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingsComponent } from './bookings/bookings.component';
import { RestaurantSettingsComponent } from './restaurant-settings/restaurant-settings.component';
import {Routes, RouterModule} from "@angular/router";
import { ProgressSpinnerModule, CalendarModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import {MatListModule, MatTooltipModule} from '@angular/material';
import { RestaurantSelectComponent } from './restaurant-select/restaurant-select.component';

const routes: Routes = [
  { path: 'restaurant/select', component: RestaurantSelectComponent },
  { path: 'restaurant/:restaurantId/bookings', component: BookingsComponent },
  { path: 'restaurant/:restaurantId/settings', component: RestaurantSettingsComponent }
];

@NgModule({
  imports: [
    CommonModule,
    ProgressSpinnerModule,
    CalendarModule,
    FormsModule,
    MatListModule,
    MatTooltipModule,
    RouterModule.forRoot(routes)
  ],
  declarations: [
    BookingsComponent,
    RestaurantSettingsComponent,
    RestaurantSelectComponent
  ]
})
export class RestaurantAppModule { }

export const restaurantComponents = [BookingsComponent];
