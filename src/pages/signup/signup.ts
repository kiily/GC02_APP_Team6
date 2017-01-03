import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { LoginPage } from '../login/login';
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

  gender: string = "f";
  test: string = "hello";

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  mySlideOptions = {
  initialSlide: 0,
  loop: false,
  pager: true,
};

@ViewChild('swipes') slider: Slides;

  cancelNewUser(){
    this.navCtrl.pop(LoginPage);
  }

}
