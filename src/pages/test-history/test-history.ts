import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {AngularFire,FirebaseListObservable} from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/map";

/*
  Generated class for the TestHistory page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-test-history',
  templateUrl: 'test-history.html'
})
export class TestHistoryPage {

  currentUID;

  data: Array<{title: string, details: string, icon: string, showDetails: boolean}> = [];

  //tests : FirebaseListObservable<any[]>;
  tests: Observable<any[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public af : AngularFire) {
     for(let i = 0; i < 3; i++ ){
      this.data.push({
          title: 'Title '+i,
          details: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          icon: "add",
          showDetails: false
        });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TestHistoryPage');

    //getting the currently logged in user
    this.af.auth.subscribe(authState => {
      this.currentUID = authState.uid;
      console.log('currentUID: '+this.currentUID);
        //this.tests = this.af.database.object('/users/'+uid+'/testHistory');
      });

      this.tests = this.af.database.list('/users/'+this.currentUID+'/testHistory');
      console.log("BEFORE MAP", this.tests);
 
    
        
  }


   toggleDetails(data) {
    if (data.showDetails) {
        data.showDetails = false;
        data.icon = 'add';
    } else {
        data.showDetails = true;
        data.icon = 'remove';
    }


  }

}
