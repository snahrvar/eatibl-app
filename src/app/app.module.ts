import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {Routes, RouterModule} from "@angular/router";
import { FormsModule } from '@angular/forms';
import { NouisliderModule } from 'ng2-nouislider';
import { ChartModule, ProgressSpinnerModule } from 'primeng/primeng';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BusinessHoursComponent } from './business-hours/business-hours.component';
import { KeyHoursComponent } from './key-hours/key-hours.component';
import { WeekDiscountComponent } from './week-discount/week-discount.component';
import { DayDiscountComponent } from './day-discount/day-discount.component';
import { RestaurantListComponent } from './restaurant-list/restaurant-list.component';
import { RestaurantDetailsComponent } from './restaurant-details/restaurant-details.component';

const routes: Routes = [
  { path: '', component: RestaurantListComponent },
  { path: ':restaurantId/hours', component: BusinessHoursComponent },
  { path: ':restaurantId/keyHours', component: KeyHoursComponent },
  { path: ':restaurantId/discount/week', component: WeekDiscountComponent },
  { path: ':restaurantId/discount/:day', component: DayDiscountComponent },
  { path: 'restaurant/:action', component: RestaurantDetailsComponent },
  { path: ':restaurantId/:action', component: RestaurantDetailsComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BusinessHoursComponent,
    KeyHoursComponent,
    WeekDiscountComponent,
    DayDiscountComponent,
    RestaurantListComponent,
    RestaurantDetailsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NouisliderModule,
    ChartModule,
    ProgressSpinnerModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
