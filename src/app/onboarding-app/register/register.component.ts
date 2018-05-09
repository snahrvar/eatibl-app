import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DialogConfirmComponent } from '../../dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  private sub: any;
  contentLoaded = false; //Prevent content from loading until api calls are returned
  apiUrl = environment.apiURL;
  newUser = {
    name: '',
    email: '',
    phone: '',
    password: '',
    type: 'Restaurant',
    restaurant_fid: ''
  };
  registerForm: FormGroup;
  restaurant: any;
  submitAttempt = false;
  agreementDeclined = false;
  response: any;
  confirmDialogRef: MatDialogRef<DialogConfirmComponent>;
  registerError = false; //For unhandled errors in the registration process
  emailTaken = false;


  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, public dialog: MatDialog) {
    this.contentLoaded = false;
    //Form controls and validation
    this.registerForm = this.formBuilder.group({
      name: ['',  Validators.required],
      phone: ['',  Validators.compose([
          Validators.required,
          Validators.pattern('[0-9 ()-]*')
        ])
      ],
      email: ['',  Validators.compose([
        Validators.required,
        Validators.email
      ])
      ],
      password: ['', Validators.compose([
          Validators.required,
          Validators.minLength(8)
        ])
      ]
    });
    //Watch for changes to the form and reset form errors
    this.registerForm.valueChanges.subscribe(data => {
      this.submitAttempt = false;
      this.emailTaken = false;
      this.registerError = false;
      this.agreementDeclined = false;
    })
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.newUser.restaurant_fid = params['restaurantId'];

      this.http.get(this.apiUrl + '/restaurant/' + params['restaurantId'])
        .subscribe(
          res => {
            this.restaurant = res;
            this.contentLoaded = true; //Only show view when all the data has loaded
          },
          err => {
            console.log("Error occurred");
          }
        );
    });
  }

  submitRegister(){
    this.submitAttempt = true;

    //If form is invalid, stop submit
    if(!this.registerForm.valid){
      Object.keys(this.registerForm.controls).forEach(field => { // {1}
        const control = this.registerForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }

    //If form is valid, continue on
    else {

      this.http.post(this.apiUrl + '/restaurant/' + this.newUser.restaurant_fid + '/register', this.registerForm.value)
        .subscribe(
          res => {
            this.response = res;

            if (this.response.message == 'email taken')
              this.emailTaken = true;

            else if (this.response.message == 'error')
              this.registerError = true;

            //If user created successfully
            else {
              //Ask if user wants to create another account
              this.confirmDialogRef = this.dialog.open(DialogConfirmComponent, {
                data: {
                  title: "Account Created",
                  message: "Account successfully created. Would you like to create another?"
                }
              });

              //Handle whether user wants to create more accounts or not
              this.confirmDialogRef.afterClosed().subscribe(result => {
                if (result)
                  this.registerForm.reset();
                else
                  this.router.navigateByUrl('/restaurantList');
              })
            }
          },
          err => {
            console.log(err);
          }
        );
    }
  }
}
