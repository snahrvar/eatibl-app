import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDialogModule, MatListModule, MatTooltipModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatListModule,
    MatTooltipModule
  ],
  exports: [
    MatDialogModule,
    MatListModule,
    MatTooltipModule
  ],
  declarations: []
})
export class AppMaterialModule { }
