# Exercise 3: Basic runtime optimizations

In this exercise we will focus on basic runtime optimizations in Angular application.

## Use `ChangeDetection.OnPush`

By default all angular component using `ChangeDetectionStrategy.Default`.
This means component will be checked and template bindings will be re-evaluated all the time which causing performance degradation.
You should aim to use `ChangeDetectionStrategy.OnPush` in all your components.

Let's do one simple but significant change and make our `app.component.ts` use `OnPush` change detection:

```typescript

// Exercise 3: Set app component CD to OnPush

@Component({
  selector: 'app-root',
  template: `
    <app-shell>
      <router-outlet></router-outlet>
    </app-shell>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
```

### Pro tips

- You can generate components with `OnPush` by default if you add next content to `angular.json` schematics:

```json
{
  "schematics": {
    "@schematics/angular": {
      "component": {
        "changeDetection": "OnPush"
      }
    }
  }
}
```

- Use `@angular-eslint` plugins to force `OnPush` change detection.

## Use `trackBy` with `ngFor`

`trackBy` is a crucial performance improvement when you iterate over non-primitive sets of data.
We will optimize genres rendering in app-shell component.

In `app-shell.component.ts` import list model:

```typescript
// Exercise 3: Add TMDBMovieGenreModel import here

import { TMDBMovieGenreModel } from "../data-access/api/model/movie-genre.model";
```

Create a `trackByGenre` function in the same file:

```typescript
  // Exercise 3: Create trackBy function here

  trackByGenre(_: number, genre: TMDBMovieGenreModel) {
    return genre.name;
  }
```

Go to `app-shell.component.html` and add our function to template:

```html
<!-- Exercise 3: Use trackBy here -->

<a
  [attr.data-uf]="'menu-gen-'+genre.id"
  *ngFor="let genre of genres$ | async; trackBy: trackByGenre;"
  class="navigation--link"
  [routerLink]="['/list', 'genre', genre.id]"
  routerLinkActive="active"
>
  <div class="navigation--menu-item">
    <svg-icon class="navigation--menu-item-icon" name="genre"></svg-icon>
    {{ genre.name }}
  </div>
</a>
```

### Pro tip

- You can force `ngFor` + `trackBy` with `@angular-eslint` linting

## Lazy loading images

By default images are eagerly (always) loaded. We can change it by setting attribute `loading="lazy"` to images that are not critical.
This avoids bootstrap and template evaluation time and will improve LCP metric.

Go to `movie-list.component.ts` and add `loading="lazy"` to movie poster:

```html
<!-- Exercise 3: Add lazy loading here and improve it -->

<img
  class="aspectRatio-2-3 gradient"
  [src]="movie?.imgUrl || 'assets/images/no_poster_available.jpg'"
  [width]="movie.imgWidth"
  [height]="movie.imgHeight"
  alt="poster movie"
  [title]="movie.title"
  loading="lazy"
/>
```

Our images are rendered in the list with `ngFor` directive. We can reduce layout shifts by loading first image eagerly.

To do this modify img with following:

```html
<!-- Exercise 3: Add lazy loading here and improve it -->

<img
  class="aspectRatio-2-3 gradient"
  [src]="movie?.imgUrl || 'assets/images/no_poster_available.jpg'"
  [width]="movie.imgWidth"
  [height]="movie.imgHeight"
  alt="poster movie"
  [title]="movie.title"
  [attr.loading]="idx === 0 ? '' : 'lazy'"
/>
```

### Pro tip

- `<iframe>` tag also has `loading` attribute and can be optimized in the same way

## Optimize fetching

One of the most common operators for observables that trigger HTTP requests is `switchMap`.
However `switchMap` can cause an over-fetching. For requests that will not change results quickly `exhaustMap` operator is a better option.
This operator will ignore all higher observable emissions until it's observable finished.

This will help us improve TTI and TBT metrics.

Go to `genre.state.ts`, add import of `exhaustMap` and remove `switchMap`:

```typescript
// Exercise 3: Replace switchMap with exhaustMap

import { exhaustMap } from "rxjs";
```

Go to `genre.state.ts` and switch to `exhaustMap`:

```typescript
this.actions.refreshGenres$.pipe(
  // Exercise 3: Use exhaustMap here

  exhaustMap(this.genreResource.getGenres)
);
```
