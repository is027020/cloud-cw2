import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileSaverService } from 'ngx-filesaver';
import { StringUtils } from 'turbocommons-ts';

// structure for top 30 airports data
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

@Injectable({
  providedIn: 'root'
})
export class DataService {

  //location of raw data

  airportDataFile = './assets/airports.csv';
  flightDataFile = './assets/AComp_Passenger_data.csv';
  tmpAirports:AirportData[]=[];
  tmpFlights:FlightData[]=[];

  //initialise arrays to hold raw and corrected data
  airports:AirportData[]=[];
  flights:FlightData[]=[];
  flightIndex=[];
  flightList=[];
  invalidFlights:FlightData[]=[];
  airportList=[];
  

  constructor(private http: HttpClient,private _FileSaverService: FileSaverService) { }

  public loadAirportData() {

    //load and parse airport csv file 
  
        this.http.get(this.airportDataFile, {responseType: 'text'}).subscribe(data => {
        const list = data.split('\n');
        list.forEach( e => {
        const rowData=e.split(',');
        this.tmpAirports.push({name:rowData[0],code:rowData[1],latitude:rowData[2],longitude:rowData[3]});
        
        });
      });
      console.log('data service loaded airports into tmpAirports'+this.tmpAirports.length);
      }
  
     public loadFlightData()
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
        console.log('data service loaded flights into tmpFlights'+this.tmpAirports.length);
        }

        public checkAirports(errors){

//check airport data against requred format - non-compliant data discarded
          this.airports=[];
          let codeRegExp= /^[A-Z]{3}$/;                                   //Format: X [3..20]
          let nameRegExp= /^[A-Z /]{3,20}$/;                              //Format: XXX
          let numRegExp= /^\d{1,3}$|^[-+]?(?=.{3,13}$)\d+\.\d+$/;        // Format: n.n [3..13]
          
          var regExpPass=true;
          var errorType='';
          var i=0;
  
          for (i=0;i<this.tmpAirports.length;i++){
          regExpPass=true;
          errorType='';
// check against regExp and record presence and type of error
  
           if(!codeRegExp.test(this.tmpAirports[i].code)){ regExpPass=false; errorType=errorType+'Code:'+this.tmpAirports[i].code;}
           if(!nameRegExp.test(this.tmpAirports[i].name)){ regExpPass=false; errorType=errorType+'Name:'+this.tmpAirports[i].name;}
           if(!numRegExp.test(this.tmpAirports[i].latitude)){ regExpPass=false; errorType=errorType+'Lat:'+this.tmpAirports[i].latitude;}
           if(!numRegExp.test(this.tmpAirports[i].longitude.trim())){ regExpPass=false; errorType=errorType+'Lon:'+this.tmpAirports[i].longitude;}
  
            if(regExpPass)
            {
  
 //pass correct data to working array
              this.airports.push(this.tmpAirports[i]);
//build array of airport codes to check flight data against
              this.airportList.push(this.tmpAirports[i].code);
            }
            else
            {
              //log details of error in log
              errors.push({record:JSON.stringify(this.tmpAirports[i]),type:errorType,action:"Deleted"});
            }
          }
          console.log('data service lhas checked airports'+this.airports.length+'airport list '+this.airportList.length);
          return errors;
        }


        public checkFlights(errors){
  
          this.flights=[];
//check flight data against requred format - non-compliant data discarded
  
          const passengerRegExp = /^[A-Z]{3}\d{4}[A-Z]{2}\d{1}$/;   //Format: XXXnnnnXXn
          const flightRegExp = /^[A-Z]{3}\d{4}[A-Z]{1}$/;           //Format: XXXnnnnX
          const codeRegExp = /^[A-Z]{3}$/;                          //Format: XXX
          const depRegExp = /^\d{10}$/;                             //Format: n [10]
          const durationRegExp = /^\d{1,4}$/;                       //Format: n [1..4]
  
          var i=0;
          var regExpPass=true;
          var errorType='';
          var flightMatch='';
          var i=0;
  
//build a list of valid flight numbers as a reference for finding possible matches
      
          this.flightIndex=[];
          this.flightList=[];
          for (i=0;i<this.tmpFlights.length;i++){
            if(flightRegExp.test(this.tmpFlights[i].flight)&&this.flightIndex.indexOf(this.tmpFlights[i].flight)<0)
            {
              this.flightIndex.push(this.tmpFlights[i].flight);
              this.flightList.push({flight:this.tmpFlights[i].flight,to:this.tmpFlights[i].to,from:this.tmpFlights[i].from});
            }
          }

          for (i=0;i<this.tmpFlights.length;i++){
          regExpPass=true;
          errorType='';
          
//check against formats
           if(!passengerRegExp.test(this.tmpFlights[i].passenger)){ regExpPass=false; errorType=errorType+'Passenger:'+this.tmpFlights[i].passenger;}
// for invalid flight codes and/or airport codes look for possible matches to valid flight codes
//log these against the errors but do not correct the data
           
           if(!flightRegExp.test(this.tmpFlights[i].flight)){  
            flightMatch=this.checkNearMiss(this.tmpFlights[i]);
              if(flightMatch==null){regExpPass=false; errorType=errorType+'Flight:'+this.tmpFlights[i].flight;}
              else{ regExpPass=false; errorType=errorType+'Flight:'+this.tmpFlights[i].flight+ ' Possible Match to: '+flightMatch;}
              }

           if(!codeRegExp.test(this.tmpFlights[i].from)){ flightMatch=this.checkNearMiss(this.tmpFlights[i]);
            if(flightMatch==null){regExpPass=false; errorType=errorType+'From:'+this.tmpFlights[i].from;}
            else{ regExpPass=false; errorType=errorType+'From:'+this.tmpFlights[i].from+ ' Possible Match to: '+flightMatch;}}

            if(!codeRegExp.test(this.tmpFlights[i].to)){ flightMatch=this.checkNearMiss(this.tmpFlights[i]);
              if(flightMatch==null){regExpPass=false; errorType=errorType+'To:'+this.tmpFlights[i].to;}
              else{ regExpPass=false; errorType=errorType+'To:'+this.tmpFlights[i].to+ ' Possible Match to: '+flightMatch;}}

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
            
                errors.push({record:JSON.stringify(this.tmpFlights[i]),type:errorType,action:"Deleted"});
              
            }
          }

//   console.log('data service has checked flights'+this.flights.length);
          return errors;
    }

public removeFlightDuplicates(errors){

//remove duplicate occurrences of flight/passenger key

  var i=0;
  var keyPairs=[];
  var correctedFlights :FlightData[]=[];
  var flightID='';
  var passengerID='';
  

  for (i=0;i<this.flights.length;i++){
    flightID=this.flights[i].flight;
    passengerID=this.flights[i].passenger;
   
    if(keyPairs.findIndex(function (a) {
      return (a.flight==flightID&&a.passenger==passengerID);
    })<0)
    {
      keyPairs.push({flight:this.flights[i].flight,passenger:this.flights[i].passenger});
      correctedFlights.push(this.flights[i])

    }
    else{
  
    errors.push({record:JSON.stringify(this.tmpFlights[i]),type:'Duplicate record:',action:"Deleted"});
      }
     }

return errors;

}

private checkNearMiss(flight){

// assessing Levensthein distance between flight code and valid flight codes
//if distance <2 return as a possible match

var j=0;
var best=8;
var bestMatch=null;
var matchedFlight='';

if(typeof flight.flight==='undefined'||flight.flight==""){
    matchedFlight=null;}
else
  {
  for (j=0;j<this.flightIndex.length;j++){
    if(StringUtils.compareByLevenshtein(flight.flight,this.flightIndex[j])<best)
    {
      best=StringUtils.compareByLevenshtein(flight.flight,this.flightIndex[j]);
      bestMatch=j;
    }
  }
  
  if(best<2){
      matchedFlight=this.flightIndex[bestMatch];
  }
  }

  return matchedFlight;
  }


    public loadCorrectedAirports(airports){
      // load corrected data ready for display/map reduce
      var i=0;
      for (i=0;i<this.airports.length;i++){

        airports.push({name:this.airports[i].name,code:this.airports[i].code,latitude:this.airports[i].latitude,longitude:this.airports[i].longitude,numFlights:'?'});
      }
      

      return airports;
    }


    public loadCorrectedFlights(flights){
      // load corrected data ready for display/map reduce
      var i=0;
      for (i=0;i<this.flights.length;i++){

        flights.push({passenger:this.flights[i].passenger,flight:this.flights[i].flight,from:this.flights[i].from,
          to:this.flights[i].to,date_time:this.flights[i].date_time,
          duration:this.flights[i].duration,dep_time:"",arr_time:"",numPassengers:""});
        }
      

      return flights;
    }



    public saveArrayToFile(dataArray,fileName) {
      //write contents of any array to a file
      var fileContents='';
      var i=0;
      var lineContents='';
  

      for ( const key in dataArray[0]){
       lineContents=lineContents+key[0].toUpperCase()+key.slice(1)+" ";
        }
        fileContents=lineContents+'\n\r';
      for (i=0;i<dataArray.length;i++){
        lineContents='';
        for (const [key, value] of Object.entries(dataArray[i])) {
          
          lineContents=lineContents+value+" ";
        }
        fileContents=fileContents+lineContents.replace(/\r/g, "")+'\n\r';
      }

      let file = new Blob([fileContents], { type: 'text/csv;charset=utf-8' });
      this._FileSaverService.save(file, fileName+'.txt');

      

    }
    
  


}
