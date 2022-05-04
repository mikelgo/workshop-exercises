# Exercise 2: Bootstrap optimizations

In this exercise we will see how we can improve Angular application bootstrap time.

## Schedule app bootstrap

First thing that we do is a split of application bootstrap into several tasks. This way we will improve [Total Blocking Time (TBT) metric](https://web.dev/i18n/en/tbt/).
We don't want to trigger style recalculation so we avoid `requestAnimationFrame` and use `setTimeout`.

Search for the `platformBrowserDynamic()` method call and wrap it with a `setTimeout`

<details>
    <summary>show solution</summary>

Go to `main.ts` file and wrap `platformBrowserDynamic` call into `setTimeout`:

<!-- TODO: Check ex number -->

```typescript
// Exercise 2: Wrap platformBrowserDynamic into setTimeout
setTimeout(() =>
  platformBrowserDynamic()
    // Exercise 5: Add {ngZone: 'noop'} as second argument
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err))
);
```

</details>

## Create scheduled app initializer

We continue to improve TBT metric. Angular allows us to provide one or several initialization functions.
With this approach we load data on application bootstrap time instead of component initialization.

First let's create `SCHEDULED_APP_INITIALIZER_PROVIDER`.

The provider should `provide` an `APP_INITIALIZER` with a factory that returns `() => Promise<void>`. 
You can try different scheduling techniques internally here if you like.

```ts
// default factory fn

() => (): Promise<void> =>
    new Promise<void>((resolve) => {
        setTimeout(() => resolve());
    }),
```

After creating your `SCHEDULED_APP_INITIALIZER_PROVIDER`, import it in the `app.module.ts`

<details>
    <summary>show solution</summary>

Create `chunk-app-initializer.provider.ts` near `app.module.ts` with following content:

```typescript
import { APP_INITIALIZER } from "@angular/core";

/**
 * **🚀 Perf Tip for TBT:**
 *
 * Use `APP_INITIALIZER` and an init method in data services to run data fetching
 * on app bootstrap instead of component initialization.
 */
export const SCHEDULED_APP_INITIALIZER_PROVIDER = [
  {
    provide: APP_INITIALIZER,
    useFactory: () => (): Promise<void> =>
      new Promise<void>((resolve) => {
        setTimeout(() => resolve());
      }),
    deps: [],
    multi: true,
  },
];
```

Add an import of our initializer in `app.module.ts`:

```typescript
// Exercise 2: Include app intializer import here.

import { SCHEDULED_APP_INITIALIZER_PROVIDER } from "./chunk-app-initializer.provider";
```

Provide it in `app.module.ts` providers array:

```typescript
providers: [
    ...
    // Exercise 2: Include app intializer import here.

    SCHEDULED_APP_INITIALIZER_PROVIDER,
    ...
```

</details>

## Create global state initializer

We can also create an initializer for our application core state.
Loading of most important state pieces on application init reduces LCP and also improves [Time To Interactive (TTI) metric](https://web.dev/i18n/en/tti/).

<details>
    <summary>show solution</summary>

Near `app.module.ts` create `state-app-initializer.provider.ts` with following content:

```typescript
import { APP_INITIALIZER } from "@angular/core";
import { GenreResource } from "./data-access/api/resources/genre.resource";
import { MovieState } from "./shared/state/movie.state";
import { RouterState } from "./shared/router/router.state";
import { take } from "rxjs";

function initializeState(
  movieState: MovieState,
  routerState: RouterState,
  genreResource: GenreResource
) {
  return (): void => {
    // sideBar prefetch
    genreResource.getGenresCached().pipe(take(1)).subscribe();
    // initial route prefetch
    routerState.routerParams$
      .pipe(take(1))
      .subscribe(({ layout, type, identifier }) => {
        // default route
        layout === "list" &&
          type === "category" &&
          movieState.initialize({ category: identifier });
        // movie detail route
        layout === "detail" &&
          type === "movie" &&
          movieState.initialize({ movieId: identifier });
      });
  };
}

/**
 * **🚀 Perf Tip for LCP, TTI:**
 *
 * Use `APP_INITIALIZER` and an init method in data services to run data fetching
 * on app bootstrap instead of component initialization.
 */
export const GLOBAL_STATE_APP_INITIALIZER_PROVIDER = [
  {
    provide: APP_INITIALIZER,
    useFactory: initializeState,
    deps: [MovieState, RouterState, GenreResource],
    multi: true,
  },
];
```

Add an import of our initializer in `app.module.ts`:

```typescript
// Exercise 2: Include app intializer import here.

import { GLOBAL_STATE_APP_INITIALIZER_PROVIDER } from "./state-app-initializer.provider";
```

Provide it in `app.module.ts` providers array:

```typescript
providers: [
    ...
    // Exercise 2: Include state intializer import here.

    GLOBAL_STATE_APP_INITIALIZER_PROVIDER,
    ...
```

</details>

## Optimize initial route

This will improve TTI and TBT metrics.

If you have routes with the same UI but different data implement it with 2 parameters instead of 2 different routes.
This saves creation-time and destruction-time of the component and also render work in the browser.

Go to `app.routing.ts` and replace this routes with single one:

```typescript

    // Exercise 2: Replace next 2 routes

    // {
    //     path: 'list-category/:category',
    //     component: MovieListPageComponent,
    // },
    // {
    //     path: 'list-genre/:genre',
    //     component: MovieListPageComponent,
    // }
    {
        path: 'list/:type/:identifier',
        component: MovieListPageComponent,
    },
```

## Optimize router bootstrap performance

Initially router doing a sync initial navigation. To improve TBT we can disable this behavior.

Go to `app.routing.ts` and extend `RouterModule.forRoot()` with following:

```typescript
  RouterModule.forRoot(ROUTES, {
    enableTracing: false,

    // Exercise 2: Disable route initial navigation here.

    initialNavigation: 'disabled',
    ...
```

However app should perform initial navigation anyway, so we should schedule it in router-outlet wrapper component.
In our case it is an `app-shell.component.ts`. Add import of routing utility function:

```typescript
// Exercise 2: Add fallback util import here

import { fallbackRouteToDefault } from "../routing-default.utils";
```

Extend constructor with following:

```typescript
// Exercise 2: Schedule navigation here

setTimeout(() =>
  this.router.navigate([fallbackRouteToDefault(document.location.pathname)])
);
```
