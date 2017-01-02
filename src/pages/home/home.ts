import { Component } from '@angular/core';
import {TestHistoryPage} from "../test-history/test-history";
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  items = [
  'TSH',
  'HgA1C',
  'Haemoglobin',
  'Cholesterol',
  'LFTs (albumin)'
];

  constructor(public navCtrl: NavController) {

  }

  itemSelected(item: string) {
    console.log("Selected Item", item);
  }

  cancelNewUser(){
    this.navCtrl.setRoot(LoginPage);
  }

goToTestHistory(){
  this.navCtrl.push(TestHistoryPage);
}

}
