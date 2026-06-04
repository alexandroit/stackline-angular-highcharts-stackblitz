import * as i0 from '@angular/core';
import { EventEmitter, AfterViewInit, OnChanges, OnDestroy, ElementRef, ModuleWithProviders } from '@angular/core';

declare class HighchartsStatic {
    static ɵfac: i0.ɵɵFactoryDeclaration<HighchartsStatic, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<HighchartsStatic>;
}
declare class HighchartsService {
    private highchartsStatic;
    constructor(highchartsStatic: HighchartsStatic);
    getHighchartsStatic(): HighchartsStatic;
    static ɵfac: i0.ɵɵFactoryDeclaration<HighchartsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<HighchartsService>;
}

declare class ChartEvent {
    originalEvent: Event;
    context: any;
    constructor(event: any, context: any);
}

declare class ChartPointComponent {
    click: EventEmitter<ChartEvent>;
    remove: EventEmitter<ChartEvent>;
    select: EventEmitter<ChartEvent>;
    unselect: EventEmitter<ChartEvent>;
    mouseOver: EventEmitter<ChartEvent>;
    mouseOut: EventEmitter<ChartEvent>;
    update: EventEmitter<ChartEvent>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ChartPointComponent, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ChartPointComponent, "point", never, {}, { "click": "click"; "remove": "remove"; "select": "select"; "unselect": "unselect"; "mouseOver": "mouseOver"; "mouseOut": "mouseOut"; "update": "update"; }, never, never, false, never>;
}

declare class ChartSeriesComponent {
    point: ChartPointComponent;
    click: EventEmitter<ChartEvent>;
    afterAnimate: EventEmitter<ChartEvent>;
    checkboxClick: EventEmitter<ChartEvent>;
    hide: EventEmitter<ChartEvent>;
    legendItemClick: EventEmitter<ChartEvent>;
    mouseOver: EventEmitter<ChartEvent>;
    mouseOut: EventEmitter<ChartEvent>;
    show: EventEmitter<ChartEvent>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ChartSeriesComponent, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ChartSeriesComponent, "series", never, {}, { "click": "click"; "afterAnimate": "afterAnimate"; "checkboxClick": "checkboxClick"; "hide": "hide"; "legendItemClick": "legendItemClick"; "mouseOver": "mouseOver"; "mouseOut": "mouseOut"; "show": "show"; }, ["point"], never, false, never>;
}

declare class ChartXAxisComponent {
    afterBreaks: EventEmitter<ChartEvent>;
    afterSetExtremes: EventEmitter<ChartEvent>;
    pointBreak: EventEmitter<ChartEvent>;
    pointInBreak: EventEmitter<ChartEvent>;
    setExtremes: EventEmitter<ChartEvent>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ChartXAxisComponent, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ChartXAxisComponent, "xAxis", never, {}, { "afterBreaks": "afterBreaks"; "afterSetExtremes": "afterSetExtremes"; "pointBreak": "pointBreak"; "pointInBreak": "pointInBreak"; "setExtremes": "setExtremes"; }, never, never, false, never>;
}

declare class ChartYAxisComponent {
    afterBreaks: EventEmitter<ChartEvent>;
    afterSetExtremes: EventEmitter<ChartEvent>;
    pointBreak: EventEmitter<ChartEvent>;
    pointInBreak: EventEmitter<ChartEvent>;
    setExtremes: EventEmitter<ChartEvent>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ChartYAxisComponent, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ChartYAxisComponent, "yAxis", never, {}, { "afterBreaks": "afterBreaks"; "afterSetExtremes": "afterSetExtremes"; "pointBreak": "pointBreak"; "pointInBreak": "pointInBreak"; "setExtremes": "setExtremes"; }, never, never, false, never>;
}

declare class ChartZAxisComponent {
    afterBreaks: EventEmitter<ChartEvent>;
    afterSetExtremes: EventEmitter<ChartEvent>;
    pointBreak: EventEmitter<ChartEvent>;
    pointInBreak: EventEmitter<ChartEvent>;
    setExtremes: EventEmitter<ChartEvent>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ChartZAxisComponent, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ChartZAxisComponent, "zAxis", never, {}, { "afterBreaks": "afterBreaks"; "afterSetExtremes": "afterSetExtremes"; "pointBreak": "pointBreak"; "pointInBreak": "pointInBreak"; "setExtremes": "setExtremes"; }, never, never, false, never>;
}

declare class ChartColorAxisComponent {
    afterBreaks: EventEmitter<ChartEvent>;
    afterSetExtremes: EventEmitter<ChartEvent>;
    pointBreak: EventEmitter<ChartEvent>;
    pointInBreak: EventEmitter<ChartEvent>;
    setExtremes: EventEmitter<ChartEvent>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ChartColorAxisComponent, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ChartColorAxisComponent, "colorAxis", never, {}, { "afterBreaks": "afterBreaks"; "afterSetExtremes": "afterSetExtremes"; "pointBreak": "pointBreak"; "pointInBreak": "pointInBreak"; "setExtremes": "setExtremes"; }, never, never, false, never>;
}

declare class ChartComponent implements AfterViewInit, OnChanges, OnDestroy {
    series: ChartSeriesComponent;
    xAxis: ChartXAxisComponent;
    yAxis: ChartYAxisComponent;
    zAxis: ChartZAxisComponent;
    colorAxis: ChartColorAxisComponent;
    create: EventEmitter<any>;
    click: EventEmitter<ChartEvent>;
    addSeries: EventEmitter<ChartEvent>;
    afterPrint: EventEmitter<ChartEvent>;
    beforePrint: EventEmitter<ChartEvent>;
    drilldown: EventEmitter<ChartEvent>;
    drillup: EventEmitter<ChartEvent>;
    load: EventEmitter<ChartEvent>;
    redraw: EventEmitter<ChartEvent>;
    selection: EventEmitter<ChartEvent>;
    chart: any;
    element: ElementRef;
    highchartsService: HighchartsService;
    private userOpts;
    private baseOpts;
    private viewInitialized;
    type: string;
    options: any;
    private init;
    private destroyChart;
    ngAfterViewInit(): void;
    ngOnChanges(): void;
    ngOnDestroy(): void;
    constructor(element: ElementRef, highchartsService: HighchartsService);
    static ɵfac: i0.ɵɵFactoryDeclaration<ChartComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ChartComponent, "chart", never, { "type": { "alias": "type"; "required": false; }; "options": { "alias": "options"; "required": false; }; }, { "create": "create"; "click": "click"; "addSeries": "addSeries"; "afterPrint": "afterPrint"; "beforePrint": "beforePrint"; "drilldown": "drilldown"; "drillup": "drillup"; "load": "load"; "redraw": "redraw"; "selection": "selection"; }, ["series", "xAxis", "yAxis", "zAxis", "colorAxis"], never, false, never>;
}

declare class ChartModule {
    static forRoot(highchartsStatic: HighchartsStatic, ...highchartsModules: Array<any>): ModuleWithProviders<ChartModule>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ChartModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ChartModule, [typeof ChartComponent, typeof ChartSeriesComponent, typeof ChartPointComponent, typeof ChartXAxisComponent, typeof ChartYAxisComponent, typeof ChartZAxisComponent, typeof ChartColorAxisComponent], never, [typeof ChartComponent, typeof ChartSeriesComponent, typeof ChartPointComponent, typeof ChartXAxisComponent, typeof ChartYAxisComponent, typeof ChartZAxisComponent, typeof ChartColorAxisComponent]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ChartModule>;
}

export { ChartColorAxisComponent, ChartComponent, ChartModule, ChartPointComponent, ChartSeriesComponent, ChartXAxisComponent, ChartYAxisComponent, ChartZAxisComponent, HighchartsService, HighchartsStatic };
