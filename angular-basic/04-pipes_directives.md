# Exercise 4: Pipes and Directives

## implement movie-image pipe

create a `Pipe` to deliver the formatted image url for our movie-card component

```bash
ng generate pipe movie-image

OR

ng g p movie-image
```

go to `projects/movies/src/app/movie-image.pipe.ts`

```ts
@Pipe({
    selector: 'movieImage'
})
export class MovieImagePipe implements PipeTransform {
    // we keep the args for now, we may need them later
    transform(value: string, ...args: unknown[]): unknown {
        if (value) {
            return `https://image.tmdb.org/t/p/w300${value}`;
        }
        return `assets/images/no_poster_available.jpg`;
    }
}
```

## use pipe in movie-card

go to `projects/movies/src/app/movie-card/movie-card.component.html`

```html
<!-- movie-card.component.html -->

<img class="movie-image" [src]="movie.poster_path | movieImage">
```

try the pipe by setting the `poster_path` property in the `AppComponent` to an empty string `''`

The poster should now be displaying the fallback image

## implement highlight directive

```bash
ng generate directive highlight

OR

ng g d highlight
```

go to `projects/movies/src/app/highlight.directive`

```ts

@Directive({
    selector: '[highlight]'
})
export class HighlightDirective {
    
    @HostListener('mouseenter') 
    onMouseenter(event: MouseEvent) {
        
    }
    @HostListener('mousemove') 
    onMousemove(event: MouseEvent) {
        
    }
    @HostListener('mouseleave') 
    onMouseleave(event: MouseEvent) {
        
    }
    
    @HostBinding('[style.background]') background: string;
}
```

## use directive to highlight movie-card

go to `projects/movies/src/app/app.component.html`

```html
<movie-card appHighlight></movie-card>
```