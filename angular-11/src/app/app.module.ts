import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartModule } from '@stackline/angular-highcharts';

import { AppComponent } from './app.component';

declare var require: any;

const Highcharts = require('highcharts');
const HighchartsMore = require('highcharts/highcharts-more');
const Highcharts3d = require('highcharts/highcharts-3d');
const Heatmap = require('highcharts/modules/heatmap');
const Treemap = require('highcharts/modules/treemap');
const Funnel = require('highcharts/modules/funnel');
const SolidGauge = require('highcharts/modules/solid-gauge');
const Stock = require('highcharts/modules/stock');
const MapModule = require('highcharts/modules/map');
const Drilldown = require('highcharts/modules/drilldown');
const Sankey = require('highcharts/modules/sankey');
const DependencyWheel = require('highcharts/modules/dependency-wheel');
const NetworkGraph = require('highcharts/modules/networkgraph');
const Sunburst = require('highcharts/modules/sunburst');
const Wordcloud = require('highcharts/modules/wordcloud');
const XRange = require('highcharts/modules/xrange');
const Timeline = require('highcharts/modules/timeline');
const Variwide = require('highcharts/modules/variwide');
const VariablePie = require('highcharts/modules/variable-pie');
const ItemSeries = require('highcharts/modules/item-series');
const Streamgraph = require('highcharts/modules/streamgraph');
const Bullet = require('highcharts/modules/bullet');
const Cylinder = require('highcharts/modules/cylinder');
const Dumbbell = require('highcharts/modules/dumbbell');
const Dotplot = require('highcharts/modules/dotplot');
const Funnel3d = require('highcharts/modules/funnel3d');
const HeikinAshi = require('highcharts/modules/heikinashi');
const HollowCandlestick = require('highcharts/modules/hollowcandlestick');
const Lollipop = require('highcharts/modules/lollipop');
const ParallelCoordinates = require('highcharts/modules/parallel-coordinates');
const Pareto = require('highcharts/modules/pareto');
const HistogramBellcurve = require('highcharts/modules/histogram-bellcurve');
const Pyramid3d = require('highcharts/modules/pyramid3d');
const Tilemap = require('highcharts/modules/tilemap');
const Treegraph = require('highcharts/modules/treegraph');
const Vector = require('highcharts/modules/vector');
const Venn = require('highcharts/modules/venn');
const Windbarb = require('highcharts/modules/windbarb');
const ArcDiagram = require('highcharts/modules/arc-diagram');
const Organization = require('highcharts/modules/organization');
const NoData = require('highcharts/modules/no-data-to-display');

export function highchartsFactory() {
  HighchartsMore(Highcharts);
  Highcharts3d(Highcharts);
  Heatmap(Highcharts);
  Treemap(Highcharts);
  Funnel(Highcharts);
  SolidGauge(Highcharts);
  Stock(Highcharts);
  MapModule(Highcharts);
  Drilldown(Highcharts);
  Sankey(Highcharts);
  DependencyWheel(Highcharts);
  NetworkGraph(Highcharts);
  Sunburst(Highcharts);
  Wordcloud(Highcharts);
  XRange(Highcharts);
  Timeline(Highcharts);
  Variwide(Highcharts);
  VariablePie(Highcharts);
  ItemSeries(Highcharts);
  Streamgraph(Highcharts);
  Bullet(Highcharts);
  Cylinder(Highcharts);
  Dumbbell(Highcharts);
  Dotplot(Highcharts);
  Funnel3d(Highcharts);
  HeikinAshi(Highcharts);
  HollowCandlestick(Highcharts);
  Lollipop(Highcharts);
  ParallelCoordinates(Highcharts);
  Pareto(Highcharts);
  HistogramBellcurve(Highcharts);
  Pyramid3d(Highcharts);
  Tilemap(Highcharts);
  Treegraph(Highcharts);
  Vector(Highcharts);
  Venn(Highcharts);
  Windbarb(Highcharts);
  ArcDiagram(Highcharts);
  Organization(Highcharts);
  NoData(Highcharts);
  return Highcharts;
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ChartModule.forRoot(highchartsFactory())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
