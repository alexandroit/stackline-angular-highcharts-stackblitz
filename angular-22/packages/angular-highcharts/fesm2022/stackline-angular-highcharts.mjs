import * as i0 from '@angular/core';
import { EventEmitter, Output, Directive, ContentChild, Injectable, Input, Component, NgModule } from '@angular/core';

class ChartColorAxisComponent {
    afterBreaks = new EventEmitter();
    afterSetExtremes = new EventEmitter();
    pointBreak = new EventEmitter();
    pointInBreak = new EventEmitter();
    setExtremes = new EventEmitter();
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.3", ngImport: i0, type: ChartColorAxisComponent, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "22.1.3", type: ChartColorAxisComponent, isStandalone: false, selector: "colorAxis", outputs: { afterBreaks: "afterBreaks", afterSetExtremes: "afterSetExtremes", pointBreak: "pointBreak", pointInBreak: "pointInBreak", setExtremes: "setExtremes" }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.3", ngImport: i0, type: ChartColorAxisComponent, decorators: [{
            type: Directive,
            args: [{
                    selector: 'colorAxis',
                    standalone: false
                }]
        }], propDecorators: { afterBreaks: [{
                type: Output
            }], afterSetExtremes: [{
                type: Output
            }], pointBreak: [{
                type: Output
            }], pointInBreak: [{
                type: Output
            }], setExtremes: [{
                type: Output
            }] } });

class ChartPointComponent {
    click = new EventEmitter();
    remove = new EventEmitter();
    select = new EventEmitter();
    unselect = new EventEmitter();
    mouseOver = new EventEmitter();
    mouseOut = new EventEmitter();
    update = new EventEmitter();
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.3", ngImport: i0, type: ChartPointComponent, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "22.1.3", type: ChartPointComponent, isStandalone: false, selector: "point", outputs: { click: "click", remove: "remove", select: "select", unselect: "unselect", mouseOver: "mouseOver", mouseOut: "mouseOut", update: "update" }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.3", ngImport: i0, type: ChartPointComponent, decorators: [{
            type: Directive,
            args: [{
                    selector: 'point',
                    standalone: false
                }]
        }], propDecorators: { click: [{
                type: Output
            }], remove: [{
                type: Output
            }], select: [{
                type: Output
            }], unselect: [{
                type: Output
            }], mouseOver: [{
                type: Output
            }], mouseOut: [{
                type: Output
            }], update: [{
                type: Output
            }] } });

class ChartSeriesComponent {
    point;
    click = new EventEmitter();
    afterAnimate = new EventEmitter();
    checkboxClick = new EventEmitter();
    hide = new EventEmitter();
    legendItemClick = new EventEmitter();
    mouseOver = new EventEmitter();
    mouseOut = new EventEmitter();
    show = new EventEmitter();
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.3", ngImport: i0, type: ChartSeriesComponent, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "22.1.3", type: ChartSeriesComponent, isStandalone: false, selector: "series", outputs: { click: "click", afterAnimate: "afterAnimate", checkboxClick: "checkboxClick", hide: "hide", legendItemClick: "legendItemClick", mouseOver: "mouseOver", mouseOut: "mouseOut", show: "show" }, queries: [{ propertyName: "point", first: true, predicate: ChartPointComponent, descendants: true }], ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.3", ngImport: i0, type: ChartSeriesComponent, decorators: [{
            type: Directive,
            args: [{
                    selector: 'series',
                    standalone: false
                }]
        }], propDecorators: { point: [{
                type: ContentChild,
                args: [ChartPointComponent, { static: false }]
            }], click: [{
                type: Output
            }], afterAnimate: [{
                type: Output
            }], checkboxClick: [{
                type: Output
            }], hide: [{
                type: Output
            }], legendItemClick: [{
                type: Output
            }], mouseOver: [{
                type: Output
            }], mouseOut: [{
                type: Output
            }], show: [{
                type: Output
            }] } });

class ChartXAxisComponent {
    afterBreaks = new EventEmitter();
    afterSetExtremes = new EventEmitter();
    pointBreak = new EventEmitter();
    pointInBreak = new EventEmitter();
    setExtremes = new EventEmitter();
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.3", ngImport: i0, type: ChartXAxisComponent, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "22.1.3", type: ChartXAxisComponent, isStandalone: false, selector: "xAxis", outputs: { afterBreaks: "afterBreaks", afterSetExtremes: "afterSetExtremes", pointBreak: "pointBreak", pointInBreak: "pointInBreak", setExtremes: "setExtremes" }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.3", ngImport: i0, type: ChartXAxisComponent, decorators: [{
            type: Directive,
            args: [{
                    selector: 'xAxis',
                    standalone: false
                }]
        }], propDecorators: { afterBreaks: [{
                type: Output
            }], afterSetExtremes: [{
                type: Output
            }], pointBreak: [{
                type: Output
            }], pointInBreak: [{
                type: Output
            }], setExtremes: [{
                type: Output
            }] } });

class ChartYAxisComponent {
    afterBreaks = new EventEmitter();
    afterSetExtremes = new EventEmitter();
    pointBreak = new EventEmitter();
    pointInBreak = new EventEmitter();
    setExtremes = new EventEmitter();
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.3", ngImport: i0, type: ChartYAxisComponent, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "22.1.3", type: ChartYAxisComponent, isStandalone: false, selector: "yAxis", outputs: { afterBreaks: "afterBreaks", afterSetExtremes: "afterSetExtremes", pointBreak: "pointBreak", pointInBreak: "pointInBreak", setExtremes: "setExtremes" }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.3", ngImport: i0, type: ChartYAxisComponent, decorators: [{
            type: Directive,
            args: [{
                    selector: 'yAxis',
                    standalone: false
                }]
        }], propDecorators: { afterBreaks: [{
                type: Output
            }], afterSetExtremes: [{
                type: Output
            }], pointBreak: [{
                type: Output
            }], pointInBreak: [{
                type: Output
            }], setExtremes: [{
                type: Output
            }] } });

class ChartZAxisComponent {
    afterBreaks = new EventEmitter();
    afterSetExtremes = new EventEmitter();
    pointBreak = new EventEmitter();
    pointInBreak = new EventEmitter();
    setExtremes = new EventEmitter();
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.3", ngImport: i0, type: ChartZAxisComponent, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "22.1.3", type: ChartZAxisComponent, isStandalone: false, selector: "zAxis", outputs: { afterBreaks: "afterBreaks", afterSetExtremes: "afterSetExtremes", pointBreak: "pointBreak", pointInBreak: "pointInBreak", setExtremes: "setExtremes" }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.3", ngImport: i0, type: ChartZAxisComponent, decorators: [{
            type: Directive,
            args: [{
                    selector: 'zAxis',
                    standalone: false
                }]
        }], propDecorators: { afterBreaks: [{
                type: Output
            }], afterSetExtremes: [{
                type: Output
            }], pointBreak: [{
                type: Output
            }], pointInBreak: [{
                type: Output
            }], setExtremes: [{
                type: Output
            }] } });

class HighchartsStatic {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.3", ngImport: i0, type: HighchartsStatic, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "22.1.3", ngImport: i0, type: HighchartsStatic });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.3", ngImport: i0, type: HighchartsStatic, decorators: [{
            type: Injectable
        }] });
class HighchartsService {
    highchartsStatic;
    constructor(highchartsStatic) {
        this.highchartsStatic = highchartsStatic;
    }
    getHighchartsStatic() {
        return this.highchartsStatic;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.3", ngImport: i0, type: HighchartsService, deps: [{ token: HighchartsStatic }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "22.1.3", ngImport: i0, type: HighchartsService });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.3", ngImport: i0, type: HighchartsService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: HighchartsStatic }] });

var isObjectLike = function (x) {
    var type = typeof x;
    return x !== null && (type === 'object' || type === 'function');
};
var hasOwnProperty = Object.prototype.hasOwnProperty;
function isMergeableContainer(value) {
    if (Array.isArray(value)) {
        return true;
    }
    if (value === null || typeof value !== 'object') {
        return false;
    }
    var prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
}
function toObject(val) {
    if (val === null || val === undefined) {
        throw new TypeError('Sources cannot be null or undefined');
    }
    return Object(val);
}
function isUnsafeKey(key) {
    return key === '__proto__' || key === 'prototype' || key === 'constructor';
}
function cloneSanitized(value) {
    if (!isMergeableContainer(value)) {
        return value;
    }
    return assign(Array.isArray(value) ? [] : {}, value);
}
function assignKey(to, from, key) {
    if (isUnsafeKey(key)) {
        return;
    }
    var val = from[key];
    if (val === undefined || val === null) {
        return;
    }
    if (hasOwnProperty.call(to, key)) {
        if (to[key] === undefined || to[key] === null) {
            throw new TypeError('Cannot convert undefined or null to object (' + key + ')');
        }
    }
    if (!hasOwnProperty.call(to, key) || !isObjectLike(val)) {
        to[key] = cloneSanitized(val);
    }
    else {
        to[key] = assign(Object(to[key]), from[key]);
    }
}
function assign(to, from) {
    if (to === from) {
        return to;
    }
    from = Object(from);
    for (var key in from) {
        if (hasOwnProperty.call(from, key)) {
            assignKey(to, from, key);
        }
    }
    return to;
}
function deepAssign(target, ...args) {
    target = toObject(target);
    for (var s = 0; s < args.length; s++) {
        assign(target, args[s]);
    }
    return target;
}

function initChart(highchartsService, userOpts, baseOpts, type) {
    const Highcharts = highchartsService.getHighchartsStatic();
    if (!Highcharts) {
        throw new Error('Base Highcharts module should be set via ChartModule.forRoot');
    }
    if (!Highcharts[type]) {
        throw new Error(`${type} is unknown chart type.`);
    }
    const normalizedBaseOpts = deepAssign({}, baseOpts);
    alignAxisShape(normalizedBaseOpts, userOpts, 'xAxis');
    alignAxisShape(normalizedBaseOpts, userOpts, 'yAxis');
    alignAxisShape(normalizedBaseOpts, userOpts, 'zAxis');
    alignAxisShape(normalizedBaseOpts, userOpts, 'colorAxis');
    const opts = deepAssign({}, normalizedBaseOpts, userOpts);
    return new Highcharts[type](opts);
}
function alignAxisShape(baseOpts, userOpts, axisName) {
    if (Array.isArray(userOpts[axisName])) {
        baseOpts[axisName] = [baseOpts[axisName]];
    }
}

class ChartEvent {
    originalEvent;
    context;
    constructor(event, context) {
        this.originalEvent = event;
        this.context = context;
    }
}

const chartEvents = [
    // Native DOM click already covers chart click.
    'addSeries',
    'afterPrint',
    'beforePrint',
    'drilldown',
    'drillup',
    'load',
    'redraw',
    'selection'
];
const seriesEvents = [
    'click',
    'afterAnimate',
    'checkboxClick',
    'hide',
    'legendItemClick',
    'mouseOut',
    'mouseOver',
    'show'
];
const pointEvents = [
    'click',
    'remove',
    'select',
    'unselect',
    'mouseOut',
    'mouseOver',
    'update'
];
const axisEvents = [
    'afterBreaks',
    'afterSetExtremes',
    'pointBreak',
    'pointInBreak',
    'setExtremes'
];
function bindEvents(target, eventNames, component) {
    if (!component) {
        return;
    }
    eventNames.forEach(function (eventName) {
        target[eventName] = target[eventName] || function (event) {
            component[eventName].emit(new ChartEvent(event, this));
        };
    });
}
function createBaseOpts(chartCmp, seriesCmp, pointCmp, xAxisCmp, yAxisCmp, zAxisCmp, colorAxisCmp, element) {
    const opts = {
        chart: {
            renderTo: element,
            events: {}
        },
        plotOptions: {
            series: {
                events: {},
                point: {
                    events: {}
                }
            }
        },
        xAxis: {
            events: {}
        },
        yAxis: {
            events: {}
        },
        zAxis: {
            events: {}
        },
        colorAxis: {
            events: {}
        }
    };
    bindEvents(opts.chart.events, chartEvents, chartCmp);
    bindEvents(opts.plotOptions.series.events, seriesEvents, seriesCmp);
    bindEvents(opts.plotOptions.series.point.events, pointEvents, pointCmp);
    bindEvents(opts.xAxis.events, axisEvents, xAxisCmp);
    bindEvents(opts.yAxis.events, axisEvents, yAxisCmp);
    bindEvents(opts.zAxis.events, axisEvents, zAxisCmp);
    bindEvents(opts.colorAxis.events, axisEvents, colorAxisCmp);
    return opts;
}

class ChartComponent {
    series;
    xAxis;
    yAxis;
    zAxis;
    colorAxis;
    create = new EventEmitter();
    click = new EventEmitter();
    addSeries = new EventEmitter();
    afterPrint = new EventEmitter();
    beforePrint = new EventEmitter();
    drilldown = new EventEmitter();
    drillup = new EventEmitter();
    load = new EventEmitter();
    redraw = new EventEmitter();
    selection = new EventEmitter();
    chart;
    element;
    highchartsService;
    userOpts;
    baseOpts;
    viewInitialized = false;
    type = 'Chart';
    options;
    init() {
        if (!this.userOpts || !this.baseOpts) {
            return;
        }
        this.destroyChart();
        this.chart = initChart(this.highchartsService, this.userOpts, this.baseOpts, this.type);
        this.create.emit(this.chart);
    }
    destroyChart() {
        if (this.chart && this.chart.destroy) {
            this.chart.destroy();
        }
        this.chart = null;
    }
    ngAfterViewInit() {
        this.viewInitialized = true;
        this.baseOpts = createBaseOpts(this, this.series, this.series ? this.series.point : null, this.xAxis, this.yAxis, this.zAxis, this.colorAxis, this.element.nativeElement);
        this.userOpts = this.options;
        this.init();
    }
    ngOnChanges() {
        this.userOpts = this.options;
        if (this.viewInitialized) {
            this.init();
        }
    }
    ngOnDestroy() {
        this.destroyChart();
    }
    constructor(element, highchartsService) {
        this.element = element;
        this.highchartsService = highchartsService;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.3", ngImport: i0, type: ChartComponent, deps: [{ token: i0.ElementRef }, { token: HighchartsService }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "22.1.3", type: ChartComponent, isStandalone: false, selector: "chart", inputs: { type: "type", options: "options" }, outputs: { create: "create", click: "click", addSeries: "addSeries", afterPrint: "afterPrint", beforePrint: "beforePrint", drilldown: "drilldown", drillup: "drillup", load: "load", redraw: "redraw", selection: "selection" }, providers: [HighchartsService], queries: [{ propertyName: "series", first: true, predicate: ChartSeriesComponent, descendants: true }, { propertyName: "xAxis", first: true, predicate: ChartXAxisComponent, descendants: true }, { propertyName: "yAxis", first: true, predicate: ChartYAxisComponent, descendants: true }, { propertyName: "zAxis", first: true, predicate: ChartZAxisComponent, descendants: true }, { propertyName: "colorAxis", first: true, predicate: ChartColorAxisComponent, descendants: true }], usesOnChanges: true, ngImport: i0, template: '&nbsp;', isInline: true });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.3", ngImport: i0, type: ChartComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'chart',
                    template: '&nbsp;',
                    standalone: false,
                    providers: [HighchartsService],
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: HighchartsService }], propDecorators: { series: [{
                type: ContentChild,
                args: [ChartSeriesComponent, { static: false }]
            }], xAxis: [{
                type: ContentChild,
                args: [ChartXAxisComponent, { static: false }]
            }], yAxis: [{
                type: ContentChild,
                args: [ChartYAxisComponent, { static: false }]
            }], zAxis: [{
                type: ContentChild,
                args: [ChartZAxisComponent, { static: false }]
            }], colorAxis: [{
                type: ContentChild,
                args: [ChartColorAxisComponent, { static: false }]
            }], create: [{
                type: Output
            }], click: [{
                type: Output
            }], addSeries: [{
                type: Output
            }], afterPrint: [{
                type: Output
            }], beforePrint: [{
                type: Output
            }], drilldown: [{
                type: Output
            }], drillup: [{
                type: Output
            }], load: [{
                type: Output
            }], redraw: [{
                type: Output
            }], selection: [{
                type: Output
            }], type: [{
                type: Input
            }], options: [{
                type: Input
            }] } });

function registerHighchartsModule(highchartsStatic, loadedModule) {
    const highchartsModule = loadedModule && loadedModule.default ? loadedModule.default : loadedModule;
    if (typeof highchartsModule === 'function') {
        highchartsModule(highchartsStatic);
    }
}
class ChartModule {
    static forRoot(highchartsStatic, ...highchartsModules) {
        highchartsModules.forEach((loadedModule) => {
            registerHighchartsModule(highchartsStatic, loadedModule);
        });
        return {
            ngModule: ChartModule,
            providers: [
                { provide: HighchartsStatic, useFactory: () => highchartsStatic }
            ]
        };
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.3", ngImport: i0, type: ChartModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "22.1.3", ngImport: i0, type: ChartModule, declarations: [ChartComponent,
            ChartSeriesComponent,
            ChartPointComponent,
            ChartXAxisComponent,
            ChartYAxisComponent,
            ChartZAxisComponent,
            ChartColorAxisComponent], exports: [ChartComponent,
            ChartSeriesComponent,
            ChartPointComponent,
            ChartXAxisComponent,
            ChartYAxisComponent,
            ChartZAxisComponent,
            ChartColorAxisComponent] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "22.1.3", ngImport: i0, type: ChartModule });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.3", ngImport: i0, type: ChartModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        ChartComponent,
                        ChartSeriesComponent,
                        ChartPointComponent,
                        ChartXAxisComponent,
                        ChartYAxisComponent,
                        ChartZAxisComponent,
                        ChartColorAxisComponent
                    ],
                    exports: [
                        ChartComponent,
                        ChartSeriesComponent,
                        ChartPointComponent,
                        ChartXAxisComponent,
                        ChartYAxisComponent,
                        ChartZAxisComponent,
                        ChartColorAxisComponent
                    ]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { ChartColorAxisComponent, ChartComponent, ChartModule, ChartPointComponent, ChartSeriesComponent, ChartXAxisComponent, ChartYAxisComponent, ChartZAxisComponent, HighchartsService, HighchartsStatic };
//# sourceMappingURL=stackline-angular-highcharts.mjs.map
