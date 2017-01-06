import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { FormBuilder, Validators } from '@angular/forms';
import { AngularFire} from 'angularfire2';
import { AuthProvider} from '../../providers/auth-provider';
import { FirebaseProvider} from '../../providers/firebase-provider';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/map";
// to access photo gallery
import { Camera } from 'ionic-native';

/*
  Generated class for the Profile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

//user variables
  firstName;
  lastName;
  email;
  numberGP;
  

  profileForm;
  isEditable;

  private photoUploaded: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authProvider : AuthProvider,
  public firebaseProvider : FirebaseProvider, public formBuilder:FormBuilder, public af:AngularFire, public alertCtrl :AlertController) {
    //need to set this variable here so it can be used below
    this.isEditable =true;
     console.log(this.isEditable);


     this.profileForm = this.formBuilder.group({
      profileFirstname: [""],
      profileLastname: [""],
      profileGPNumber:[""],
      profileEmail: [""],
      profileNewPassword: [""],
      profileNewPasswordRepeat: [""]

      });

     
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    //call getCurrentUserInfo
    this.getCurrentUserInfo();

if(this.photoUploaded == null){
    this.photoUploaded = "assets/images/dobby.jpg";
}
    
  }

  backButton() {
  this.navCtrl.pop(HomePage);
  }

  
//IDEA: create a photoURI field in the database ?? could mess up if in another device.
  // http://blog.ionic.io/ionic-native-accessing-ios-photos-and-android-gallery-part-i/
  private openGallery (): void {
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
    .then(file_uri => this.photoUploaded = file_uri,
    err => console.log(err));
}


//need to re-think this and test
saveChanges(){

  let uid = this.authProvider.getCurrentUID();

  let firstName = this.profileForm.controls.profileFirstName.value;
  let lastName = this.profileForm.controls.profileLastName.value;
  let email = this.profileForm.controls.profileEmail.value;
  let numberGP = this.profileForm.controls.profileGPNumber.value;

  let newPassword = this.profileForm.controls.profileNewPassword.value;
  let newPasswordRepeat = this.profileForm.controls.profileNewPasswordRepeat.value;


   if(newPassword === newPasswordRepeat){
     this.authProvider.updateUserProfile(uid,firstName,lastName,email,numberGP);
   }
     

      this.presentChangesAlert();
  
}

toogleEdit(){
  if(this.isEditable == true){
    this.isEditable =false;
    console.log("changed to", this.isEditable);
  }else{
    this.isEditable = true;
  }

}

getCurrentUserInfo(){
  let uid = this.authProvider.getCurrentUID();

  let firstName = this.authProvider.getUserFirstName(uid);
  firstName.subscribe(firstNameDB => {
    this.firstName = firstNameDB.x.$value
  });

  let lastName = this.authProvider.getUserLastName(uid);
  lastName.subscribe(lastNameDB => {
    this.lastName = lastNameDB.x.$value
  });

   let email = this.authProvider.getUserEmail(uid);
  email.subscribe(emailDB => {
    this.email = emailDB.x.$value
  });

     let numberGP = this.authProvider.getUserGPNumber(uid);
  numberGP.subscribe(numberGPDB => {
    this.numberGP = numberGPDB.x.$value
  });

}
// getCurrentUserInfo(){

//    //getting the currently logged in user
//     this.af.auth.subscribe(authState => {
//       this.currentUID = authState.uid;
     
//      console.log("this shouldbe printed");

//       // this.currentUser = this.af.database.list('/users/'+currentUID).map(users => {
//       //   console.log(users);
//       //   return users;
//       //   });
//       // // .map(users => {

//       // //     console.log("map", users);


//       // //     for(let user in users){
//       // //     // this.firstName = user.firstname;
         
//       // //     }
//       // //     return users;
//       // // });
//       });


// //map method not working so currently works with more expensive operation
//    this.firstNameObject =this.af.database.object("/users/"+this.currentUID+'/firstname');
//     this.firstNameObject.subscribe( x => 
//     this.firstName = x.$value
//     );

//       this.lastNameObject =this.af.database.object("/users/"+this.currentUID+'/lastname');
//     this.lastNameObject.subscribe( x => 
//     this.lastName = x.$value
//     );

//       this.emailObject =this.af.database.object("/users/"+this.currentUID+'/email').subscribe( x => {
//     this.email = x.$value;
//     console.log(x)
//     console.log("email",this.email);
// });

//      this.af.database.object("/users/"+this.currentUID+'/numberGP').subscribe( x => 
//     this.numberGP = x.$value
//     );
      
      
      
    
     
// }



//to notify that new password does not match
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


presentChangesAlert(){
  
    //separate alert into new method
    let alert = this.alertCtrl.create({

      title: "Profile updated",
      subTitle: "Your changes have been successfully saved",
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
