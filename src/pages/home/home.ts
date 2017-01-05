import { Component } from '@angular/core';
import {TestHistoryPage} from "../test-history/test-history";
import { NavController, AlertController, Platform, ActionSheetController } from 'ionic-angular';
import { InfoPage } from '../info/info';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { LoginPage } from '../login/login';
import { ProfilePage } from '../profile/profile';


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


  constructor(public navCtrl: NavController, public af:AngularFire, public alertCtrl:AlertController,
  public actionsheetCtrl: ActionSheetController, public platform: Platform) {

  }


//this subscription needs to be in this method;
//helps avoid memory leakage
   ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    this.tests = this.af.database.list("bloodTests");

    this.userPhoto =  "assets/images/dobby.jpg";
    console.log(this.userPhoto);

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
    //TODO: un comment
    //this.presentTestAddedAlert();

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

showPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Date Finder',
      message: "Please enter the date of your recent blood test",
      inputs: [
        {
          name: 'title',
          placeholder: 'dd/mm/yyyy'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Next',
          handler: data => {
            console.log('Next clicked');

            let navTransition = prompt.dismiss();

                  // start some async method
                  this.createTimeout(300).then(() => {
                    // once the async operation has completed
                    // then run the next nav transition after the
                    // first transition has finished animating out

                    navTransition.then(() => {
                      // here comes your navigation action (push, pop, setRoot)
                      this.showCheckbox();
                    });
                  });
                  return false;

            // this.showCheckbox();
          }
        }
      ]
    });
    prompt.present();

  }

  // delay betweem alerts
  createTimeout(timeout) {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(null),timeout)
        })
    }

// checkbox alert
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
}
