# Testing - Pipes

In this exercise we will get to know the basics of unit testing in angular.
By following the arrange => act => assert pattern, we will cover how to implement a basic set of unit tests for a `Pipe`.

## Goal

In the end of this exercise you will know how to implement basic unit tests in angular with the `arrange` => `act` => `assert`
pattern.

## Unit Tests for MovieImagePipe

We will start by implementing a set of unit tests for the `MovieImagePipe`.

As a first step, make sure the setup is configured correctly.

Head to the `movie-image.pipe.spec.ts` file and execute it.
Run it either with your IDE, or execute the following script:

```bash
npm run test -- --testNamePattern=^MovieImagePipe  --runTestsByPath ./src/app/movie/movie-image.pipe.spec.ts
```

On top of the test being already in place, we want to add three more unit tests to this spec file.

* it - `should return an image path`
* it - `should respect width parameter`
* it - `should return a placeholder`

For now, all the tests will follow the same simple pattern:

* create a pipe instance
* create expectedResult values
* execute `pipe#transform` method
* test result with `expect(result).toBe(expectedResult)`

### should return an image path

This test should check if the `MovieImagePipe#transform` function returns a string composed of `https://image.tmdb.org/t/p/w300/`
and the value you pass.

<details>
    <summary>Show Solution</summary>

```ts
// movie-image.pipe.spec.ts

it('should return an image path', () => {
    // arrange
    const pipe = new MovieImagePipe();
    const value = 'imagePath';
    const expectedResult = `https://image.tmdb.org/t/p/w300/${value}`;

    // act
    const imagePath = pipe.transform(value);

    // assert
    expect(imagePath).toBe(expectedResult);
});
```
</details>

Execute the test suite and watch your test fail or pass :)

```bash
npm run test -- --testNamePattern=^MovieImagePipe  --runTestsByPath ./src/app/movie/movie-image.pipe.spec.ts
```

### should respect width parameter

This test should check if the `MovieImagePipe#transform` function returns an image url composed out of the value and the
width parameter passed.

<details>
    <summary>Show Solution</summary>

```ts
// movie-image.pipe.spec.ts

it('should respect width parameter', () => {
    // arrange
    const pipe = new MovieImagePipe();
    
    const value = 'imagePath';
    const width = 250;
    
    const expectedResult = `https://image.tmdb.org/t/p/w${width}/${value}`;
    
    // act
    const imagePath = pipe.transform(value, width);
    
    // assert
    expect(imagePath).toBe(expectedResult);
});
```
</details>

Execute the test suite and watch your test fail or pass :)

```bash
npm run test -- --testNamePattern=^MovieImagePipe  --runTestsByPath ./src/app/movie/movie-image.pipe.spec.ts
```

### should return a placeholder

This test should check if the `MovieImagePipe#transform` function returns the placeholder string `/assets/images/no_poster_available.jpg`
in case no argument was passed.

<details>
    <summary>Show Solution</summary>

```ts
// movie-image.pipe.spec.ts

it('should return a placeholder', () => {
    // arrange
    const pipe = new MovieImagePipe();
    const expectedResult = '/assets/images/no_poster_available.jpg';
    
    // act
    const imagePath = pipe.transform();
    
    // assert
    expect(imagePath).toBe(expectedResult);
});
```
</details>

Execute the test suite and watch your test fail or pass :)

```bash
npm run test -- --testNamePattern=^MovieImagePipe  --runTestsByPath ./src/app/movie/movie-image.pipe.spec.ts
```

## Bonus: add beforeEach block

Implement a `beforeEach` block which takes care of creating the `MovieImagePipe` instance for each test run.
This way you save some code in your actual test case implementation.

Execute the test suite and watch your test fail or pass :)

```bash
npm run test -- --testNamePattern=^MovieImagePipe  --runTestsByPath ./src/app/movie/movie-image.pipe.spec.ts
```
