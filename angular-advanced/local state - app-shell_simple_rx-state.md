# Local State: Simple RxState Exercise

In this exercise we will get to know the basics of local state management on the example of the `AppShellComponent`.
With the help of `@rx-angular/state RxState` we are introducing a better structure for better scalability and maintainability
to our codebase.

## Goal

The goal of this exercise is to learn how to improve your codebase by introducing simple local state management patterns
and use the `RxState` for keeping things simple.

## AppShellComponent

This exercise is about introducing state management into our `AppShellComponent`. 
Before we begin with the refactoring, let's define the actual `State` and the `SideEffects` for the component.

### State
* `searchValue: string`
  * set when `ui-search-bar` emits a value
* `sideDrawerOpen: boolean`
  * is sidebar open or closed
  * should be `false` after navigation
* `genres: TMDBMovieGenreModel[]`
  * list of genres

Create the state interface from the above information!

<details>
    <summary>AppShellState</summary>

```ts
// app-shell.component.ts

interface AppShellState {
    sideDrawerOpen: boolean;
    genres: TMDBMovieGenreModel[];
    searchValue: string;
}

```

</details>

Now it's time to `provide` our local `RxState` instance, inject it into the component and set up the initial state.

* Add `RxState` to the `providers` array of `AppShellComponent`s component declaration.
* grant access to the local state by injecting it into the constructor `private state: RxState<AppShellState>`
* set default values for your `state` in either the constructor, or the `ngOnInit` method
* expose your state as `viewModel$` for the components' template
  * use the `select` method to select all properties from the state


<details>
    <summary>RxState setup</summary>

expose `viewModel$`

```ts
// app-shell.component.ts

viewModel$ = this.state.select();

```

Inject instance in constructor

```ts
// app-shell.component.ts

// inject RxState in constructor
constructor(
    /*... */
    private state: RxState<AppShellState>
) {}
```

Set default values

```ts
// app-shell.component.ts

// set default values either in onInit or constructor
this.state.set({
    genres: [],
    sideDrawerOpen: false,
    searchValue: ''
});

```

</details>

Great, now the state is configured and ready to be filled with actual values.

You can choose to either use the `connect` method or the `set` method in order to perform changes to the state.

The task now is to replace each of the properties (`sideDrawerOpen, searchValue, genres`) with their correct values.
* genres: `state.connect('genres', genres$)`
* sideDrawerOpen
  * either create a `sideDrawerOpen$: Subject<boolean>` and `next` it in the template on `openedChange`
  * or create a callback function for the `openedChange` event and call `state.set({sideDrawerOpen: val...})`
* searchValue
  * either create a `searchValue$: Subject<string>` and `next` it in the template on `ngModelChange`
  * or call `state.set({searchValue: value})` in the setter of `searchValue`

<details>
    <summary>Connect Values</summary>

connect genres in OnInit

```ts
// app-shell.component.ts

// ngOnInit
this.state.connect('genres', this.genres$);

```

Simplify usage of `searchValue`

```ts
// app-shell.component.ts

// you can remove the setter/getter combi
readonly searchValue$ = new Subject<string>();

// ngOnInit
this.state.connect('searchValue', this.searchValue$);
```


Finally, set up `sideDrawerOpen`. I've again decided to use the `Subject` as a trigger. You can ofc choose another solution.

```ts
// app-shell.component.ts

readonly sideDrawerOpen$ = new Subject<boolean>();

// ngOnInit
this.state.connect('sideDrawerOpen', this.sideDrawerOpen$);

```

</details>


<details>
    <summary>Complete component code</summary>

```ts

  // state triggers
  private readonly genres$ = this.movieService.getGenres();
  readonly sideDrawerOpen$ = new Subject<boolean>();
  readonly searchValue$ = new Subject<string>();
  
  // viewmodel
  readonly viewModel$ = this.state.select();

  constructor(
    private movieService: MovieService,
    private router: Router,
    private state: RxState<AppShellState>
  ) {}

  ngOnInit() {
    // default state set
    this.state.set({
      genres: [],
      sideDrawerOpen: false,
      searchValue: ''
    });
    
    const sideDrawerOnNavigation$ = this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map((e) => (e as NavigationEnd).urlAfterRedirects),
        distinctUntilChanged(),
        map(() => false)
      );
    
    // state connected
    this.state.connect('genres', this.genres$);
    this.state.connect('searchValue', this.searchValue$);
    this.state.connect('sideDrawerOpen', this.sideDrawerOpen$);
    this.state.connect('sideDrawerOpen', sideDrawerOnNavigation$);
    
  }
```

</details>

Now that our component code has changed, we need to adjust the `Template` as well.
We want to re-structure our template to make use of our exposed `viewModel$` property.

Introduce a top-level `ng-container` with the `*ngIf async hack` or `*rxLet`, providing the `viewModel$ as vm` to the template.

Fix the changed property bindings and call the `next` the respective subjects on their corresponding outputs:

* `ui-side-drawer`
  * `[opened]` => `vm.sideDrawerOpen`
  * `(openedChange)` => `sideDrawerOpen$.next`
* `ui-search-bar`
  * `[query]` => `vm.searchValue`
  * `(searchSubmit)` => `searchValue$.next($event)`
* `*ngFor="let genre of vm.genres;"`
* `ui-hamburger-button`
  * `(click)` => `sideDrawerOpen$.next(!vm.sideDrawerOpen)`

<details>
    <summary>Adjust Template</summary>

top-level `ng-container` with `viewModel$`

```html
<!--app-shell.component.html-->

<ng-container *rxLet="viewModel$; let vm">

    <!--Rest of the template-->

</ng-container>
```

adjust the template for `searchValue` usage, we need to `next` our subject and set the `searchValue` as input for `query`

```html
<!--app-shell.component.html-->

<ui-search-bar
        (searchSubmit)="searchValue$.next($event)"
        [query]="searchValue"
></ui-search-bar>
```

</details>

### SideEffects

* when `searchValue` changes, navigate to `['search', searchValue]`

