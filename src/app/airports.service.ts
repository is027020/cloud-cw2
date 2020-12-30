import { getAllLifecycleHooks } from '@angular/compiler/src/lifecycle_reflector';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AirportsService {

  constructor() { }
  

  getAllAirports(){
    console.log("airport code 0"+mockAirports[0].code);
    return [...mockAirports];
  
  }
}

export interface Airport {

  name:string;
  code:string;
  latitude:number;
  longitude:number;
  numFlights:number;
}

const mockAirports:Airport[]=[
{name:'ATLANTA',code:'ATL',latitude:33.636719,longitude:-84.428067,numFlights:1203},
{name:'BEIJING',code:'PEK',latitude:40.080111,longitude:116.584556,numFlights:13},
{name:'LONDON',code:'LHR',latitude:51.4775,longitude:-.461389,numFlights:4537}

]

