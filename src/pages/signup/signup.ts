import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { LoginPage } from '../login/login';
import { FormBuilder, Validators } from '@angular/forms';
import { FirebaseListObservable } from 'angularfire2';
import { AuthProvider} from '../../providers/auth-provider';
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


  constructor(public navCtrl: NavController, public formBuilder:FormBuilder, 
   public alertCtrl:AlertController,  public authProvider : AuthProvider) {

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


}
