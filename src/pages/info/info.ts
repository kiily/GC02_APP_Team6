import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { EmailComposer } from 'ionic-native';
import { AuthProvider} from '../../providers/auth-provider';
import { FirebaseProvider} from '../../providers/firebase-provider';

/*
  Generated class for the Info page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-info',
  templateUrl: 'info.html'
})

/**
 * This is the class that renders the info page of the app. In this page the user receives Information
 * about the selected test as well as a video of a doctor explaining the test and some of the underlying
 * biology. From this page the user can send this information to their email and navigate back to the
 * home page.
 * This class contains the variables and methods necessary to render a fully functional
 * HTML template.
 * 
 *  * References:
 * - https://ionicframework.com/docs/
 * - https://docs.angularjs.org/guide/unit-testing
 * - http://www.angular2.com/
 * - https://angular.io/docs/ts/latest/guide/
 * - https://cordova.apache.org/docs/en/latest/guide/overview/#web-app
 * - http://www.typescriptlang.org/docs/tutorial.html
 * https://www.joshmorony.com/building-mobile-apps-with-ionic-2/
 */
 
export class InfoPage {


testType;

//user and test data to render
videoURL :string;
description: string;
firstName: string;
email: string;
infoLink1 : string;
infoLink2 : string;




  constructor(public navCtrl: NavController, public navParams: NavParams,  
  public authProvider : AuthProvider, public firebaseProvider : FirebaseProvider) {


    this.testType = this.navParams.get("testType");

  }



/**
 * This method is triggered as soon as the info Page is loaded and it stores the
 * current user's uid in order to be able to retrieve his first and last names .  Additionally the method retrieves a specific
 * test type's desciption and video URL as well as 2 additional information links to be displayed on the home page. Note that subscribe methods are included here instead of 
 * being inside the constructor because this prevents memory leakage.
 *  */
ionViewDidLoad(){
 
 let uid = this.authProvider.getCurrentUID();

 let videoURL = this.firebaseProvider.getVideoURL(this.testType);
 videoURL.subscribe(videoURLDB => {
   
   //this is the URL passed to the DOM
    this.videoURL = videoURLDB.$value;
    console.log("URL: "+this.videoURL);
 });

 let description = this.firebaseProvider.getTestDescription(this.testType);
 description.subscribe(descriptionDB => {
   this.description = descriptionDB.$value;
   //console.log(this.description);
 });

 let firstName = this.authProvider.getUserFirstName(uid);
 firstName.subscribe(firstNameDB =>{
   this.firstName = firstNameDB.$value;
 })

 let email = this.authProvider.getUserEmail(uid);
 email.subscribe(emailDB => {
   this.email= emailDB.$value;
 });
 
 let videoLink1 = this.firebaseProvider.getInfoLink1(this.testType);
 videoLink1.subscribe(infoLink1DB => {
   this.infoLink1 = infoLink1DB.$value;
   //console.log(this.description);
 });

  let videoLink2 = this.firebaseProvider.getInfoLink2(this.testType);
 videoLink2.subscribe(infoLink2DB => {
   this.infoLink1 = infoLink2DB.$value;
   //console.log(this.description);
 });

}

/**
 * This method is triggered when the user presses the back arrow/button. The view changes to the 
 * home screen.
 */
backButton() {
    this.navCtrl.pop(HomePage);
}

/**
 * This method is triggered when the user presses the send to email button. It calls the 
 * email composer from the respective cordova plugin and it allows the user to compose an email, which
 * will contain the relevant information and send this to the registered email address.
 * 
 * References:
 * - https://github.com/hypery2k/cordova-email-plugin
 * - https://ionicframework.com/docs/v2/native/email-composer/
 */
sendEmail(){

  EmailComposer.isAvailable().then((available : boolean) => {
    if(available){
      console.log("can now send email");
    }
  });

//might need to hardcode the password
let emailToSend ={
  to: this.email,
  subject: 'Blood Test App - '+this.testType+' Information',
  body: '<p>Dear '+this.firstName+',</p>'+'<p>'+this.description+'</p><p>Follow this link to watch the video: '+this.videoURL+'<p>As always, please contact the medical professional who ordered this test for you if you need to discuss further. We will update you shortly when your results are available.</p><p>Sincerely,</p><p>Blood Test App Team</p>',
  isHtml: true
};

EmailComposer.open(emailToSend);


}
     


}
