import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AngularFire} from 'angularfire2';
import { AuthProvider} from '../../providers/auth-provider';
import { FirebaseProvider} from '../../providers/firebase-provider';
import "rxjs/add/operator/map";
// to access photo gallery
import { Camera } from 'ionic-native';

/*
  Generated class for the Profile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})

/**
 * This is the class that renders the profile page of the app. From here the user can edit
 * profile and navigate back to the home screen. 
 * This class contains the variables and methods necessary to render a fully functional
 * HTML template.
 * 
 * References:
 * - https://ionicframework.com/docs/
 * - https://docs.angularjs.org/guide/unit-testing
 * - http://www.angular2.com/
 * - https://angular.io/docs/ts/latest/guide/
 * - https://cordova.apache.org/docs/en/latest/guide/overview/#web-app
 * - http://www.typescriptlang.org/docs/tutorial.html
 * - https://www.joshmorony.com/building-mobile-apps-with-ionic-2/
 */
export class ProfilePage {

//user variables
  firstName;
  lastName;
  email;
  numberGP;
  newPassword;
  newPasswordRepeat;

  //boolean for enabling and disabling ion-input fields
  isEditable =true;

  private photoUploaded: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authProvider : AuthProvider,
  public firebaseProvider : FirebaseProvider, public af:AngularFire, public alertCtrl :AlertController) {
    //need to set this variable here so it can be used below
 
     console.log(this.isEditable);

     
  }

  /**
 * This method is triggered as soon as the profile Page is loaded and it calls the getCurrentUserInfo()
 * method which renders all the information belonging to the currenltly connected user,  to the HTML template.
 *  */
  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  
    this.getCurrentUserInfo();

    console.log("current photo uri: "+this.photoUploaded);
    console.log("firstname: "+this.firstName)
    
  
  

if(this.photoUploaded == null){
    this.photoUploaded = "assets/images/dobby.jpg";
}
    
  }

  /**
   * Method triggered when the user presses the back arrow/button. The view changes to the 
   * home page.
   */
  backButton() {
  this.navCtrl.pop(HomePage);
  }

  
  /**
   * This method accesses the camera of the device the application is running on via a native cordova
   * plugin. It then extracts the uri for the picture and saves it to the firebase database as an 
   * attribute of the specified user. This can then be extracted so that the photo is accessible 
   * whenever the user logs into the app.
   * 
   * References:
   *  - http://blog.ionic.io/ionic-native-accessing-ios-photos-and-android-gallery-part-i/
   */
  openGallery() : void {
    console.log('reached method');

  let uid = this.authProvider.getCurrentUID();

  let cameraOptions = {
    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
    destinationType: Camera.DestinationType.FILE_URI,
    quality: 100,
    targetWidth: 1000,
    targetHeight: 1000,
    encodingType: Camera.EncodingType.JPEG,
    correctOrientation: true
  }
  
  Camera.getPicture(cameraOptions)
    .then(file_uri => {this.photoUploaded = file_uri;
      console.log("this is the photo uri"+file_uri);
      this.authProvider.updatePhotoUri(uid, file_uri);
    },
    err => console.log(err));
}


//FOR TOMORROW, SHOULD EMAIL EVEN BE HERE ??
/**
 * This method is triggered by pressing the save changes button. It takes the information
 * in the ion-input fields and passes it to the auth provider method updateUserProfile thus
 * updating the information for the user specified by the user id. This includes the last name,
 * first name,email and GP number.
 */
saveChanges(){

  let uid = this.authProvider.getCurrentUID();
  
  

//we are getting rid of the new password part on this
   if(this.newPassword === this.newPasswordRepeat){
     this.authProvider.updateUserProfile(uid,this.firstName,this.lastName,this.email,this.numberGP);
     console.log("user updated");
   }
     

      this.presentChangesAlert();
  
}

/**
 * This utility method is triggered by pressing the edit button. It changes the value of the
 * isEditable boolean thus enabling the control over whether the ion-inputs are enabled or 
 * disabled.
 */
toogleEdit(){
  if(this.isEditable == true){
    this.isEditable =false;
    console.log("changed to", this.isEditable);
  }else{
    this.isEditable = true;
    console.log("changed to", this.isEditable);
  }

}

/**
 * This method extracts all the relevant information about the currently connected user, based on
 * its uid in order to provide the data necessary to render this information on the HTML template.
 * User data extracted from the database includes: uid, first and last names, email, their GP number and
 * the uri for the photo saved.
 */
getCurrentUserInfo(){
  let uid = this.authProvider.getCurrentUID();

  let firstName = this.authProvider.getUserFirstName(uid);
  firstName.subscribe(firstNameDB => {
    this.firstName = firstNameDB.$value
  });

  let lastName = this.authProvider.getUserLastName(uid);
  lastName.subscribe(lastNameDB => {
    this.lastName = lastNameDB.$value
  });

   let email = this.authProvider.getUserEmail(uid);
  email.subscribe(emailDB => {
    this.email = emailDB.$value
  });

     let numberGP = this.authProvider.getUserGPNumber(uid);
  numberGP.subscribe(numberGPDB => {
    this.numberGP = numberGPDB.$value
  });

   
  let photoUri = this.authProvider.getPhotoUri(uid);
  photoUri.subscribe(photoUriDB =>  {
    this.photoUploaded = photoUriDB.$value;
    console.log(photoUriDB.$value);
  });
}

/**
 * This method is deprecated
 */
presentPasswordAlert(){
  
    //separate alert into new method
    let alert = this.alertCtrl.create({

      title: "Passwords did not match!",
      subTitle: "Make sure that the password fields match. Try again",
      buttons: [
        {
          text: "OK",
          //checking if it works
          handler: data => {
            console.log('OK clicked')
          }
        }
      ]
    });
    alert.present();
  


}

/**
 * This method presents an alert to notify the user that the changes to the profile page
 * where successfully saved to the firebase database.
 */
presentChangesAlert(){
  
    let alert = this.alertCtrl.create({

      title: "Profile updated",
      subTitle: "Your changes have been successfully saved",
      buttons: [
        {
          text: "OK",
          handler: data => {
            console.log('OK clicked')
          }
        }
      ]
    });
    alert.present();
  


}

}
