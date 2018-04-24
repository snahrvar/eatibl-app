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
  response: any;
  confirmDialogRef: MatDialogRef<DialogConfirmComponent>;


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
        Validators.pattern('[a-zA-Z0-9.-]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}')
      ])
      ],
      password: ['', Validators.compose([
          Validators.required,
          Validators.minLength(8)
        ])
      ]
    });
    //Watch for changes to the form
    this.registerForm.valueChanges.subscribe(data => {
      this.submitAttempt = false;
      console.log('changed')
    })
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.newUser.restaurant_fid = params['restaurantId'];

      this.http.get(this.apiUrl + '/restaurant/' + params['restaurantId'])
        .subscribe(
          res => {
            this.restaurant = res;
            this.contentLoaded = true;
          },
          err => {
            console.log("Error occurred");
          }
        );
    });
  }

  submitRegister(){
    if(!this.registerForm.valid){
      Object.keys(this.registerForm.controls).forEach(field => { // {1}
        const control = this.registerForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
      this.submitAttempt = true;
    }
    else
      this.http.post(this.apiUrl + '/restaurant/'+this.newUser.restaurant_fid+'/register', this.registerForm.value)
        .subscribe(
          res => { //Returns restaurant ID
            this.response = res;
            if(this.response.message == 'email taken')
              console.log('email takenn');
            else if(this.response.message == 'error')
              console.log('there was an error');
            else {
              this.confirmDialogRef = this.dialog.open(DialogConfirmComponent, {
                data: {
                  title: "Account Created",
                  message: "Account successfully created. Would you like to create another?"
                }
              });
              this.confirmDialogRef.afterClosed().subscribe(result => {
                if(result)
                  this.registerForm.reset();
                else
                  this.router.navigateByUrl('/');
              })
            }
          },
          err => {
            console.log(err);
          }
        );
  }

}
