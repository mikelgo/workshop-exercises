# Exercise 9: Auth State & Router Guards

## CanActivate AuthGuard

next up, we want to make use of `RouterGuards`.

Let's start by introducing an `AuthGuard` which implements the `CanActivate` interface

`ng g guard auth/auth`

```ts
// auth.guard.ts

```

## Create protected route

To make use of the newly created `AuthGuard` let's create a new component which should only be accessible when a user is logged in.

implement a `MyMovieListModule`

`ng g m movie/my-movie-list`

make sure to integrate a router config, make it accessible as `/my-movies`

```ts
// my-movie-list.module.ts

```

implement a `MyMovieListComponent`

`ng g c movie/my-movie-list`

```ts
// movie-list-page.module.ts



```

when adding the route the `AppModule`s configuration, make sure to apply the `AuthGuard` to it

```ts
// app.module.ts

```

Serve the application and try to navigate to a movie-list-page. the guard should not let you do that.

## Auth Service

Now we want to add a bit more of a real world behavior, let's create an `AuthService` to handle our auth state

`ng g service auth/auth`

```ts
// auth.service.ts

isAuthenticated = false;

login() {
    this.isAuthenticated = true;
}

logout() {
    this.isAuthenticated = false;
}

```

We can now use the `AuthService` in the `AuthGuard` by simply injecting it

```ts
// auth.guard.ts

constructor(
    private authService: AuthService
) {}

// use authService to determine if route can be shown or not

```

## Toggle Auth State

The last thing we need to do is to introduce a user interaction to toggle our faked auth service state.

go to `AppShellComponent` and implement an auth toggle

```ts
// app-shell.component.ts

get loggedIn(): boolean {
    return this.authService.isAuthenticated;
}

constructor(private authService: AuthService) {}

toggleAuth() {
    if (this.loggedIn) {
        this.authService.logout();
    } else {
        this.authservice.login();
    }
}
```

add the template to display a toggle button and a visualization of the auth state for the user

```html
<!-- app-shell.component.html -->

<button (click)="toggleAuth()">
    {{ loggedIn ? 'log in' : 'log out' }}
</button>
```

serve the application, test out the behavior of the implemented toggle button and see if you can navigate to the
desired route based on the auth state you triggered


