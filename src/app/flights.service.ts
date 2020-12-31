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
}

export interface FlightData {

  passenger:string;
  flight:string;
  from:string;
  to:string;
  date_time:string;
  duration:string;
}

//const mockAirports:Airport[]=[
//{name:'ATLANTA',code:'ATL',latitude:33.636719,longitude:-84.428067,numFlights:1203},
//{name:'BEIJING',code:'PEK',latitude:40.080111,longitude:116.584556,numFlights:13},
//{name:'LONDON',code:'LHR',latitude:51.4775,longitude:-.461389,numFlights:4537}

//]

