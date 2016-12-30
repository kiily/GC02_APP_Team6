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

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    InfoPage,
    ProfilePage,
    ResultsPage,
    SignupPage,
    TestHistoryPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
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
