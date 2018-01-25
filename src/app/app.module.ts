import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {Routes, RouterModule} from "@angular/router";
import { FormsModule } from '@angular/forms';
import 'hammerjs';

//Modules
import { OnboardingAppModule, onboardingComponents } from './onboarding-app/onboarding-app.module';
import { RestaurantAppModule, restaurantComponents } from './restaurant-app/restaurant-app.module';
import { AppMaterialModule } from './app-material/app-material.module'; //Angular Material components
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { RegisterLoginComponent } from './register-login/register-login.component';
import { SampleService } from './sample.service';
import { LoginService } from './_services/login.service';
import { AuthGuard } from './_guards/auth.guard'; //login permissions
import { DialogConfirmComponent } from './dialog-confirm/dialog-confirm.component';

const routes: Routes = [
  { path: 'login', component: RegisterLoginComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    RegisterLoginComponent,
    DialogConfirmComponent,
    onboardingComponents
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    OnboardingAppModule,
    RestaurantAppModule,
    RouterModule.forRoot(routes)
  ],
  entryComponents: [DialogConfirmComponent],
  providers: [SampleService, LoginService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
