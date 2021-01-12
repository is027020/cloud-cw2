import { getAllLifecycleHooks } from '@angular/compiler/src/lifecycle_reflector';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MapReduceService } from './map-reduce.service';

@Injectable({
  providedIn: 'root'
})
export class AirportsService {
  


  mapReduceResult:any=[];

  constructor(private http: HttpClient,private mapReduceService: MapReduceService) { }
  


  public analyseAirportFlights(flights){
  
  //use MapReduceService map and reduce functions
  this.mapReduceResult=this.mapReduceService.reduce(this.mapReduceService.map(flights,'from','flight','count'));

  // result is a list of airports and count of flights - need to join this with airport list for airports with no flights
  
  return this.mapReduceResult;

  }

}


export interface Airport {

  name:string;
  code:string;
  latitude:string;
  longitude:string;
  numFlights:string;
}



