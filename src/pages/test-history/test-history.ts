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

/**
 * This is the class that renders the test history page of the app. From here the user can access
 * its test history. He can delete tests and check the information for a specific test.
 * Pressing a back button navigates to the home page.
 * This class contains the variables and methods necessary to render a fully functional
 * HTML template.
 */
export class TestHistoryPage {




  
// array to help render the different elements in the DOM
  data: Array<{testType: string, testKey: string, testDate :string,
  resultDeliveryDate : string, progress :number}> = [];

  //tests : FirebaseListObservable<any[]>;
  tests: Observable<any[]>;

  isDataEmpty: boolean;
  isDataEmptyString;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl : AlertController,
  public loadingCtrl : LoadingController, public authProvider : AuthProvider, public firebaseProvider : FirebaseProvider ) {


  }

  /**
 * This method is triggered as soon as the test history Page is loaded and it calls the displayTests()
 * method which renders all the tests in a specific user's history to the HTML template.
 *  */
  ionViewDidLoad() {
    console.log('ionViewDidLoad TestHistoryPage');

    this.displayTests();
    
  }

  /**
   * Method triggered when the user presses the back arrow/button. The view changes to the 
   * home page.
   */
  backButton() {
  this.navCtrl.pop(HomePage);
  }



/**
 * This method takes the uid of the currently connected user and uses it to get the user's
 * test history data from the database. Every test is then pushed to the data array alongside its
 * progress. Progress is calculated with a utility method (calculatePercentage(test)) and corresponds
 * to the percentage of the delivery time which has elapsed since the test date supplied by the
 * user (this also controls how full the progress bar is). The data array simply facilitates the rendering
 * of the different elements related to the test history.
 */
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
          progress : progress
        });

        console.log(this.data);

       }

       //temporarily for tests to display by date
       this.data.reverse();
      return tests;
      });



}

/**
 * This method is triggered when the user presses the info button. The view is changed to the
 * info page and a test type parameter is passed to the NavController so that it can be retrieved
 * and used by the InfoPage class (info.ts)
. */

  goToInfoPage(testType){
    this.navCtrl.push(InfoPage, {
      testType: testType
    });

}

/**
 * This method takes a test object and extracts the test and the result delivery date as well as 
 * the estimated delivery time in order to calculate the percentage of the delivery time elapse since
 * the date specified by the user when adding the test.
 */
calculatePercentage(test) :number{


   let initial = moment(test.testDate, 'DD/MM/YYYY').format('MM/DD/YYYY');
   let final = moment(test.resultDeliveryDate, 'DD/MM/YYYY').format('MM/DD/YYYY');
   
   //all dates converted to ms
   let testDate : Date = new Date(initial)
   let testDateMs = testDate.getTime();
  
   let resultDeliveryDate : Date = new Date(final);
   let resultDeliveryDateMs = resultDeliveryDate.getTime();
 
   let currentDate : Date = new Date();
   let currentDateMs = currentDate.getTime();
  
  
   let timeElapsedMs = (currentDateMs - testDateMs);
  
    let progress;
    //any test that has finished
    if(resultDeliveryDateMs < currentDateMs){
      progress = 100;

    }else{

    progress = (timeElapsedMs/(resultDeliveryDateMs-testDateMs) * 100);
    }

  
   console.log(progress);
   return Math.round(progress);
      
}

/**
 * This method takes a boolean that holds information about whethera user confirmed that they wanted to delete
 * a test from their history. It also takes the key of the test to delete and if confirmDelete : boolean 
 * is true, the firebase provider is called to delete the specified test for the currently connected
 * user.
 */
deleteTest(testKeyToDelete, confirmDelete){


  if(confirmDelete == true){
  let uid = this.authProvider.getCurrentUID();

  this.firebaseProvider.deleteTest(uid, testKeyToDelete);
  this.data =[];

  this.displayTests();
  }

}



  /**
   * Utility method which presents a small loading delay while a test is being deleted.
   */
  presentLoadingDefault() {
  let loading = this.loadingCtrl.create({
    content: 'Deleting test...'
  });

  loading.present();

  setTimeout(() => {
    loading.dismiss();
  }, 1200);

}


/**
 * This method is triggered by pressing the delete test button and asks confirmation
 * from the user in order to proceed with the deletion operation. The relevant information, including
 * the test key to delete is passed to the deleteTest(testKeyToDelete, confirmDelete) method.
 */
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

            this.presentLoadingDefault();

            this.createTimeout(800).then(() => {
            confirmDelete = true;
            this.deleteTest(testKeyToDelete, confirmDelete);

          }
        )}
        }
      ]
    });
    confirm.present();

  }

 /**
 * This utility method creates a delay of custom time to allow a smoother transition between deleting a test and refreshing the test history page.
 */
  createTimeout(timeout) {
          return new Promise((resolve, reject) => {
              setTimeout(() => resolve(null),timeout)
          })
      }

}
