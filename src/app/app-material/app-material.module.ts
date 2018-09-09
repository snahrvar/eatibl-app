import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDialogModule, MatListModule, MatTooltipModule, MatTabsModule, MatTableModule, MatInputModule, MatSortModule, MatPaginatorModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatListModule,
    MatTooltipModule,
    MatTabsModule,
    MatTableModule,
    MatInputModule,
    MatSortModule,
    MatPaginatorModule
  ],
  exports: [
    MatDialogModule,
    MatListModule,
    MatTooltipModule,
    MatTabsModule,
    MatTableModule,
    MatInputModule,
    MatSortModule,
    MatPaginatorModule
  ],
  declarations: []
})
export class AppMaterialModule { }
