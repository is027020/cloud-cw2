import { Component,OnInit } from '@angular/core';
import { Airport,AirportsService } from '../airports.service';
import { Flight } from '../flights.service';
import { DataService } from '../data.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit  {
  airports:Airport[]=[];
  flights:Flight[]=[];
  mapReduceResult:any=[];
  constructor(private airportsService:AirportsService,
    private dataService:DataService) {

    }
  ngOnInit() {
   
    // reading csv file is an async process - this is done in DataService - a full Angular implementation would
    //have the page components subscribe to Observables tand refresh the data /calculations each time new data is added
    //for prototype purposes the data is loaded and Map Reduce functions called on page initialisation
   
    this.loadAirportData();
    this.loadFlightData();
    this.updateFlightNumbers();
    
    }

    private loadAirportData() {
      
    this.airports=this.dataService.loadCorrectedAirports(this.airports);
    
    }

    private loadFlightData() {
      
      this.flights=this.dataService.loadCorrectedFlights(this.flights);
      
    }
    

private updateFlightNumbers()
{
  //map step returns key:airport code and value: 1 for each flight
  //reduce step sums the values by airport code

  //this.mapReduceResult=this.airportsService.reduceAirportFlights(this.airportsService.mapAirportFlights(this.flights));

  this.mapReduceResult=this.airportsService.analyseAirportFlights(this.flights);

  //updating airport display array using mapreduce results - airports with no flight data set to zero

  var i=0;
  var j=0;
  var codeFound=0;

  for (i=0;i<this.airports.length;i++){
   codeFound=0;
   for(j=0;j<this.mapReduceResult.length;j++){

    if(this.airports[i].code==this.mapReduceResult[j].key){
      this.airports[i].numFlights=this.mapReduceResult[j].value;
      codeFound=1;
    }
   }
   if(codeFound==0){
    this.airports[i].numFlights="0";
   }
   

  }

  this.airports= this.airports.sort(function (a, b) {
    return Number(b.numFlights) - Number(a.numFlights);
  });
}

 

   
    private saveToFile() {

// save airport flight data to a text file

      this.dataService.saveArrayToFile(this.airports,'AirportFlights');
    }
}


