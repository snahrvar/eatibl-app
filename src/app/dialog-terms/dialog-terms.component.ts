import { Component, Inject } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog-terms',
  templateUrl: './dialog-terms.component.html',
  styleUrls: ['./dialog-terms.component.scss']
})
export class DialogTermsComponent {

  termsForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogTermsComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private formBuilder: FormBuilder) {
    //Form controls and validation
    this.termsForm = this.formBuilder.group({
      terms1: [true, Validators.pattern('true')],
      terms2: [true, Validators.pattern('true')],
      terms3: [true, Validators.pattern('true')],
      terms4: [true, Validators.pattern('true')],
      terms5: [true, Validators.pattern('true')],
      terms6: [true]
    });
  }

  submitForm(){
    this.dialogRef.close(this.termsForm.value);
  }

}
