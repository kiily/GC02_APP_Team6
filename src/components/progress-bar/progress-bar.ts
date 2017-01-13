import { Component, Input } from '@angular/core';

/*
  Generated class for the ProgressBar component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'progress-bar',
  templateUrl: 'progress-bar.html'
})

/*ProgressBar is a custom generated component used to render a progress which displays a percentage
of the delivery time which has elapsed from the test date. The data about the delivery time of each test
is saved inside the Firebase database.

References:
 -  https://codepen.io/aidan2129/details/GZQwam
 -  http://www.joshmorony.com/build-a-simple-progress-bar-component-in-ionic-2/
*/

export class ProgressBarComponent {

  @Input('progress') progress;

  constructor() {}

}
