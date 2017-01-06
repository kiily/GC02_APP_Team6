import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { FormBuilder, Validators, } from '@angular/forms';
import { AuthProvider} from '../../providers/auth-provider';
import { HomePage } from '../home/home';
import { SignupPage } from '../signup/signup';




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

  constructor(public navCtrl: NavController, public formBuilder:FormBuilder,
  public alertCtrl : AlertController, public loadingCtrl : LoadingController, public authProvider : AuthProvider) {

  //the validator ensures this doesn't work if no value is entered
    this.loginForm = formBuilder.group({
      email: ["", Validators.required],
      password: ["", Validators.required]


    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    
  }



//pressing the login button
login(){
   

   let email = this.loginForm.controls.email.value;
   let password = this.loginForm.controls.password.value;

   //login method from provider returns a promise
   this.authProvider.login(email, password)
   .then(authState =>  {
    
    console.log("LOGIN-SUCCESS", authState);
    this.loginForm.reset();
    
    this.navCtrl.push(HomePage);
    this.presentLoadingDefault();
    

  })
    .catch(error => {
    console.log("LOGIN-ERROR", error);
    this.invalidCredentialsAlert();
  });
  
 

}


//change to sign-up page
  register() {
    this.navCtrl.push(SignupPage);
  }



// loading animation
presentLoadingDefault() {
  let loading = this.loadingCtrl.create({
    content: 'Signing in...'
  });

  loading.present();

  setTimeout(() => {
    loading.dismiss();
  }, 800);
}


//alerts and prompts

//triggered in case of invalid credentials
invalidCredentialsAlert(){
  
    let alert = this.alertCtrl.create({

      title: "Invalid credentials...",
      subTitle: "The username and password you entered does not match our records.\rPlease try again.",
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


}

//called inside invalidCredentialsAlert() in case the user presses 'Forgot Password'
passwordRecoveryPrompt(){

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
            let recoveryEmail = data.email;
            console.log('Confirm clicked');
            console.log("prompt method: "+recoveryEmail);


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
