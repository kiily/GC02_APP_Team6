import { Component } from '@angular/core';
import {TestHistoryPage} from "../test-history/test-history";
import { NavController, AlertController, Platform, ActionSheetController } from 'ionic-angular';
import { InfoPage } from '../info/info';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { LoginPage } from '../login/login';
import { ProfilePage } from '../profile/profile';
import { LocalNotifications } from 'ionic-native';
import * as moment from 'moment';

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


 // use this to give the url of the profile picture from firebase
userPhoto: string;

// used with checkbox alert
testCheckboxOpen: boolean;
testCheckboxResult;
currentUID;

tests: FirebaseListObservable<any[]>;

testToAdd: FirebaseListObservable<any[]>;

//date manipulation
initialDate;
//date with format (mm/dd/yyyy) (dd/mm/yyyy is invalid)
initialDateFormat :Date;
finalDateCalculated : Date

//final date in dd/mm/yyyy format
finalDate : string;




  constructor(public navCtrl: NavController, public af:AngularFire, public alertCtrl:AlertController,
  public actionsheetCtrl: ActionSheetController, public platform: Platform) {
    
  }


//this subscription needs to be in this method;
//helps avoid memory leakage
   ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    //to render buttons
    this.tests = this.af.database.list("bloodTests");

    this.userPhoto =  "assets/images/default-user-grey.png";
    console.log(this.userPhoto);
      
   }


//method registers a test under a given user
//called inside the alert prompt method
 registerTest(test){

    

    this.af.auth.subscribe(authState => {
      this.currentUID = authState.uid;
      console.log('currentUID: '+this.currentUID);
        //this.tests = this.af.database.object('/users/'+uid+'/testHistory');
      });
    
       

    this.testToAdd = this.af.database.list('/users/'+this.currentUID+'/testHistory');
    console.log("adding the test");
    
    console.log(this.initialDate);

    this.calculateFinalDate(this.initialDateFormat, test.deliveryTime);


    this.testToAdd.push({
      type: test.$key,
      initialDate: this.initialDate ,
      finalDate: this.finalDate,
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
goToProfile(){
  this.navCtrl.push(ProfilePage);
}

// date prompt alertCtrl
// TODO: next button should save the date to firebase? and maybe have exception
// handlers


  // delay betweem alerts
  createTimeout(timeout) {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(null),timeout)
        })
    }

// checkbox alert; disabled for now
showCheckbox() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Information...');

    alert.addInput({
      type: 'checkbox',
      label: 'via e-mail',
      value: 'value1',
      checked: true
    });

    alert.addInput({
      type: 'checkbox',
      label: 'via app',
      value: 'value2'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Confirm',
      handler: data => {
        console.log('Checkbox data:', data);
        this.testCheckboxOpen = false;
        this.testCheckboxResult = data;

        this.confirmBtnTouched();

      }
    });
    alert.present();
  }

  // action sheet
  openMenu() {
   let actionSheet = this.actionsheetCtrl.create({
     title: 'Information',
     cssClass: 'action-sheets-basic-page',
     buttons: [
       {
         text: 'via Email',
         icon: !this.platform.is('ios') ? 'share' : null,
         handler: () => {
           console.log('Share clicked');
         }
       },
       {
         text: 'via App',
         icon: !this.platform.is('ios') ? 'arrow-dropright-circle' : null,
         handler: () => {
           console.log('Play clicked');
         }
       },
       {
         text: 'Both',
         icon: !this.platform.is('ios') ? 'heart-outline' : null,
         handler: () => {
           console.log('Favorite clicked');
         }
       },
       {
         text: 'Cancel',
         role: 'cancel', // will always sort to be on the bottom
         icon: !this.platform.is('ios') ? 'close' : null,
         handler: () => {
           console.log('Cancel clicked');
         }
       }
     ]
   });
   actionSheet.present();
 }

confirmBtnTouched(){
  this.navCtrl.push(InfoPage);
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

//cheks for date and its validity
datePrompt(test){


let alert = this.alertCtrl.create({
    title: 'Date Finder',
    subTitle: "Please enter the date of your recent blood test in the following format:\rdd/mm/yyyy",
    inputs: [
      {
        name: 'date',
        placeholder: 'XX/XX/XXXX'
      }
    ],
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Next',
        handler: data => {

         let isValidDate = this.dateValidator(data.date);

         if(isValidDate == true){
            this.initialDate = data.date;
            //  let navTransition = alert.dismiss();

            //  // start some async method
            //       this.createTimeout(600).then(() => {
            //         // once the async operation has completed
            //         // then run the next nav transition after the
            //         // first transition has finished animating out

            //         navTransition.then(() => {
            //           // here comes your navigation action (push, pop, setRoot)
            //           this.showCheckbox();
            //         });
            //       });

            this.registerTest(test)
         }else{
           this.invalidDateAlert(test);
           
         }

        
         
          }
        }
      
    ]
  });
  alert.present();

}


//http://www.w3resource.com/javascript/form/javascript-date-validation.php

//changes this.initialDateFormat
dateValidator(date : string) : boolean {

var dateFormat = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;

var isValid :boolean;

if(date.match(dateFormat)){
  console.log("regex matched");
  var dateArray = date.split('/');

  let day = parseInt(dateArray[0]);
  let month = parseInt(dateArray[1]);
  let year = parseInt(dateArray[2]);
  console.log("parsed date:"+day+' month:'+month+' year:'+year);
 // Create list of days of a month [assume there is no leap year by default]  
  var ListofDays = [31,28,31,30,31,30,31,31,30,31,30,31];  

  if (month > 12)  
  {  
    isValid = false;
  }
  //if over 31
  else if (day>ListofDays[month-1])  
  {  
  
  isValid = false;
  }  
   
  //if February
  else if (month==2)  
  {  
    //account for leap year
  var lyear = false;  
  if ( (!(year % 4) && year % 100) || !(year % 400))   
  {  
  lyear = true;  
  }  
  if ((lyear==false) && (day>=29))  
  {  
  isValid  = false;
  }  
  if ((lyear==true) && (day>29))  
  {  
   isValid  = false;
  }  
  
  }else
 
  isValid =true;
  this.initialDateFormat = new Date(month+'/'+day+'/'+year);
  console.log(this.initialDateFormat);  
  


}else{
 isValid =false;
}

console.log(isValid);

return isValid;
}


invalidDateAlert(test){

   //separate alert into new method
    let alert = this.alertCtrl.create({

      title: "Entered an invalid date",
      subTitle: "Please enter a date with this format: dd/mm/yyyy",
      buttons: [
        {
          text: "OK",
          //checking if it works
          handler: data => {
            console.log('OK clicked')
            this.datePrompt(test);
          }
        }
      ]
    });
    alert.present();

}

calculateFinalDate(initialDate : Date, deliveryTime){

//conversion to ms
  let deliveryTimeMs = deliveryTime *24*3600*1000;
  var initialDateMs = initialDate.getTime();

  this.finalDateCalculated = new Date(initialDateMs + deliveryTimeMs);
  this.finalDate = moment(this.finalDateCalculated).format('DD/MM/YYYY');
  console.log(this.finalDate); 
}

scheduleLocalNotification(test){

//by default notifications arrive at midnight (added 10h to be safe; added in ms)
//ensures that most people will be awake and GPs open 
  LocalNotifications.schedule({
    title:' Blood Test App - '+test.$key+' Results Available',
    text:'Phone your GP to find out',
    at: (this.finalDateCalculated.getTime() + 10*3600*1000)
  })

}


}


