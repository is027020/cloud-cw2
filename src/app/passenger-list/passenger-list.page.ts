import { Component, OnInit,Input } from '@angular/core';
import {ModalController,NavParams} from '@ionic/angular'

@Component({
  selector: 'app-passenger-list',
  templateUrl: './passenger-list.page.html',
  styleUrls: ['./passenger-list.page.scss'],
})
export class PassengerListPage implements OnInit {
  // Data passed in by componentProps
  @Input() passengerList: any;
  passengers:any=[];
  

  constructor(public modalCtrl: ModalController,private navParams:NavParams) { }

  
  ngOnInit() {
    this.passengers=this.navParams.get('passengerList');
    console.log("passenegrs "+this.passengers.length);
  }

  public dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}
