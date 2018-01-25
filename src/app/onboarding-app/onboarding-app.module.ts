import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '../_guards/auth.guard'; //login permissions
import {Routes, RouterModule} from "@angular/router";
import { NouisliderModule } from 'ng2-nouislider';
import { ChartModule, ProgressSpinnerModule } from 'primeng/primeng';

import { BusinessHoursComponent } from '../onboarding-app/business-hours/business-hours.component';
import { KeyHoursComponent } from '../onboarding-app/key-hours/key-hours.component';
import { WeekDiscountComponent } from '../onboarding-app/week-discount/week-discount.component';
import { DayDiscountComponent } from '../onboarding-app/day-discount/day-discount.component';
import { RestaurantListComponent } from '../onboarding-app/restaurant-list/restaurant-list.component';
import { RestaurantDetailsComponent } from '../onboarding-app/restaurant-details/restaurant-details.component'

const routes: Routes = [
  { path: '', component: RestaurantListComponent, canActivate: [AuthGuard] },
  { path: ':restaurantId/hours', component: BusinessHoursComponent, canActivate: [AuthGuard]  },
  { path: ':restaurantId/keyHours', component: KeyHoursComponent, canActivate: [AuthGuard]  },
  { path: ':restaurantId/pricing/week', component: WeekDiscountComponent, canActivate: [AuthGuard]  },
  { path: ':restaurantId/pricing/:day', component: DayDiscountComponent, canActivate: [AuthGuard]  },
  { path: 'restaurant/:action', component: RestaurantDetailsComponent, canActivate: [AuthGuard]  },
  { path: ':restaurantId/:action', component: RestaurantDetailsComponent, canActivate: [AuthGuard]  },
];

@NgModule({
  imports: [
    CommonModule,
    NouisliderModule,
    ChartModule,
    ProgressSpinnerModule,
    RouterModule.forRoot(routes)
  ],
  exports: [ProgressSpinnerModule, NouisliderModule, ChartModule],
  providers: [AuthGuard],
})
export class OnboardingAppModule { }

export const onboardingComponents = [RestaurantDetailsComponent, RestaurantListComponent, DayDiscountComponent, WeekDiscountComponent, KeyHoursComponent, BusinessHoursComponent];
