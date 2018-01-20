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
import { RestaurantListComponent, RestaurantListDeleteDialog } from './restaurant-list/restaurant-list.component';
import { RestaurantDetailsComponent } from './restaurant-details/restaurant-details.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatDialogModule} from '@angular/material';
import { RegisterLoginComponent } from './register-login/register-login.component';
import { SampleService } from './sample.service';
import { AuthGuard } from './_guards/auth.guard.ts'; //login permissions

const routes: Routes = [
  { path: '', component: RestaurantListComponent, canActivate: [AuthGuard] },
  { path: 'login', component: RegisterLoginComponent },
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
    BusinessHoursComponent,
    KeyHoursComponent,
    WeekDiscountComponent,
    DayDiscountComponent,
    RestaurantListComponent,
    RestaurantDetailsComponent,
    RestaurantListDeleteDialog,
    RegisterLoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NouisliderModule,
    ChartModule,
    ProgressSpinnerModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    RouterModule.forRoot(routes)
  ],
  entryComponents: [RestaurantListDeleteDialog],
  providers: [SampleService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
