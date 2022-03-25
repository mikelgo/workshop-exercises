# Exercise 8: Router Params & LazyLoading

## Setup router params

we want to make our list route more dynamic to switch between different categories of movies we want to display

`list/:category`

## Enable Category Navigation

go to `AppShellComponent`, use `routerLink` and setup routes to navigate between
`top_rated`, `popular`, `upcoming` movies.

serve the application and navigate between the three different categories. You should see the address bar changing, but 
the view isn't changing at all.

## Router Params

We need to adapt our `MovieService` in order fetch different categories

```ts
// movie.service.ts

getMovies(category: string): Observable<{ results: MovieModel[] }> {
    // destruct variables
    return this.httpClient.get<{ results: MovieModel[]}>(
        `${tmdbBaseUrl}/3/movie/${category}`
    );
}

```

use router params in `MovieListPageComponent`

```ts
router.params$.subscribe(params => {
    if (params.category) {
        this.movies$ = movieService.getMovies(params.category)
    }
})
```

serve the application and navigate between categories again. Now you should see that the list of movies is changing properly
according to the selected category in the route.

Please also observe the network tab in your devtools to see how the http requests are getting fired when you switch between routes

## Enable lazyloading for all routes

## Setup PreloadStrategy
