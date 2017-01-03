import { Component } from '@angular/core';
import {TestHistoryPage} from "../test-history/test-history";
import { NavController, AlertController } from 'ionic-angular';
import { InfoPage } from '../info/info';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

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

currentUID;

tests: FirebaseListObservable<any[]>;

testToAdd: FirebaseListObservable<any[]>;


  constructor(public navCtrl: NavController, public af:AngularFire, public alertCtrl:AlertController) {
    
  }


//this subscription needs to be in this method;
//helps avoid memory leakage
   ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    this.tests = this.af.database.list("bloodTests");
      
  }

//method registers a test under a given user 
 registerTest(test){
    this.af.auth.subscribe(authState => {
      this.currentUID = authState.uid;
      console.log('currentUID: '+this.currentUID);
        //this.tests = this.af.database.object('/users/'+uid+'/testHistory');
      });

   

    this.testToAdd = this.af.database.list('/users/'+this.currentUID+'/testHistory');
    console.log("adding the test");
    let date = '03/01/2017';
    console.log(date);
    this.testToAdd.push({
      type: test.$key,
      date: date ,
      deliveryTime: test.deliveryTime

    });
    console.log("TEST ADDED");
    this.presentTestAddedAlert();
    
    //alternative is to put this in the alert method
    //and pass the test parameter
     this.navCtrl.push(InfoPage, {
       testType: test.$key
       
    });
    }

 

//method is now deprecated
  testSelected(test) {
    console.log("Selected test", test);
    console.log(test.$key);
    console.log(test.deliveryTime);
  }

  

signOutBtn(){
    this.navCtrl.popToRoot();
    //this.af.auth.logout();

  }

goToTestHistory(){
  this.navCtrl.push(TestHistoryPage);
}





presentTestAddedAlert(){
  
    //separate alert into new method
    let alert = this.alertCtrl.create({

      title: "Test Added",
      subTitle: "Your test was added to the database. It is now also available in your test history",
      buttons: [
        {
          text: "OK",
          //checking if it works
          handler: data => {
            console.log('OK clicked');
           
          }
        }
      ]
    });
    alert.present();
  


}
}


