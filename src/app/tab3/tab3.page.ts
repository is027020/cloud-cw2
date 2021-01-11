import { Component } from '@angular/core';
import { Airport,AirportsService } from '../airports.service';
import { Flight, FlightsService } from '../flights.service';
import { AirportData, FlightData, DataService } from '../data.service';
import { PassengerData,PassengersService } from '../passengers.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  airports:Airport[]=[];
  flights:Flight[]=[];
  mapResult:any=[];
  mapReduceResult:any=[];
  passengers:any=[];
  constructor(private airportsService:AirportsService,
    private dataService:DataService,
    private flightsService:FlightsService,
    private passengersService:PassengersService) {}


ngOnInit() {
   
  /** reading csv file is an async process - for prototype purposes its done inside each component - 
  this would normally be a server side function with data loaded via an API in JSON format */ 

  this.loadAirportData();
  this.loadFlightData();
  this.updateAirmiles();
  
  }

  private loadAirportData() {
      
    this.airports=this.dataService.loadCorrectedAirports(this.airports);
    
    }
  private loadFlightData() {
    
    this.flights=this.dataService.loadCorrectedFlights(this.flights);
   
    }

 
    private updateAirmiles()
    {
      //map step returns key:flight  and value: 1 for each flight + passengerid and calculated dep_time,arr_time and duration
      //reduce step sums the values by flight and packs the passenegr ids into an array
      
      this.mapReduceResult=this.passengersService.reducePassengerAirmiles(this.passengersService.mapPassengerAirmiles(this.flights,this.airports));
    
      //updating flights display array using mapreduce results 
      var i=0;
      var j=0;
      var codeFound=0;
      var dateObject: Date;
      var passengerList=[];
    
      passengerList=this.mapReduceResult.sort(function (a, b) {
        return b.value - a.value;
      });

      for (i=0;i<passengerList.length;i++){
        
          this.passengers.push({passenger:passengerList[i].key,airmiles:passengerList[i].value,rank:i+1});
        
      }


       }

    private mapPassengers(){
      //test execution of map function from button
       this.mapResult=this.passengersService.mapPassengerAirmiles(this.flights,this.airports);
 
       var i=0;
       for (i=0;i<this.mapResult.length;i++){
      // console.log(" key "+this.mapResult[i].key+" dep "+this.mapResult[i].dep_time+" arr "+this.mapResult[i].arr_time+ 
      // " dur "+this.mapResult[i].duration+" pass "+this.mapResult[i].passenger);
 
         }
     }
     private reducePassengers(){
      //test execution of reduce function from button
     var reduceResult:any=[];
      // console.log("calling reduce "+this.mapResult.length);
      this.passengersService.reducePassengerAirmiles(this.mapResult);
    
        }

        private saveToFile() {
          this.dataService.saveArrayToFile(this.passengers,'PassengerAirMiles');
        }
  }