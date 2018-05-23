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
  agreed = false;
  restaurant = {} as any;

  constructor(
    public dialogRef: MatDialogRef<DialogTermsComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private formBuilder: FormBuilder) {

    //If restaurant has already agreed to terms
    if(this.data.restaurant.hasOwnProperty('terms')){

      //Cache restaurant info
      var terms = {
        terms1: true,
        terms2: true,
        terms3: true,
        terms4: true,
        terms5: true,
        terms6: (this.data.restaurant.terms == "false")
      };

      //Form controls and validation
      this.termsForm = this.formBuilder.group({
        terms1: [terms.terms1, Validators.pattern('true')],
        terms2: [terms.terms2, Validators.pattern('true')],
        terms3: [terms.terms3, Validators.pattern('true')],
        terms4: [terms.terms4, Validators.pattern('true')],
        terms5: [terms.terms5, Validators.pattern('true')],
        terms6: [terms.terms6]
      });

      //Disable form
      this.agreed = true;
      this.termsForm.disable();
    }
    else
    //Form controls and validation
      this.termsForm = this.formBuilder.group({
        terms1: [true, Validators.pattern('true')],
        terms2: [true, Validators.pattern('true')],
        terms3: [true, Validators.pattern('true')],
        terms4: [true, Validators.pattern('true')],
        terms5: [true, Validators.pattern('true')],
        terms6: [true]
      });

    //Dialog options
    this.dialogRef.disableClose = true;
  }

  submitForm(){
    this.dialogRef.close(this.termsForm.value);
  }

}
