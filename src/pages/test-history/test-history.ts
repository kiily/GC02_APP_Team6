import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import {AngularFire,FirebaseListObservable} from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/map";
import { InfoPage } from '../info/info';
import { HomePage } from '../home/home';
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

  currentUID;


  testType;
// this array helps us build the accordion
  data: Array<{testType: string, testKey: string, initialDate :string,finalDate : string, progress :number,  icon: string, showDetails: boolean}> = [];

  //tests : FirebaseListObservable<any[]>;
  tests: Observable<any[]>;

  
  
  testKeyToDelete;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public af : AngularFire,
  public loadingCtrl : LoadingController) {
  
  }

  backButton() {
  this.navCtrl.pop(HomePage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TestHistoryPage');
    this.displayTests();
        
  }

displayTests(){
  //getting the currently logged in user
    this.af.auth.subscribe(authState => {
      this.currentUID = authState.uid;
      console.log('currentUID: '+this.currentUID);
        //this.tests = this.af.database.object('/users/'+uid+'/testHistory');
      });

  console.log('currentUID: '+this.currentUID);


      this.tests = this.af.database.list('/users/'+this.currentUID+'/testHistory')
    .map(tests =>{
       console.log("AFTER MAP", tests);
       
       for(let test of tests){

         let progress = this.calculatePercentage(test);

        this.data.push({
          testType: test.type,
          testKey: test.$key,
          initialDate: test.initialDate,
          finalDate: test.finalDate,
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
     this.testType = data.testType;
     //this.testDateToDelete = data.date;
     this.testKeyToDelete = data.testKey;
      

     console.log("toggle",this.testType);

    if (data.showDetails) {
        data.showDetails = false;
        data.icon = 'add';
    } else {
        data.showDetails = true;
        data.icon = 'remove';
    }


   


  }


  goToInfoPage(){
    this.navCtrl.push(InfoPage, {
      testType: this.testType
    });
  
}

calculatePercentage(test) :number{
  
  console.log(test.initialDate);
  console.log(test.finalDate);

   let initial = moment(test.initialDate, 'DD/MM/YYYY').format('MM/DD/YYYY');
   console.log(initial);
   let final = moment(test.finalDate, 'DD/MM/YYYY').format('MM/DD/YYYY');
   console.log(final);

   let initialDate = new Date(initial)
   let initialDateMs = initialDate.getTime();
   console.log("initial:"+initialDate+' in ms:'+initialDateMs)
   let finalDate = new Date(final);
   let finalDateMs = new Date(final).getTime();
   console.log("final:"+finalDate+' in ms:'+finalDateMs)
   let currentDate = new Date();
   console.log(currentDate);
   let currentDateMs = new Date().getTime();
   console.log(currentDateMs);

   let timeElapsedMs = (currentDateMs - initialDateMs);
   console.log(timeElapsedMs);
   //let deliveryTimeMs = data.deliveryTime *24*3600*1000;
   
   //(timeElapsed/deliveryTime)*100
   let progress = (timeElapsedMs/(finalDateMs-initialDateMs) * 100);
   console.log(progress);
   return Math.round(progress);
    //  allows to make the progress bar
    
}



//deletes the object from both the database and the data array
//currently depends on the toogle details method
deleteTest(){
  console.log(this.testKeyToDelete);

  this.af.database.object('/users/'+this.currentUID+'/testHistory/'+this.testKeyToDelete).remove()
  .then(x => {
    console.log("Test was removed");

    this.data = [];

    // for(let d of this.data){

    // if(d.testKey === this.testKeyToDelete){
    //   let index = this.data.indexOf(d);
    //   this.data.splice(index,1);
    // }

    this.displayTests();
    this.presentLoadingDefault();

  //}
  })
  .catch(error => console.log("ERROR", error));
 //when item is removed could display a toast notification or an alert


  }
  


  // loading animation
  presentLoadingDefault() {
  let loading = this.loadingCtrl.create({
    content: 'Deleting test...'
  });

  loading.present();

  setTimeout(() => {
    loading.dismiss();
  }, 500);
}

displayProgress(loadProgressArray : Array<number>){
  

// for (let progressInterval of progressIntervalArray){
// for(let i= 0; i<loadProgressArray.length ; i++){

//  setInterval(() => {
//        if(loadProgressArray[i] <100){
//          loadProgressArray[i]++;
         
//        }


//      }, progressInterval);

//    }

//    }

}



}



