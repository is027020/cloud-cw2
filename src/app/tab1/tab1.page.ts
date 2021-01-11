import { Component,OnInit } from '@angular/core';
import { Airport,AirportsService } from '../airports.service';
import { Flight, FlightsService } from '../flights.service';
import { AirportData, FlightData, DataService } from '../data.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit  {
  airports:Airport[]=[];
  flights:Flight[]=[];
  mapResult:any=[];
  mapReduceResult:any=[];
  constructor(private airportsService:AirportsService,
    private flightsService:FlightsService,
    private dataService:DataService) {

    }
  ngOnInit() {
   
    // reading csv file is an async process - for prototype purposes its done inside each component - 
    // this would normally be a server side function with data loaded via an API on JSON
   
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

  this.mapReduceResult=this.airportsService.reduceAirportFlights(this.airportsService.mapAirportFlights(this.flights));

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
}

 

    private mapAirportFlights(){
     //test execution of map function from button
      this.mapResult=this.airportsService.mapAirportFlights(this.flights);

      var i=0;
      for (i=0;i<this.mapResult.length;i++){
      //console.log(" key "+this.mapResult[i].key+" value "+this.mapResult[i].value);

        }
    }
    

    private reduceAirportFlights(){
    //test execution of reduce function from button
      var reduceResult:any=[];
     // console.log("calling reduce "+this.mapResult.length);
      this.airportsService.reduceAirportFlights(this.mapResult);

    }

    private saveToFile() {
      this.dataService.saveArrayToFile(this.airports,'AirportFlights');
    }
}


