import { Component } from '@angular/core';
import {TestHistoryPage} from "../test-history/test-history";
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { ProfilePage } from '../profile/profile';
import { InfoPage } from '../info/info';
import { AlertController } from 'ionic-angular';
import { Platform, ActionSheetController } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public alertCtrl: AlertController,
    public actionsheetCtrl: ActionSheetController, public platform: Platform) {
  }

  ionViewDidLoad(){
    this.userPhoto =  "assets/images/default-user-grey.png";
    console.log(this.userPhoto);
  }

  itemSelected(item: string) {
    console.log("Selected Item", item);
  }

signOutBtn(){
    this.navCtrl.popToRoot();
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

}
