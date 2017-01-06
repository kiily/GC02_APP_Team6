import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { LoginPage } from '../login/login';
import { FormBuilder, Validators } from '@angular/forms';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
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
export class SignupPage {


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

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }



  cancelNewUser(){
    this.navCtrl.pop(LoginPage);
  }


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



  


presentSignUpAlert(){

    //separate alert into new method
    let alert = this.alertCtrl.create({

      title: "Registration successful",
      subTitle: "We've sent you an email! Please verify your account before signing in.",
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


presentEmailAlreadyExistsAlert(){
  //separate alert into new method
    let alert = this.alertCtrl.create({

      title: "Email already in use",
      subTitle: "The email address is already in use by another account",
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


}
