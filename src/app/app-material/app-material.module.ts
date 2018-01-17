import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDialogModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule
  ],
  exports: [
    MatDialogModule
  ]
  declarations: []
})
export class AppMaterialModule { }
