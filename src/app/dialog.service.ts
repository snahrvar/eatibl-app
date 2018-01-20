import { Observable } from 'rxjs/Rx';
import { DialogConfirmComponent } from './dialog-confirm/dialog-confirm.component';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import { Injectable } from '@angular/core';

@Injectable()
export class DialogService {

  constructor(private dialog: MatDialog) { }

  // public confirm(title: string, message: string): Observable<boolean> {

    // let dialogRef: MatDialogRef<DialogConfirmComponent>;
    //
    // dialogRef = this.dialog.open(DialogConfirmComponent);
    //
    // dialogRef.componentInstance.title = title;
    // dialogRef.componentInstance.message = message;
    //
    // return dialogRef.afterClosed();
  // }

}
