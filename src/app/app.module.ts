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
import { PrimeNgModule } from './prime-ng/prime-ng.module'; //PrimeNG components
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//Services
import {ClockService} from "./_services/clock.service";
import { SampleService } from './sample.service';
import { UserService } from './_services/user.service.ts';

import { AppComponent } from './app.component';
import { RegisterLoginComponent } from './register-login/register-login.component';
import { FunctionsService } from './_services/functions.service';
import { AuthGuard } from './_guards/auth.guard'; //login permissions
import { DialogConfirmComponent } from './dialog-confirm/dialog-confirm.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './http-interceptor';

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
    PrimeNgModule,
    OnboardingAppModule,
    RestaurantAppModule,
    RouterModule.forRoot(routes)
  ],
  entryComponents: [DialogConfirmComponent],
  providers: [SampleService, ClockService, FunctionsService, UserService, AuthGuard, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
