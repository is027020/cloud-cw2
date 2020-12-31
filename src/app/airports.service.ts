import { getAllLifecycleHooks } from '@angular/compiler/src/lifecycle_reflector';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AirportsService {
  csvData = './assets/airports.csv';
  constructor(private http: HttpClient) { }
  

  getAllAirports(){
    return this.http.get(this.csvData, {responseType: 'text'});
  
  }

 public mapAirportFlights(flightData){
    //for each airport/flight combination push a row containing airport code: 1 to an array
    var j=0;
    var mapResult=[];
    var flightList=[];
    for(j=0;j<flightData.length;j++)
      {
        if(flightList.indexOf(flightData[j].flight)<0)
        {
          mapResult.push({key:flightData[j].from,value:1});
          flightList.push(flightData[j].flight);
        }
      }

  return mapResult;

  }

  public reduceAirportFlights(mapData){
// take results of map function and sum values for each key - ie sum number of flights for each airport

    var j=0;
    var reduceResult=[];
    var airportList=[];
    var i=0;
  

    for(j=0;j<mapData.length;j++)
    {
     // console.log("key 1  "+mapData[j].key+"in airport list "+airportList.indexOf(mapData[j].key)+ " in reduced set "+reduceResult.indexOf(mapData[j].key));
      if(airportList.indexOf(mapData[j].key)<0)
      {
        airportList.push(mapData[j].key);
        reduceResult.push({key:mapData[j].key,value:0});
        
      }
    }
 

      for (i=0;i<airportList.length;i++){
       
        for (j=0;j<mapData.length;j++){
         // console.log(" airport "+reduceResult[i].key+" flight "+mapData[j].key);
          if(reduceResult[i].key==mapData[j].key){
            reduceResult[i].value=reduceResult[i].value+1;
          }

        }

        }

      
        return reduceResult;

    }
      
  }




export interface Airport {

  name:string;
  code:string;
  latitude:string;
  longitude:string;
  numFlights:string;
}



