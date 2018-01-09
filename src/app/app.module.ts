import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {Routes, RouterModule} from "@angular/router";
import { FormsModule } from '@angular/forms';
import { NouisliderModule } from 'ng2-nouislider';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BusinessHoursComponent } from './business-hours/business-hours.component';
import { KeyHoursComponent } from './key-hours/key-hours.component';

const routes: Routes = [
  { path: 'step1', component: BusinessHoursComponent },
  { path: 'step2', component: KeyHoursComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BusinessHoursComponent,
    KeyHoursComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NouisliderModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
