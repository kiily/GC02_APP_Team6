import { Component } from '@angular/core';
import {TestHistoryPage} from "../test-history/test-history";
import { NavController, AlertController } from 'ionic-angular';
import { InfoPage } from '../info/info';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { ProfilePage } from '../profile/profile';
import { LocalNotifications } from 'ionic-native';
import { AuthProvider} from '../../providers/auth-provider';
import { FirebaseProvider} from '../../providers/firebase-provider';
import * as moment from 'moment';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

/**
 * This is the class that renders the home page of the app. From here the user can sign out,
 * visit the test history, select from a list of available tests and edit their profile.
 * This class contains the variables and methods necessary to render a fully functional
 * HTML template.
 * 
 *  References:
 * - https://ionicframework.com/docs/
 * - https://docs.angularjs.org/guide/unit-testing
 * - http://www.angular2.com/
 * - https://angular.io/docs/ts/latest/guide/
 * - https://cordova.apache.org/docs/en/latest/guide/overview/#web-app
 * - http://www.typescriptlang.org/docs/tutorial.html
 * - https://www.joshmorony.com/building-mobile-apps-with-ionic-2/
 * - https://devdactic.com/ultimate-ionic-2-cheatsheet/
 */
export class HomePage {



 // use this to give the uri of the profile picture from firebase
userPhoto: string;



//to display in the home page
firstName;
lastName;
tests: FirebaseListObservable<any[]>;


  constructor(public navCtrl: NavController, public af:AngularFire, public alertCtrl:AlertController,
   public authProvider : AuthProvider, public firebaseProvider : FirebaseProvider ) {
    
  }



/**
 * This method is triggered as soon as the Home Page is loaded and it stores the
 * current user's uid in order to be able to retrieve  his first and last names and the 
 * uri for their profile photo from the firebase database.  Additionally the method retrieves the list of available tests
 * to be displayed on the home page. Note that subscribe methods are included here instead of 
 * being inside the constructor because this prevents memory leakage.
 *  */
   ionViewDidLoad() {
    console.log('HomePage Loaded');


    let uid = this.authProvider.getCurrentUID()
    //to render buttons
    this.tests = this.firebaseProvider.getBloodTests();

     
  let firstName = this.authProvider.getUserFirstName(uid);
  firstName.subscribe(firstNameDB => {
    this.firstName = firstNameDB.$value
  });

  let lastName = this.authProvider.getUserLastName(uid);
  lastName.subscribe(lastNameDB => {
    this.lastName = lastNameDB.$value
  });

     
  let photoUri = this.authProvider.getPhotoUri(uid);
  photoUri.subscribe(photoUriDB =>  {
    this.userPhoto = photoUriDB.$value;
    console.log(photoUriDB.$value);
  });
  

   }


/**
 * This method is triggered when a user confirms that he wants to sign out. The view changes
 * to the login page.
 */
signOutBtn(){
    this.navCtrl.popToRoot();
    //this.af.auth.logout();

  }

/**
 * This method is triggered when the user presses the my tests button.
 * The view changes to the test history page.
 */
goToTestHistory(){
  this.navCtrl.push(TestHistoryPage);
}

/**
 * This method is triggered when the user presses the my edit profile button.
 * The view changes to the profile page.
 */
goToProfile(){
  this.navCtrl.push(ProfilePage);
}



//CHECK IF WE STILL NEED THIS ONE
/**
 * Utility method to create delays between alerts. 
 * Making the design more fluid.
 */
createTimeout(timeout) {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(null),timeout)
        })
    }


/**
 * This method is triggered when the user selects one of the tests from the home screen.
 * A prompt message prompts the user to enter the date of their recent blood test.
 * A built-in date validator, rejects invalid date formats (i.e. NOT dd/mm/yyyy).
 * If the date is valid this method calls utility methods to store the test in the database,
 * calculate and store the estimated date for result delivery and schedule a notification for that
 * date to remind the user to ring their GP. 
 * 
 * Takes the argument test --> object representing the test chosen by the user
 */
datePrompt(test){

let uid = this.authProvider.getCurrentUID();

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

          var dateArray = data.date.split('/');

          let day = parseInt(dateArray[0]);
          let month = parseInt(dateArray[1]);
          let year = parseInt(dateArray[2]);

          let testDate : Date = new Date(month+'/'+day+'/'+year);
          console.log(testDate);
          let testDateStr : string  = moment(testDate).format('DD/MM/YYYY');
          console.log(testDateStr);

         if(isValidDate == true){
            
            let resultDeliveryDate = this.calculateFinalDate(testDate, test.deliveryTime);
            let resultDeliveryDateStr : string = moment(resultDeliveryDate).format('DD/MM/YYYY');
            //this.scheduleLocalNotification(test, resultDeliveryDate);


            this.firebaseProvider.registerNewTest(uid, test, testDateStr, resultDeliveryDateStr);

            this.scheduleLocalNotification(test, resultDeliveryDate);
            this.presentTestAddedAlert();
    
            //alternative is to put this in the alert method
            //and pass the test parameter
            this.navCtrl.push(InfoPage, {
            testType: test.$key
       
    });

         }else{
           this.invalidDateAlert(test);
           
         }

        
         
          }
        }
      
    ]
  });
  alert.present();

}





/**
 * This method takes in a string and checks if it is a valid date of the format:
 * dd/mm/yyyy.
 * 
 * References:
 * - http://www.w3resource.com/javascript/form/javascript-date-validation.php
 */
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
  
  
  


}else{
 isValid =false;
}

console.log(isValid);

return isValid;
}

/**
 * This method presents an alert when the date entered in the date prompt is invalid.
 * It takes a test object as an input so that the date prompt function can be called again
 * allowing the user to input another date.
 */
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

/**
 * This method presents an alert to notify the user that a test was successfully added to 
 * the firebase database.
 */
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

/**
 * This method takes the test date entered by the user and the delivery time retrieved from the
 * firebase database in order to calculate the estimated result delivery date.
 */
calculateFinalDate(testDate : Date, deliveryTime) : Date {

//conversion to ms
  let deliveryTimeMs = deliveryTime *24*3600*1000;
  var testDateMs = testDate.getTime();

  let resultDeliveryDate : Date  = new Date(testDateMs + deliveryTimeMs);
  
  
  return resultDeliveryDate;
}


/**
 * This method schedules local notifications fofr the estimated result delivery date for 
 * the test chosen by the user. The method adds 10h (in ms) to avoid the notifications to arrive at 
 * midnight (default) ensuring that they arrive at 10pm when most users will be awake and GPs open
 * to recieve calls.
 */
scheduleLocalNotification(test, deliveryDate : Date ){

console.log('scheduling notification for this date: '+deliveryDate);

  LocalNotifications.schedule({
    title:' Blood Test App - '+test.$key+' Results Available',
    text:'Phone your GP to find out',
    at: (deliveryDate.getTime() + 10*3600*1000)
   
  })



}

signOutMethod(){

     let confirm = this.alertCtrl.create({
      title: 'Sign out?',
      message: 'Are you sure that you want to sign out?',
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

            this.signOutBtn();

          }
        }
        
      ]
    });
    confirm.present();

}

}
