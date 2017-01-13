import { Injectable, Pipe } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';

/*
  Generated class for the Safe pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
@Pipe({
  name: 'safe'
})


@Injectable()
/**
 * This pipe is used to sanitize the URL for the video, after it is extracted from the firebase database.
 * 
 * Reference:
 *  - https://github.com/angular-university/courses/blob/master/01-getting-started-with-angular2/final-project/src/app/shared/safe.pipe.ts
 */
export class SafePipe {

constructor(public sanitizer : DomSanitizer) {
  }

  transform(url :string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
