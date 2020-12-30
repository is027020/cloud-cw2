import { Component } from '@angular/core';
import { Airport,AirportsService } from '../airports.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  airports:Airport[]=[];
  constructor(private airportsService:AirportsService) {
    this.airports=this.airportsService.getAllAirports();
    console.log("result of getAll "+this.airports[0].code);

  }

  
}
