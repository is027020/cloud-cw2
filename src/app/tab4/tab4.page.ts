import { Component, OnInit } from '@angular/core';
//HttpClient required to read local files
import { HttpClient } from '@angular/common/http';
//FileSaver module  required to save local files
import { FileSaverService } from 'ngx-filesaver';

import { Airport,AirportsService } from '../airports.service';

// structure for top30 airports data
export interface AirportData {

  name:string;
  code:string;
  latitude:string;
  longitude:string;
  
}
// structure for flights data

export interface FlightData {

  passenger:string;
  flight:string;
  from:string;
  to:string;
  date_time:string;
  duration:string;
  
}

//structure for ErrorLog
export interface ErrorLog{
  record:string;
  type:string;
  action:string;

}

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})


export class Tab4Page implements OnInit {

  //initialise arrays to hold raw and corercted data
  public airports:AirportData[]=[];
  public flights:FlightData[]=[];
  tmpAirports:AirportData[]=[];
  tmpFlights:FlightData[]=[];
  airportList=[];
  //initialise error log
  errors:ErrorLog[]=[];

  //location of raw data

  airportDataFile = './assets/airports.csv';
  flightDataFile = './assets/AComp_Passenger_data.csv';
  //constructor(private http: HttpClient,private filesaver:FileSaverModule) { }
  constructor(private http: HttpClient,private _FileSaverService: FileSaverService,private airportsService:AirportsService) { }
  ngOnInit() {
    
  //on component nitialise load the data 

    this.errors=[];
    this.loadAirportData();
    this.loadFlightData();
    
    }

    private loadAirportData() {

  //load and parse airport csv file 

      this.http.get(this.airportDataFile, {responseType: 'text'}).subscribe(data => {
      const list = data.split('\n');
      list.forEach( e => {
      const rowData=e.split(',');
      this.tmpAirports.push({name:rowData[0],code:rowData[1],latitude:rowData[2],longitude:rowData[3]});
      
      });
    });
    
    }

    private loadFlightData()
    {

//load and parse flight data csv file 

      this.http.get(this.flightDataFile, {responseType: 'text'}).subscribe(data => {
        const list = data.split('\n');
        list.forEach( e => {
        const rowData=e.split(',');
        this.tmpFlights.push({passenger:rowData[0],flight:rowData[1],from:rowData[2],to:rowData[3],date_time:rowData[4],
          duration:rowData[5]});
        });
      });
      }


      private loadData(){

    // check data against required formats - this function activated from button click

        this.checkAirports();
        this.checkFlights();

      }

      
      private checkAirports(){

        //check airport data against requred format - non-compliant data discarded

        let codeRegExp= /^[A-Z]{3}$/;                                   //Format: X [3..20]
        let nameRegExp= /^[A-Z /]{3,20}$/;                              //Format: XXX
        let numRegExp= /^\d{1,3}$|^[-+]?(?=.{3,13}$)\d+\.\d+$/;        // Format: n.n [3..13]
        
        var regExpPass=true;
        var errorType='';
        var i=0;

        for (i=0;i<this.tmpAirports.length;i++){
        regExpPass=true;
        errorType='';
        // check against regExp and record preesnce and type of error

         if(!codeRegExp.test(this.tmpAirports[i].code)){ regExpPass=false; errorType=errorType+'Code:'+this.tmpAirports[i].code;}
         if(!nameRegExp.test(this.tmpAirports[i].name)){ regExpPass=false; errorType=errorType+'Name:'+this.tmpAirports[i].name;}
         if(!numRegExp.test(this.tmpAirports[i].latitude)){ regExpPass=false; errorType=errorType+'Lat:'+this.tmpAirports[i].latitude;}
         if(!numRegExp.test(this.tmpAirports[i].longitude.trim())){ regExpPass=false; errorType=errorType+'Lon:'+this.tmpAirports[i].longitude;}

          if(regExpPass)
          {

            //pass correct data to working array
            this.airports.push(this.tmpAirports[i]);
            //build array of airport code to check flight data against
            this.airportList.push(this.tmpAirports[i].code);
          }
          else
          {
            //log details of error in log
            this.errors.push({record:JSON.stringify(this.tmpAirports[i]),type:errorType,action:"Deleted"});
          }
        }

      }
      private checkFlights(){

         //check airport data against requred format - non-compliant data discarded

        const passengerRegExp = /^[A-Z]{3}\d{4}[A-Z]{2}\d{1}$/;   //Format: XXXnnnnXXn
        const flightRegExp = /^[A-Z]{3}\d{4}[A-Z]{1}$/;           //Format: XXXnnnnX
        const codeRegExp = /^[A-Z]{3}$/;                          //Format: XXX
        const depRegExp = /^\d{10}$/;                             //Format: n [10]
        const durationRegExp = /^\d{1,4}$/;                       //Format: n [1..4]

        var i=0;
        var regExpPass=true;
        var errorType='';
        var i=0;

        for (i=0;i<this.tmpFlights.length;i++){
        regExpPass=true;
        errorType='';
        
        //check against formats
         if(!passengerRegExp.test(this.tmpFlights[i].passenger)){ regExpPass=false; errorType=errorType+'Passenger:'+this.tmpFlights[i].passenger;}
         if(!flightRegExp.test(this.tmpFlights[i].flight)){ regExpPass=false; errorType=errorType+'Flight:'+this.tmpFlights[i].flight;}
         if(!codeRegExp.test(this.tmpFlights[i].from)){ regExpPass=false; errorType=errorType+'From:'+this.tmpFlights[i].from;}
         if(!codeRegExp.test(this.tmpFlights[i].to)){ regExpPass=false; errorType=errorType+'To:'+this.tmpFlights[i].to;}
         if(!depRegExp.test(this.tmpFlights[i].date_time)){ regExpPass=false; errorType=errorType+'DepTime:'+this.tmpFlights[i].date_time;}

        // check if from/to airports exist in list
         if(this.airportList.indexOf(this.tmpFlights[i].from)<0 ){regExpPass=false; errorType=errorType+'From:Invalid'+this.tmpFlights[i].from; }
         if(this.airportList.indexOf(this.tmpFlights[i].to)<0 ){regExpPass=false; errorType=errorType+'To:Invalid'+this.tmpFlights[i].to; }
         
         //last data element includes a CRLF so need to trim
         if(typeof this.tmpFlights[i].duration !== 'undefined'){
         if(!durationRegExp.test(this.tmpFlights[i].duration.trim())){ regExpPass=false; errorType=errorType+'Duration:';}
          }
         else
         {regExpPass=false; errorType=errorType+'Duration:'}

         //discard invalid rows and log error details 
          if(regExpPass)
          {
            this.flights.push(this.tmpFlights[i]);
          }
          else
          {
            this.errors.push({record:JSON.stringify(this.tmpFlights[i]),type:errorType,action:"Deleted"});
          }
        }
  }

  private saveErrorLog() {
    //write con tents of error log to a file
    var fileContents='';
    var i=0;
    for (i=0;i<this.errors.length;i++){
      fileContents=fileContents+JSON.stringify(this.errors[i].type)+' '+JSON.stringify(this.errors[i].record)+' '+JSON.stringify(this.errors[i].action)+'\n\r';
    }

    let file = new Blob([fileContents], { type: 'text/csv;charset=utf-8' });
    this._FileSaverService.save(file, 'ErrorLog.txt')
  }


}

