import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { LoginPage } from '../login/login';
import { FormBuilder, Validators } from '@angular/forms';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
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

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public formBuilder:FormBuilder, public af:AngularFire, public alertCtrl:AlertController) {

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



@ViewChild('swipes') slider: Slides;

  cancelNewUser(){
    this.navCtrl.pop(LoginPage);
  }

  registerNewUser(){
    console.log("user registered");

    let email = this.signUpForm.controls.email.value;
    let password = this.signUpForm.controls.password.value;
    let passwordRepeat = this.signUpForm.controls.passwordRepeat.value;

    if(password === passwordRepeat){
    this.af.auth.createUser({
      email: email,
      password: password

      //resolve promise and catch errors in registration, if any
    }).then(authState => {
      //send email verification
      authState.auth.sendEmailVerification();
      this.presentSignUpAlert();
      let uid = authState.uid;


      //this seems a bit clumsy inside the auth state part
      //consider moving it outside and creating a class variables
      //for current uid
      console.log(uid);

      this.users = this.af.database.list('/users/'+uid);

      let firstname = this.signUpForm.controls.firstname.value;
      let lastname = this.signUpForm.controls.lastname.value;
      let gender = this.signUpForm.controls.gender.value;
      let dob = this.signUpForm.controls.dob.value;
      let numberGP = this.signUpForm.controls.numberGP.value;

      console.log(firstname);
      console.log(email);

      this.af.database.object('/users/'+uid).update({

      firstname: firstname,
      lastname: lastname,
      gender: gender,
      dob: dob,
      email: email,
      numberGP: numberGP,
      //for email preferences
      preferences: false


      });


      this.navCtrl.setRoot(LoginPage);

    })
    .catch(error => {


   console.log("REGISTER ERROR", error);
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


}
