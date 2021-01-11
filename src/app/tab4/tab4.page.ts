import { Component, OnInit } from '@angular/core';
//HttpClient required to read local files
import { HttpClient } from '@angular/common/http';
//FileSaver module  required to save local files
import { FileSaverService } from 'ngx-filesaver';
import { AirportData,FlightData, DataService } from '../data.service';





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

  
  //initialise error log
  errors:ErrorLog[]=[];

  
  //constructor(private http: HttpClient,private filesaver:FileSaverModule) { }
  constructor( private dataService:DataService,private _FileSaverService:FileSaverService) { }
  ngOnInit() {
    
  //on component nitialise load the data 

    this.errors=[];
    this.dataService.loadAirportData();
    this.dataService.loadFlightData();
    
    }

    


      private loadData(){

    // check data against required formats - this function activated from button click

        this.errors=this.dataService.checkAirports(this.errors);
        this.errors=this.dataService.checkFlights(this.errors);

      }

      
      
  private saveErrorLog() {
    this.dataService.saveArrayToFile(this.errors,'ErrorLog');
  }


}

