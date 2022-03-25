# Exercise 7: NgModule best practices

## smart module structure

Let's try to distinguish between `shared` and `feature` modules in our movies application.

> TODO: what to do with directive?

We consider the following components as `shared`:
* movie-list
* movie-card
* movie-image

Since all of the identified `shared` components are inside of the same domain, we can combine them together
in the already existing `MovieModule` without making any changes to it.

We consider the following components as `feature`:
* movie-list-page
* not-found

For all the feature modules we want to introduce new `NgModules`

start by introducing a `MovieListPageModule`. It should declare the `MovieListPageComponent` and import everything
only this component needs.

`ng g m movie/movie-list-page`

```ts
@NgModule({
  declarations: [MovieListPageComponent],
  imports: [
    CommonModule,
    MovieModule
  ]
})
export class MovieListPageModule { }
```

Continue by removing all occurrences of `MovieListPageComponent` from `MovieModule`, router configuration included.

Finally, we need to re-introduce (or move) the route config to the `MovieListPageModule` and import it
in the `AppModule` as we did before with the `MovieModule`.

```ts
// movie-list-page.module.ts

const routes: Routes = [
  {
    path: 'list/popular',
    component: MovieListPageComponent
  }
]

RouterModule.forChild(routes)
```

At this point in time we can also remove the import to `MovieModule` since we don't need it any longer in `AppComponent`s scope.

```ts
// app.module.ts

imports: [
    // other imports,
    MovieListPageModule
]
```

We successfully integrated our first feature module!
Serve the application and see if the popular movies are showing up properly.

Continue by repeating this task for the `NotFoundComponent`.

`ng g m not-found`

```ts
// not-found.module.ts

const routes: Routes = [{
  path: '**',
  component: NotFoundComponent
}];

{
    declarations: [NotFoundComponent],
    imports: [
        RouterModule.forChild(routes),
    ]
}
```

> don't forget to adapt the `AppModule` 

after completing the refactoring, serve the application, enter an invalid route and see if the 404 page
shows up.

### Bonus: introduce SCAM pattern everywhere

in order to prevent too heavy modules upfront, we want to make use of the so called `SCAM` pattern.
For this we want to refactor all our components to be declared and exported by their very own `NgModule`

`ng g m movie/movie-list`

`ng g m movie/movie-card`

`ng g m movie/movie-image`

## MovieModule `forRoot`



