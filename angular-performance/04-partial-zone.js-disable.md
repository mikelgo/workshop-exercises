# Exercise 4: Partial zone.js disable

Zone.js is responsible for monkey-patching of all asynchronous events in Angular.
This is often a bottle-neck. In this exercise we will see how it is possible to disable events globally and go partially zone-less using rx-angular helpers.

All improvements focusing on LCP, TTI, TBT metrics.

## Disable APIs globally using zone-flags

You can certain event patching by using zone-flags.

Create `zone-flags.ts` file with following content:

```typescript
(window as any).__Zone_disable_timers = true;
```

Import it in `polyfills.ts` **before** zone.js import:

```typescript
// Exercise 4: Import zone-flags.ts here
import "./zone-flags";
import "zone.js";
```

With this in place, all timer events (for example `setTimeout`) will run outside of zone.js.

## Disable APIs partially with rx-angular helpers

It is not always the case that we want to disable event globally.
Let's disable particular `setTimeout` that is responsible for initial navigation in `app-shell.component.ts`.

First comment out `zone-flags` import in `polyfills.ts`:

```typescript
// Exercise 4: Import zone-flags.ts here
// import "./zone-flags";
import "zone.js";
```

In `app-shell.component.ts` add `setTimeout` import from `@rx-angular/cdk/zone-less`:

```typescript
// Exercise 4: Add setTimeout import here

import { setTimeout } from "@rx-angular/cdk/zone-less";
```

This is it, now only this particular `setTimeout` will run outside Angular.

### Pro tip

- `@rx-angular/cdk/zone-less` provides also unpatched versions of other browser scheduling APIs.

## Disable events partially with rx-angular helpers

Zone.js also patches user input events (click/scroll/etc). We can disable them by using unpatched `fromEvent` version from the same package.

In `search-bar.component.ts` we have a `fromEvent` observable in `outsideClick` handler:

```typescript
  private outsideClick(): Observable<Event> {
    // any click on the page (we can't use the option `once:true` as we might get multiple false trigger)
    return fromEvent(this.document, 'click').pipe(
      // forward if the form did NOT triggered the click
      // means we clicked somewhere else in the page but the form
      filter((e) => !this.formRef.nativeElement.contains(e.target as any))
    );
  }
```

Remove `fromEvent` import from `rxjs` and add import form `@rx-angular/cdk/zone-less`.

```typescript
import {
  filter,
  map,
  merge,
  Observable,
  startWith,
  switchMap,
  take,
  withLatestFrom,
} from "rxjs";

// Exercise 4: Add rx-angular fromEvent import here

import { fromEvent } from "@rx-angular/cdk/zone-less";
```

Now this event is running outside of zone.

### Pro tip

- `@rx-angular/cdk/zone-less` also provides unpatched `addEventListener` api alternative called `unpatchAddEventListener`.
