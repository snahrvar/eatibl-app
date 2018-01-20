import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {Routes, RouterModule} from "@angular/router";
import { FormsModule } from '@angular/forms';
import { NouisliderModule } from 'ng2-nouislider';
import { ChartModule, ProgressSpinnerModule } from 'primeng/primeng';
import 'hammerjs';

import { AppComponent } from './app.component';
import { BusinessHoursComponent } from './business-hours/business-hours.component';
import { KeyHoursComponent } from './key-hours/key-hours.component';
import { WeekDiscountComponent } from './week-discount/week-discount.component';
import { DayDiscountComponent } from './day-discount/day-discount.component';
import { RestaurantListComponent } from './restaurant-list/restaurant-list.component';
import { RestaurantDetailsComponent } from './restaurant-details/restaurant-details.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterLoginComponent } from './register-login/register-login.component';
import { AppMaterialModule } from './app-material/app-material.module';
import { DialogConfirmComponent } from './dialog-confirm/dialog-confirm.component'; //Angular Material components

const routes: Routes = [
  { path: '', component: RestaurantListComponent },
  { path: 'login', component: RegisterLoginComponent },
  { path: ':restaurantId/hours', component: BusinessHoursComponent },
  { path: ':restaurantId/keyHours', component: KeyHoursComponent },
  { path: ':restaurantId/pricing/week', component: WeekDiscountComponent },
  { path: ':restaurantId/pricing/:day', component: DayDiscountComponent },
  { path: 'restaurant/:action', component: RestaurantDetailsComponent },
  { path: ':restaurantId/:action', component: RestaurantDetailsComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    BusinessHoursComponent,
    KeyHoursComponent,
    WeekDiscountComponent,
    DayDiscountComponent,
    RestaurantListComponent,
    RestaurantDetailsComponent,
    RegisterLoginComponent,
    DialogConfirmComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NouisliderModule,
    ChartModule,
    ProgressSpinnerModule,
    FormsModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    RouterModule.forRoot(routes)
  ],
  entryComponents: [DialogConfirmComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
