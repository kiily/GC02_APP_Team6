import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFire } from 'angularfire2';
import { DomSanitizer} from '@angular/platform-browser';
import { EmailComposer } from 'ionic-native';
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

test;
currentUID;

//object from database
videoURLObject;
//link from database
videoURL :string;
description: string;
firstName: string;
email: string;



  constructor(public navCtrl: NavController, public navParams: NavParams, public af:AngularFire,
  public sanitizer : DomSanitizer) {
    this.testType = this.navParams.get("testType");

  }


  ionViewDidLoad() {

    //get the currently logged in user
    this.af.auth.subscribe(authState => {
      this.currentUID = authState.uid;
      console.log('currentUID: '+this.currentUID);
        
      });
 
    console.log("info test type", this.testType);

   this.test = this.af.database.object("/bloodTests/"+this.testType);
   // console.log("yep logging stuff",this.tests.$value);
//    this.testExists.subscribe(x => {
// //if x exists and x.$value is truthy
//      if(x && x.$value){
//        console.log("EXISTS",x);
    this.videoURLObject =this.af.database.object("/bloodTests/"+this.testType+'/video');
    console.log(this.videoURLObject);
    this.videoURLObject.subscribe( x => {
    console.log(x);
    //extracting the link from the database
    this.videoURL = x.$value;
    console.log(this.videoURL);

    });
//getting description from the database
    this.af.database.object("/bloodTests/"+this.testType+'/description').subscribe(description => {
      console.log(description);
      this.description = description.$value;
    });
    //NOW SANITIZING WITH A PIPE
    // this.sanitizedVideoURL = this.sanitizer.bypassSecurityTrustResourceUrl(this.videoURL);
    // console.log(this.sanitizedVideoURL);
    this.af.database.object("/users/"+this.currentUID+'/firstname').subscribe(firstname => {
      console.log(firstname);
      this.firstName = firstname.$value;
    });

    this.af.database.object("/users/"+this.currentUID+'/email').subscribe(email => {
      console.log(email);
      this.email = email.$value;
    });



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
  body: '<p>Dear '+this.firstName+',</p>'+'<p>'+this.description+'</p><p>Follow this link to watch the video:'+this.videoURL+'<p>As always, please contact the medical professional who ordered this test for you if you need to discuss further. We will update you shortly when your results are available.</p><p>Sincerely,</p><p>Blood Test App Team</p>',
  isHtml: true
};

EmailComposer.open(emailToSend);


}
     


}
