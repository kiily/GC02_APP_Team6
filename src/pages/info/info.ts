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
export class InfoPage {


testType;

//link from database
videoURL :string;
description: string;
firstName: string;
email: string;



  constructor(public navCtrl: NavController, public navParams: NavParams,  
  public authProvider : AuthProvider, public firebaseProvider : FirebaseProvider) {


    this.testType = this.navParams.get("testType");

  }


ionViewDidLoad(){
 
 let uid = this.authProvider.getCurrentUID();

 let videoURL = this.firebaseProvider.getVideoURL(this.testType);
 videoURL.subscribe(videoURLDB => {
   
   //this is the URL passed to the DOM
    this.videoURL = videoURLDB.$value;
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
 

}

backButton() {
    this.navCtrl.pop(HomePage);
}

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
