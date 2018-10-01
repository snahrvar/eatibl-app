import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component, OnInit } from '@angular/core';
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {} from '@types/googlemaps';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit {

  constructor(private mapsAPILoader: MapsAPILoader, private http: HttpClient) {}

  mapOptions = {} as any;
  apiUrl = environment.apiURL;
  heatmapData: google.maps.LatLng[] = [];
  currentMap: any;
  heatmap: any;
  maxIntensity: number = 10;
  rangeDates: Date[] = [new Date("July 26 2018"), new Date("Dec 31 2019")];

  resultArray: any; //for storing API result

  ngOnInit() {
    //Set google map options
    this.mapOptions = {
      latitude: 43.6532,
      longitude: -79.3832,
      zoom: 14
    }
  }

  createHeatMap(mapInstance){
    this.currentMap = mapInstance; //cache map instance in component variable

    var postObj = {dateRange: this.rangeDates};
    this.http.post(this.apiUrl + '/analytics/geolocation', postObj)
      .subscribe(
        res => {
          //if we have existing heatmap, remove it
          if(typeof(this.heatmap) == 'object'){
            this.heatmap.setMap(null);
            this.heatmap = [];
            this.heatmapData = [];
          }

          this.resultArray = res;

          //format back-end data into google maps friendly format
          for (var i = 0; i < this.resultArray.length; i++){
            var current = new google.maps.LatLng(Number(this.resultArray[i].lat),Number(this.resultArray[i].lng));
            this.heatmapData[i] = current;
          }

          //generate heatmap layer
          this.heatmap = new google.maps.visualization.HeatmapLayer({
            data: this.heatmapData
          });

          //establish heatmap settings
          this.heatmap.set('radius', 20);
          this.heatmap.set('dissipating', true);

          if(this.resultArray.length > 10000)
            this.heatmap.set('maxIntensity', 15);
          if(this.resultArray.length < 1000)
            this.heatmap.set('maxIntensity', 10);
          else
            this.heatmap.set('maxIntensity', 12);


          //apply heatmap to the actual map
          this.heatmap.setMap(this.currentMap);
        },
        err => {
          console.log("Error occurred");
        }
      );



  }

}
