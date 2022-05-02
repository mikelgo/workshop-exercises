import { Component } from '@angular/core';
// import { ZonelessRouting } from './shared/zone-less/zone-less-routing.service';

// Exercise 3: Set app component CD to OnPush

@Component({
  selector: 'app-root',
  template: `
    <app-shell>
      <router-outlet></router-outlet>
    </app-shell>
  `,
})
export class AppComponent {
  /**
   *  **🚀 Perf Tip:**
   *
   *  In zone-less applications we have to handle routing manually.
   *  This is a necessity to make it work zone-less but does not make the app faster.

     import { ZonelessRouting } from './shared/zone-agnostic/zone-less-routing.service';

     constructor(private zonelessRouting: ZonelessRouting) {
       this.zonelessRouting.init();
     }
   *

  constructor(private zonelessRouting: ZonelessRouting) {
    this.zonelessRouting.init();
  }
   */
}
