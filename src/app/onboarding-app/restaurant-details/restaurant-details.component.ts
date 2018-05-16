import { Component, OnInit, Renderer2 } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DialogConfirmComponent } from '../../dialog-confirm/dialog-confirm.component';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../environments/environment';
import { FunctionsService } from './../../_services/functions.service';
import { DialogTermsComponent } from '../../dialog-terms/dialog-terms.component';
import { map } from 'rxjs/operators';
import * as _ from 'underscore';
import * as decode from 'jwt-decode';

@Component({
  selector: 'app-restaurant-details',
  templateUrl: 'restaurant-details.component.html',
  styleUrls: ['restaurant-details.component.scss']
})
export class RestaurantDetailsComponent implements OnInit {
  //Initialize variables
  private sub: any;
  restaurant: Object = {
    name: '',
    contacts: [],
    recommendedItems: [],
    dineIn: true,
    takeOut: false,
    featuredImage: String,
    images: [],
    categories: []
  };
  restaurantId: any;
  action: any; //Either edit restaurant or add restaurant
  contentLoaded = false; //Prevent content from loading until api calls are returned
  submitted = false; //Used to disable submit button once pressed
  apiUrl = environment.apiURL;
  imageApiUrl = environment.imageApiURL;
  restaurantSaved = true; //Used to toggle disabled on the save button
  restaurantCached = {} as any; //To compare to edits
  confirmDialogRef: MatDialogRef<DialogConfirmComponent>;
  termsDialogRef: MatDialogRef<DialogTermsComponent>;
  userData: any; //Store decoded user data from local storage
  selectedTab: number; //Selects the tab based on the numerical index

  //initialize file Uploader stuff
  fileURL:string;
  public uploader:FileUploader;

  //Initializations for autocomplete
  categories: string[] = [];
  filteredCategories: any[];
  resObject = {} as any; //Need to cache res object when requesting all categories to use .length

  filterCategories(event) {
    this.filteredCategories = [];
    for(let i = 0; i < this.categories.length; i++) {
      let category = this.categories[i];
      if(category.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
        this.filteredCategories.push(category);
      }
    }
  }

  //turn off credentials, because it conflicts with CORS setting on backend
  ngAfterViewInit() {
    this.uploader.onAfterAddingFile = (item => {
      item.withCredentials = false;
    });
    this.uploader.onCompleteItem = () => {
      this.http.get(this.apiUrl + '/restaurant/' + this.restaurantId)
        .subscribe(
          res => {
            this.restaurant = res;
          },
          err => {
            console.log("Error occurred");
          }
        );
    };
  }

  constructor( private http: HttpClient, private route:ActivatedRoute, private router: Router, private functions: FunctionsService, private renderer: Renderer2, public dialog: MatDialog) {
  }

  //Open terms of agreement
  termsDialog(restaurant){
    //Opens restaurant agreement form
    this.termsDialogRef = this.dialog.open(DialogTermsComponent, {
      data: {
        restaurant: restaurant
      }
    });
    //Handle agreement form answer
    this.termsDialogRef.afterClosed().subscribe(result => {
      if(result){
        this.restaurant['terms'] = {
          name: result.name,
          terms1: result.terms1,
          terms2: result.terms2,
          terms3: result.terms3,
          terms4: result.terms4,
          terms5: result.terms5,
          terms6: result.terms6,
          timestamp: Date.now()
        };
        this.onChanges();
      }
    });
  }

  //Upload all images in the queue
  uploadImages(){
    //upload them bad boys
    this.uploader.uploadAll();

    this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
      var serverResponse = JSON.parse(response);
      var currentName = serverResponse.file; //get updated filename from API response
      if(this.restaurant['images'].length == 0)
        this.restaurant['featuredImage'] = currentName;
      this.restaurant['images'].push(currentName); //add these files to the restaurant entry so that when we submit, they will be linked
      this.onChanges();
    };
  }

  setRestaurantName(name){
    this.functions.changeRestaurantName(name);
  }

  addContact(){
    var contact = {
      name: '',
      position: '',
      email: '',
      phone: '',
      notes: ''
    };
    this.restaurant['contacts'].push(contact);
    this.onChanges();
  }

  removeContact(index){
    this.restaurant['contacts'].splice(index, 1);
    this.onChanges();
  }

  addMenuItem(){
    var recommendedItem = {
      item: '',
      price: ''
    };
    this.restaurant['recommendedItems'].push(recommendedItem);
    this.onChanges();
  }

  removeMenuItem(index){
    this.restaurant['recommendedItems'].splice(index, 1);
    this.onChanges();
  }

  submitRestaurant(){
    this.submitted = true;
    this.http.post(this.apiUrl + '/restaurant/create', this.restaurant)
      .subscribe(
        res => { //Returns restaurant ID
          this.restaurantId = res;
          this.setRestaurantName(this.restaurant['name']);
          this.restaurantSaved = true;
          this.submitted = false;
          this.restaurantCached = JSON.parse(JSON.stringify(this.restaurant)); //Cache restaurant object in a way that wont be bound to this.restaurant
        },
        err => {
          console.log(err);
        }
      );
  }

  //Navigate to main restaurant list
  prevPage(){
    if(this.userData.type != 'Restaurant') { //for admin
      if (!this.restaurantSaved) {
        this.confirmDialogRef = this.dialog.open(DialogConfirmComponent, {
          data: {
            title: "Unsaved Data",
            message: "You have unsaved changes to this restaurant. Are you sure you would like to continue?"
          }
        });
        this.confirmDialogRef.afterClosed().subscribe(result => {
          if (result)
            this.router.navigateByUrl('/restaurantList');
        })
      }
      else
        this.router.navigateByUrl('/restaurantList');
    }
    else //for restaurants
      this.router.navigate(['/restaurant/' + this.userData.restaurant_fid + '/settings']);
  }

  //Navigate to business hours page
  nextPage(){
    if(!this.restaurantSaved){
      this.confirmDialogRef = this.dialog.open(DialogConfirmComponent, {
        data: {
          title: "Unsaved Data",
          message: "You have unsaved changes to this restaurant. Are you sure you would like to continue?"
        }
      });
      this.confirmDialogRef.afterClosed().subscribe(result => {
        if(result)
          this.router.navigateByUrl('/' + this.restaurantId + '/hours');
      })
    }
    else
      this.router.navigateByUrl('/' + this.restaurantId + '/hours');
  }

  //Select image to show delete button
  toggleActive(event){
    var isActive = false;
    for(var i = 0; i < event.target.classList.length; i++){
      if(event.target.classList[i] == 'active')
        isActive = true;
    }
    if(isActive){
      this.renderer.removeClass(event.target,"active");
    }
    else{
      this.renderer.addClass(event.target,"active");
    }
  }

  deleteImage(index){
    var filename = this.restaurant['images'][index];
    this.restaurant['images'].splice(index, 1);

    //if featured image is deleted, update it
    if(filename == this.restaurant['featuredImage'])
      this.restaurant['featuredImage'] = this.restaurant['images'].length > 0 ? this.restaurant['images'][0] : '';
    this.onChanges();
  }

  setFeaturedImage(image){
    this.restaurant['featuredImage'] = image;
    this.onChanges();
  }

  //When an input is changed, find if the restaurant info is updated to enable the save button
  onChanges(){
    var isEqual = this.functions.compareObjects(this.restaurantCached, this.restaurant);
    if(isEqual)
      this.restaurantSaved = true;
    else
      this.restaurantSaved = false;
  }

  ngOnInit() {
    this.userData = decode(localStorage.getItem('token'));

    //Subscribe to the route parameters
    this.sub = this.route.params.subscribe(params => {
      this.action = params['action'];
      this.restaurantId = params['restaurantId'];

      this.fileURL = this.apiUrl + '/restaurant/uploadImages'; //for file upload route
      this.uploader = new FileUploader({url: this.fileURL, authToken: 'Bearer '+ localStorage.getItem('token')});

      //Only get restaurant information if we are editing an existing one
      if(this.action == 'Edit')

        this.http.get(this.apiUrl + '/restaurant/' + this.restaurantId)
          .subscribe(
            res => {
              this.restaurant = res;
              this.restaurantCached = JSON.parse(JSON.stringify(res)); //Cache restaurant object in a way that wont be bound to this.restaurant
              this.setRestaurantName(this.restaurant['name']);
              this.contentLoaded = true;
            },
            err => {
              console.log("Error occurred");
            }
          );
      else{
        this.restaurantSaved = false;
        this.contentLoaded = true;
      }

      //Import entire list of categories
      this.http.get(this.apiUrl + '/category/all')
        .subscribe(
          res => {
            //Store res in variable to be able to use length
            this.resObject = res;
            for(var i = 0; i < this.resObject.length; i++){
              this.categories.push(this.resObject[i]['name']);
            }
            this.categories = _.sortBy(this.categories, function(name){
              return name;
            })
          }
        )
    });

    //Used for restaurant dashboard access
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        if(params['tab'] == 'items')
          this.selectedTab = 0;
        else if(params['tab'] == 'images')
          this.selectedTab = 1;
      });
  }

}
