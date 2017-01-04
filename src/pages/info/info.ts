import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {AngularFire } from 'angularfire2';

import { HomePage } from '../home/home';

/*
  Generated class for the Info page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-info',
  templateUrl: 'info.html'
})
export class InfoPage {


testType;

test;


  constructor(public navCtrl: NavController, public navParams: NavParams, public af:AngularFire) {
    this.testType = this.navParams.get("testType");

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad InfoPage');
    console.log("info test type", this.testType);

   this.test = this.af.database.object("/bloodTests/"+this.testType);
   // console.log("yep logging stuff",this.tests.$value);
//    this.testExists.subscribe(x => {
// //if x exists and x.$value is truthy
//      if(x && x.$value){
//        console.log("EXISTS",x);

     }

     backButton() {
          this.navCtrl.pop(HomePage);
          }

//idea did not work

}
