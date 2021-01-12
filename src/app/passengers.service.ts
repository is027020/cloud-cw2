import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PassengersService {

  constructor() { }
  public mapPassengerAirmiles(flightData,airports){
    //map phase calculates airmiles for each passenger flight

    var j=0;
    var mapResult=[];
  
    for(j=0;j<flightData.length;j++)
      {
          mapResult.push({key:flightData[j].passenger,
            value:this.calcDistance(flightData[j].from,flightData[j].to,airports)
          });
      }
  return mapResult;

  }

  calcDistance(from,to,airports){
    var lat1=0;
    var lon1=0;
    var lat2=0;
    var lon2=0;
    var i=0;

    for(i=0;i<airports.length;i++){
      if(airports[i].code==from){
        lat1=airports[i].latitude;
        lon1=airports[i].longitude;
      };
      if(airports[i].code==to){
        lat2=airports[i].latitude;
        lon2=airports[i].longitude;
      };
    }

    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1/180;
      var radlat2 = Math.PI * lat2/180;
      var theta = lon1-lon2;
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
       dist = dist * 0.8684;
      return dist;
    }
 
  }

  public reducePassengerAirmiles(mapData){
    // take results of map function and total airmiles per passenger
    
        var j=0;
        var reduceResult=[];
        var passengerList=[]
        var i=0;
      
    
          
        for(j=0;j<mapData.length;j++)
        {
        
          if(passengerList.indexOf(mapData[j].key)<0)
          {
            passengerList.push(mapData[j].key);
            reduceResult.push({key:mapData[j].key,value:0});
            
          }
        }
    
        for (i=0;i<passengerList.length;i++){
            for (j=0;j<mapData.length;j++){  
              if(reduceResult[i].key==mapData[j].key){
                reduceResult[i].value=reduceResult[i].value+mapData[j].value;
              }
            }
          }
          for (i=0;i<reduceResult.length;i++){
          }
            return reduceResult;
        }


}

export interface PassengerData {

  passenger:string;
  airmiles:string;
  rank:string;
}