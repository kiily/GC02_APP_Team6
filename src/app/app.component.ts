import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { LoginPage } from '../pages/login/login';
import { TestHistoryPage } from '../pages/test-history/test-history';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
 rootPage = LoginPage;
//rootPage = TestHistoryPage;


  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      StatusBar.overlaysWebView(true); // let status bar overlay webview
      StatusBar.backgroundColorByHexString('#ffffff'); // set status bar to white

      Splashscreen.hide();
    });
  }
}
