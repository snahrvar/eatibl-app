import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDialogModule, MatListModule, MatTooltipModule, MatTabsModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatListModule,
    MatTooltipModule,
    MatTabsModule
  ],
  exports: [
    MatDialogModule,
    MatListModule,
    MatTooltipModule,
    MatTabsModule
  ],
  declarations: []
})
export class AppMaterialModule { }
