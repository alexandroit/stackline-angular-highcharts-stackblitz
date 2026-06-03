# Stackline Angular Highcharts StackBlitz

Dedicated StackBlitz playgrounds for `@stackline/angular-highcharts`.

This repository is intentionally organized by Angular major. It grows one Angular line at a time as each release is validated and published.

## Available Playgrounds

| Angular | Package | Highcharts | StackBlitz |
| :---: | :---: | :---: | :--- |
| 9.x | `@stackline/angular-highcharts@9.0.0` | `highcharts@10.3.3` | [Open Angular 9](https://stackblitz.com/github/alexandroit/stackline-angular-highcharts-stackblitz/tree/master/angular-9?file=src%2Fapp%2Fapp.component.ts&startScript=start) |
| 10.x | `@stackline/angular-highcharts@10.0.0` | `highcharts@10.3.3` | [Open Angular 10](https://stackblitz.com/github/alexandroit/stackline-angular-highcharts-stackblitz/tree/master/angular-10?file=src%2Fapp%2Fapp.component.ts&startScript=start) |
| 11.x | `@stackline/angular-highcharts@11.0.0` | `highcharts@10.3.3` | [Open Angular 11](https://stackblitz.com/github/alexandroit/stackline-angular-highcharts-stackblitz/tree/master/angular-11?file=src%2Fapp%2Fapp.component.ts&startScript=start) |
| 12.x | `@stackline/angular-highcharts@12.0.0` | `highcharts@12.6.0` | [Open Angular 12](https://stackblitz.com/github/alexandroit/stackline-angular-highcharts-stackblitz/tree/master/angular-12?file=src%2Fapp%2Fapp.component.ts&startScript=start) |
| 13.x | `@stackline/angular-highcharts@13.0.0` | `highcharts@12.6.0` | [Open Angular 13](https://stackblitz.com/github/alexandroit/stackline-angular-highcharts-stackblitz/tree/master/angular-13?file=src%2Fapp%2Fapp.component.ts&startScript=start) |
| 14.x | `@stackline/angular-highcharts@14.0.0` | `highcharts@12.6.0` | [Open Angular 14](https://stackblitz.com/github/alexandroit/stackline-angular-highcharts-stackblitz/tree/master/angular-14?file=src%2Fapp%2Fapp.component.ts&startScript=start) |
| 15.x | `@stackline/angular-highcharts@15.0.0` | `highcharts@12.6.0` | [Open Angular 15](https://stackblitz.com/github/alexandroit/stackline-angular-highcharts-stackblitz/tree/master/angular-15?file=src%2Fapp%2Fapp.component.ts&startScript=start) |

## Angular 9

```bash
cd angular-9
npm install
npm start
```

The Angular 9 playground is a real Angular CLI 9.1 application. It includes:

- live crypto candle charts with REST history and WebSocket updates
- dynamic Highcharts module examples backed by market data
- static chart examples for the Highcharts 10.3.3 module surface tested on Angular 9
- tutorial panels with HTML, TypeScript, and CSS for each example
- wrapper coverage for `<chart>`, constructor switching, `(create)`, and projected directive events

## Angular 10

```bash
cd angular-10
npm install
npm start
```

The Angular 10 playground follows the same live/static structure as Angular 9, with `@stackline/angular-highcharts@10.0.0` and the highest Highcharts version validated for this Angular CLI/Webpack generation: `highcharts@10.3.3`.

## Angular 11

```bash
cd angular-11
npm install
npm start
```

The Angular 11 playground keeps the same live/static Highcharts 10.3.3 surface as Angular 10, validated against `@stackline/angular-highcharts@11.0.0`.

## Angular 12

```bash
cd angular-12
npm install
npm start
```

The Angular 12 playground upgrades the line to `@stackline/angular-highcharts@12.0.0` and `highcharts@12.6.0`, including the modern validated chart surface and AOT-compatible APF package consumption.

## Angular 13

```bash
cd angular-13
npm install
npm start
```

The Angular 13 playground uses `@stackline/angular-highcharts@13.0.0` and `highcharts@12.6.0` through the Angular 13 APF/Ivy package line. The dynamic route keeps unstable derived series out of live updates and leaves those examples in the static gallery.

## Angular 14

```bash
cd angular-14
npm install
npm start
```

The Angular 14 playground uses `@stackline/angular-highcharts@14.0.0` and `highcharts@12.6.0` through the Angular 14 APF/Ivy package line, with the same dynamic/static coverage validated for the public docs.

## Angular 15

```bash
cd angular-15
npm install
npm start
```

The Angular 15 playground uses `@stackline/angular-highcharts@15.0.0` and `highcharts@12.6.0` through the Angular 15 APF/Ivy package line, with the same dynamic/static coverage validated for the public docs.

## Links

- Package: https://www.npmjs.com/package/@stackline/angular-highcharts
- Docs: https://alexandro.net/docs/angular/angular-highcharts/
- Angular 15 docs: https://alexandro.net/docs/angular/angular-highcharts/angular-15/
- Angular 15 live docs: https://alexandro.net/docs/angular/angular-highcharts/angular-15/live/
- Community: https://www.reddit.com/r/Stackline/
