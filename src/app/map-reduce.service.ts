import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapReduceService {

  constructor() { }

  public map(mapData,mapOutputKey,mapValueKey,mapCalculation){
    console.log(' outputkey'+mapOutputKey+' value key '+mapValueKey);
    console.log(' outputkey'+mapData[0].flight+' [flight] '+mapData[0][mapOutputKey]);
    var j=0;
    var mapResult=[];
    var keyList=[];
    for(j=0;j<mapData.length;j++)
      {
        if(keyList.indexOf(mapData[j][mapValueKey])<0)
        {
          
          if(mapCalculation=='count'){
          keyList.push(mapData[j][mapValueKey]);
          mapResult.push({key:mapData[j][mapOutputKey],value:1});
          }
          else
          {
//do some other calculation

          }
        }
      }

      for(j=0;j<mapResult.length;j++){
console.log(' map key'+mapResult[j].key+' value '+mapResult[j].value);
      }
  return mapResult;



  }

  public reduce(mapData){

    var j=0;
    var i=0;
    var keyList=[];
    var reduceResult :any =[];
    for (j=0;j<mapData.length;j++){
     
      if(keyList.indexOf(mapData[j].key)<0){
        keyList.push(mapData[j].key);
        reduceResult.push({key:mapData[j].key,value:mapData[j].value});
        console.log(' pushing '+mapData[j].key);
      }
      else
      {
        for(i=0;i<reduceResult.length;i++){
          if(reduceResult[i].key==mapData[j].key){
            reduceResult[i].value=reduceResult[i].value+mapData[j].value;
          }

        }

      }

    }
console.log(' in reduce');
    for (i=0;i< reduceResult.length;i++){
      console.log(" key "+ reduceResult[i].key+" value "+ reduceResult[i].value);

        }
    return reduceResult;

    }

}
