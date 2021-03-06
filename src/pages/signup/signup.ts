import { Component } from '@angular/core';
import { NavController, AlertController, Slides,   Platform } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { LoginPage } from '../login/login';
import { FormBuilder, Validators } from '@angular/forms';
import { FirebaseListObservable } from 'angularfire2';
import { AuthProvider} from '../../providers/auth-provider';
import { Camera, Keyboard } from 'ionic-native';
/*
  Generated class for the Signup page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})

/**
 * This is the class that renders the sign up page of the app. From here the user can sign up to the app.
 * Once a user signs up, the relevant information is registered in the database.
 * If any errors occur during the process, alerts are displayed to notify the user.
 * Pressing the cancel button navigates to the login page.
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
 * - http://www.angulartypescript.com/angular-2-tutorial/
 */
export class SignupPage {

//observable which contains the list of all users in the database
users: FirebaseListObservable<any []>;

//form and slide variables
  signUpForm;
  mySlideOptions;

  gender: string;
  test: string = "hello";

@ViewChild('swipes') slider: Slides;

private photoUploaded: string;

  constructor(public navCtrl: NavController, public formBuilder:FormBuilder,
   public alertCtrl:AlertController,  public authProvider : AuthProvider, public platform :Platform) {


      this.platform.ready().then(() => {
      Keyboard.disableScroll(true);
    });
    
    this.mySlideOptions = {
    initialSlide: 0,
    loop: false,
    pager: true,
    };

    this.signUpForm = formBuilder.group({
      firstname: ["", Validators.required],
      lastname: ["", Validators.required],
      gender: ["",Validators.required],
      dob: ["",Validators.required],
      numberGP:[""],
      email: ["", Validators.required],
      password: ["", Validators.required],
      passwordRepeat: ["", Validators.required]

      });



  }

/**
 * This method is triggered as soon as the signup Page is loaded
 */
  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
   
  }


/**
 * This method is triggered by pressing the cancel button and sends the user back to the
 * login screen. Cancels the signup operation.
 */
  cancelNewUser(){
    this.navCtrl.pop(LoginPage);
  }


/**
 * This method is triggered by pressing the sign up button. It takes all the data from the
 * signUpForm form builder and checks whether the two passwords supplied match. If they do,
 * the user and its information are stored in the firebase database. If successful and alert 
 * notifies the user that the operation was successful. If the user supplies an already existing
 * email he is also notified by an alert. Lastly, if the passwords don't match, the user is not registered
 * and receives an alert displaying that the passwords do not match.
 */
  registerNewUserNew(){
     console.log("user registered");

    //data from slide 1
    let firstname = this.signUpForm.controls.firstname.value;
    let lastname = this.signUpForm.controls.lastname.value;
    let gender = this.signUpForm.controls.gender.value;
    let dob = this.signUpForm.controls.dob.value;
    let numberGP = this.signUpForm.controls.numberGP.value;

    //data from slide 2
    let email = this.signUpForm.controls.email.value;
    let password = this.signUpForm.controls.password.value;
    let passwordRepeat = this.signUpForm.controls.passwordRepeat.value;

    if(password === passwordRepeat){
      this.authProvider.registerNewUser(email,password)
      .then(authState => {
      //send email verification
      authState.auth.sendEmailVerification();

      let uid = authState.uid;
      this.authProvider.addUserToDatabase(uid, email, firstname, lastname, gender, dob, numberGP);
      
      if(this.photoUploaded != null){
      this.authProvider.updatePhotoUri(uid, this.photoUploaded);
      }

      this.presentSignUpAlert();

      this.navCtrl.setRoot(LoginPage);

      })
      .catch(error => {
       console.log("REGISTER ERROR", error);
       this.presentEmailAlreadyExistsAlert();
    });

    }else{
      this.presentPasswordAlert();
    }
  }






/**
 * This method presents an alert when the user sign up is successful.
 *
 */
presentSignUpAlert(){

  
    let alert = this.alertCtrl.create({

      title: "Registration successful",
      subTitle: "We've sent you an email! Please verify your account before signing in.",
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

/**
 * This method presents an alert when the password and the password repeat supplied during
 * sign up do not match.
 */
presentPasswordAlert(){

 
    let alert = this.alertCtrl.create({

      title: "Passwords did not match!",
      subTitle: "Make sure that the password fields match. Try again",
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

/**
 * This method presents an alert if the user tries to sign up with an email which already
 * exists in the database.
 */
presentEmailAlreadyExistsAlert(){
 
    let alert = this.alertCtrl.create({

      title: "Email already in use",
      subTitle: "The email address is already in use by another account",
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
      
    },
    err => console.log(err));
}

/**
 * This method presents an alert notifying the user that the photo is only used to be 
 * displayed inside the app.
 */
presentPhotoInfoAlert(){
 
    let alert = this.alertCtrl.create({

      title: "Photo Upload",
      subTitle: "This app only uses the photo for displaying a profile picture inside the app.",
      buttons: [
        {
          text: "OK",
          
          handler: data => {
            console.log('OK clicked')
            this.openGallery();
          }
        }
      ]
    });
    alert.present();
}


}
