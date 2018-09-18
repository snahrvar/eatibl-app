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

  ngOnInit() {
    //Set google map options
    this.mapOptions = {
      latitude: 43.6532,
      longitude: -79.3832,
      zoom: 14
    }
  }

  createHeatMap(mapInstance){

    this.http.get(this.apiUrl + '/analytics/geolocation')
      .subscribe(
        res => {
          let resultArray: any;
          resultArray = res;

          for (var i = 0; i < resultArray.length; i++){
            var current = new google.maps.LatLng(Number(resultArray[i].lat),Number(resultArray[i].lng));
            this.heatmapData[i] = current;
          }

          var heatmap = new google.maps.visualization.HeatmapLayer({
            data: this.heatmapData
          });

          heatmap.set('radius', 20);
          heatmap.set('maxIntensity', 15);
          heatmap.set('dissipating', true);

          heatmap.setMap(mapInstance);
        },
        err => {
          console.log("Error occurred");
        }
      );



  }

}
