import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {Routes, RouterModule} from "@angular/router";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';
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
import { UserService } from './_services/user.service';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './onboarding-app/register/register.component';
import { FunctionsService } from './_services/functions.service';
import { AuthGuard, AuthGuardAdmin } from './_guards/auth.guard'; //login permissions
import { DialogConfirmComponent } from './dialog-confirm/dialog-confirm.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor, CacheInterceptor } from './http-interceptor';
import { DialogTermsComponent } from './dialog-terms/dialog-terms.component';
import { DialogForgotPasswordComponent } from './dialog-forgot-password/dialog-forgot-password.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DialogConfirmComponent,
    onboardingComponents,
    RegisterComponent,
    HomeComponent,
    DialogTermsComponent,
    DialogForgotPasswordComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    PrimeNgModule,
    FileUploadModule,
    OnboardingAppModule,
    RestaurantAppModule,
    RouterModule.forRoot(routes)
  ],
  entryComponents: [DialogConfirmComponent, DialogTermsComponent, DialogForgotPasswordComponent],
  providers: [SampleService, ClockService, FunctionsService, UserService, AuthGuard, AuthGuardAdmin,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true}
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
