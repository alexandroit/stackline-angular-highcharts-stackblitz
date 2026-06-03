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
const Accessibility = require('highcharts/modules/accessibility');
const Flowmap = require('highcharts/modules/flowmap');
const GeoHeatmap = require('highcharts/modules/geoheatmap');
const Pictorial = require('highcharts/modules/pictorial');
const Contour = require('highcharts/modules/contour');
const PointAndFigure = require('highcharts/modules/pointandfigure');
const Renko = require('highcharts/modules/renko');
const NoData = require('highcharts/modules/no-data-to-display');

function installHighchartsModule(moduleRef: any) {
  const factory = moduleRef && (moduleRef.default || moduleRef);

  if (typeof factory === 'function') {
    factory(Highcharts);
  }
}

export function highchartsFactory() {
  installHighchartsModule(HighchartsMore);
  installHighchartsModule(Highcharts3d);
  installHighchartsModule(Heatmap);
  installHighchartsModule(Treemap);
  installHighchartsModule(Funnel);
  installHighchartsModule(SolidGauge);
  installHighchartsModule(Stock);
  installHighchartsModule(MapModule);
  installHighchartsModule(Drilldown);
  installHighchartsModule(Sankey);
  installHighchartsModule(DependencyWheel);
  installHighchartsModule(NetworkGraph);
  installHighchartsModule(Sunburst);
  installHighchartsModule(Wordcloud);
  installHighchartsModule(XRange);
  installHighchartsModule(Timeline);
  installHighchartsModule(Variwide);
  installHighchartsModule(VariablePie);
  installHighchartsModule(ItemSeries);
  installHighchartsModule(Streamgraph);
  installHighchartsModule(Bullet);
  installHighchartsModule(Cylinder);
  installHighchartsModule(Dumbbell);
  installHighchartsModule(Dotplot);
  installHighchartsModule(Funnel3d);
  installHighchartsModule(HeikinAshi);
  installHighchartsModule(HollowCandlestick);
  installHighchartsModule(Lollipop);
  installHighchartsModule(ParallelCoordinates);
  installHighchartsModule(Pareto);
  installHighchartsModule(HistogramBellcurve);
  installHighchartsModule(Pyramid3d);
  installHighchartsModule(Tilemap);
  installHighchartsModule(Treegraph);
  installHighchartsModule(Vector);
  installHighchartsModule(Venn);
  installHighchartsModule(Windbarb);
  installHighchartsModule(ArcDiagram);
  installHighchartsModule(Organization);
  installHighchartsModule(Accessibility);
  installHighchartsModule(Flowmap);
  installHighchartsModule(GeoHeatmap);
  installHighchartsModule(Pictorial);
  installHighchartsModule(Contour);
  installHighchartsModule(PointAndFigure);
  installHighchartsModule(Renko);
  installHighchartsModule(NoData);
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
