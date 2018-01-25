import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDialogModule, MatListModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatListModule
  ],
  exports: [
    MatDialogModule,
    MatListModule
  ],
  declarations: []
})
export class AppMaterialModule { }
