import { Component } from '@angular/core';
import {ActionSheetController} from '@ionic/angular'
import {AlertController} from '@ionic/angular'
import {ModalController} from '@ionic/angular'
import { Flight, FlightsService } from '../flights.service';
import { AirportData, FlightData, DataService } from '../data.service';
import { PassengerListPage } from '../passenger-list/passenger-list.page';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  flightdata:Flight[]=[];
  flights:any=[];
  mapResult:any=[];
  mapReduceResult:any=[];
  constructor(private dataService:DataService, private flightsService:FlightsService,private modalController:ModalController) {}
  ngOnInit() {
   
    // reading csv file is an async process - for prototype purposes its done inside each component - 
    // this would normally be a server side function with data loaded via an API on JSON

    
    this.loadFlightData();
    this.updatePassengerNumbers();
    
    }
    private loadFlightData() {
      console.log("flights before "+this.flightdata.length);
      this.flightdata=this.dataService.loadCorrectedFlights(this.flightdata);
      console.log("flights after "+this.flightdata.length);
      }


    

private updatePassengerNumbers()
{
  //map step returns key:flight  and value: 1 for each flight + passengerid and calculated dep_time,arr_time and duration
  //reduce step sums the values by flight and packs the passenegr ids into an array
  
  this.mapReduceResult=this.flightsService.reduceFlightPassengers(this.flightsService.mapFlightPassengers(this.flightdata));

  //updating flights display array using mapreduce results 
  var i=0;
  var j=0;
  var codeFound=0;
  var dateObject: Date;

  
   for(j=0;j<this.mapReduceResult.length;j++){

    this.flights.push({flight:this.mapReduceResult[j].key,
    from:this.mapReduceResult[j].from,
    to:this.mapReduceResult[j].to,
    arr_time:this.calcDate(this.mapReduceResult[j].arr_time),
    dep_time:this.calcDate(this.mapReduceResult[j].dep_time),
    duration:this.mapReduceResult[j].duration,
    numPassengers:this.mapReduceResult[j].value});
    
      codeFound=1;
    }
   }
  


public calcDate(unixdate){
       //transform unix time into hours/minutes
        var i=0;
        var dateObject: Date;
        dateObject = new Date(Number(unixdate)*1000);

        return(dateObject.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

      }


private mapFlights(){
        //test execution of map function from button
         this.mapResult=this.flightsService.mapFlightPassengers(this.flights);
   
         var i=0;
         for (i=0;i<this.mapResult.length;i++){
        // console.log(" key "+this.mapResult[i].key+" dep "+this.mapResult[i].dep_time+" arr "+this.mapResult[i].arr_time+ 
        // " dur "+this.mapResult[i].duration+" pass "+this.mapResult[i].passenger);
   
           }
       }

private reduceFlights(){
      //test execution of reduce function from button
     var reduceResult:any=[];
      // console.log("calling reduce "+this.mapResult.length);
      this.flightsService.reduceFlightPassengers(this.mapResult);
    
        }

async presentPassengerList(flight) {

  //present modal popup showing passenger list for flight
    var i=0;
    var j=0;
    var passengers=[];

//get passenger list from reduec result

    for (i=0;i<this.mapReduceResult.length;i++){
      if (this.mapReduceResult[i].key==flight)
     {
        for (j=0;j<this.mapReduceResult[i].passengerList.length;j++){
           passengers.push(this.mapReduceResult[i].passengerList[j]);
      }
  }
   
}

//create modal popup and pass passenger list

  const modal = await this.modalController.create({
    component: PassengerListPage,
    cssClass: 'my-custom-class',
    componentProps: {
      'passengerList': passengers
    }
  });
  return await modal.present();
}

public saveToFile() {
  this.dataService.saveArrayToFile(this.mapReduceResult,'Flights_Passengers');
}


}
