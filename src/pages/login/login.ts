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

/**
 * This is the class that renders the login page of the app. From here they can submit 
 * their login credentials and attempt to login to the app. This page includes password
 * recovery functions and allows the user to navigate to the sign up page.
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

  /**
   * This method is triggered as soon as the Login Page is loaded
   */
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');

  }



/**
 * This method is triggered when the user presses the login button. It extracts the supplied
 * email and password from the form builder and passes it this data to the login method of the 
 * angular fire auth provider. If the credentials are invalid, an alert is displayed. If they are valid 
 * , the form builder is reset and while a delay is presented the view changes to the Home page.
 */
login(){

// loading sign needs to be present first.
this.presentLoadingDefault();

   let email = this.loginForm.controls.email.value;
   let password = this.loginForm.controls.password.value;

// allow smooother transition into homepage if credentials are correct


   //login method from provider returns a promise
   this.authProvider.login(email, password)
   .then(authState =>  {

this.createTimeout(300).then(() => {
    console.log("LOGIN-SUCCESS", authState);
    this.loginForm.reset();

    this.navCtrl.push(HomePage);

  })
})
    .catch(error => {
    console.log("LOGIN-ERROR", error);
    this.invalidCredentialsAlert();
  });
  return false;


}

/**
 * This method is triggered when the user presses the sign up button. The view changes
 * to the sign up page.
 */
  register() {
    this.navCtrl.push(SignupPage);
  }


 /**
 * This utility method creates a delay of custom time to allow a smoother transition between login and homepage.
 */
  createTimeout(timeout) {
          return new Promise((resolve, reject) => {
              setTimeout(() => resolve(null),timeout)
          })
      }




/**
 * This utility method presents a signing in loading window to simulate
 * the logging in effect
 */

presentLoadingDefault() {
  let loading = this.loadingCtrl.create({
    content: 'Signing in...'
  });

  loading.present();

  setTimeout(() => {
    loading.dismiss();
  }, 1200);
}


//ALERTS AND PROMPTS

/**
 * This method presents an alert to notify the users that invalid credentials were entered during
 * login. It enables the user to access password recovery functions.
 */
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

/**
 * This method presents an alert when the user presses the forgot password button. This prompts the
 * user for a recovery email. If the email does not exist in the database, an alert is displayed.
 * If the email is in the database, the auth provider is used to send a password reset email. If the 
 * operation is successful an alert confirmation appears on the screen.
 */
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

          this.authProvider.resetPassword(recoveryEmail).then( onResolve => {

            this.emailSentAlert();
          })
          
          
          .catch(error => {
          
          this.emailDoesNotExistAlert();
        
      });

      
          }
        }
      ]
    });
    prompt.present();


}

/**
 * This method presents an alert to notify the user that the recovery email entered to receive
 * the password reset link does not exist in the database.
 */
emailDoesNotExistAlert(){

  let alert = this.alertCtrl.create({

      title: "User does not exist.",
      subTitle: "There is no user record corresponding to this email identifier.\rPlease try again.",
      buttons: [
        {
          text: "OK",
          //checking if it works
          handler: data => {
            console.log('OK clicked');
            this.passwordRecoveryPrompt();
          }
        }
        
      ]
    });
    alert.present();

}

/**
 * This method presents an alert to notify the user when the password recovery email is successfully 
 * sent from Firebase.
 */
emailSentAlert(){
  
  let alert = this.alertCtrl.create({

      title: "Email Sent",
      subTitle: "A recovery link was sent to your email.",
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
