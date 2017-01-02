import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';

import { SignupPage } from '../signup/signup';

import { AngularFire, AuthMethods, AuthProviders, FirebaseListObservable} from 'angularfire2';
import { FormBuilder, Validators, } from '@angular/forms';




/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  loginForm;
  //in case of invalid credentials.
  error; 
  
  users: FirebaseListObservable<any []>;
  recoveryEmail;
  
  
  constructor(public navCtrl: NavController, public af : AngularFire, public formBuilder:FormBuilder,
  public alertCtrl : AlertController) {

//the validator ensures this doesn't work if no value is entered
    this.loginForm = formBuilder.group({
      email: ["", Validators.required],
      password: ["", Validators.required]

      
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');

    //creates users node in database
    this.users = this.af.database.list('/users');
    // //subscribe returns an obe=servable
    // this.af.auth.subscribe(authState => {
      
      
    //   //authState.uid
      
    // });
  }


//pressing the sign-up button
  login(){
     
    let email = this.loginForm.controls.email.value;
    let password = this.loginForm.controls.password.value;
    console.log(email);
    console.log(password);


    this.af.auth.login({
      email: email,
      password: password
    },{
      method: AuthMethods.Password,
      provider: AuthProviders.Password
         
    })//redirect to page inside the promise
    .then(authState =>  {
    console.log("LOGIN-THEN", authState);
    this.navCtrl.setRoot(HomePage)
    })
    .catch(error => {
    console.log("LOGIN-ERROR", error);


    //separate alert into new method
    let alert = this.alertCtrl.create({

      title: "Invalid credentials...",
      subTitle: "The username and password you entered does not match our records.\nPlease try again.",
      buttons: [
        {
          text: "OK",
          //checking if it works
          handler: data => {
            console.log('OK clicked')
          }
        },
        {
          //did not implement recovery yet
         text: "Forgot password?", 
         handler: data => {
           console.log("Forgot password clicked");
           
          this.passwordRecoveryPrompt();


         }
        }
      ]
    });
    alert.present();
  
});


  
    
  }




//for email : password auth
  register() {
    this.af.auth.createUser({
      email: "miguelmarin95@hotmail.com",
      //by default firebase makes passwords be at least 6 characters
      //we should make an alert to show this
      password: "password"

      
      
      //resolve promise and catch errors in registration, if any
    }).then(authState => {
      //send email verification
      //authState.auth.sendEmailVerification();
      
      let uid = authState.uid;
      
      console.log(uid);

     
     this.users.push({

      userId: uid,
      firstname: "Miguel",
      lastname: "Marin",
      email: "miguelmarin95@hotmail.com",
      numberGP: 7889

    });
      
      
    })
    .catch(error => {
    
    
   console.log("REGISTER ERROR", error);
    });


  }

//prompts the user for their email if they want to reset the password
//this method could probably go into a Firebase provider
passwordRecoveryPrompt() {


      let prompt = this.alertCtrl.create({
      title: 'Password recovery',
      message: "Enter the email associated with your account:",
      inputs: [
        {
          name: 'email',
          placeholder: 'Email'
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
          text: 'Confirm',
          handler: data => {
            this.recoveryEmail = data.email;
            console.log('Confirm clicked');
            console.log("prompt method: "+this.recoveryEmail);

           
           //did not manage to do this
          //   var auth = firebase.auth();
          //   auth.sendPasswordResetEmail(this.recoveryEmail).then(() => {
          // console.log("recovery email sent");

          // }).catch(() => {
          //     console.log("an error happened")
          // });
            
            
          }
        }
      ]
    });
    prompt.present();
    
    
  }


  

}





