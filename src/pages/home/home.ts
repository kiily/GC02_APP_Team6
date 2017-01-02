import { Component } from '@angular/core';
import {TestHistoryPage} from "../test-history/test-history";
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {
    
  }

goToTestHistory(){
  this.navCtrl.push(TestHistoryPage);
}

}
