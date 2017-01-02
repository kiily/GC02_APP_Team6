import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { InfoPage } from '../pages/info/info';
import { ProfilePage } from '../pages/profile/profile';
import { ResultsPage } from '../pages/results/results';
import { SignupPage } from '../pages/signup/signup';
import { TestHistoryPage } from '../pages/test-history/test-history';
import { ProgressBarComponent } from '../components/progress-bar/progress-bar';

//import AF2 module
import {AngularFireModule} from 'angularfire2';

//AF2 settings; extracted these from firebase
//this connects to the database associated with
//Miguel's google account
export const firebaseConfig = {
    apiKey: "AIzaSyBAAXiVlgB66YObWKyFsuq8qMeZk6V23as",
    authDomain: "bloodtestapp-336ef.firebaseapp.com",
    databaseURL: "https://bloodtestapp-336ef.firebaseio.com",
    storageBucket: "bloodtestapp-336ef.appspot.com",
    messagingSenderId: "752847663614"
}


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    InfoPage,
    ProfilePage,
    ResultsPage,
    SignupPage,
    TestHistoryPage,
    ProgressBarComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig)
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    InfoPage,
    ProfilePage,
    ResultsPage,
    SignupPage,
    TestHistoryPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
