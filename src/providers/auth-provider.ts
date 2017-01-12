import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AngularFire, AuthMethods, AuthProviders, FirebaseObjectObservable, AngularFireAuth} from 'angularfire2';

import firebase from 'firebase';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthProvider {

firebaseAuth: AngularFireAuth;

  constructor(public af : AngularFire) {
    this.firebaseAuth = af.auth;
  }

login(email, password){

    let loginPromise = this.af.auth.login({
      email: email,
      password: password
    },{
      method: AuthMethods.Password,
      provider: AuthProviders.Password

    });

    return loginPromise;

}

registerNewUser(email, password){

  let registerNewUserPromise = this.af.auth.createUser({
      email: email,
      password: password
    });
  
    return registerNewUserPromise;
}

//uid --> user ID (unique)
addUserToDatabase(uid, email, firstname, lastname, gender, dob, numberGP){

    this.af.database.object('/users/'+uid).update({
        
      firstname: firstname,
      lastname: lastname,
      gender: gender,
      dob: dob,
      email: email,
      numberGP: numberGP
      //for email preferences
      //preferences: false
      });

}

updateUserProfile(uid, firstName, lastName, email, numberGP){
  this.af.database.object('/users/'+uid).update({
        
      firstname: firstName,
      lastname: lastName,
      email: email,
      numberGP: numberGP,
      //for email preferences
      //preferences: false
     
     
      });
}

getCurrentUID() : string {
  let uid;
  this.af.auth.subscribe(authState => {
      uid = authState.uid;
      });
      console.log('currentUID: '+uid)
      return uid
}

getUserFirstName(uid) : FirebaseObjectObservable<any>{
  let firstName = this.af.database.object("/users/"+uid+'/firstname');

  return firstName;
}

getUserLastName(uid) : FirebaseObjectObservable<any>{
  let LastName = this.af.database.object("/users/"+uid+'/lastname');

  return LastName;
}

getUserEmail(uid) : FirebaseObjectObservable<any>{
  let email = this.af.database.object("/users/"+uid+'/email');

  return email;
}

getUserGPNumber(uid) : FirebaseObjectObservable<any>{
  let numberGP = this.af.database.object("/users/"+uid+'/numberGP');

  return numberGP;
}

resetPassword(email : string){
  return firebase.auth().sendPasswordResetEmail(email);
}

//temporary method to see if the image URI is working
updatePhotoUri(uid, photoUri){
   this.af.database.object('/users/'+uid).update({
        
      photoUri: photoUri
     
     
      });
}


getPhotoUri(uid) : FirebaseObjectObservable<any>{
  let photoUri = this.af.database.object("/users/"+uid+'/photoUri');

  return photoUri;
}


}
