import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';

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


  private photoUploaded: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  backButton() {
  this.navCtrl.pop(HomePage);
  }

  test() {
    console.log("Hello");
  }

  // http://blog.ionic.io/ionic-native-accessing-ios-photos-and-android-gallery-part-i/
  private openGallery (): void {
    console.log('reached method');
    this.photoUploaded = "assets/images/dobby.jpg";
  // let cameraOptions = {
  //   sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
  //   destinationType: Camera.DestinationType.FILE_URI,
  //   quality: 100,
  //   targetWidth: 1000,
  //   targetHeight: 1000,
  //   encodingType: Camera.EncodingType.JPEG,
  //   correctOrientation: true
  // }
  //
  // Camera.getPicture(cameraOptions)
  //   .then(file_uri => this.photoUploaded = file_uri,
  //   err => console.log(err));
}

}
