import { Component, Inject } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
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
  submitAttempt = false;
  patternError = false;

  constructor(
    public dialogRef: MatDialogRef<DialogTermsComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private formBuilder: FormBuilder) {

    //If restaurant has already agreed to terms
    if(this.data.restaurant.hasOwnProperty('terms') && this.data.restaurant.terms != null){

      //Cache restaurant info
      var terms = {
        terms1: true,
        terms2: true,
        terms3: true,
        terms4: true,
        terms5: true,
        terms6: typeof this.data.restaurant.terms.terms6 == "boolean" ? this.data.restaurant.terms.terms6 : this.data.restaurant.terms.terms6 == "true",
        fee: this.data.restaurant.terms.fee
      };

      //Form controls and validation
      this.termsForm = this.formBuilder.group({
        terms1: [terms.terms1, Validators.pattern('true')],
        terms2: [terms.terms2, Validators.pattern('true')],
        terms3: [terms.terms3, Validators.pattern('true')],
        terms4: [terms.terms4, Validators.pattern('true')],
        terms5: [terms.terms5, Validators.pattern('true')],
        terms6: [terms.terms6],
        fee: [terms.fee, this.needsFee]
      });

      //Disable form
      this.agreed = true;
      this.termsForm.disable();
    }
    else{

      //Form controls and validation
      this.termsForm = this.formBuilder.group({
        terms1: [true, Validators.pattern('true')],
        terms2: [true, Validators.pattern('true')],
        terms3: [true, Validators.pattern('true')],
        terms4: [true, Validators.pattern('true')],
        terms5: [true, Validators.pattern('true')],
        terms6: [true],
        fee: [1, this.needsFee]
      });
    }

    //Dialog options
    this.dialogRef.disableClose = true;
  }

  submitForm(){
    this.patternError = false;
    //Checked if any of the terms 1-5 are unchecked
    Object.keys(this.termsForm.controls).forEach(field => {
      if(this.termsForm.get(field).hasError('pattern'))
        this.patternError = true;
    });

    //Check if form has errors
    if(this.termsForm['controls'].fee.hasError('needsFee') || this.patternError)
      this.submitAttempt = true;
    else
      this.dialogRef.close(this.termsForm.value);
  }

  //Custom vaildator for fee input
  needsFee(input: FormControl){
    //Error handling? From stack overflow
    if (!input.root || !input.root['controls']){
      return null;
    }

    //Returns true (ie has error) if terms6 is checked but fee input is empty
    var term6Checked = input.root['controls'].terms6.value;
    if(term6Checked && !input.root['controls'].fee.value)
      return { needsFee: true };
    else
      return null;
  }

  //Checks needsFee validator when terms 6 is checked or unchecked
  feeValidator(){
    this.termsForm.controls["fee"].updateValueAndValidity();
  }

}
