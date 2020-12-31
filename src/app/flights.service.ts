import { getAllLifecycleHooks } from '@angular/compiler/src/lifecycle_reflector';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FlightsService {
  csvData = './assets/flightdata.csv';
  constructor(private http: HttpClient) { }
  

  getAllFlights(){
    return this.http.get(this.csvData, {responseType: 'text'});
  
  }

  public mapFlightPassengers(flightData){
    //map phase calculates arrival time in seconds - key is flight - value is number of passengers

    var j=0;
    var mapResult=[];
  
    for(j=0;j<flightData.length;j++)
      {
          mapResult.push({key:flightData[j].flight,dep_time:flightData[j].date_time,
            arr_time:Number(flightData[j].date_time)+ Number(flightData[j].duration),duration:flightData[j].duration,
            passenger:flightData[j].passenger});
        
      }

  return mapResult;

  }

  public reduceFlightPassengers(mapData){
    // take results of map function and count number of passengers per flight, also return passenger list and 
    //calculated arrrival time etc for each flight
    
        var j=0;
        var reduceResult=[];
        var flightList=[];
        var passengerList=[]
        var i=0;
      

        for(j=0;j<mapData.length;j++)
        {
         // console.log("key 1  "+mapData[j].key+"in airport list "+airportList.indexOf(mapData[j].key)+ " in reduced set "+reduceResult.indexOf(mapData[j].key));
          if(flightList.indexOf(mapData[j].key)<0)
          {
            flightList.push(mapData[j].key);
            reduceResult.push({key:mapData[j].key,dep_time:"",arr_time:"",duration:"",value:0,passengerList:passengerList});
            
          }
        }
        //console.log("num Flights "+flightList.length);
    
          for (i=0;i<flightList.length;i++){
           passengerList=[];
            for (j=0;j<mapData.length;j++){
             // console.log(" airport "+reduceResult[i].key+" flight "+mapData[j].key);
              if(reduceResult[i].key==mapData[j].key){
                reduceResult[i].value=reduceResult[i].value+1;
                passengerList.push(mapData[j].passenger);
                reduceResult[i].dep_time=mapData[j].dep_time;
                reduceResult[i].arr_time=mapData[j].arr_time;
                reduceResult[i].duration=mapData[j].duration;
              }
    
                
            }
           
            reduceResult[i].passengerList=passengerList;
            //console.log("flight "+reduceResult[i].key+ "list 1 "+passengerList.length+"list 2 "+reduceResult[i].passengerList.length);
           
            }
           // for (i=0;i<flightList.length;i++){
            //  console.log("flight "+reduceResult[i].key+" count "+reduceResult[i].value);
           // }
          
            return reduceResult;
    
        }
          
      }
    


export interface FlightData {

  passenger:string;
  flight:string;
  from:string;
  to:string;
  date_time:string;
  duration:string;
  dep_time:string;
  arr_time:string;
  numPassengers:string;
}


