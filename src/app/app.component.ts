import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { LoginPage } from '../pages/login/login';

//import firebase from 'firebase';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
 rootPage = LoginPage;



  constructor(platform: Platform) {

    // firebase.initializeApp({
    // apiKey: "AIzaSyBAAXiVlgB66YObWKyFsuq8qMeZk6V23as",
    // authDomain: "bloodtestapp-336ef.firebaseapp.com",
    // databaseURL: "https://bloodtestapp-336ef.firebaseio.com",
    // storageBucket: "bloodtestapp-336ef.appspot.com",
    // messagingSenderId: "752847663614"
    // })
    


    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      StatusBar.overlaysWebView(true); // let status bar overlay webview
      StatusBar.backgroundColorByHexString('#ffffff'); // set status bar to white

      Splashscreen.hide();
    });
  }

}
