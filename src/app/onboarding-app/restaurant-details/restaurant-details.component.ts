import { Component, OnInit, Input, Renderer2 } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../environments/environment';
import { FunctionsService } from './../../_services/functions.service';

@Component({
  selector: 'app-restaurant-details',
  templateUrl: 'restaurant-details.component.html',
  styleUrls: ['restaurant-details.component.scss']
})
export class RestaurantDetailsComponent implements OnInit {
  private sub: any;
  action: any;
  restaurantId: number;
  restaurant: Object = {
    contacts: [],
    recommendedItems: [],
    dineIn: true,
    takeOut: false,
    featuredImage: String,
    images: []
  };
  contentLoaded = false; //Prevent content from loading until api calls are returned
  submitted = false; //Used to disable submit button once pressed
  apiUrl = environment.apiURL;

  //initialize file Uploader stuff
  fileURL:string;
  public uploader:FileUploader;

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

  constructor( private http: HttpClient, private route:ActivatedRoute, private router: Router, private functions: FunctionsService, private renderer: Renderer2) {

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
              this.setRestaurantName(this.restaurant['name']);
              this.contentLoaded = true;
              console.log(this.restaurant)
            },
            err => {
              console.log("Error occurred");
            }
          );
      else
        this.contentLoaded = true;
    });
  }

  //Upload all images in the queue
  uploadImages(){

    for(var i = 0; i < this.uploader.queue.length; i++){

      var currentName = this.uploader.queue[i].file.name,
          temp = currentName.split("."),
          extension = temp[temp.length-1]; //the last piece is the extension

      this.uploader.queue[i].file.name = "file-"+Date.now()+i+'.'+extension; //rename to a unique file for backend
    }

    //upload them bad boys
    this.uploader.uploadAll();

    this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
      var currentName = item.file.name;
      if(this.restaurant['images'].length == 0)
        this.restaurant['featuredImage'] = currentName;
      this.restaurant['images'].push(currentName); //add these files to the restaurant entry so that when we submit, they will be linked
    };
    console.log(this.restaurant)
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
  }

  removeContact(index){
    this.restaurant['contacts'].splice(index, 1);
  }

  addMenuItem(){
    var recommendedItem = {
      item: '',
      price: ''
    };
    this.restaurant['recommendedItems'].push(recommendedItem);
  }

  removeMenuItem(index){
    this.restaurant['recommendedItems'].splice(index, 1);
  }

  submitRestaurant(){
    console.log(this.restaurant);
    this.submitted = true;
    this.http.post(this.apiUrl + '/restaurant/create', this.restaurant)
      .subscribe(
        res => { //Returns restaurant ID
          console.log(res);
          this.setRestaurantName(this.restaurant['name']);
          this.router.navigateByUrl('/' + res + '/hours');
        },
        err => {
          console.log(err);
        }
      );
  }

  toggleActive(event){
    if(event.target.classList.value.indexOf("active") >= 0){
      this.renderer.removeClass(event.target,"active");
    }
    else{
      this.renderer.addClass(event.target,"active");
    }
  }

  deleteImage(index){
    var filename = this.restaurant['images'][index];
    if(this.restaurantId)
      this.http.get(this.apiUrl + '/restaurant/' + this.restaurantId + '/' + filename + '/remove')
        .subscribe(
          res => {
            this.restaurant['images'].splice(index, 1);

            //if featured image is deleted, update it
            if(filename == this.restaurant['featuredImage'])
              this.restaurant['featuredImage'] = this.restaurant['images'].length > 0 ? this.restaurant['images'][0] : '';
          },
          err => {
            console.log("Error occurred");
          }
        );
    else{
      this.restaurant['images'].splice(index, 1);

      //if featured image is deleted, update it
      if(filename == this.restaurant['featuredImage'])
        this.restaurant['featuredImage'] = this.restaurant['images'].length > 0 ? this.restaurant['images'][0] : '';
    }
  }

  setFeaturedImage(image){
    this.restaurant['featuredImage'] = image;
    console.log(this.restaurant)
  }

  ngOnInit() {
  }

}
