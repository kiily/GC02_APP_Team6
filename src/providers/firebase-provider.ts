import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable,FirebaseListObservable } from 'angularfire2';
import 'rxjs/add/operator/map';

/*
  Generated class for the FirebaseProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

/**
 * This class provides the methods necessary to manipulate user and test data to/from the database.
 */
@Injectable()
export class FirebaseProvider {

  constructor(public af: AngularFire) {
    
  }


/**
 * This method takes a test object, a test date and an estimated result delivery date
 * to register a new test in the test history of the user specified by the uid passed
 * as an argument.
 */
registerNewTest(uid, test, testDate, resultDeliveryDate ){


  let testToAdd = this.af.database.list('/users/'+uid+'/testHistory');
   console.log("adding the test");

    testToAdd.push({
      type: test.$key,
      testDate: testDate,
      resultDeliveryDate: resultDeliveryDate,
      deliveryTime: test.deliveryTime
 });

 console.log("TEST ADDED");

}

/**
 * Getter for a specific test type's video URL. The method returns a FirebaseObjectObservable to which we later subscribe
 * to extract the video URL data.
 */
getVideoURL(testType) : FirebaseObjectObservable<any> {
  let videoURL =this.af.database.object("/bloodTests/"+testType+'/video');

  return videoURL;

}

/**
 * Getter for a specific test type's description. The method returns a FirebaseObjectObservable to which we later subscribe
 * to extract the description data.
 */
getTestDescription(testType) : FirebaseObjectObservable<any>{
  let description = this.af.database.object("/bloodTests/"+testType+'/description');
  console.log(description);

  return description;
}

/**
 * Getter for all the tests in a given user's test history. The FirebaseListObservable
 * returned by this method can be used to render the tests as a list in the HTML template.
 */
getUserTests(uid) : FirebaseListObservable<any> {
  let tests = this.af.database.list('/users/'+uid+'/testHistory');

  return tests;

}

/**
 * This method passes a specific test key to delete a test from a specified user's test history.
 * This is determined by the uid passed as an argument. The test which matches the key is removed
 * from the database and from the HTML template.
 */
deleteTest(uid, testKeyToDelete){
  this.af.database.object('/users/'+uid+'/testHistory/'+testKeyToDelete).remove();
  
}
/**
 * Getter for all the blood test types that are stored in the firebase database. The FirebaseListObservable
 * returned by this method can be used to render the tests as buttons in the HTML template.
 */
getBloodTests() : FirebaseListObservable<any>{

  let tests = this.af.database.list("/bloodTests");
  return tests;

}

/**
 * Getter for a specific test type's info link #1. The method returns a FirebaseObjectObservable to which we later subscribe
 * to extract the info link #1 data.
 */
getInfoLink1(testType): FirebaseObjectObservable<any>{

  let infoLink1 = this.af.database.object("/bloodTests/"+testType+'/infoLink1');
  return infoLink1;
}

/**
 * Getter for a specific test type's info link #2. The method returns a FirebaseObjectObservable to which we later subscribe
 * to extract the info link #2 data.
 */
getInfoLink2(testType): FirebaseObjectObservable<any>{

  let infoLink2 = this.af.database.object("/bloodTests/"+testType+'/infoLink2');
  return infoLink2;
}


}
