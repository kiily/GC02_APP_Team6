import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AngularFire, AuthMethods, AuthProviders, FirebaseObjectObservable, AngularFireAuth} from 'angularfire2';

import firebase from 'firebase';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

/**
 * This class provides the methods necessary to manipulate user data to/from the database and
 * provides methods to support authentication.
 */
@Injectable()
export class AuthProvider {

firebaseAuth: AngularFireAuth;

  constructor(public af : AngularFire) {
    this.firebaseAuth = af.auth;
  }

/**
 * This method takes an email and password and attempts to log in the user. It
 * returns a firebase promise of the type FirebaseAuthState.
 */
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

/**
 * This method takes a username and password and registers a user with these credentials in 
 * the firebase database. It returns a firebase promise of the type FirebaseAuthState.
 */
registerNewUser(email, password){

  let registerNewUserPromise = this.af.auth.createUser({
      email: email,
      password: password
    });
  
    return registerNewUserPromise;
}

/**
 * This method takes a user's: uid, email, first and last names, gender, date of birth and the number 
 * of their GP. This information generates a JSON object for this user in the database so that
 * his personal information can be recorded and retrieved from the firebase database.
 */
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

/**
 * This method takes a user's: uid, first and last names, email and the number of their GP,
 * and it updates the profile of this user with the parameters passed.
 */
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

/**
 * This method is used to retrieve the userID (uid) of the currently
 * connected user.
 */
getCurrentUID() : string {
  let uid;
  this.af.auth.subscribe(authState => {
      uid = authState.uid;
      });
      console.log('currentUID: '+uid)
      return uid
}

/**
 * Getter for the user's first name. User is specified by its uid.
 * The method returns a FirebaseObjectObservable to which we later subscribe
 * to extract the first name data.
 */
getUserFirstName(uid) : FirebaseObjectObservable<any>{
  let firstName = this.af.database.object("/users/"+uid+'/firstname');

  return firstName;
}


/**
 * Getter for the user's last name.  User is specified by its uid.
 * The method returns a FirebaseObjectObservable to which we later subscribe
 * to extract the last name data.
 */
getUserLastName(uid) : FirebaseObjectObservable<any>{
  let LastName = this.af.database.object("/users/"+uid+'/lastname');

  return LastName;
}


/**
 * Getter for the user's email.  User is specified by its uid.
 *The method returns a FirebaseObjectObservable to which we later subscribe
 * to extract the email data.
 */
getUserEmail(uid) : FirebaseObjectObservable<any>{
  let email = this.af.database.object("/users/"+uid+'/email');

  return email;
}

/**
 * Getter for the user's GP number. User is specified by its uid.
 * The method returns a FirebaseObjectObservable to which we later subscribe
 * to extract the user's GP number data.
 */
getUserGPNumber(uid) : FirebaseObjectObservable<any>{
  let numberGP = this.af.database.object("/users/"+uid+'/numberGP');

  return numberGP;
}


/**
 * This method takes the user's email and sends a password recovery email.
 * It checks whether the recovery email exists in the database.
 */
resetPassword(email : string){
  return firebase.auth().sendPasswordResetEmail(email);
}

/**
 * This method takes a photo uri from the camera gallery and updates this information
 * for the specified user id.
 */
updatePhotoUri(uid, photoUri){
   this.af.database.object('/users/'+uid).update({
        
      photoUri: photoUri
     
     
      });
}

/**
 * Getter for the user's profile photo uri. User is specified by its uid.
 * The method returns a FirebaseObjectObservable to which we later subscribe
 * to extract the profile photo uri data.
 */
getPhotoUri(uid) : FirebaseObjectObservable<any>{
  let photoUri = this.af.database.object("/users/"+uid+'/photoUri');

  return photoUri;
}


}
