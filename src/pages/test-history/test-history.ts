import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { AuthProvider} from '../../providers/auth-provider';
import { FirebaseProvider} from '../../providers/firebase-provider';
import { InfoPage } from '../info/info';
import { HomePage } from '../home/home';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/map";
import * as moment from 'moment';

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

  


  
// this array helps us build the accordion
  data: Array<{testType: string, testKey: string, testDate :string,
  resultDeliveryDate : string, progress :number, icon: string, showDetails: boolean}> = [];

  //tests : FirebaseListObservable<any[]>;
  tests: Observable<any[]>;

  isDataEmpty;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl : AlertController,
  public loadingCtrl : LoadingController, public authProvider : AuthProvider, public firebaseProvider : FirebaseProvider ) {
  

  }

  backButton() {
  this.navCtrl.pop(HomePage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TestHistoryPage');

    this.displayTests();
    
    // try put into display test method

    //COME BACK TO THIS IDEA
    // if(this.data.length =0 ){
    //   this.isDataEmpty = true;
    // }else{
    //   this.isDataEmpty = false;
    // }
        
  }


displayTests(){

  let uid = this.authProvider.getCurrentUID();

  this.tests = this.firebaseProvider.getUserTests(uid)
  .map(tests => {

     console.log("AFTER MAP", tests);
       
       for(let test of tests){

         let progress = this.calculatePercentage(test);

        this.data.push({
          testType: test.type,
          testKey: test.$key,
          testDate: test.testDate,
          resultDeliveryDate: test.resultDeliveryDate,
          progress : progress,
          icon: "add",
          showDetails: false
        });
         
        console.log(this.data);
      
       }

       //temporarily for tests to display by date
       this.data.reverse();
      
       

       //need to change the position of this//progress needs to be lcoal and specific
       
      return tests;
      });



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


  goToInfoPage(testType){
    this.navCtrl.push(InfoPage, {
      testType: testType
    });

}

calculatePercentage(test) :number{
  

   let initial = moment(test.testDate, 'DD/MM/YYYY').format('MM/DD/YYYY');
   //console.log(initial);
   let final = moment(test.resultDeliveryDate, 'DD/MM/YYYY').format('MM/DD/YYYY');
   //console.log(final);

   let testDate : Date = new Date(initial)
   let testDateMs = testDate.getTime();
   //console.log("initial:"+initialDate+' in ms:'+initialDateMs)
   let resultDeliveryDate : Date = new Date(final);
   let resultDeliveryDateMs = resultDeliveryDate.getTime();
   //console.log("final:"+finalDate+' in ms:'+finalDateMs)
   let currentDate : Date = new Date();
   //console.log(currentDate);
   let currentDateMs = currentDate.getTime();
  // console.log(currentDateMs);

   let timeElapsedMs = (currentDateMs - testDateMs);
   console.log(timeElapsedMs);
   //let deliveryTimeMs = data.deliveryTime *24*3600*1000;
   
   //(timeElapsed/deliveryTime)*100
   let progress = (timeElapsedMs/(resultDeliveryDateMs-testDateMs) * 100);
   console.log(progress);
   return Math.round(progress);
    //  allows to make the progress bar
    
}

//no longer depends on toggleDetails
deleteTest(testKeyToDelete, confirmDelete){


  if(confirmDelete == true){
  let uid = this.authProvider.getCurrentUID();

  this.firebaseProvider.deleteTest(uid, testKeyToDelete);
  this.data =[];

  this.displayTests();
  this.presentLoadingDefault();
  }

}



  // loading animation
  //might not be needed
  presentLoadingDefault() {
  let loading = this.loadingCtrl.create({
    content: 'Deleting test...'
  });

  loading.present();

  setTimeout(() => {
    loading.dismiss();
  }, 200);
    
}

deleteTestConfirmation(testKeyToDelete, testType){

  let confirmDelete = false;

  let confirm = this.alertCtrl.create({
      title: 'Delete this '+testType+' test?',
      message: 'Are you sure that you want to delete this test?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Agree clicked');
            confirmDelete = true;
            this.deleteTest(testKeyToDelete, confirmDelete);
            
          }
        }
      ]
    });
    confirm.present();
    
  }





}
