import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {Routes, RouterModule} from "@angular/router";
import { FormsModule } from '@angular/forms';
import { NouisliderModule } from 'ng2-nouislider';
import { ChartModule } from 'primeng/primeng';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BusinessHoursComponent } from './business-hours/business-hours.component';
import { KeyHoursComponent } from './key-hours/key-hours.component';
import { WeekDiscountComponent } from './week-discount/week-discount.component';
import { DayDiscountComponent } from './day-discount/day-discount.component';

const routes: Routes = [
  { path: 'step1', component: BusinessHoursComponent },
  { path: 'step2', component: KeyHoursComponent },
  { path: 'step3', component: WeekDiscountComponent },
  { path: 'step3/:day', component: DayDiscountComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BusinessHoursComponent,
    KeyHoursComponent,
    WeekDiscountComponent,
    DayDiscountComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NouisliderModule,
    ChartModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
