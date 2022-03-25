# Exercise 10: Movie Detail Page

It's time to wrap it all up, the detail page gives us features to implement:
* lazy loaded routing
* router params
* structural directives
* http client / service usage
* multiple http calls
* loading state
* routing

## Implement Movie Detail Page

> TBD

create module with basic lazy-loading router setup

`ng g m movie/movie-detail-page`

```ts
// movie-detail-page.module.ts

```

create `MovieDetailPageComponent`

`ng g c movie/movie-detail-page`

```ts
// movie-detail-page.component.ts

```

start adding static values needed for our template

```ts
// movie-detail-page.component.ts

```

go to the template and implement with static values

```html
<!-- movie-detail-page.component.html -->

```

also add stylings

```scss
/* movie-detail-page.component.scss */


```

serve the application and navigate to `/movie` by typing it into the address bar

## Add dynamic routing

> TBD

* setup routing to movie-detail

## loading state

> TBD

## Back button, imdb link, youtube link

> TBD

## recommended movies data

> TBD 

implement recommended movies:

* add method to `MovieService`
* use in `MovieDetailsPageComponent`
* display in template

## cast data

> TBD

implement cast list:

* add method to `MovieService`
* use in `MovieDetailsPageComponent`
* display in template
