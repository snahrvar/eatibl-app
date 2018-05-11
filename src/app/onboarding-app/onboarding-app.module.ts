import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard, AuthGuardAdmin } from '../_guards/auth.guard'; //login permissions
import {Routes, RouterModule} from "@angular/router";
import { NouisliderModule } from 'ng2-nouislider';
import {MatTooltipModule, MatTabsModule} from '@angular/material';

import { BusinessHoursComponent } from '../onboarding-app/business-hours/business-hours.component';
import { KeyHoursComponent } from '../onboarding-app/key-hours/key-hours.component';
import { WeekDiscountComponent } from '../onboarding-app/week-discount/week-discount.component';
import { DayDiscountComponent } from '../onboarding-app/day-discount/day-discount.component';
import { RestaurantListComponent } from '../onboarding-app/restaurant-list/restaurant-list.component';
import { RestaurantDetailsComponent } from '../onboarding-app/restaurant-details/restaurant-details.component'
import { RegisterComponent } from '../onboarding-app/register/register.component'

const routes: Routes = [
  { path: 'restaurantList', component: RestaurantListComponent, canActivate: [AuthGuardAdmin] },
  { path: ':restaurantId/hours', component: BusinessHoursComponent, canActivate: [AuthGuard]  },
  { path: ':restaurantId/keyHours', component: KeyHoursComponent, canActivate: [AuthGuard]  },
  { path: ':restaurantId/pricing/week', component: WeekDiscountComponent, canActivate: [AuthGuard]  },
  { path: ':restaurantId/pricing/:day', component: DayDiscountComponent, canActivate: [AuthGuard]  },
  { path: 'restaurant/:action', component: RestaurantDetailsComponent, canActivate: [AuthGuard]  },
  { path: ':restaurantId/register', component: RegisterComponent, canActivate: [AuthGuardAdmin]  },
  { path: ':restaurantId/:action', component: RestaurantDetailsComponent, canActivate: [AuthGuard]  }
];

@NgModule({
  imports: [
    CommonModule,
    NouisliderModule,
    MatTooltipModule,
    MatTabsModule,
    RouterModule.forRoot(routes)
  ],
  exports: [NouisliderModule],
  providers: [AuthGuard],
})
export class OnboardingAppModule { }

export const onboardingComponents = [RestaurantDetailsComponent, RestaurantListComponent, DayDiscountComponent, WeekDiscountComponent, KeyHoursComponent, BusinessHoursComponent, RegisterComponent];
