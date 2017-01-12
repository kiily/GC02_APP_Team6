import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable,FirebaseListObservable } from 'angularfire2';
import 'rxjs/add/operator/map';

/*
  Generated class for the FirebaseProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class FirebaseProvider {

  constructor(public af: AngularFire) {
    
  }



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

getVideoURL(testType) : FirebaseObjectObservable<any> {
  let videoURL =this.af.database.object("/bloodTests/"+testType+'/video');

  return videoURL;

}

getTestDescription(testType) : FirebaseObjectObservable<any>{
  let description = this.af.database.object("/bloodTests/"+testType+'/description');
  console.log(description);

  return description;
}

getUserTests(uid) : FirebaseListObservable<any> {
  let tests = this.af.database.list('/users/'+uid+'/testHistory');

  return tests;

}

deleteTest(uid, testKeyToDelete){
  this.af.database.object('/users/'+uid+'/testHistory/'+testKeyToDelete).remove();
  
}

getBloodTests() : FirebaseListObservable<any>{

  let tests = this.af.database.list("bloodTests");
  return tests;

}

getInfoLink1(testType): FirebaseObjectObservable<any>{

  let infoLink1 = this.af.database.object("/bloodTests/"+testType+'/infoLink1');
  return infoLink1;
}

getInfoLink2(testType): FirebaseObjectObservable<any>{

  let infoLink2 = this.af.database.object("/bloodTests/"+testType+'/infoLink2');
  return infoLink2;
}


}
