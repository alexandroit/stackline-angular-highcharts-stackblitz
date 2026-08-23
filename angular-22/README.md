# @stackline/angular-highcharts Angular 22 StackBlitz

Angular 22 playground for `@stackline/angular-highcharts@22.1.1` and `highcharts@12.6.0`.

The app is a real Angular CLI 22 project. It uses the same live Highcharts demo surface as the Angular 22 docs: live crypto candles, dynamic chart cards, static chart examples, tutorial panels, constructor switching, native chart instance access, and projected directive events.

The package is included locally at `packages/angular-highcharts` so the
StackBlitz project remains self-contained.

## Run

```bash
npm ci
npm start
```

`npm start` is StackBlitz-safe. It starts the Angular CLI dev server when the runtime supports Angular 22, and serves the committed preview build when the WebContainer Node version is older than Angular 22 requires.

Use this command when you specifically want the real Angular CLI dev server:

```bash
npm run dev
```

Angular 22 CLI requires Node `22.22.3+`, `24.15.0+`, or `26.0.0+`.

## Links

- StackBlitz: https://stackblitz.com/github/alexandroit/stackline-angular-highcharts-stackblitz/tree/master/angular-22?file=src%2Fapp%2Fapp.ts&startScript=start
- Docs: https://alexandro.net/docs/angular/angular-highcharts/angular-22/
- Live docs: https://alexandro.net/docs/angular/angular-highcharts/angular-22/live/
