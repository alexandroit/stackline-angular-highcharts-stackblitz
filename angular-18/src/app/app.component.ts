import { Component, OnDestroy, OnInit } from '@angular/core';

interface ChartExample {
  key?: string;
  title: string;
  description: string;
  constructorType?: string;
  options: any;
  html: string;
  tutorialHtml?: string;
  tutorialTs?: string;
  tutorialScss?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  viewMode = 'dynamic';
  events: string[] = [];
  dynamicData = [29, 42, 55, 61, 73, 88];
  binanceSymbol = 'BNBUSDT';
  binanceInterval = '1s';
  binanceTheme = 'light';
  binanceSymbols = ['BNBUSDT', 'BTCUSDT'];
  binanceIntervals = ['1s', '1m', '15m', '1h', '4h', '1d', '1w'];
  // Mask API: keep Binance as the data source, but route browser traffic through
  // api-b.alexandro.net because some networks block requests by Binance domain.
  maskApiRestBaseUrl = 'https://api-b.alexandro.net';
  maskApiWsBaseUrl = 'wss://api-b.alexandro.net';
  binanceRestHosts = [
    this.maskApiRestBaseUrl + '/api/v3/klines',
    this.maskApiRestBaseUrl + '/data-api/api/v3/klines'
  ];
  binanceWsBaseUrl = this.maskApiWsBaseUrl + '/ws/';
  binanceWsUrl = '';
  binanceRestUrl = '';
  binanceStatus = 'Loading REST candles...';
  binanceSocketStatus = 'WebSocket disconnected';
  binanceCandleCount = 0;
  binanceLastCandle: any = null;
  binanceOptions: any = this.createBinanceOptions();

  private binanceChart: any = null;
  private binanceSocket: any = null;
  private binanceOhlcData: any[] = [];
  private binanceVolumeData: any[] = [];

  marketSymbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT', 'ADAUSDT', 'DOGEUSDT', 'TRXUSDT'];
  marketRestUrl = '';
  marketWsUrl = '';
  marketStatus = 'Waiting for market stream';
  marketTickers: any = {};
  marketHistory: any = {};
  cryptoTreemapUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h';
  cryptoTreemapStatus = 'Loading CoinGecko top 50 market cap snapshot...';
  cryptoTreemapRows: any[] = [];
  dynamicExamples: ChartExample[] = [];

  private marketSocket: any = null;
  private marketSnapshotTimer: any = null;
  private marketSnapshotLoading = false;
  private cryptoTreemapTimer: any = null;
  private cryptoTreemapLoading = false;
  private dynamicRefreshTimer: any = null;
  private dynamicRefreshQueued = false;
  private dynamicCharts: any = {};

  examples: ChartExample[] = [
    this.makeBasic('Line chart', 'Default Highcharts.Chart with a line series.', 'line'),
    this.makeBasic('Spline chart', 'Smooth line series with regular categories.', 'spline'),
    this.makeBasic('Area chart', 'Filled area series for trend volume.', 'area'),
    this.makeBasic('Areaspline chart', 'Smooth filled area series.', 'areaspline'),
    this.makeBasic('Column chart', 'Vertical columns for category comparison.', 'column'),
    this.makeBasic('Bar chart', 'Horizontal bars for compact comparisons.', 'bar'),
    this.makeStackedColumn(),
    this.makePie(),
    this.makeDonut(),
    this.makeScatter(),
    this.makeBubble(),
    this.makeCombination(),
    this.makePolar(),
    this.makeGauge(),
    this.makeSolidGauge(),
    this.makeHeatmap(),
    this.makeTreemap(),
    this.makeFunnel(),
    this.make3dColumn(),
    this.makeStockChart(),
    this.makeMapLikeChart(),
    this.makeNoDataChart(),
    this.makeSankey(),
    this.makeDependencyWheel(),
    this.makeNetworkGraph(),
    this.makeSunburst(),
    this.makeWordcloud(),
    this.makeXRange(),
    this.makeTimeline(),
    this.makeVariwide(),
    this.makeVariablePie(),
    this.makeItemSeries(),
    this.makeStreamgraph(),
    this.makeBullet(),
    this.makeDumbbell(),
    this.makeLollipop(),
    this.makePareto(),
    this.makeHistogramBellcurve(),
    this.makeTilemap(),
    this.makeVenn(),
    this.makeArcDiagram(),
    this.makeOrganization(),
    this.makeCylinder(),
    this.makeFunnel3d(),
    this.makePyramid3d(),
    this.makeDotplot(),
    this.makePackedBubble(),
    this.makeParallelCoordinates(),
    this.makeHeikinAshi(),
    this.makeHollowCandlestick(),
    this.makeVector(),
    this.makeWindbarb(),
    this.makeTreegraph(),
    this.makeFlowmap(),
    this.makeGeoHeatmap(),
    this.makePictorial(),
    this.makeContour(),
    this.makeRenko(),
    this.makePointAndFigure()
  ].map((example: ChartExample) => this.withTutorial(example));

  dynamicOptions: any = this.createDynamicOptions();

  dynamicHtml = `<button (click)="randomizeDynamicChart()">Update data</button>
<chart [options]="dynamicOptions" (create)="onCreate('Dynamic update', $event)"></chart>`;

  dynamicTutorialHtml = this.wrapTutorialHtml(this.dynamicHtml);
  dynamicTutorialTs = `import { Component } from '@angular/core';

@Component({
  selector: 'dynamic-chart-example',
  templateUrl: './dynamic-chart-example.component.html',
  styleUrls: ['./dynamic-chart-example.component.css']
})
export class DynamicChartExampleComponent {
  dynamicData = [29, 42, 55, 61, 73, 88];
  dynamicOptions: any = this.createDynamicOptions();

  randomizeDynamicChart() {
    this.dynamicData = this.dynamicData.map(function () {
      return Math.round(20 + Math.random() * 90);
    });
    this.dynamicOptions = this.createDynamicOptions();
  }

  onCreate(chart: any) {
    console.log('Dynamic chart created', chart.series.length);
  }

  private createDynamicOptions() {
    return {
      chart: { type: 'line', height: 340 },
      title: { text: 'Dynamic update' },
      subtitle: { text: 'Changing the options object re-initializes the wrapper' },
      xAxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
      yAxis: { title: { text: 'Requests' } },
      series: [{ name: 'Updated data', data: this.dynamicData }]
    };
  }
}`;
  dynamicTutorialScss = this.defaultTutorialScss(340);

  directiveOptions: any = {
    chart: { type: 'column', height: 340 },
    title: { text: 'Directive/event wiring' },
    subtitle: { text: '<series>, <point>, <xAxis> and <yAxis> outputs' },
    xAxis: { categories: ['North', 'South', 'East', 'West'] },
    yAxis: { title: { text: 'Tickets' } },
    plotOptions: {
      series: {
        cursor: 'pointer',
        point: {
          events: {}
        }
      }
    },
    series: [
      { name: 'Open', data: [12, 18, 9, 15] },
      { name: 'Closed', data: [9, 13, 7, 11] }
    ]
  };

  directiveHtml = `<chart
  [options]="directiveOptions"
  (create)="onCreate('Directive chart', $event)"
  (load)="record('chart load')"
  (redraw)="record('chart redraw')"
>
  <series
    (click)="record('series click')"
    (legendItemClick)="record('legend click')"
  >
    <point
      (click)="record('point click')"
      (mouseOver)="record('point hover')"
    ></point>
  </series>
  <xAxis (setExtremes)="record('xAxis extremes')"></xAxis>
  <yAxis (setExtremes)="record('yAxis extremes')"></yAxis>
</chart>`;

  directiveTutorialHtml = this.wrapTutorialHtml(this.directiveHtml);
  directiveTutorialTs = `import { Component } from '@angular/core';

@Component({
  selector: 'directive-events-example',
  templateUrl: './directive-events-example.component.html',
  styleUrls: ['./directive-events-example.component.css']
})
export class DirectiveEventsExampleComponent {
  events: string[] = [];

  directiveOptions: any = {
    chart: { type: 'column', height: 340 },
    title: { text: 'Directive/event wiring' },
    subtitle: { text: '<series>, <point>, <xAxis> and <yAxis> outputs' },
    xAxis: { categories: ['North', 'South', 'East', 'West'] },
    yAxis: { title: { text: 'Tickets' } },
    plotOptions: {
      series: {
        cursor: 'pointer',
        point: { events: {} }
      }
    },
    series: [
      { name: 'Open', data: [12, 18, 9, 15] },
      { name: 'Closed', data: [9, 13, 7, 11] }
    ]
  };

  onCreate(chart: any) {
    this.record('chart created with ' + chart.series.length + ' series');
  }

  record(message: string) {
    this.events.unshift(new Date().toLocaleTimeString() + ' - ' + message);
    this.events = this.events.slice(0, 8);
  }
}`;
  directiveTutorialScss = this.defaultTutorialScss(340);

  binanceTutorialHtml = `<section
  class="live-market-card"
  [class.market-light]="binanceTheme === 'light'"
  [class.market-dark]="binanceTheme === 'dark'"
>
  <div class="market-toolbar">
    <button type="button" (click)="selectBinanceTheme('dark')">Dark</button>
    <button type="button" (click)="selectBinanceTheme('light')">Light</button>
    <button type="button" (click)="selectBinanceSymbol('BNBUSDT')">BNBUSDT</button>
    <button type="button" (click)="selectBinanceSymbol('BTCUSDT')">BTCUSDT</button>
    <button type="button" (click)="selectBinanceInterval('1s')">1s</button>
    <button type="button" (click)="selectBinanceInterval('1m')">1m</button>
    <button type="button" (click)="selectBinanceInterval('1d')">1d</button>
  </div>

  <chart
    [type]="'StockChart'"
    [options]="binanceOptions"
    (create)="onBinanceChartCreate($event)"
  ></chart>
</section>`;

  binanceTutorialTs = `import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'binance-candles-example',
  templateUrl: './binance-candles-example.component.html',
  styleUrls: ['./binance-candles-example.component.css']
})
export class BinanceCandlesExampleComponent implements OnInit, OnDestroy {
  binanceSymbol = 'BNBUSDT';
  binanceInterval = '1s';
  binanceTheme = 'light';
  binanceRestHosts = [
    'https://api-b.alexandro.net/api/v3/klines',
    'https://api-b.alexandro.net/data-api/api/v3/klines'
  ];
  // Mask API: the example still uses Binance public market data, but browser
  // requests go through api-b.alexandro.net to avoid firewall/domain blocks.
  binanceWsBaseUrl = 'wss://api-b.alexandro.net/ws/';
  binanceOptions: any = this.createBinanceOptions();

  private binanceChart: any = null;
  private binanceSocket: any = null;
  private binanceOhlcData: any[] = [];
  private binanceVolumeData: any[] = [];

  ngOnInit() {
    this.loadBinanceHistory();
  }

  ngOnDestroy() {
    this.disconnectBinanceSocket();
  }

  onBinanceChartCreate(chart: any) {
    this.binanceChart = chart;
    this.applyBinanceSeries();
  }

  selectBinanceTheme(theme: string) {
    this.binanceTheme = theme;
    this.binanceOptions = this.createBinanceOptions();
    if (this.binanceChart && this.binanceChart.update) {
      this.binanceChart.update(this.binanceOptions, false);
      this.applyBinanceSeries();
    }
  }

  selectBinanceSymbol(symbol: string) {
    this.binanceSymbol = symbol;
    this.loadBinanceHistory();
  }

  selectBinanceInterval(interval: string) {
    this.binanceInterval = interval;
    this.loadBinanceHistory();
  }

  private loadBinanceHistory() {
    this.disconnectBinanceSocket();
    var url = this.binanceRestHosts[0] +
      '?symbol=' + this.binanceSymbol +
      '&interval=' + this.binanceInterval +
      '&limit=300';
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
        this.receiveBinanceHistory(JSON.parse(xhr.responseText));
      }
    };

    xhr.open('GET', url, true);
    xhr.send();
  }

  private receiveBinanceHistory(candles: any[]) {
    this.binanceOhlcData = [];
    this.binanceVolumeData = [];

    for (var i = 0; i < candles.length; i++) {
      var candle = candles[i];
      var point = [
        parseInt(candle[0], 10),
        parseFloat(candle[1]),
        parseFloat(candle[2]),
        parseFloat(candle[3]),
        parseFloat(candle[4])
      ];
      this.binanceOhlcData.push(point);
      this.binanceVolumeData.push({
        x: point[0],
        y: parseFloat(candle[5]),
        color: point[4] >= point[1] ? '#02c076' : '#f6465d'
      });
    }

    this.applyBinanceSeries();
    this.connectBinanceSocket();
  }

  private connectBinanceSocket() {
    var url = this.binanceWsBaseUrl +
      this.binanceSymbol.toLowerCase() +
      '@kline_' +
      this.binanceInterval;
    this.binanceSocket = new WebSocket(url);

    this.binanceSocket.onmessage = (message: any) => {
      var payload = JSON.parse(message.data);
      if (payload && payload.k) {
        this.receiveLiveCandle(payload.k);
      }
    };
  }

  private receiveLiveCandle(kline: any) {
    var point = [
      kline.t,
      parseFloat(kline.o),
      parseFloat(kline.h),
      parseFloat(kline.l),
      parseFloat(kline.c)
    ];
    this.binanceOhlcData[this.binanceOhlcData.length - 1] = point;
    this.applyBinanceSeries();
  }

  private applyBinanceSeries() {
    if (!this.binanceChart || !this.binanceChart.series) {
      return;
    }
    this.binanceChart.series[0].setData(this.binanceOhlcData.slice(0), false);
    this.binanceChart.series[1].setData(this.calculateMovingAverage(7), false);
    this.binanceChart.series[2].setData(this.calculateMovingAverage(25), false);
    this.binanceChart.series[3].setData(this.calculateMovingAverage(99), false);
    this.binanceChart.series[4].setData(this.binanceVolumeData.slice(0), false);
    this.binanceChart.redraw();
  }

  private calculateMovingAverage(period: number) {
    var result: any[] = [];
    var sum = 0;
    for (var i = 0; i < this.binanceOhlcData.length; i++) {
      sum += this.binanceOhlcData[i][4];
      if (i >= period) {
        sum -= this.binanceOhlcData[i - period][4];
      }
      if (i >= period - 1) {
        result.push([this.binanceOhlcData[i][0], sum / period]);
      }
    }
    return result;
  }

  private disconnectBinanceSocket() {
    if (this.binanceSocket) {
      this.binanceSocket.close();
      this.binanceSocket = null;
    }
  }

  private createBinanceOptions() {
    return {
      chart: { height: 560, backgroundColor: '#ffffff', plotBackgroundColor: '#ffffff' },
      title: { text: this.binanceSymbol + ' live candles' },
      rangeSelector: { enabled: false },
      navigator: { enabled: false },
      scrollbar: { enabled: false },
      yAxis: [{ height: '68%' }, { top: '73%', height: '22%', offset: 0 }],
      plotOptions: {
        candlestick: {
          color: '#f6465d',
          upColor: '#02c076',
          lineColor: '#f6465d',
          upLineColor: '#02c076'
        },
        series: { animation: false, turboThreshold: 0 }
      },
      series: [
        { type: 'candlestick', name: 'Price', data: [] },
        { type: 'line', name: 'MA(7)', data: [], color: '#f5d300' },
        { type: 'line', name: 'MA(25)', data: [], color: '#ff4ec9' },
        { type: 'line', name: 'MA(99)', data: [], color: '#8e44ad' },
        { type: 'column', name: 'Volume', data: [], yAxis: 1 }
      ]
    };
  }
}`;
  binanceTutorialScss = `.live-market-card {
  padding: 18px;
  border: 1px solid #d9e5ee;
  border-radius: 8px;
  background: #fff;
}

.market-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

button {
  min-height: 32px;
  padding: 0 12px;
  border: 1px solid #d0d5dd;
  border-radius: 6px;
  background: #fff;
  color: #344054;
  cursor: pointer;
}

chart {
  display: block;
  width: 100%;
  min-height: 560px;
}`;

  ngOnInit() {
    this.readRoute();
    this.readInitialBinanceTheme();
    this.binanceOptions = this.createBinanceOptions();
    this.dynamicExamples = this.createDynamicMarketExamples();

    if (this.viewMode === 'dynamic') {
      this.loadBinanceHistory();
      this.loadMarketTickerSnapshot();
      this.marketSnapshotTimer = setInterval(() => this.loadMarketTickerSnapshot(false), 20000);
      this.loadCryptoTreemapSnapshot();
      this.cryptoTreemapTimer = setInterval(() => this.loadCryptoTreemapSnapshot(false), 60000);
      this.connectMarketTickerStream();
    }
  }

  ngOnDestroy() {
    this.disconnectBinanceSocket();
    this.disconnectMarketTickerStream();
    if (this.dynamicRefreshTimer) {
      clearTimeout(this.dynamicRefreshTimer);
      this.dynamicRefreshTimer = null;
    }
    if (this.marketSnapshotTimer) {
      clearInterval(this.marketSnapshotTimer);
      this.marketSnapshotTimer = null;
    }
    if (this.cryptoTreemapTimer) {
      clearInterval(this.cryptoTreemapTimer);
      this.cryptoTreemapTimer = null;
    }
    this.dynamicCharts = {};
  }

  private readRoute() {
    var path = window.location && window.location.pathname ? window.location.pathname : '/';
    var search = window.location && window.location.search ? window.location.search : '';
    this.viewMode = path.indexOf('/static') >= 0 || search.indexOf('view=static') >= 0 ? 'static' : 'dynamic';
  }

  onBinanceChartCreate(chart: any) {
    this.binanceChart = chart;
    this.applyBinanceSeries();
  }

  selectBinanceSymbol(symbol: string) {
    if (this.binanceSymbol === symbol) {
      return;
    }

    this.binanceSymbol = symbol;
    this.loadBinanceHistory();
  }

  selectBinanceInterval(interval: string) {
    if (this.binanceInterval === interval) {
      return;
    }

    this.binanceInterval = interval;
    this.loadBinanceHistory();
  }

  selectBinanceTheme(theme: string) {
    if (this.binanceTheme === theme) {
      return;
    }

    this.binanceTheme = theme;
    this.binanceOptions = this.createBinanceOptions();

    if (this.binanceChart && this.binanceChart.update) {
      this.binanceChart.update(this.binanceOptions, false);
      this.applyBinanceSeries();
    }
  }

  reloadBinanceChart() {
    this.loadBinanceHistory();
  }

  private loadBinanceHistory() {
    this.disconnectBinanceSocket();
    this.binanceOhlcData = [];
    this.binanceVolumeData = [];
    this.binanceCandleCount = 0;
    this.binanceLastCandle = null;
    this.binanceStatus = 'Loading REST candles for ' + this.binanceSymbol + ' ' + this.binanceInterval + '...';
    this.binanceSocketStatus = 'Waiting for REST history';
    this.applyBinanceSeries();
    this.loadBinanceHistoryFromHost(0);
  }

  private readInitialBinanceTheme() {
    var search = window.location && window.location.search ? window.location.search : '';
    if (search.indexOf('theme=dark') !== -1) {
      this.binanceTheme = 'dark';
    }
  }

  private loadMarketTickerSnapshot(showLoading?: boolean) {
    if (this.marketSnapshotLoading) {
      return;
    }

    var symbolsParam = encodeURIComponent(JSON.stringify(this.marketSymbols));
    var url = this.maskApiRestBaseUrl + '/api/v3/ticker/24hr?symbols=' + symbolsParam;
    var xhr = new XMLHttpRequest();

    this.marketSnapshotLoading = true;
    this.marketRestUrl = url;
    if (showLoading !== false) {
      this.marketStatus = 'Loading tracked 24hr ticker snapshot...';
    }

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) {
        return;
      }

      this.marketSnapshotLoading = false;

      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          var tickers = JSON.parse(xhr.responseText);
          for (var i = 0; i < tickers.length; i++) {
            this.receiveMarketTicker(this.normalizeRestTicker(tickers[i]));
          }
          this.marketStatus = 'REST ticker snapshot loaded';
          this.refreshDynamicExamples();
        } catch (error) {
          this.marketStatus = 'REST ticker parse failed';
        }
      } else {
        this.marketStatus = 'REST ticker snapshot failed';
      }
    };

    xhr.onerror = () => {
      this.marketSnapshotLoading = false;
      this.marketStatus = 'REST ticker snapshot failed';
    };
    xhr.open('GET', url, true);
    xhr.send();
  }

  private loadCryptoTreemapSnapshot(showLoading?: boolean) {
    if (this.cryptoTreemapLoading) {
      return;
    }

    var xhr = new XMLHttpRequest();

    this.cryptoTreemapLoading = true;
    if (showLoading !== false) {
      this.cryptoTreemapStatus = 'Loading CoinGecko top 50 market cap snapshot...';
    }

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) {
        return;
      }

      this.cryptoTreemapLoading = false;

      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          var coins = JSON.parse(xhr.responseText);
          var rows: any[] = [];
          for (var i = 0; i < coins.length; i++) {
            rows.push(this.normalizeCoinGeckoCoin(coins[i]));
          }
          this.cryptoTreemapRows = rows;
          this.cryptoTreemapStatus = 'CoinGecko market cap snapshot updated: top ' + rows.length;
          this.refreshDynamicExamples();
        } catch (error) {
          this.cryptoTreemapStatus = 'CoinGecko market cap parse failed';
        }
      } else {
        this.cryptoTreemapStatus = 'CoinGecko market cap snapshot failed';
      }
    };

    xhr.onerror = () => {
      this.cryptoTreemapLoading = false;
      this.cryptoTreemapStatus = 'CoinGecko market cap snapshot failed';
    };
    xhr.open('GET', this.cryptoTreemapUrl, true);
    xhr.send();
  }

  private connectMarketTickerStream() {
    this.disconnectMarketTickerStream();
    var streams: string[] = [];

    for (var i = 0; i < this.marketSymbols.length; i++) {
      streams.push(this.marketSymbols[i].toLowerCase() + '@miniTicker');
    }

    this.marketWsUrl = this.maskApiWsBaseUrl + '/stream?streams=' + streams.join('/');
    this.marketStatus = 'Connecting tracked market miniTicker stream...';

    try {
      this.marketSocket = new WebSocket(this.marketWsUrl);
    } catch (error) {
      this.marketStatus = 'Market WebSocket failed to start';
      return;
    }

    this.marketSocket.onopen = () => {
      this.marketStatus = 'Live tracked market miniTicker connected';
    };

    this.marketSocket.onclose = () => {
      this.marketStatus = 'Market WebSocket disconnected';
    };

    this.marketSocket.onerror = () => {
      this.marketStatus = 'Market WebSocket error';
    };

    this.marketSocket.onmessage = (message: any) => {
      try {
        var payload = JSON.parse(message.data);
        var data = payload && payload.data ? payload.data : payload;
        if (data && data.length !== undefined) {
          for (var i = 0; i < data.length; i++) {
            this.receiveMiniTickerPayload(data[i]);
          }
        } else {
          this.receiveMiniTickerPayload(data);
        }
        this.marketStatus = 'Live market miniTicker update: ' + new Date().toLocaleTimeString();
        this.scheduleDynamicRefresh();
      } catch (error) {
        this.marketStatus = 'Market WebSocket parse error';
      }
    };
  }

  private disconnectMarketTickerStream() {
    if (!this.marketSocket) {
      return;
    }

    this.marketSocket.onopen = null;
    this.marketSocket.onclose = null;
    this.marketSocket.onerror = null;
    this.marketSocket.onmessage = null;
    this.marketSocket.close();
    this.marketSocket = null;
  }

  private toFiniteNumber(value: any, fallback: number) {
    var parsed = typeof value === 'number' ? value : parseFloat(value);
    return isFinite(parsed) ? parsed : fallback;
  }

  private normalizeRestTicker(ticker: any) {
    var symbol = ticker.symbol || '';
    var index = this.marketSymbols.indexOf(symbol);
    var fallback = this.fallbackTicker(symbol, index >= 0 ? index : 0);

    return {
      symbol: symbol,
      price: this.toFiniteNumber(ticker.lastPrice, fallback.price),
      open: this.toFiniteNumber(ticker.openPrice, fallback.open),
      high: this.toFiniteNumber(ticker.highPrice, fallback.high),
      low: this.toFiniteNumber(ticker.lowPrice, fallback.low),
      volume: this.toFiniteNumber(ticker.volume, fallback.volume),
      quoteVolume: this.toFiniteNumber(ticker.quoteVolume, fallback.quoteVolume),
      changePercent: this.toFiniteNumber(ticker.priceChangePercent, fallback.changePercent),
      trades: this.toFiniteNumber(ticker.count, fallback.trades)
    };
  }

  private normalizeCoinGeckoCoin(coin: any) {
    return {
      name: this.safeTreemapText(coin.name || ''),
      symbol: this.safeTreemapText((coin.symbol || '').toUpperCase()),
      price: this.toFiniteNumber(coin.current_price, 0),
      marketCap: this.toFiniteNumber(coin.market_cap, 0),
      changePercent: this.toFiniteNumber(coin.price_change_percentage_24h, 0)
    };
  }

  private safeTreemapText(value: string) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private normalizeMiniTicker(ticker: any) {
    var source = ticker && ticker.data ? ticker.data : ticker;
    var symbol = source && source.s ? source.s : '';
    var index = this.marketSymbols.indexOf(symbol);
    var fallback = this.marketTickers[symbol] || this.fallbackTicker(symbol, index >= 0 ? index : 0);
    var open = this.toFiniteNumber(source && source.o, fallback.open);
    var close = this.toFiniteNumber(source && source.c, fallback.price);
    var changePercent = open ? (close - open) / open * 100 : fallback.changePercent;

    return {
      symbol: symbol,
      price: close,
      open: open,
      high: this.toFiniteNumber(source && source.h, fallback.high),
      low: this.toFiniteNumber(source && source.l, fallback.low),
      volume: this.toFiniteNumber(source && source.v, fallback.volume),
      quoteVolume: this.toFiniteNumber(source && source.q, fallback.quoteVolume),
      changePercent: this.toFiniteNumber(changePercent, fallback.changePercent),
      trades: undefined
    };
  }

  private receiveMiniTickerPayload(data: any) {
    var ticker = this.normalizeMiniTicker(data);

    if (this.isTrackedMarketSymbol(ticker.symbol)) {
      this.receiveMarketTicker(ticker);
    }
  }

  private receiveMarketTicker(ticker: any) {
    if (!ticker || !ticker.symbol) {
      return;
    }

    var previous = this.marketTickers[ticker.symbol];
    var index = this.marketSymbols.indexOf(ticker.symbol);
    var fallback = previous || this.fallbackTicker(ticker.symbol, index >= 0 ? index : 0);
    ticker.price = this.toFiniteNumber(ticker.price, fallback.price);
    ticker.open = this.toFiniteNumber(ticker.open, fallback.open);
    ticker.high = this.toFiniteNumber(ticker.high, fallback.high);
    ticker.low = this.toFiniteNumber(ticker.low, fallback.low);
    ticker.volume = this.toFiniteNumber(ticker.volume, fallback.volume);
    ticker.quoteVolume = this.toFiniteNumber(ticker.quoteVolume, fallback.quoteVolume);
    ticker.changePercent = this.toFiniteNumber(ticker.changePercent, fallback.changePercent);

    if (previous && (ticker.trades === undefined || isNaN(ticker.trades))) {
      ticker.trades = previous.trades;
    }

    this.marketTickers[ticker.symbol] = ticker;
    if (!this.marketHistory[ticker.symbol]) {
      this.marketHistory[ticker.symbol] = [];
    }

    this.marketHistory[ticker.symbol].push([Date.now(), ticker.price]);
    while (this.marketHistory[ticker.symbol].length > 60) {
      this.marketHistory[ticker.symbol].shift();
    }
  }

  private isTrackedMarketSymbol(symbol: string) {
    for (var i = 0; i < this.marketSymbols.length; i++) {
      if (this.marketSymbols[i] === symbol) {
        return true;
      }
    }

    return false;
  }

  private scheduleDynamicRefresh() {
    if (this.dynamicRefreshQueued) {
      return;
    }

    this.dynamicRefreshQueued = true;
    this.dynamicRefreshTimer = setTimeout(() => {
      this.dynamicRefreshQueued = false;
      this.dynamicRefreshTimer = null;
      this.refreshDynamicExamples();
    }, 900);
  }

  private refreshDynamicExamples() {
    this.updateAllDynamicCharts();
  }

  private loadBinanceHistoryFromHost(index: number) {
    if (index >= this.binanceRestHosts.length) {
      this.binanceStatus = 'REST history failed on both Binance endpoints.';
      this.binanceSocketStatus = 'WebSocket not started';
      return;
    }

    var url = this.binanceRestHosts[index] +
      '?symbol=' + encodeURIComponent(this.binanceSymbol) +
      '&interval=' + encodeURIComponent(this.binanceInterval) +
      '&limit=300';
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) {
        return;
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          var candles = JSON.parse(xhr.responseText);
          this.receiveBinanceHistory(candles, url);
        } catch (error) {
          this.loadBinanceHistoryFromHost(index + 1);
        }
        return;
      }

      this.loadBinanceHistoryFromHost(index + 1);
    };

    xhr.onerror = () => this.loadBinanceHistoryFromHost(index + 1);
    xhr.open('GET', url, true);
    xhr.send();
  }

  private receiveBinanceHistory(candles: any[], url: string) {
    var ohlc: any[] = [];
    var volume: any[] = [];

    for (var i = 0; i < candles.length; i++) {
      var candle = candles[i];
      var point = this.toOhlcPoint(candle);
      ohlc.push(point);
      volume.push({
        x: point[0],
        y: parseFloat(candle[5]),
        color: point[4] >= point[1] ? '#02c076' : '#f6465d'
      });
    }

    this.binanceOhlcData = ohlc;
    this.binanceVolumeData = volume;
    this.binanceRestUrl = url;
    this.binanceCandleCount = ohlc.length;
    this.binanceLastCandle = this.createCandleMeta(ohlc[ohlc.length - 1]);
    this.binanceStatus = 'REST candles loaded from ' + this.shortUrl(url);
    this.applyBinanceSeries();
    this.refreshDynamicExamples();
    this.connectBinanceSocket();
  }

  private connectBinanceSocket() {
    this.disconnectBinanceSocket();
    this.binanceWsUrl = this.binanceWsBaseUrl +
      this.binanceSymbol.toLowerCase() +
      '@kline_' +
      this.binanceInterval;
    this.binanceSocketStatus = 'Connecting to ' + this.binanceWsUrl;

    try {
      this.binanceSocket = new WebSocket(this.binanceWsUrl);
    } catch (error) {
      this.binanceSocketStatus = 'WebSocket failed to start';
      return;
    }

    this.binanceSocket.onopen = () => {
      this.binanceSocketStatus = 'Live WebSocket connected';
    };

    this.binanceSocket.onclose = () => {
      this.binanceSocketStatus = 'WebSocket disconnected';
    };

    this.binanceSocket.onerror = () => {
      this.binanceSocketStatus = 'WebSocket error';
    };

    this.binanceSocket.onmessage = (message: any) => {
      try {
        var payload = JSON.parse(message.data);
        if (payload && payload.k) {
          this.receiveBinanceLiveCandle(payload.k);
        }
      } catch (error) {
        this.binanceSocketStatus = 'WebSocket parse error';
      }
    };
  }

  private disconnectBinanceSocket() {
    if (!this.binanceSocket) {
      return;
    }

    this.binanceSocket.onopen = null;
    this.binanceSocket.onclose = null;
    this.binanceSocket.onerror = null;
    this.binanceSocket.onmessage = null;
    this.binanceSocket.close();
    this.binanceSocket = null;
  }

  private receiveBinanceLiveCandle(kline: any) {
    var point = [
      kline.t,
      parseFloat(kline.o),
      parseFloat(kline.h),
      parseFloat(kline.l),
      parseFloat(kline.c)
    ];
    var volumePoint = {
      x: point[0],
      y: parseFloat(kline.v),
      color: point[4] >= point[1] ? '#02c076' : '#f6465d'
    };

    this.upsertTimePoint(this.binanceOhlcData, point);
    this.upsertTimePoint(this.binanceVolumeData, volumePoint);
    this.trimBinanceData();
    this.binanceCandleCount = this.binanceOhlcData.length;
    this.binanceLastCandle = this.createCandleMeta(point);
    this.binanceSocketStatus = 'Live WebSocket update: ' + new Date().toLocaleTimeString();
    this.applyBinanceSeries();
    this.scheduleDynamicRefresh();
  }

  private upsertTimePoint(target: any[], point: any) {
    var pointTime = point.x || point[0];
    var last = target.length ? target[target.length - 1] : null;
    var lastTime = last ? (last.x || last[0]) : null;

    if (last && lastTime === pointTime) {
      target[target.length - 1] = point;
      return;
    }

    target.push(point);
  }

  private trimBinanceData() {
    while (this.binanceOhlcData.length > 300) {
      this.binanceOhlcData.shift();
    }

    while (this.binanceVolumeData.length > 300) {
      this.binanceVolumeData.shift();
    }
  }

  private applyBinanceSeries() {
    if (!this.binanceChart || !this.binanceChart.series || this.binanceChart.series.length < 5) {
      return;
    }

    var isMobile = this.isMobileViewport();
    this.binanceChart.setTitle(
      { text: isMobile ? '' : this.binanceSymbol + ' live candles' },
      { text: isMobile ? '' : 'REST history + Binance WebSocket updates (' + this.binanceInterval + ')' },
      false
    );
    this.binanceChart.series[0].setData(this.binanceOhlcData.slice(0), false);
    this.binanceChart.series[1].setData(this.calculateMovingAverage(7), false);
    this.binanceChart.series[2].setData(this.calculateMovingAverage(25), false);
    this.binanceChart.series[3].setData(this.calculateMovingAverage(99), false);
    this.binanceChart.series[4].setData(this.binanceVolumeData.slice(0), false);
    this.binanceChart.redraw();
  }

  private toOhlcPoint(candle: any[]) {
    return [
      parseInt(candle[0], 10),
      parseFloat(candle[1]),
      parseFloat(candle[2]),
      parseFloat(candle[3]),
      parseFloat(candle[4])
    ];
  }

  private createCandleMeta(point: any[]) {
    if (!point) {
      return null;
    }

    var open = point[1];
    var close = point[4];
    var change = close - open;
    var changePercent = open ? change / open * 100 : 0;

    return {
      time: point[0],
      open: open,
      high: point[2],
      low: point[3],
      close: close,
      change: change,
      changePercent: changePercent
    };
  }

  private calculateMovingAverage(period: number) {
    var result: any[] = [];
    var sum = 0;

    for (var i = 0; i < this.binanceOhlcData.length; i++) {
      sum += this.binanceOhlcData[i][4];

      if (i >= period) {
        sum -= this.binanceOhlcData[i - period][4];
      }

      if (i >= period - 1) {
        result.push([
          this.binanceOhlcData[i][0],
          parseFloat((sum / period).toFixed(4))
        ]);
      }
    }

    return result;
  }

  private shortUrl(url: string) {
    return url.replace('https://', '').replace('wss://', '');
  }

  formatPrice(value: number) {
    if (value === null || typeof value === 'undefined') {
      return '--';
    }

    return value.toFixed(value >= 1000 ? 2 : 4);
  }

  formatPercent(value: number) {
    if (value === null || typeof value === 'undefined') {
      return '--';
    }

    return (value >= 0 ? '+' : '') + value.toFixed(2) + '%';
  }

  private withTutorial(example: ChartExample): ChartExample {
    var optionsName = this.extractOptionsName(example.html);
    var className = this.toComponentClassName(example.title);
    var wrappedHtml = this.wrapTutorialHtml(example.html);

    example.tutorialHtml = wrappedHtml;
    example.tutorialTs = `import { Component } from '@angular/core';

@Component({
  selector: '${this.toSelectorName(example.title)}',
  templateUrl: './${this.toFileName(example.title)}.component.html',
  styleUrls: ['./${this.toFileName(example.title)}.component.css']
})
export class ${className} {
  ${optionsName}: any = ${this.stringifyOptions(example.options)};

  onCreate(chart: any) {
    console.log('${example.title} created', chart.series.length);
  }
}`;
    example.tutorialScss = this.defaultTutorialScss(example.options && example.options.chart && example.options.chart.height ? example.options.chart.height : 320);

    return example;
  }

  private wrapTutorialHtml(html: string) {
    return `<div class="chart-shell">
  ${html}
</div>`;
  }

  private extractOptionsName(html: string) {
    var match = html.match(/\[options\]="([^"]+)"/);
    return match && match[1] ? match[1] : 'chartOptions';
  }

  private stringifyOptions(options: any) {
    return JSON.stringify(options, null, 2)
      .replace(/"([^"]+)":/g, '$1:')
      .replace(/"/g, '\'');
  }

  private toComponentClassName(title: string) {
    var name = this.toWords(title).join('');
    if (/^[0-9]/.test(name)) {
      name = 'Chart' + name;
    }
    return name + 'ExampleComponent';
  }

  private toSelectorName(title: string) {
    return 'chart-' + this.toFileName(title);
  }

  private toFileName(title: string) {
    return this.toWords(title).join('-').toLowerCase();
  }

  private toWords(value: string) {
    var words = value.replace(/[^a-zA-Z0-9]+/g, ' ').split(' ');
    var clean: string[] = [];

    for (var i = 0; i < words.length; i++) {
      if (words[i]) {
        clean.push(words[i].charAt(0).toUpperCase() + words[i].slice(1));
      }
    }

    return clean.length ? clean : ['Chart'];
  }

  private defaultTutorialScss(height: number) {
    return `.chart-shell {
  width: 100%;
  padding: 16px;
  border: 1px solid #d9e5ee;
  border-radius: 8px;
  background: #fff;
  box-sizing: border-box;
}

chart {
  display: block;
  width: 100%;
  min-height: ${height}px;
}`;
  }

  private createDynamicMarketExamples() {
    var examples: ChartExample[] = [
      this.makeDynamicExample('Live crypto treemap', 'Top 50 coins sized by market cap and colored by 24h change.', 'liveTreemapOptions', this.createLiveTreemapOptions()),
      this.makeDynamicExample('Live price move line', 'Normalized live price movement from Binance miniTicker WebSocket.', 'liveLineOptions', this.createLiveLineOptions()),
      this.makeDynamicExample('Live price heartbeat spline', 'Heartbeat-style normalized pulse from live price and change data.', 'liveSplineOptions', this.createLiveSplineOptions()),
      this.makeDynamicExample('Live quote volume area', 'Area comparison using live quote volume.', 'liveAreaOptions', this.createLiveAreaOptions()),
      this.makeDynamicExample('Live quote volume areaspline', 'Smooth area chart from live quote volume.', 'liveAreasplineOptions', this.createLiveAreasplineOptions()),
      this.makeDynamicExample('Live change column', '24h percentage change updated by WebSocket.', 'liveColumnOptions', this.createLiveColumnOptions()),
      this.makeDynamicExample('Live volume bar', 'Horizontal bar chart from live quote volume.', 'liveBarOptions', this.createLiveBarOptions()),
      this.makeDynamicExample('Live stacked volume', 'Stacked columns splitting volume into base and quote-derived views.', 'liveStackedOptions', this.createLiveStackedOptions()),
      this.makeDynamicExample('Live volume pie', 'Volume share across tracked symbols.', 'livePieOptions', this.createLivePieOptions()),
      this.makeDynamicExample('Live volume donut', 'Donut variation of the same live volume share.', 'liveDonutOptions', this.createLiveDonutOptions()),
      this.makeDynamicExample('Live price scatter', 'Price versus quote volume for the tracked symbols.', 'liveScatterOptions', this.createLiveScatterOptions()),
      this.makeDynamicExample('Live change bubble', 'Change percent, price and volume in a bubble chart.', 'liveBubbleOptions', this.createLiveBubbleOptions()),
      this.makeDynamicExample('Live combo chart', 'Column volume plus spline change percent.', 'liveComboOptions', this.createLiveComboOptions()),
      this.makeDynamicExample('Live polar strength', 'Market strength rendered in polar/radar form.', 'livePolarOptions', this.createLivePolarOptions()),
      this.makeDynamicExample('Live BNB change gauge', 'Gauge driven by BNBUSDT 24h change.', 'liveGaugeOptions', this.createLiveGaugeOptions()),
      this.makeDynamicExample('Live market score solid gauge', 'Solid gauge score from the tracked symbols.', 'liveSolidGaugeOptions', this.createLiveSolidGaugeOptions()),
      this.makeDynamicExample('Live market heatmap', 'Heatmap built from change and volatility metrics.', 'liveHeatmapOptions', this.createLiveHeatmapOptions()),
      this.makeDynamicExample('Live liquidity funnel', 'Funnel sorted from highest to lowest quote volume.', 'liveFunnelOptions', this.createLiveFunnelOptions()),
      this.makeDynamicExample('Live 3D volume columns', '3D columns from live quote volume.', 'live3dColumnOptions', this.createLive3dColumnOptions()),
      this.makeDynamicExample('Live volume cylinder', 'Cylinder chart driven by Binance quote volume.', 'liveCylinderOptions', this.createLiveCylinderOptions()),
      this.makeDynamicExample('Live liquidity funnel 3D', '3D funnel sorted by Binance quote volume.', 'liveFunnel3dOptions', this.createLiveFunnel3dOptions()),
      this.makeDynamicExample('Live trade activity pyramid 3D', '3D pyramid using Binance 24hr trade counts when available.', 'livePyramid3dOptions', this.createLivePyramid3dOptions()),
      this.makeDynamicExample('Live change dot plot', 'Dot plot from live 24hr percentage change.', 'liveDotplotOptions', this.createLiveDotplotOptions()),
      this.makeDynamicExample('Live liquidity packed bubbles', 'Packed bubbles grouped by live Binance liquidity rank.', 'livePackedBubbleOptions', this.createLivePackedBubbleOptions()),
      this.makeDynamicExample('Live market parallel coordinates', 'Parallel coordinates comparing live Binance price, range, volume and trade activity.', 'liveParallelCoordinatesOptions', this.createLiveParallelCoordinatesOptions()),
      this.makeDynamicExample('Live Heikin Ashi candles', 'Heikin Ashi rendering from the selected Binance candle stream.', 'liveHeikinAshiOptions', this.createLiveHeikinAshiOptions(), 'StockChart'),
      this.makeDynamicExample('Live hollow candlestick', 'Hollow candlestick rendering from the selected Binance candle stream.', 'liveHollowCandlestickOptions', this.createLiveHollowCandlestickOptions(), 'StockChart'),
      this.makeDynamicExample('Live market vector field', 'Vector direction and strength derived from Binance change and liquidity.', 'liveVectorOptions', this.createLiveVectorOptions()),
      this.makeDynamicExample('Live market wind barb', 'Wind barb style view of live market momentum derived from Binance tickers.', 'liveWindbarbOptions', this.createLiveWindbarbOptions()),
      this.makeDynamicExample('Live market flowmap', 'Flow links from a liquidity hub into tracked market points.', 'liveFlowmapOptions', this.createLiveFlowmapOptions()),
      this.makeDynamicExample('Live geo heatmap', 'Geo heatmap cells from live market movement and liquidity.', 'liveGeoHeatmapOptions', this.createLiveGeoHeatmapOptions()),
      this.makeDynamicExample('Live market pictorial', 'Pictorial bars using live quote volume.', 'livePictorialOptions', this.createLivePictorialOptions()),
      this.makeDynamicExample('Live market contour', 'Contour surface from change, liquidity and volatility.', 'liveContourOptions', this.createLiveContourOptions()),
      this.makeDynamicExample('Live Renko price bricks', 'Renko StockChart generated from the selected candle stream.', 'liveRenkoOptions', this.createLiveRenkoOptions(), 'StockChart'),
      this.makeDynamicExample('Live point and figure', 'Point and figure StockChart generated from live candle closes.', 'livePointAndFigureOptions', this.createLivePointAndFigureOptions(), 'StockChart')
    ];

    for (var i = 0; i < examples.length; i++) {
      examples[i] = this.withTutorial(examples[i]);
    }

    return examples;
  }

  private makeDynamicExample(title: string, description: string, optionsName: string, options: any, constructorType?: string): ChartExample {
    return {
      key: optionsName,
      title: title,
      description: description,
      constructorType: constructorType,
      options: options,
      html: constructorType
        ? '<chart [type]="\'' + constructorType + '\'" [options]="' + optionsName + '"></chart>'
        : '<chart [options]="' + optionsName + '"></chart>'
    };
  }

  private marketRows() {
    var rows: any[] = [];

    for (var i = 0; i < this.marketSymbols.length; i++) {
      var symbol = this.marketSymbols[i];
      rows.push(this.marketTickers[symbol] || this.fallbackTicker(symbol, i));
    }

    return rows;
  }

  private fallbackTicker(symbol: string, index: number) {
    var base = [67000, 3600, 660, 155, 2.2, 0.65, 0.16, 0.11][index] || (10 + index);
    var change = [1.2, -0.8, 0.4, 2.1, -1.1, 0.7, 1.8, -0.3][index] || 0;
    return {
      symbol: symbol,
      price: base,
      open: base * (1 - change / 100),
      high: base * 1.02,
      low: base * 0.98,
      volume: 1000000 + index * 120000,
      quoteVolume: 900000000 - index * 70000000,
      changePercent: change,
      trades: 1500000 - index * 120000
    };
  }

  private cryptoTreemapRowsForChart() {
    if (this.cryptoTreemapRows.length) {
      return this.cryptoTreemapRows;
    }

    return [
      { name: 'Bitcoin', symbol: 'BTC', price: 67516, marketCap: 1352661264706, changePercent: -5.67 },
      { name: 'Ethereum', symbol: 'ETH', price: 1922.75, marketCap: 232156210067, changePercent: -3.27 },
      { name: 'Tether', symbol: 'USDT', price: 0.998454, marketCap: 187951404193, changePercent: -0.01 },
      { name: 'BNB', symbol: 'BNB', price: 665.54, marketCap: 89722947955, changePercent: -3.06 },
      { name: 'XRP', symbol: 'XRP', price: 1.23, marketCap: 76555364639, changePercent: -4.94 },
      { name: 'USD Coin', symbol: 'USDC', price: 0.999595, marketCap: 75837344337, changePercent: -0.01 },
      { name: 'Solana', symbol: 'SOL', price: 76.77, marketCap: 44417058835, changePercent: -5.08 },
      { name: 'TRON', symbol: 'TRX', price: 0.337746, marketCap: 32024356142, changePercent: -2.23 }
    ];
  }

  private marketLabels(rows: any[]) {
    var labels: string[] = [];
    for (var i = 0; i < rows.length; i++) {
      labels.push(rows[i].symbol.replace('USDT', ''));
    }
    return labels;
  }

  private marketValues(rows: any[], field: string, divisor: number) {
    var values: number[] = [];
    for (var i = 0; i < rows.length; i++) {
      values.push(parseFloat(((rows[i][field] || 0) / divisor).toFixed(4)));
    }
    return values;
  }

  private marketPieData(rows: any[]) {
    var data: any[] = [];
    for (var i = 0; i < rows.length; i++) {
      data.push([rows[i].symbol.replace('USDT', ''), parseFloat((rows[i].quoteVolume / 1000000).toFixed(2))]);
    }
    return data;
  }

  private marketHistorySeries() {
    var series: any[] = [];
    for (var i = 0; i < this.marketSymbols.length; i++) {
      var symbol = this.marketSymbols[i];
      var history = this.marketHistory[symbol] && this.marketHistory[symbol].length ? this.marketHistory[symbol] : [[Date.now(), this.fallbackTicker(symbol, i).price]];
      series.push({
        name: symbol.replace('USDT', ''),
        data: history.slice(0),
        marker: { enabled: false }
      });
    }
    return series;
  }

  private marketMoveSeries() {
    var rows = this.marketRows().slice(0, 6);
    var now = Date.now();
    var pointCount = 48;
    var series: any[] = [];

    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var symbol = row.symbol.replace('USDT', '');
      var open = row.open || row.price || 1;
      var liveMove = open ? ((row.price || open) - open) / open * 100 : 0;
      var change = row.changePercent || liveMove;
      var data: any[] = [];

      for (var pointIndex = 0; pointIndex < pointCount; pointIndex++) {
        var age = pointCount - pointIndex;
        var progress = pointIndex / (pointCount - 1);
        var x = now - age * 1000;
        var drift = change * progress;
        var wave = Math.sin((pointIndex + i * 4) / 5) * (0.35 + i * 0.04);
        var microMove = Math.cos((pointIndex + i) / 2.7) * 0.16;
        var value = drift + wave + microMove;

        data.push([x, parseFloat(value.toFixed(3))]);
      }

      series.push({
        name: symbol + ' move',
        data: data,
        marker: { enabled: false },
        lineWidth: i === 0 ? 3 : 2
      });
    }

    return series;
  }

  private marketHeartbeatSeries() {
    var rows = this.marketRows().slice(0, 4);
    var now = Date.now();
    var pointCount = 48;
    var series: any[] = [];

    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var symbol = row.symbol.replace('USDT', '');
      var baseChange = row.changePercent || 0;
      var open = row.open || row.price || 1;
      var priceDrift = open ? ((row.price || open) - open) / open * 100 : 0;
      var data: any[] = [];

      for (var pointIndex = 0; pointIndex < pointCount; pointIndex++) {
        var age = pointCount - pointIndex;
        var x = now - age * 1000;
        var rhythm = Math.sin((pointIndex + i * 3) / 2.3) * (1.4 + i * 0.22);
        var breath = Math.sin((pointIndex + i) / 7) * 0.75;
        var beatPosition = (pointIndex + i * 2) % 12;
        var pulse = beatPosition === 0 ? 8.5 : (beatPosition === 1 ? 4.8 : (beatPosition === 2 ? -2.4 : 0));
        var marketLean = baseChange * 0.9 + priceDrift * 0.65;
        var value = 100 + marketLean + rhythm + breath + pulse;

        data.push([x, parseFloat(value.toFixed(2))]);
      }

      series.push({
        name: symbol + ' pulse',
        data: data,
        marker: { enabled: false },
        lineWidth: i === 0 ? 3 : 2
      });
    }

    return series;
  }

  private marketScore(rows: any[]) {
    var sum = 0;
    for (var i = 0; i < rows.length; i++) {
      sum += rows[i].changePercent;
    }
    var avg = rows.length ? sum / rows.length : 0;
    var score = 50 + avg * 5;
    return Math.max(0, Math.min(100, parseFloat(score.toFixed(2))));
  }

  private sortedMarketRowsBy(field: string) {
    var rows = this.marketRows().slice(0);
    rows.sort(function (a: any, b: any) {
      return (b[field] || 0) - (a[field] || 0);
    });
    return rows;
  }

  private rangePercent(row: any) {
    var price = row && row.price ? row.price : 1;
    return price ? (row.high - row.low) / price * 100 : 0;
  }

  private metricScore(value: number, min: number, max: number) {
    if (max === min) {
      return 50;
    }
    return parseFloat(Math.max(0, Math.min(100, (value - min) / (max - min) * 100)).toFixed(2));
  }

  private maxField(rows: any[], field: string) {
    var max = 0;
    for (var i = 0; i < rows.length; i++) {
      max = Math.max(max, rows[i][field] || 0);
    }
    return max || 1;
  }

  private candleDataForDynamicCharts() {
    if (this.binanceOhlcData.length) {
      return this.binanceOhlcData.slice(-80);
    }

    var now = Date.now();
    var data: any[] = [];
    var close = this.fallbackTicker(this.binanceSymbol, 2).price;
    for (var i = 0; i < 40; i++) {
      var open = close + Math.sin(i / 3) * 3;
      var high = open + 6 + Math.cos(i / 4) * 2;
      var low = open - 6 - Math.sin(i / 5) * 2;
      close = open + Math.sin(i / 2) * 4;
      data.push([now - (40 - i) * 1000, open, high, low, close]);
    }
    return data;
  }

  private createLiveLineOptions() {
    return {
      chart: { type: 'line', height: 320 },
      title: { text: 'Live price move line' },
      subtitle: { text: this.marketStatus },
      xAxis: { type: 'datetime' },
      yAxis: {
        title: { text: 'Move from open, %' },
        plotLines: [{ value: 0, color: '#94a3b8', width: 1, dashStyle: 'ShortDash', zIndex: 1 }]
      },
      tooltip: {
        shared: true,
        valueSuffix: '%',
        valueDecimals: 3
      },
      plotOptions: {
        line: {
          animation: false,
          marker: { enabled: false }
        }
      },
      series: this.marketMoveSeries()
    };
  }

  private createLiveSplineOptions() {
    return {
      chart: { type: 'spline', height: 320 },
      title: { text: 'Live price heartbeat spline' },
      subtitle: { text: this.marketStatus },
      xAxis: {
        type: 'datetime',
        tickPixelInterval: 90
      },
      yAxis: {
        title: { text: 'Normalized pulse' },
        plotLines: [{ value: 100, color: '#94a3b8', width: 1, dashStyle: 'ShortDash', zIndex: 1 }]
      },
      tooltip: {
        shared: true,
        valueSuffix: ' pulse',
        valueDecimals: 2
      },
      plotOptions: {
        spline: {
          animation: false,
          marker: { enabled: false }
        }
      },
      series: this.marketHeartbeatSeries()
    };
  }

  private createLiveAreaOptions() {
    var rows = this.marketRows();
    return {
      chart: { type: 'area', height: 320 },
      title: { text: 'Live quote volume area' },
      xAxis: { categories: this.marketLabels(rows) },
      yAxis: { title: { text: 'Quote volume, millions' } },
      series: [{ name: 'Quote volume', data: this.marketValues(rows, 'quoteVolume', 1000000) }]
    };
  }

  private createLiveAreasplineOptions() {
    var options = this.createLiveAreaOptions();
    options.chart.type = 'areaspline';
    options.title.text = 'Live quote volume areaspline';
    return options;
  }

  private createLiveColumnOptions() {
    var rows = this.marketRows();
    return {
      chart: { type: 'column', height: 320 },
      title: { text: 'Live 24h change column' },
      xAxis: { categories: this.marketLabels(rows) },
      yAxis: { title: { text: 'Change %' } },
      series: [{ name: '24h change %', data: this.marketValues(rows, 'changePercent', 1) }]
    };
  }

  private createLiveBarOptions() {
    var rows = this.marketRows();
    return {
      chart: { type: 'bar', height: 320 },
      title: { text: 'Live volume bar' },
      xAxis: { categories: this.marketLabels(rows) },
      yAxis: { title: { text: 'Quote volume, millions' } },
      series: [{ name: 'Quote volume', data: this.marketValues(rows, 'quoteVolume', 1000000) }]
    };
  }

  private createLiveStackedOptions() {
    var rows = this.marketRows();
    return {
      chart: { type: 'column', height: 320 },
      title: { text: 'Live stacked volume' },
      xAxis: { categories: this.marketLabels(rows) },
      yAxis: { min: 0, title: { text: 'Volume score' }, stackLabels: { enabled: true } },
      plotOptions: { column: { stacking: 'normal' } },
      series: [
        { name: 'Base volume', data: this.marketValues(rows, 'volume', 1000000) },
        { name: 'Quote volume', data: this.marketValues(rows, 'quoteVolume', 100000000) }
      ]
    };
  }

  private createLivePieOptions() {
    return {
      chart: { type: 'pie', height: 320 },
      title: { text: 'Live volume pie' },
      series: [{ name: 'Quote volume', data: this.marketPieData(this.marketRows()) }]
    };
  }

  private createLiveDonutOptions() {
    var options: any = this.createLivePieOptions();
    options.title.text = 'Live volume donut';
    options.plotOptions = { pie: { innerSize: '55%' } };
    return options;
  }

  private createLiveScatterOptions() {
    var rows = this.marketRows();
    var data: any[] = [];
    for (var i = 0; i < rows.length; i++) {
      data.push({
        name: rows[i].symbol.replace('USDT', ''),
        x: parseFloat(rows[i].changePercent.toFixed(4)),
        y: parseFloat((rows[i].quoteVolume / 1000000).toFixed(4))
      });
    }
    return {
      chart: { type: 'scatter', zoomType: 'xy', height: 320 },
      title: { text: 'Live price scatter' },
      xAxis: { title: { text: '24h change %' } },
      yAxis: { title: { text: 'Quote volume, millions' } },
      series: [{ name: 'Symbols', data: data }]
    };
  }

  private createLiveBubbleOptions() {
    var rows = this.marketRows();
    var data: any[] = [];
    for (var i = 0; i < rows.length; i++) {
      data.push({
        name: rows[i].symbol.replace('USDT', ''),
        x: parseFloat(rows[i].changePercent.toFixed(4)),
        y: parseFloat(rows[i].price.toFixed(4)),
        z: Math.max(10, parseFloat((rows[i].quoteVolume / 100000000).toFixed(4)))
      });
    }
    return {
      chart: { type: 'bubble', plotBorderWidth: 1, zoomType: 'xy', height: 320 },
      title: { text: 'Live change bubble' },
      xAxis: { title: { text: '24h change %' } },
      yAxis: { title: { text: 'Price USDT' } },
      series: [{ name: 'Symbols', data: data }]
    };
  }

  private createLiveComboOptions() {
    var rows = this.marketRows();
    return {
      chart: { height: 320 },
      title: { text: 'Live combo chart' },
      xAxis: { categories: this.marketLabels(rows) },
      yAxis: [{ title: { text: 'Quote volume, millions' } }, { title: { text: 'Change %' }, opposite: true }],
      series: [
        { type: 'column', name: 'Quote volume', data: this.marketValues(rows, 'quoteVolume', 1000000) },
        { type: 'spline', name: '24h change %', data: this.marketValues(rows, 'changePercent', 1), yAxis: 1 }
      ]
    };
  }

  private createLivePolarOptions() {
    var rows = this.marketRows();
    var data: number[] = [];
    for (var i = 0; i < rows.length; i++) {
      var change = this.toFiniteNumber(rows[i].changePercent, 0);
      var strength = Math.max(0, Math.min(100, 50 + change * 5));
      data.push(parseFloat(strength.toFixed(2)));
    }
    return {
      chart: { polar: true, type: 'line', height: 320 },
      title: { text: 'Live polar strength' },
      pane: { size: '80%' },
      xAxis: { categories: this.marketLabels(rows), tickmarkPlacement: 'on', lineWidth: 0 },
      yAxis: { gridLineInterpolation: 'polygon', lineWidth: 0, min: 0, max: 100 },
      series: [{ name: 'Strength', data: data, pointPlacement: 'on' }]
    };
  }

  private createLiveGaugeOptions() {
    var ticker = this.marketTickers['BNBUSDT'] || this.fallbackTicker('BNBUSDT', 2);
    return {
      chart: { type: 'gauge', height: 320 },
      title: { text: 'Live BNB change gauge' },
      pane: { startAngle: -150, endAngle: 150 },
      yAxis: { min: -10, max: 10, title: { text: '24h %' } },
      series: [{ name: 'BNB change', data: [parseFloat(ticker.changePercent.toFixed(2))] }]
    };
  }

  private createLiveSolidGaugeOptions() {
    var score = this.marketScore(this.marketRows());
    return {
      chart: { type: 'solidgauge', height: 320 },
      title: { text: 'Live market score solid gauge' },
      pane: {
        center: ['50%', '60%'],
        size: '90%',
        startAngle: -90,
        endAngle: 90,
        background: { backgroundColor: '#eef3f8', innerRadius: '60%', outerRadius: '100%', shape: 'arc' }
      },
      yAxis: {
        min: 0,
        max: 100,
        stops: [[0.3, '#f6465d'], [0.55, '#f0b90b'], [0.75, '#02c076']],
        lineWidth: 0,
        tickWidth: 0,
        minorTickInterval: null,
        tickAmount: 2,
        title: { text: null }
      },
      series: [{ name: 'Market score', data: [score] }]
    };
  }

  private createLiveHeatmapOptions() {
    var rows = this.marketRows();
    var data: any[] = [];
    for (var i = 0; i < rows.length; i++) {
      data.push([i, 0, parseFloat(rows[i].changePercent.toFixed(2))]);
      data.push([i, 1, parseFloat(((rows[i].high - rows[i].low) / rows[i].price * 100).toFixed(2))]);
    }
    return {
      chart: { type: 'heatmap', height: 320 },
      title: { text: 'Live market heatmap' },
      xAxis: { categories: this.marketLabels(rows) },
      yAxis: { categories: ['Change %', 'Range %'], title: null },
      colorAxis: { min: -5, max: 5, minColor: '#f6465d', maxColor: '#02c076' },
      series: [{ name: 'Metric', borderWidth: 1, data: data, dataLabels: { enabled: true, color: '#111' } }]
    };
  }

  private createLiveTreemapOptions() {
    var rows = this.cryptoTreemapRowsForChart();
    var data: any[] = [];
    for (var i = 0; i < rows.length; i++) {
      var change = parseFloat(rows[i].changePercent.toFixed(2));
      data.push({
        name: rows[i].symbol,
        value: rows[i].marketCap,
        colorValue: change,
        custom: {
          name: rows[i].name,
          symbol: rows[i].symbol,
          change: change,
          price: rows[i].price,
          marketCap: rows[i].marketCap
        }
      });
    }
    return {
      chart: {
        type: 'treemap',
        className: 'crypto-treemap-chart',
        height: 620,
        backgroundColor: '#ffffff',
        plotBackgroundColor: '#ffffff',
        spacing: [12, 0, 8, 0],
        events: {
          load: function () {
            var chart: any = this;
            var hideTooltip = function () {
              if (chart.tooltip && chart.tooltip.hide) {
                chart.tooltip.hide(0);
              }
            };
            var hideWhenOutside = function (event: any) {
              var target = event && event.target ? event.target : null;
              if (chart.container && target && chart.container.contains && chart.container.contains(target)) {
                return;
              }
              hideTooltip();
            };

            if (chart.container && chart.container.addEventListener) {
              chart.container.addEventListener('mouseleave', hideTooltip);
              chart.container.addEventListener('blur', hideTooltip, true);
            }

            if (document && document.addEventListener) {
              document.addEventListener('mousedown', hideWhenOutside, true);
              document.addEventListener('touchstart', hideWhenOutside, true);
              document.addEventListener('scroll', hideTooltip, true);
            }

            if (window && window.addEventListener) {
              window.addEventListener('blur', hideTooltip);
            }
          }
        }
      },
      title: {
        text: 'Top 50 coins by market cap',
        style: { color: '#111827', fontSize: '22px', fontWeight: '700' }
      },
      subtitle: {
        text: this.cryptoTreemapStatus + ' | colored by 24h change',
        style: { color: '#475569', fontSize: '14px' }
      },
      colorAxis: {
        min: -10,
        max: 10,
        stops: [[0, '#f33b36'], [0.45, '#fb7b72'], [0.5, '#e5e7eb'], [0.55, '#82e77c'], [1, '#29b916']]
      },
      tooltip: {
        backgroundColor: '#ffffff',
        borderColor: '#cbd5e1',
        hideDelay: 0,
        shadow: true,
        zIndex: 100000,
        style: { color: '#111827' },
        headerFormat: '',
        pointFormat: '<b>{point.custom.name} ({point.custom.symbol})</b><br/>Market cap: ${point.custom.marketCap:,.0f}<br/>Price: ${point.custom.price}<br/>24h change: {point.custom.change:.2f}%'
      },
      plotOptions: {
        treemap: {
          animation: false,
          borderColor: '#ffffff',
          borderWidth: 2,
          stickyTracking: false,
          point: {
            events: {
              mouseOver: function () {
                var point: any = this;
                var chart = point.series && point.series.chart ? point.series.chart : null;
                if (chart && chart.tooltip && chart.tooltip.label && chart.tooltip.label.toFront) {
                  setTimeout(function () {
                    chart.tooltip.label.toFront();
                  }, 0);
                }
              },
              mouseOut: function () {
                var point: any = this;
                if (point.series && point.series.chart && point.series.chart.tooltip) {
                  point.series.chart.tooltip.hide(0);
                }
              }
            }
          },
          dataLabels: {
            enabled: true,
            crop: true,
            overflow: 'none',
            align: 'center',
            verticalAlign: 'middle',
            style: {
              color: '#030712',
              fontSize: '13px',
              fontWeight: '700',
              textOutline: 'none'
            },
            formatter: function () {
              var point = (<any>this).point || {};
              var custom = point.custom || {};
              var shape = point.shapeArgs || {};
              var width = shape.width || 0;
              var height = shape.height || 0;
              var change = custom.change || 0;
              var sign = change > 0 ? '+' : '';

              if (width < 42 || height < 28) {
                return point.name;
              }

              if (width > 220 && height > 150) {
                return custom.name + ' (' + point.name + ')<br/>$' + custom.price + '<br/>' + sign + change.toFixed(2) + '%';
              }

              if (width > 110 && height > 72) {
                return point.name + '<br/>$' + custom.price + '<br/>' + sign + change.toFixed(2) + '%';
              }

              return point.name + '<br/>' + sign + change.toFixed(1) + '%';
            }
          }
        }
      },
      series: [{
        type: 'treemap',
        layoutAlgorithm: 'squarified',
        alternateStartingDirection: true,
        turboThreshold: 0,
        data: data
      }]
    };
  }

  private createLiveFunnelOptions() {
    var rows = this.marketRows().slice(0);
    rows.sort(function (a: any, b: any) {
      return b.quoteVolume - a.quoteVolume;
    });
    var data: any[] = [];
    for (var i = 0; i < rows.length; i++) {
      data.push([rows[i].symbol.replace('USDT', ''), parseFloat((rows[i].quoteVolume / 1000000).toFixed(2))]);
    }
    return {
      chart: { type: 'funnel', height: 320 },
      title: { text: 'Live liquidity funnel' },
      series: [{ name: 'Quote volume', data: data }]
    };
  }

  private createLive3dColumnOptions() {
    var rows = this.marketRows();
    return {
      chart: { type: 'column', height: 320, options3d: { enabled: true, alpha: 12, beta: 12, depth: 45 } },
      title: { text: 'Live 3D volume columns' },
      xAxis: { categories: this.marketLabels(rows) },
      yAxis: { title: { text: 'Quote volume, millions' } },
      series: [{ name: 'Quote volume', data: this.marketValues(rows, 'quoteVolume', 1000000) }]
    };
  }

  private createLiveCylinderOptions() {
    var rows = this.sortedMarketRowsBy('quoteVolume').slice(0, 6);
    return {
      chart: {
        type: 'cylinder',
        height: 340,
        options3d: { enabled: true, alpha: 15, beta: 15, depth: 45, viewDistance: 25 }
      },
      title: { text: 'Live volume cylinder' },
      subtitle: { text: this.marketStatus },
      xAxis: { categories: this.marketLabels(rows) },
      yAxis: { title: { text: 'Quote volume, millions' } },
      plotOptions: { series: { depth: 35, colorByPoint: true, animation: false } },
      series: [{ name: 'Quote volume', data: this.marketValues(rows, 'quoteVolume', 1000000) }]
    };
  }

  private createLiveFunnel3dOptions() {
    var rows = this.sortedMarketRowsBy('quoteVolume').slice(0, 6);
    return {
      chart: {
        type: 'funnel3d',
        height: 360,
        options3d: { enabled: true, alpha: 10, depth: 50, viewDistance: 50 }
      },
      title: { text: 'Live liquidity funnel 3D' },
      subtitle: { text: this.marketStatus },
      plotOptions: {
        series: {
          animation: false,
          neckWidth: '30%',
          neckHeight: '25%',
          width: '72%',
          height: '82%',
          dataLabels: { enabled: true, format: '<b>{point.name}</b>: {point.y:.0f}M' }
        }
      },
      series: [{ name: 'Quote volume', data: this.marketPieData(rows) }]
    };
  }

  private createLivePyramid3dOptions() {
    var rows = this.sortedMarketRowsBy('trades').slice(0, 6);
    var data: any[] = [];
    for (var i = 0; i < rows.length; i++) {
      data.push([rows[i].symbol.replace('USDT', ''), Math.round((rows[i].trades || 0) / 1000)]);
    }
    return {
      chart: {
        type: 'pyramid3d',
        height: 360,
        options3d: { enabled: true, alpha: 10, depth: 50, viewDistance: 50 }
      },
      title: { text: 'Live trade activity pyramid 3D' },
      subtitle: { text: 'Binance 24hr ticker count, thousands' },
      plotOptions: {
        series: {
          animation: false,
          width: '72%',
          height: '82%',
          dataLabels: { enabled: true, format: '<b>{point.name}</b>: {point.y:.0f}K' }
        }
      },
      series: [{ name: 'Trades', data: data }]
    };
  }

  private createLiveDotplotOptions() {
    var rows = this.marketRows();
    return {
      chart: { type: 'dotplot', height: 320 },
      title: { text: 'Live change dot plot' },
      subtitle: { text: this.marketStatus },
      xAxis: { categories: this.marketLabels(rows) },
      yAxis: {
        title: { text: '24h change %' },
        plotLines: [{ value: 0, color: '#94a3b8', width: 1, dashStyle: 'ShortDash', zIndex: 1 }]
      },
      plotOptions: { series: { animation: false } },
      series: [{ name: '24h change', data: this.marketValues(rows, 'changePercent', 1) }]
    };
  }

  private createLivePackedBubbleOptions() {
    var rows = this.sortedMarketRowsBy('quoteVolume');
    var top: any[] = [];
    var middle: any[] = [];
    var watch: any[] = [];

    for (var i = 0; i < rows.length; i++) {
      var point = {
        name: rows[i].symbol.replace('USDT', ''),
        value: parseFloat((rows[i].quoteVolume / 1000000).toFixed(2))
      };
      if (i < 3) {
        top.push(point);
      } else if (i < 6) {
        middle.push(point);
      } else {
        watch.push(point);
      }
    }

    return {
      chart: { type: 'packedbubble', height: 360 },
      title: { text: 'Live liquidity packed bubbles' },
      subtitle: { text: this.marketStatus },
      tooltip: { pointFormat: '<b>{point.name}</b>: {point.value:.2f}M quote volume' },
      plotOptions: {
        packedbubble: {
          animation: false,
          minSize: '28%',
          maxSize: '92%',
          layoutAlgorithm: { splitSeries: false, gravitationalConstant: 0.04 }
        }
      },
      series: [
        { name: 'Top liquidity', data: top },
        { name: 'Mid liquidity', data: middle },
        { name: 'Watchlist', data: watch }
      ]
    };
  }

  private createLiveParallelCoordinatesOptions() {
    var rows = this.marketRows().slice(0, 6);
    var maxVolume = this.maxField(rows, 'quoteVolume');
    var maxTrades = this.maxField(rows, 'trades');
    var series: any[] = [];

    for (var i = 0; i < rows.length; i++) {
      var changeScore = this.metricScore(rows[i].changePercent, -10, 10);
      var rangeScore = this.metricScore(this.rangePercent(rows[i]), 0, 12);
      var volumeScore = this.metricScore(rows[i].quoteVolume, 0, maxVolume);
      var tradeScore = this.metricScore(rows[i].trades || 0, 0, maxTrades);
      var priceScore = this.metricScore(rows[i].price, rows[rows.length - 1].price || 0, rows[0].price || 1);
      series.push({
        name: rows[i].symbol.replace('USDT', ''),
        data: [priceScore, changeScore, rangeScore, volumeScore, tradeScore]
      });
    }

    return {
      chart: { parallelCoordinates: true, type: 'line', height: 360 },
      title: { text: 'Live market parallel coordinates' },
      subtitle: { text: 'Scores normalized from Binance ticker fields' },
      xAxis: { categories: ['Price', 'Change', 'Range', 'Volume', 'Trades'] },
      yAxis: { title: { text: null }, min: 0, max: 100 },
      plotOptions: { series: { animation: false, marker: { enabled: false } } },
      series: series
    };
  }

  private createLiveHeikinAshiOptions() {
    return {
      chart: { height: 340 },
      title: { text: 'Live Heikin Ashi candles' },
      subtitle: { text: this.binanceSymbol + ' ' + this.binanceInterval + ' candles' },
      rangeSelector: { enabled: false },
      navigator: { enabled: false },
      scrollbar: { enabled: false },
      plotOptions: { series: { animation: false } },
      series: [{ type: 'heikinashi', name: this.binanceSymbol, data: this.candleDataForDynamicCharts() }]
    };
  }

  private createLiveHollowCandlestickOptions() {
    return {
      chart: { height: 340 },
      title: { text: 'Live hollow candlestick' },
      subtitle: { text: this.binanceSymbol + ' ' + this.binanceInterval + ' candles' },
      rangeSelector: { enabled: false },
      navigator: { enabled: false },
      scrollbar: { enabled: false },
      plotOptions: { series: { animation: false } },
      series: [{ type: 'hollowcandlestick', name: this.binanceSymbol, data: this.candleDataForDynamicCharts() }]
    };
  }

  private createLiveVectorOptions() {
    var rows = this.marketRows();
    var maxVolume = this.maxField(rows, 'quoteVolume');
    var data: any[] = [];
    for (var i = 0; i < rows.length; i++) {
      var direction = rows[i].changePercent >= 0 ? 45 : 225;
      var length = 6 + Math.abs(rows[i].changePercent) * 1.8 + (rows[i].quoteVolume / maxVolume) * 6;
      data.push([i, this.metricScore(rows[i].quoteVolume, 0, maxVolume), parseFloat(length.toFixed(2)), direction]);
    }
    return {
      chart: { type: 'vector', height: 340 },
      title: { text: 'Live market vector field' },
      subtitle: { text: 'Direction from live change; length from change plus liquidity' },
      xAxis: { categories: this.marketLabels(rows), min: -0.5, max: rows.length - 0.5 },
      yAxis: { min: 0, max: 100, title: { text: 'Liquidity score' } },
      tooltip: { pointFormat: 'Length: <b>{point.length:.2f}</b><br/>Direction: <b>{point.direction} deg</b>' },
      plotOptions: { series: { animation: false } },
      series: [{ name: 'Momentum vectors', data: data }]
    };
  }

  private createLiveWindbarbOptions() {
    var rows = this.marketRows();
    var now = Date.now();
    var data: any[] = [];
    for (var i = 0; i < rows.length; i++) {
      data.push({
        x: now + i * 60000,
        value: parseFloat((Math.abs(rows[i].changePercent) * 3 + this.rangePercent(rows[i])).toFixed(2)),
        direction: rows[i].changePercent >= 0 ? 70 : 250,
        name: rows[i].symbol.replace('USDT', '')
      });
    }
    return {
      chart: { height: 320 },
      title: { text: 'Live market wind barb' },
      subtitle: { text: 'Momentum style view derived from Binance ticker movement' },
      xAxis: { type: 'datetime' },
      yAxis: { title: { text: 'Momentum speed' } },
      plotOptions: { series: { animation: false } },
      series: [{ type: 'windbarb', name: 'Momentum', data: data }]
    };
  }

  private createLiveTreegraphOptions() {
    var rows = this.marketRows();
    var data: any[] = [
      { id: 'Tracked Binance markets' },
      { id: 'Positive move', parent: 'Tracked Binance markets' },
      { id: 'Negative move', parent: 'Tracked Binance markets' }
    ];

    for (var i = 0; i < rows.length; i++) {
      var label = rows[i].symbol.replace('USDT', '') + ' ' + rows[i].changePercent.toFixed(2) + '%';
      data.push({
        id: label,
        parent: rows[i].changePercent >= 0 ? 'Positive move' : 'Negative move',
        color: rows[i].changePercent >= 0 ? '#02c076' : '#f6465d'
      });
    }

    return {
      chart: { type: 'treegraph', height: 380 },
      title: { text: 'Live market treegraph' },
      subtitle: { text: 'Tracked symbols grouped by live 24h move' },
      plotOptions: {
        series: {
          animation: false,
          dataLabels: { style: { textOutline: 'none' } },
          marker: { symbol: 'rect', width: 120 }
        }
      },
      series: [{ data: data }]
    };
  }

  private modernMarketPoints() {
    var coords = [
      { lon: -46.6333, lat: -23.5505 },
      { lon: -74.0060, lat: 40.7128 },
      { lon: -0.1276, lat: 51.5072 },
      { lon: 2.3522, lat: 48.8566 },
      { lon: -99.1332, lat: 19.4326 },
      { lon: -70.6693, lat: -33.4489 },
      { lon: -58.3816, lat: -34.6037 },
      { lon: -79.3832, lat: 43.6532 }
    ];
    var rows = this.marketRows();
    var points: any[] = [];

    for (var i = 0; i < rows.length; i++) {
      points.push({
        id: rows[i].symbol,
        name: rows[i].symbol.replace('USDT', ''),
        lon: coords[i % coords.length].lon,
        lat: coords[i % coords.length].lat,
        value: rows[i].changePercent,
        quoteVolume: rows[i].quoteVolume
      });
    }

    return points;
  }

  private createLiveFlowmapOptions() {
    var points = this.modernMarketPoints();
    var data: any[] = [];
    var hub = { id: 'STACKLINE-HUB', name: 'Stackline liquidity hub', lon: -38.5, lat: 8.5 };

    for (var i = 0; i < points.length; i++) {
      data.push({
        from: hub.id,
        to: points[i].id,
        weight: Math.max(1, Math.round(points[i].quoteVolume / 250000000)),
        color: points[i].value >= 0 ? '#02c076' : '#f6465d'
      });
    }

    return {
      chart: { height: 380, map: null },
      title: { text: 'Live market flowmap' },
      subtitle: { text: 'Flow links weighted by live quote volume' },
      mapView: {
        projection: { name: 'WebMercator' },
        center: [-42, 18],
        zoom: 1.35
      },
      plotOptions: { series: { animation: false } },
      series: [
        {
          type: 'mappoint',
          name: 'Market points',
          data: [hub].concat(points),
          marker: { radius: 6 }
        },
        {
          type: 'flowmap',
          name: 'Liquidity flow',
          data: data,
          markerEnd: { width: 8, height: 8 },
          opacity: 0.72
        }
      ]
    };
  }

  private createLiveGeoHeatmapOptions() {
    var points = this.modernMarketPoints();
    var data: any[] = [];

    for (var i = 0; i < points.length; i++) {
      var lon = points[i].lon;
      var lat = points[i].lat;
      data.push({
        name: points[i].name,
        value: points[i].value,
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [lon - 5, lat - 4],
            [lon + 5, lat - 4],
            [lon + 5, lat + 4],
            [lon - 5, lat + 4],
            [lon - 5, lat - 4]
          ]]
        }
      });
    }

    return {
      chart: { height: 380, map: null },
      title: { text: 'Live geo heatmap' },
      subtitle: { text: 'Market movement rendered as geographic heat cells' },
      mapView: {
        projection: { name: 'WebMercator' },
        center: [-42, 18],
        zoom: 1.25
      },
      colorAxis: {
        min: -5,
        max: 5,
        stops: [
          [0, '#f6465d'],
          [0.5, '#eef2f7'],
          [1, '#02c076']
        ]
      },
      plotOptions: { series: { animation: false } },
      series: [{ type: 'geoheatmap', name: '24h change', data: data }]
    };
  }

  private createLivePictorialOptions() {
    var rows = this.marketRows().slice(0, 6);
    var categories: string[] = [];
    var data: any[] = [];

    for (var i = 0; i < rows.length; i++) {
      categories.push(rows[i].symbol.replace('USDT', ''));
      data.push({
        y: Math.max(8, rows[i].quoteVolume / 100000000),
        color: rows[i].changePercent >= 0 ? '#02c076' : '#f6465d'
      });
    }

    return {
      chart: { type: 'pictorial', height: 380 },
      title: { text: 'Live market pictorial' },
      subtitle: { text: 'Quote volume drawn through a reusable SVG path' },
      xAxis: { categories: categories },
      yAxis: { title: { text: 'Quote volume score' }, max: 12 },
      plotOptions: {
        pictorial: {
          animation: false,
          stacking: 'normal',
          paths: [{
            definition: 'M 50 0 C 78 0 100 22 100 50 C 100 78 78 100 50 100 C 22 100 0 78 0 50 C 0 22 22 0 50 0 Z',
            max: 12
          }]
        }
      },
      series: [{ type: 'pictorial', name: 'Quote volume', data: data }]
    };
  }

  private createLiveTiledWebMapOptions() {
    var points = this.modernMarketPoints();
    var markers: any[] = [];

    for (var i = 0; i < points.length; i++) {
      markers.push({
        name: points[i].name,
        lon: points[i].lon,
        lat: points[i].lat,
        z: Math.max(2, Math.abs(points[i].value) * 3),
        color: points[i].value >= 0 ? '#02c076' : '#f6465d'
      });
    }

    return {
      chart: { height: 380, map: null },
      title: { text: 'Live tiled web map' },
      subtitle: { text: 'OpenStreetMap tiles with live market markers' },
      mapView: {
        projection: { name: 'WebMercator' },
        center: [-42, 18],
        zoom: 1.25
      },
      plotOptions: { series: { animation: false } },
      series: [
        {
          type: 'tiledwebmap',
          name: 'OpenStreetMap',
          provider: { type: 'OpenStreetMap' }
        },
        {
          type: 'mapbubble',
          name: 'Market movement',
          data: markers,
          minSize: 8,
          maxSize: 28
        }
      ]
    };
  }

  private createLiveContourOptions() {
    var rows = this.marketRows();
    var data: any[] = [];
    var metrics = ['Change', 'Range', 'Volume', 'Trades', 'Price'];

    for (var x = 0; x < rows.length; x++) {
      var row = rows[x];
      var values = [
        row.changePercent,
        (row.high - row.low) / Math.max(row.open, 1) * 100,
        row.quoteVolume / 1000000000,
        (row.trades || 0) / 1000000,
        row.price / Math.max(row.open, 1) - 1
      ];

      for (var y = 0; y < values.length; y++) {
        data.push([x, y, parseFloat(values[y].toFixed(3))]);
      }
    }

    return {
      chart: { type: 'contour', height: 380 },
      title: { text: 'Live market contour' },
      subtitle: { text: 'Surface built from live market metrics' },
      xAxis: { categories: rows.map(function (row: any) { return row.symbol.replace('USDT', ''); }) },
      yAxis: { categories: metrics, title: { text: null } },
      colorAxis: {
        stops: [
          [0, '#f6465d'],
          [0.5, '#eef2f7'],
          [1, '#02c076']
        ]
      },
      plotOptions: { series: { animation: false, turboThreshold: 0 } },
      series: [{ type: 'contour', name: 'Market surface', data: data }]
    };
  }

  private closePriceSeries() {
    var source = this.binanceOhlcData.length ? this.binanceOhlcData : [
      [Date.now() - 7000, 620, 628, 616, 624],
      [Date.now() - 6000, 624, 630, 621, 629],
      [Date.now() - 5000, 629, 631, 625, 626],
      [Date.now() - 4000, 626, 636, 625, 634],
      [Date.now() - 3000, 634, 639, 631, 637],
      [Date.now() - 2000, 637, 641, 635, 640],
      [Date.now() - 1000, 640, 642, 633, 635]
    ];
    var data: any[] = [];
    var firstClose = source[0][4];
    var hasBoxMovement = false;

    for (var i = 0; i < source.length; i++) {
      if (Math.abs(source[i][4] - firstClose) >= 0.01) {
        hasBoxMovement = true;
      }
      data.push({ x: source[i][0], y: source[i][4] });
    }

    if (!hasBoxMovement && data.length > 2) {
      data[1].y = firstClose + 0.02;
      data[2].y = firstClose - 0.02;
    }

    return data;
  }

  private createLiveRenkoOptions() {
    return {
      chart: { height: 380 },
      rangeSelector: { enabled: false },
      navigator: { enabled: false },
      scrollbar: { enabled: false },
      title: { text: 'Live Renko price bricks' },
      subtitle: { text: 'Calculated from selected candle closes' },
      plotOptions: { series: { animation: false } },
      series: [{
        type: 'renko',
        name: this.binanceSymbol + ' Renko',
        data: this.closePriceSeries(),
        boxSize: 0.01
      }]
    };
  }

  private createLivePointAndFigureOptions() {
    return {
      chart: { height: 380 },
      rangeSelector: { enabled: false },
      navigator: { enabled: false },
      scrollbar: { enabled: false },
      title: { text: 'Live point and figure' },
      subtitle: { text: 'Calculated from selected candle closes' },
      plotOptions: { series: { animation: false } },
      series: [{
        type: 'pointandfigure',
        name: this.binanceSymbol + ' P&F',
        data: this.closePriceSeries(),
        boxSize: 0.01,
        reversalAmount: 1
      }]
    };
  }

  private makeFlowmap(): ChartExample {
    return {
      title: 'Flowmap',
      description: 'Highcharts 11+ flow links between map points.',
      options: this.createLiveFlowmapOptions(),
      html: '<chart [options]="flowmapOptions"></chart>'
    };
  }

  private makeGeoHeatmap(): ChartExample {
    return {
      title: 'Geo heatmap',
      description: 'Highcharts 11+ geographic heat cells.',
      options: this.createLiveGeoHeatmapOptions(),
      html: '<chart [options]="geoHeatmapOptions"></chart>'
    };
  }

  private makePictorial(): ChartExample {
    return {
      title: 'Pictorial chart',
      description: 'Highcharts 11+ pictorial series using SVG path definitions.',
      options: this.createLivePictorialOptions(),
      html: '<chart [options]="pictorialOptions"></chart>'
    };
  }

  private makeTiledWebMap(): ChartExample {
    return {
      title: 'Tiled web map',
      description: 'Highcharts 11+ tiled map layer with market markers.',
      options: this.createLiveTiledWebMapOptions(),
      html: '<chart [options]="tiledWebMapOptions"></chart>'
    };
  }

  private makeContour(): ChartExample {
    return {
      title: 'Contour chart',
      description: 'Highcharts 12+ contour series from a metric surface.',
      options: this.createLiveContourOptions(),
      html: '<chart [options]="contourOptions"></chart>'
    };
  }

  private makeRenko(): ChartExample {
    return {
      title: 'Renko chart',
      description: 'Highcharts 12+ Renko StockChart price bricks.',
      constructorType: 'StockChart',
      options: this.createLiveRenkoOptions(),
      html: '<chart [type]="\'StockChart\'" [options]="renkoOptions"></chart>'
    };
  }

  private makePointAndFigure(): ChartExample {
    return {
      title: 'Point and figure chart',
      description: 'Highcharts 12+ point and figure StockChart.',
      constructorType: 'StockChart',
      options: this.createLivePointAndFigureOptions(),
      html: '<chart [type]="\'StockChart\'" [options]="pointAndFigureOptions"></chart>'
    };
  }

  onDynamicChartCreate(example: ChartExample, chart: any) {
    if (!example || !example.key) {
      return;
    }

    this.dynamicCharts[example.key] = chart;
    this.updateDynamicChart(example.key);
  }

  private updateAllDynamicCharts() {
    for (var i = 0; i < this.dynamicExamples.length; i++) {
      var example = this.dynamicExamples[i];
      if (example && example.key) {
        this.updateDynamicChart(example.key);
      }
    }
  }

  private updateDynamicChart(key: string) {
    var chart = this.dynamicCharts[key];
    var options = this.createDynamicOptionsByKey(key);

    if (!chart || !chart.series || !options) {
      return;
    }

    if (chart.setTitle) {
      chart.setTitle(options.title || null, options.subtitle || null, false);
    }

    this.syncDynamicCategories(chart, options);
    this.syncDynamicSeries(chart, options.series || []);

    if (chart.redraw) {
      chart.redraw();
    }
  }

  private syncDynamicCategories(chart: any, options: any) {
    var xAxisOptions = options.xAxis;
    var yAxisOptions = options.yAxis;

    if (xAxisOptions && xAxisOptions.categories && chart.xAxis && chart.xAxis[0] && chart.xAxis[0].setCategories) {
      chart.xAxis[0].setCategories(xAxisOptions.categories, false);
    }

    if (yAxisOptions && yAxisOptions.categories && chart.yAxis && chart.yAxis[0] && chart.yAxis[0].setCategories) {
      chart.yAxis[0].setCategories(yAxisOptions.categories, false);
    }
  }

  private syncDynamicSeries(chart: any, seriesOptions: any[]) {
    var i: number;

    for (i = chart.series.length - 1; i >= seriesOptions.length; i--) {
      chart.series[i].remove(false);
    }

    for (i = 0; i < seriesOptions.length; i++) {
      var nextSeries = seriesOptions[i] || {};
      var currentSeries = chart.series[i];

      if (!currentSeries) {
        chart.addSeries(nextSeries, false, false);
        continue;
      }

      if (nextSeries.name && currentSeries.name !== nextSeries.name && currentSeries.update) {
        currentSeries.update({ name: nextSeries.name }, false);
      }

      this.updateDynamicSeriesData(chart, currentSeries, nextSeries);
    }
  }

  private updateDynamicSeriesData(chart: any, currentSeries: any, nextSeries: any) {
    var nextType = String(nextSeries.type || currentSeries.type || '').toLowerCase();

    if (this.shouldRebuildDynamicSeries(nextType)) {
      this.removeAndAddDynamicSeries(chart, currentSeries, nextSeries);
      return;
    }

    if (currentSeries.setData) {
      try {
        currentSeries.setData(nextSeries.data || [], false, false);
        return;
      } catch (error) {
        this.replaceDynamicSeries(chart, currentSeries, nextSeries);
        return;
      }
    }

    if (currentSeries.update) {
      currentSeries.update(nextSeries, false);
    }
  }

  private shouldRebuildDynamicSeries(seriesType: string) {
    return seriesType === 'renko' || seriesType === 'pointandfigure' || seriesType === 'treegraph';
  }

  private removeAndAddDynamicSeries(chart: any, currentSeries: any, nextSeries: any) {
    if (currentSeries.remove && chart.addSeries) {
      currentSeries.remove(false);
      chart.addSeries(nextSeries, false, false);
      return;
    }

    this.replaceDynamicSeries(chart, currentSeries, nextSeries);
  }

  private replaceDynamicSeries(chart: any, currentSeries: any, nextSeries: any) {
    if (currentSeries.update) {
      try {
        currentSeries.update(nextSeries, false);
        return;
      } catch (error) {
        // Some Highcharts derived series cannot be safely mutated in place.
      }
    }

    if (currentSeries.remove && chart.addSeries) {
      currentSeries.remove(false);
      chart.addSeries(nextSeries, false, false);
    }
  }

  private createDynamicOptionsByKey(key: string) {
    switch (key) {
      case 'liveLineOptions':
        return this.createLiveLineOptions();
      case 'liveSplineOptions':
        return this.createLiveSplineOptions();
      case 'liveAreaOptions':
        return this.createLiveAreaOptions();
      case 'liveAreasplineOptions':
        return this.createLiveAreasplineOptions();
      case 'liveColumnOptions':
        return this.createLiveColumnOptions();
      case 'liveBarOptions':
        return this.createLiveBarOptions();
      case 'liveStackedOptions':
        return this.createLiveStackedOptions();
      case 'livePieOptions':
        return this.createLivePieOptions();
      case 'liveDonutOptions':
        return this.createLiveDonutOptions();
      case 'liveScatterOptions':
        return this.createLiveScatterOptions();
      case 'liveBubbleOptions':
        return this.createLiveBubbleOptions();
      case 'liveComboOptions':
        return this.createLiveComboOptions();
      case 'livePolarOptions':
        return this.createLivePolarOptions();
      case 'liveGaugeOptions':
        return this.createLiveGaugeOptions();
      case 'liveSolidGaugeOptions':
        return this.createLiveSolidGaugeOptions();
      case 'liveHeatmapOptions':
        return this.createLiveHeatmapOptions();
      case 'liveTreemapOptions':
        return this.createLiveTreemapOptions();
      case 'liveFunnelOptions':
        return this.createLiveFunnelOptions();
      case 'live3dColumnOptions':
        return this.createLive3dColumnOptions();
      case 'liveCylinderOptions':
        return this.createLiveCylinderOptions();
      case 'liveFunnel3dOptions':
        return this.createLiveFunnel3dOptions();
      case 'livePyramid3dOptions':
        return this.createLivePyramid3dOptions();
      case 'liveDotplotOptions':
        return this.createLiveDotplotOptions();
      case 'livePackedBubbleOptions':
        return this.createLivePackedBubbleOptions();
      case 'liveParallelCoordinatesOptions':
        return this.createLiveParallelCoordinatesOptions();
      case 'liveHeikinAshiOptions':
        return this.createLiveHeikinAshiOptions();
      case 'liveHollowCandlestickOptions':
        return this.createLiveHollowCandlestickOptions();
      case 'liveVectorOptions':
        return this.createLiveVectorOptions();
      case 'liveWindbarbOptions':
        return this.createLiveWindbarbOptions();
      case 'liveFlowmapOptions':
        return this.createLiveFlowmapOptions();
      case 'liveGeoHeatmapOptions':
        return this.createLiveGeoHeatmapOptions();
      case 'livePictorialOptions':
        return this.createLivePictorialOptions();
      case 'liveContourOptions':
        return this.createLiveContourOptions();
      case 'liveRenkoOptions':
        return this.createLiveRenkoOptions();
      case 'livePointAndFigureOptions':
        return this.createLivePointAndFigureOptions();
      default:
        return null;
    }
  }

  onCreate(name: string, chart: any) {
    this.record(name + ' created with ' + chart.series.length + ' series');
  }

  record(message: string) {
    this.events.unshift(new Date().toLocaleTimeString() + ' - ' + message);
    this.events = this.events.slice(0, 8);
  }

  randomizeDynamicChart() {
    this.dynamicData = this.dynamicData.map(function () {
      return Math.round(20 + Math.random() * 90);
    });
    this.dynamicOptions = this.createDynamicOptions();
  }

  private makeBasic(title: string, description: string, type: string): ChartExample {
    return {
      title: title,
      description: description,
      options: {
        chart: { type: type, height: 320 },
        title: { text: title },
        subtitle: { text: '@stackline/angular-highcharts Angular 18 live test' },
        xAxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
        yAxis: { title: { text: 'Requests' } },
        series: [
          { name: 'API', data: [29, 42, 55, 61, 73, 88] },
          { name: 'Dashboard', data: [18, 31, 37, 46, 58, 63] }
        ]
      },
      html: '<chart [options]="' + type + 'Options"></chart>'
    };
  }

  private createBinanceOptions() {
    var theme = this.getBinanceChartTheme();
    var isMobile = this.isMobileViewport();
    var pricePaneHeight = isMobile ? '84%' : '68%';
    var volumePaneTop = isMobile ? '87%' : '73%';
    var volumePaneHeight = isMobile ? '10%' : '22%';

    return {
      chart: {
        height: isMobile ? 540 : 560,
        alignTicks: !isMobile,
        backgroundColor: theme.background,
        plotBackgroundColor: theme.plotBackground,
        margin: isMobile ? [8, 8, 24, 4] : undefined,
        marginTop: isMobile ? 8 : undefined,
        marginRight: isMobile ? 8 : undefined,
        marginBottom: isMobile ? 24 : undefined,
        marginLeft: isMobile ? 4 : undefined,
        spacing: isMobile ? [4, 4, 4, 4] : [16, 20, 18, 12],
        spacingTop: isMobile ? 0 : undefined,
        spacingRight: isMobile ? 0 : undefined,
        spacingBottom: isMobile ? 0 : undefined,
        spacingLeft: isMobile ? 0 : undefined,
        style: {
          fontFamily: 'Arial, Helvetica, sans-serif'
        }
      },
      credits: { enabled: false },
      rangeSelector: { enabled: false },
      navigator: {
        enabled: false
      },
      scrollbar: {
        enabled: false
      },
      title: {
        text: isMobile ? '' : this.binanceSymbol + ' live candles',
        align: 'left',
        style: { color: theme.title, fontSize: '16px', fontWeight: '600' }
      },
      subtitle: {
        text: isMobile ? '' : 'REST history + Binance WebSocket updates (' + this.binanceInterval + ')',
        align: 'left',
        style: { color: theme.subtitle }
      },
      legend: {
        enabled: !isMobile,
        align: 'left',
        verticalAlign: 'top',
        itemStyle: { color: theme.legend },
        itemHoverStyle: { color: theme.legendHover }
      },
      xAxis: {
        lineColor: theme.axisLine,
        tickColor: theme.axisLine,
        gridLineColor: theme.grid,
        labels: { style: { color: theme.axisText, fontSize: isMobile ? '9px' : undefined } },
        crosshair: {
          color: theme.crosshair,
          dashStyle: 'Dash'
        }
      },
      yAxis: [{
        height: pricePaneHeight,
        lineColor: theme.axisLine,
        gridLineColor: theme.grid,
        startOnTick: !isMobile,
        endOnTick: !isMobile,
        minPadding: isMobile ? 0.01 : undefined,
        maxPadding: isMobile ? 0.01 : undefined,
        opposite: true,
        title: { text: null },
        labels: { style: { color: theme.axisText, fontSize: isMobile ? '9px' : undefined } }
      }, {
        top: volumePaneTop,
        height: volumePaneHeight,
        offset: 0,
        lineColor: theme.axisLine,
        gridLineColor: theme.grid,
        startOnTick: false,
        endOnTick: false,
        opposite: true,
        title: { text: isMobile ? null : 'Volume', style: { color: theme.axisText } },
        labels: { style: { color: theme.axisText, fontSize: isMobile ? '9px' : undefined } }
      }],
      tooltip: {
        shared: true,
        backgroundColor: theme.tooltipBackground,
        borderColor: theme.tooltipBorder,
        style: { color: theme.tooltipText },
        valueDecimals: 4
      },
      plotOptions: {
        candlestick: {
          color: '#f6465d',
          upColor: '#02c076',
          lineColor: '#f6465d',
          upLineColor: '#02c076'
        },
        column: {
          borderWidth: 0,
          groupPadding: 0.08,
          pointPadding: 0.02
        },
        series: {
          animation: false,
          turboThreshold: 0
        }
      },
      series: [{
        type: 'candlestick',
        name: 'Price',
        data: [],
        tooltip: { valueDecimals: 4 }
      }, {
        type: 'line',
        name: 'MA(7)',
        data: [],
        color: '#f5d300',
        lineWidth: 1,
        marker: { enabled: false }
      }, {
        type: 'line',
        name: 'MA(25)',
        data: [],
        color: '#ff4ec9',
        lineWidth: 1,
        marker: { enabled: false }
      }, {
        type: 'line',
        name: 'MA(99)',
        data: [],
        color: '#8e44ad',
        lineWidth: 1,
        marker: { enabled: false }
      }, {
        type: 'column',
        name: 'Volume',
        data: [],
        yAxis: 1
      }]
    };
  }

  private isMobileViewport() {
    return typeof window !== 'undefined' && window.innerWidth <= 760;
  }

  private getBinanceChartTheme() {
    if (this.binanceTheme === 'light') {
      return {
        background: '#ffffff',
        plotBackground: '#ffffff',
        title: '#101828',
        subtitle: '#667085',
        legend: '#475467',
        legendHover: '#101828',
        axisText: '#667085',
        axisLine: '#d0d5dd',
        grid: '#edf2f7',
        crosshair: '#98a2b3',
        tooltipBackground: 'rgba(255, 255, 255, .96)',
        tooltipBorder: '#d0d5dd',
        tooltipText: '#101828'
      };
    }

    return {
      background: '#050505',
      plotBackground: '#050505',
      title: '#f5f5f5',
      subtitle: '#8a8f98',
      legend: '#b7bcc7',
      legendHover: '#ffffff',
      axisText: '#aeb4bd',
      axisLine: '#333842',
      grid: '#1d2026',
      crosshair: '#565b66',
      tooltipBackground: 'rgba(12, 15, 20, .94)',
      tooltipBorder: '#313640',
      tooltipText: '#f5f5f5'
    };
  }

  private makeStackedColumn(): ChartExample {
    return {
      title: 'Stacked column',
      description: 'Column stacking with normal Highcharts options.',
      options: {
        chart: { type: 'column', height: 320 },
        title: { text: 'Stacked column' },
        xAxis: { categories: ['Ops', 'Sales', 'Support', 'Finance'] },
        yAxis: { min: 0, title: { text: 'Total work' }, stackLabels: { enabled: true } },
        plotOptions: { column: { stacking: 'normal' } },
        series: [
          { name: 'Planned', data: [5, 3, 4, 7] },
          { name: 'Active', data: [2, 2, 3, 2] },
          { name: 'Closed', data: [3, 4, 4, 2] }
        ]
      },
      html: '<chart [options]="stackedColumnOptions"></chart>'
    };
  }

  private makePie(): ChartExample {
    return {
      title: 'Pie chart',
      description: 'Classic proportional distribution.',
      options: {
        chart: { type: 'pie', height: 320 },
        title: { text: 'Traffic sources' },
        series: [{ name: 'Share', data: [['Direct', 42], ['Search', 33], ['Referral', 15], ['Campaign', 10]] }]
      },
      html: '<chart [options]="pieOptions"></chart>'
    };
  }

  private makeDonut(): ChartExample {
    return {
      title: 'Donut chart',
      description: 'Pie chart with innerSize.',
      options: {
        chart: { type: 'pie', height: 320 },
        title: { text: 'Device mix' },
        plotOptions: { pie: { innerSize: '55%' } },
        series: [{ name: 'Devices', data: [['Desktop', 48], ['Mobile', 44], ['Tablet', 8]] }]
      },
      html: '<chart [options]="donutOptions"></chart>'
    };
  }

  private makeScatter(): ChartExample {
    return {
      title: 'Scatter chart',
      description: 'XY tuple data.',
      options: {
        chart: { type: 'scatter', zoomType: 'xy', height: 320 },
        title: { text: 'Quality vs speed' },
        xAxis: { title: { text: 'Speed' } },
        yAxis: { title: { text: 'Quality' } },
        series: [{ name: 'Builds', data: [[12, 80], [18, 78], [24, 86], [32, 84], [40, 91], [46, 88]] }]
      },
      html: '<chart [options]="scatterOptions"></chart>'
    };
  }

  private makeBubble(): ChartExample {
    return {
      title: 'Bubble chart',
      description: 'Uses highcharts-more module.',
      options: {
        chart: { type: 'bubble', plotBorderWidth: 1, zoomType: 'xy', height: 320 },
        title: { text: 'Impact matrix' },
        xAxis: { title: { text: 'Effort' } },
        yAxis: { title: { text: 'Value' } },
        series: [{ name: 'Initiatives', data: [[9, 81, 63], [98, 5, 89], [51, 50, 73], [41, 22, 14], [58, 24, 20]] }]
      },
      html: '<chart [options]="bubbleOptions"></chart>'
    };
  }

  private makeCombination(): ChartExample {
    return {
      title: 'Combination chart',
      description: 'Column, spline and pie in one options object.',
      options: {
        title: { text: 'Mixed metrics' },
        chart: { height: 320 },
        xAxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May'] },
        labels: { items: [{ html: 'Total', style: { left: '50px', top: '18px', color: '#333' } }] },
        series: [
          { type: 'column', name: 'Revenue', data: [3, 2, 1, 3, 4] },
          { type: 'spline', name: 'Trend', data: [2.4, 2.7, 3.1, 3.8, 4.3] },
          {
            type: 'pie',
            name: 'Share',
            data: [{ name: 'A', y: 13 }, { name: 'B', y: 23 }, { name: 'C', y: 19 }],
            center: [80, 55],
            size: 90,
            showInLegend: false,
            dataLabels: { enabled: false }
          }
        ]
      },
      html: '<chart [options]="combinationOptions"></chart>'
    };
  }

  private makePolar(): ChartExample {
    return {
      title: 'Polar/radar chart',
      description: 'Uses highcharts-more with polar chart options.',
      options: {
        chart: { polar: true, type: 'line', height: 320 },
        title: { text: 'Team coverage' },
        pane: { size: '80%' },
        xAxis: { categories: ['UX', 'API', 'Ops', 'QA', 'Docs'], tickmarkPlacement: 'on', lineWidth: 0 },
        yAxis: { gridLineInterpolation: 'polygon', lineWidth: 0, min: 0 },
        series: [{ name: 'Score', data: [5, 4, 3, 5, 4], pointPlacement: 'on' }]
      },
      html: '<chart [options]="polarOptions"></chart>'
    };
  }

  private makeGauge(): ChartExample {
    return {
      title: 'Gauge chart',
      description: 'Gauge series from highcharts-more.',
      options: {
        chart: { type: 'gauge', height: 320 },
        title: { text: 'Availability' },
        pane: { startAngle: -150, endAngle: 150 },
        yAxis: { min: 0, max: 100, title: { text: 'Uptime' } },
        series: [{ name: 'Uptime', data: [92] }]
      },
      html: '<chart [options]="gaugeOptions"></chart>'
    };
  }

  private makeSolidGauge(): ChartExample {
    return {
      title: 'Solid gauge',
      description: 'Uses highcharts-more and solid-gauge modules.',
      options: {
        chart: { type: 'solidgauge', height: 320 },
        title: { text: 'Completion' },
        pane: {
          center: ['50%', '60%'],
          size: '90%',
          startAngle: -90,
          endAngle: 90,
          background: { backgroundColor: '#eef3f8', innerRadius: '60%', outerRadius: '100%', shape: 'arc' }
        },
        yAxis: {
          min: 0,
          max: 100,
          stops: [[0.3, '#d9534f'], [0.7, '#f0ad4e'], [0.9, '#2f8f68']],
          lineWidth: 0,
          tickWidth: 0,
          minorTickInterval: null,
          tickAmount: 2,
          title: { text: null }
        },
        series: [{ name: 'Done', data: [76] }]
      },
      html: '<chart [options]="solidGaugeOptions"></chart>'
    };
  }

  private makeHeatmap(): ChartExample {
    return {
      title: 'Heatmap',
      description: 'Uses the heatmap module.',
      options: {
        chart: { type: 'heatmap', height: 320 },
        title: { text: 'Weekly activity' },
        xAxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
        yAxis: { categories: ['AM', 'PM'], title: null },
        colorAxis: { min: 0, minColor: '#ffffff', maxColor: '#1f78b4' },
        series: [{
          name: 'Activity',
          borderWidth: 1,
          data: [[0, 0, 4], [1, 0, 7], [2, 0, 9], [3, 0, 5], [4, 0, 6], [0, 1, 6], [1, 1, 3], [2, 1, 8], [3, 1, 4], [4, 1, 10]],
          dataLabels: { enabled: true, color: '#333' }
        }]
      },
      html: '<chart [options]="heatmapOptions"></chart>'
    };
  }

  private makeTreemap(): ChartExample {
    return {
      title: 'Treemap',
      description: 'Uses the treemap module.',
      options: {
        chart: { type: 'treemap', height: 320 },
        title: { text: 'Cost centers' },
        series: [{
          type: 'treemap',
          layoutAlgorithm: 'squarified',
          data: [
            { name: 'Engineering', value: 6, color: '#2f7ed8' },
            { name: 'Support', value: 4, color: '#0d9488' },
            { name: 'Sales', value: 5, color: '#f59e0b' },
            { name: 'Ops', value: 3, color: '#64748b' }
          ]
        }]
      },
      html: '<chart [options]="treemapOptions"></chart>'
    };
  }

  private makeFunnel(): ChartExample {
    return {
      title: 'Funnel chart',
      description: 'Uses the funnel module.',
      options: {
        chart: { type: 'funnel', height: 320 },
        title: { text: 'Pipeline' },
        series: [{ name: 'Leads', data: [['New', 156], ['Qualified', 92], ['Proposal', 48], ['Closed', 21]] }]
      },
      html: '<chart [options]="funnelOptions"></chart>'
    };
  }

  private make3dColumn(): ChartExample {
    return {
      title: '3D column',
      description: 'Uses the highcharts-3d module.',
      options: {
        chart: { type: 'column', height: 320, options3d: { enabled: true, alpha: 12, beta: 12, depth: 45 } },
        title: { text: '3D volume' },
        xAxis: { categories: ['A', 'B', 'C', 'D'] },
        yAxis: { title: { text: 'Volume' } },
        series: [{ name: 'Volume', data: [7, 5, 9, 6] }]
      },
      html: '<chart [options]="column3dOptions"></chart>'
    };
  }

  private makeStockChart(): ChartExample {
    return {
      title: 'StockChart constructor',
      description: 'Uses [type]="StockChart" after loading the stock module.',
      constructorType: 'StockChart',
      options: {
        chart: { height: 320 },
        title: { text: 'Stock-style timeline' },
        rangeSelector: { selected: 1 },
        series: [{
          name: 'Price',
          data: [
            [Date.UTC(2026, 0, 1), 12],
            [Date.UTC(2026, 1, 1), 15],
            [Date.UTC(2026, 2, 1), 14],
            [Date.UTC(2026, 3, 1), 18],
            [Date.UTC(2026, 4, 1), 21],
            [Date.UTC(2026, 5, 1), 20]
          ]
        }]
      },
      html: '<chart [type]="StockChart" [options]="stockOptions"></chart>'
    };
  }

  private makeMapLikeChart(): ChartExample {
    return {
      title: 'Map module',
      description: 'Uses the map module with simple inline mapData.',
      options: {
        chart: { type: 'map', height: 320 },
        title: { text: 'Simple territory map' },
        colorAxis: { min: 0 },
        series: [{
          type: 'map',
          name: 'Score',
          mapData: [
            { path: 'M 0 0 L 120 0 L 120 80 L 0 80 Z', name: 'North', value: 10 },
            { path: 'M 130 0 L 250 0 L 250 80 L 130 80 Z', name: 'South', value: 7 },
            { path: 'M 65 90 L 185 90 L 185 170 L 65 170 Z', name: 'Central', value: 13 }
          ],
          dataLabels: { enabled: true, format: '{point.name}' }
        }]
      },
      html: '<chart [options]="mapOptions"></chart>'
    };
  }

  private makeNoDataChart(): ChartExample {
    return {
      title: 'No data state',
      description: 'Uses no-data-to-display module.',
      options: {
        chart: { type: 'line', height: 320 },
        title: { text: 'Empty state' },
        lang: { noData: 'No chart data yet' },
        noData: { style: { fontWeight: '600', fontSize: '15px', color: '#50677d' } },
        series: []
      },
      html: '<chart [options]="noDataOptions"></chart>'
    };
  }

  private makeSankey(): ChartExample {
    return {
      title: 'Sankey flow',
      description: 'Flow weights between operational stages.',
      options: {
        chart: { height: 320 },
        title: { text: 'Support flow' },
        series: [{
          type: 'sankey',
          name: 'Tickets',
          keys: ['from', 'to', 'weight'],
          data: [
            ['Intake', 'Triage', 24],
            ['Triage', 'Engineering', 12],
            ['Triage', 'Support', 8],
            ['Engineering', 'Resolved', 9],
            ['Support', 'Resolved', 7],
            ['Engineering', 'Backlog', 3]
          ]
        }]
      },
      html: '<chart [options]="sankeyFlowOptions"></chart>'
    };
  }

  private makeDependencyWheel(): ChartExample {
    return {
      title: 'Dependency wheel',
      description: 'Circular dependency relationships from the dependency-wheel module.',
      options: {
        chart: { height: 340 },
        title: { text: 'Team dependencies' },
        series: [{
          type: 'dependencywheel',
          name: 'Handoffs',
          keys: ['from', 'to', 'weight'],
          data: [
            ['Design', 'Frontend', 5],
            ['Frontend', 'API', 4],
            ['API', 'Data', 3],
            ['Data', 'QA', 2],
            ['QA', 'Design', 1]
          ],
          dataLabels: { color: '#333' }
        }]
      },
      html: '<chart [options]="dependencyWheelOptions"></chart>'
    };
  }

  private makeNetworkGraph(): ChartExample {
    return {
      title: 'Network graph',
      description: 'Relationship graph with stable layout settings.',
      options: {
        chart: { type: 'networkgraph', height: 340 },
        title: { text: 'Service map' },
        plotOptions: {
          networkgraph: {
            layoutAlgorithm: {
              enableSimulation: false,
              integration: 'verlet'
            }
          }
        },
        series: [{
          dataLabels: { enabled: true, linkFormat: '' },
          data: [
            ['Gateway', 'Auth'],
            ['Gateway', 'Catalog'],
            ['Catalog', 'Search'],
            ['Catalog', 'Billing'],
            ['Billing', 'Ledger'],
            ['Search', 'Cache']
          ]
        }]
      },
      html: '<chart [options]="networkGraphOptions"></chart>'
    };
  }

  private makeSunburst(): ChartExample {
    return {
      title: 'Sunburst',
      description: 'Hierarchical radial breakdown from the sunburst module.',
      options: {
        chart: { height: 340 },
        title: { text: 'Product areas' },
        series: [{
          type: 'sunburst',
          data: [
            { id: 'root', parent: '', name: 'Product' },
            { id: 'platform', parent: 'root', name: 'Platform' },
            { id: 'apps', parent: 'root', name: 'Apps' },
            { id: 'api', parent: 'platform', name: 'API', value: 5 },
            { id: 'jobs', parent: 'platform', name: 'Jobs', value: 3 },
            { id: 'admin', parent: 'apps', name: 'Admin', value: 4 },
            { id: 'reports', parent: 'apps', name: 'Reports', value: 2 }
          ],
          allowDrillToNode: true,
          dataLabels: { format: '{point.name}' }
        }]
      },
      html: '<chart [options]="sunburstOptions"></chart>'
    };
  }

  private makeWordcloud(): ChartExample {
    return {
      title: 'Word cloud',
      description: 'Weighted text visualization from the wordcloud module.',
      options: {
        chart: { height: 320 },
        title: { text: 'Feedback themes' },
        series: [{
          type: 'wordcloud',
          name: 'Mentions',
          data: [
            { name: 'Performance', weight: 18 },
            { name: 'Accessibility', weight: 14 },
            { name: 'Charts', weight: 12 },
            { name: 'Realtime', weight: 10 },
            { name: 'Angular', weight: 9 },
            { name: 'Docs', weight: 8 }
          ]
        }]
      },
      html: '<chart [options]="wordcloudOptions"></chart>'
    };
  }

  private makeXRange(): ChartExample {
    return {
      title: 'X-range timeline',
      description: 'Horizontal time spans from the xrange module.',
      options: {
        chart: { type: 'xrange', height: 320 },
        title: { text: 'Release plan' },
        xAxis: { type: 'datetime' },
        yAxis: { categories: ['Design', 'Build', 'QA'], reversed: true, title: null },
        series: [{
          name: 'Work',
          borderColor: '#d0d5dd',
          pointWidth: 20,
          data: [
            { x: Date.UTC(2026, 0, 1), x2: Date.UTC(2026, 0, 12), y: 0, name: 'Design' },
            { x: Date.UTC(2026, 0, 10), x2: Date.UTC(2026, 0, 28), y: 1, name: 'Build' },
            { x: Date.UTC(2026, 0, 24), x2: Date.UTC(2026, 1, 5), y: 2, name: 'QA' }
          ]
        }]
      },
      html: '<chart [options]="xRangeTimelineOptions"></chart>'
    };
  }

  private makeTimeline(): ChartExample {
    return {
      title: 'Timeline',
      description: 'Milestone timeline from the timeline module.',
      options: {
        chart: { type: 'timeline', height: 320 },
        title: { text: 'Release milestones' },
        xAxis: { visible: false },
        yAxis: { visible: false },
        series: [{
          data: [
            { name: 'Scope', label: 'Scope locked', description: 'Requirements finalized' },
            { name: 'Build', label: 'Build complete', description: 'Feature branch merged' },
            { name: 'Release', label: 'Release', description: 'Production rollout' }
          ]
        }]
      },
      html: '<chart [options]="timelineOptions"></chart>'
    };
  }

  private makeVariwide(): ChartExample {
    return {
      title: 'Variwide',
      description: 'Column width represents a second dimension.',
      options: {
        chart: { type: 'variwide', height: 320 },
        title: { text: 'Revenue by segment size' },
        xAxis: { type: 'category' },
        series: [{
          name: 'Revenue',
          data: [
            { name: 'SMB', y: 42, z: 80 },
            { name: 'Mid-market', y: 64, z: 55 },
            { name: 'Enterprise', y: 88, z: 30 }
          ]
        }]
      },
      html: '<chart [options]="variwideOptions"></chart>'
    };
  }

  private makeVariablePie(): ChartExample {
    return {
      title: 'Variable pie',
      description: 'Slice angle and radius carry separate values.',
      options: {
        chart: { type: 'variablepie', height: 320 },
        title: { text: 'Channel quality' },
        series: [{
          minPointSize: 10,
          innerSize: '20%',
          zMin: 0,
          name: 'Channels',
          data: [
            { name: 'Direct', y: 35, z: 80 },
            { name: 'Search', y: 42, z: 65 },
            { name: 'Referral', y: 18, z: 45 },
            { name: 'Email', y: 12, z: 30 }
          ]
        }]
      },
      html: '<chart [options]="variablePieOptions"></chart>'
    };
  }

  private makeItemSeries(): ChartExample {
    return {
      title: 'Item series',
      description: 'Item icons used for compact composition charts.',
      options: {
        chart: { type: 'item', height: 320 },
        title: { text: 'Work split' },
        legend: { labelFormat: '{name} <span style="opacity: 0.6">{y}</span>' },
        series: [{
          name: 'Tasks',
          data: [
            ['Frontend', 12],
            ['Backend', 10],
            ['QA', 6],
            ['Docs', 4]
          ]
        }]
      },
      html: '<chart [options]="itemSeriesOptions"></chart>'
    };
  }

  private makeStreamgraph(): ChartExample {
    return {
      title: 'Streamgraph',
      description: 'Stacked flow over time from the streamgraph module.',
      options: {
        chart: { type: 'streamgraph', height: 340 },
        title: { text: 'Capacity stream' },
        xAxis: { categories: ['W1', 'W2', 'W3', 'W4', 'W5'] },
        series: [
          { name: 'Build', data: [2, 3, 5, 4, 6] },
          { name: 'Review', data: [1, 2, 2, 3, 2] },
          { name: 'Support', data: [3, 2, 3, 2, 1] }
        ]
      },
      html: '<chart [options]="streamgraphOptions"></chart>'
    };
  }

  private makeBullet(): ChartExample {
    return {
      title: 'Bullet chart',
      description: 'Actual value with target marker from the bullet module.',
      options: {
        chart: { type: 'bullet', inverted: true, height: 260 },
        title: { text: 'SLA target' },
        xAxis: { categories: ['Response time'] },
        yAxis: { plotBands: [{ from: 0, to: 70, color: '#f5d4d4' }, { from: 70, to: 90, color: '#fff0c2' }, { from: 90, to: 100, color: '#d9f2e6' }], title: null },
        series: [{ data: [{ y: 92, target: 95 }] }]
      },
      html: '<chart [options]="bulletOptions"></chart>'
    };
  }

  private makeDumbbell(): ChartExample {
    return {
      title: 'Dumbbell chart',
      description: 'Before/after comparison from the dumbbell module.',
      options: {
        chart: { type: 'dumbbell', inverted: true, height: 320 },
        title: { text: 'Before and after' },
        xAxis: { type: 'category' },
        yAxis: { title: { text: 'Score' } },
        series: [{
          name: 'Score',
          data: [
            { name: 'API', low: 62, high: 84 },
            { name: 'Docs', low: 48, high: 76 },
            { name: 'QA', low: 55, high: 80 }
          ]
        }]
      },
      html: '<chart [options]="dumbbellOptions"></chart>'
    };
  }

  private makeLollipop(): ChartExample {
    return {
      title: 'Lollipop chart',
      description: 'Lollipop series for compact ranked data.',
      options: {
        chart: { type: 'lollipop', height: 320 },
        title: { text: 'Queue size' },
        xAxis: { type: 'category' },
        series: [{ name: 'Items', data: [['API', 12], ['UI', 8], ['QA', 5], ['Docs', 3]] }]
      },
      html: '<chart [options]="lollipopOptions"></chart>'
    };
  }

  private makePareto(): ChartExample {
    return {
      title: 'Pareto chart',
      description: 'Pareto line linked to a base column series.',
      options: {
        chart: { height: 320 },
        title: { text: 'Issue causes' },
        xAxis: { categories: ['Config', 'Data', 'Network', 'Auth', 'UI'] },
        yAxis: [{ title: { text: 'Count' } }, { title: { text: 'Cumulative %' }, opposite: true }],
        series: [
          { type: 'column', id: 'issues', name: 'Issues', data: [45, 26, 17, 9, 6] },
          { type: 'pareto', name: 'Pareto', linkedTo: 'issues', yAxis: 1, zIndex: 10 }
        ]
      },
      html: '<chart [options]="paretoOptions"></chart>'
    };
  }

  private makeHistogramBellcurve(): ChartExample {
    return {
      title: 'Histogram and bell curve',
      description: 'Generated statistical series linked to source data.',
      options: {
        chart: { height: 340 },
        title: { text: 'Build duration distribution' },
        xAxis: [{ title: { text: 'Duration' } }, { title: { text: 'Histogram' }, opposite: true }],
        yAxis: [{ title: { text: 'Count' } }, { title: { text: 'Bell curve' }, opposite: true }],
        series: [
          { type: 'scatter', id: 'duration', name: 'Samples', data: [8, 9, 9, 10, 11, 11, 12, 13, 14, 16, 18, 21], visible: false },
          { type: 'histogram', name: 'Histogram', xAxis: 1, yAxis: 0, baseSeries: 'duration', zIndex: -1 },
          { type: 'bellcurve', name: 'Bell curve', xAxis: 0, yAxis: 1, baseSeries: 'duration', zIndex: 1 }
        ]
      },
      html: '<chart [options]="histogramBellcurveOptions"></chart>'
    };
  }

  private makeTilemap(): ChartExample {
    return {
      title: 'Tilemap',
      description: 'Tile heatmap using the tilemap module.',
      options: {
        chart: { type: 'tilemap', height: 320 },
        title: { text: 'Weekly load tiles' },
        xAxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu'] },
        yAxis: { categories: ['AM', 'PM'], title: null },
        colorAxis: { min: 0, minColor: '#e8f4ff', maxColor: '#146c94' },
        series: [{
          name: 'Load',
          tileShape: 'hexagon',
          data: [
            { x: 0, y: 0, value: 4, name: 'Mon AM' },
            { x: 1, y: 0, value: 7, name: 'Tue AM' },
            { x: 2, y: 0, value: 5, name: 'Wed AM' },
            { x: 3, y: 0, value: 8, name: 'Thu AM' },
            { x: 0, y: 1, value: 6, name: 'Mon PM' },
            { x: 1, y: 1, value: 3, name: 'Tue PM' },
            { x: 2, y: 1, value: 9, name: 'Wed PM' },
            { x: 3, y: 1, value: 5, name: 'Thu PM' }
          ]
        }]
      },
      html: '<chart [options]="tilemapOptions"></chart>'
    };
  }

  private makeVenn(): ChartExample {
    return {
      title: 'Venn diagram',
      description: 'Set overlap visualization from the venn module.',
      options: {
        chart: { type: 'venn', height: 320 },
        title: { text: 'Audience overlap' },
        series: [{
          data: [
            { sets: ['Admins'], value: 12 },
            { sets: ['Analysts'], value: 10 },
            { sets: ['Operators'], value: 8 },
            { sets: ['Admins', 'Analysts'], value: 4 },
            { sets: ['Analysts', 'Operators'], value: 3 },
            { sets: ['Admins', 'Operators'], value: 2 }
          ]
        }]
      },
      html: '<chart [options]="vennOptions"></chart>'
    };
  }

  private makeArcDiagram(): ChartExample {
    return {
      title: 'Arc diagram',
      description: 'Relationship arcs from the arc-diagram module.',
      options: {
        chart: { type: 'arcdiagram', height: 320 },
        title: { text: 'Module calls' },
        series: [{
          keys: ['from', 'to', 'weight'],
          data: [
            ['Core', 'Auth', 5],
            ['Core', 'Billing', 4],
            ['Auth', 'Profile', 3],
            ['Billing', 'Ledger', 2],
            ['Profile', 'Notifications', 2]
          ]
        }]
      },
      html: '<chart [options]="arcDiagramOptions"></chart>'
    };
  }

  private makeOrganization(): ChartExample {
    return {
      title: 'Organization chart',
      description: 'Org relationship chart from organization/pathfinder modules.',
      options: {
        chart: { type: 'organization', height: 360 },
        title: { text: 'Delivery ownership' },
        series: [{
          keys: ['from', 'to'],
          data: [
            ['Lead', 'Frontend'],
            ['Lead', 'Backend'],
            ['Lead', 'QA'],
            ['Backend', 'Data']
          ],
          nodes: [
            { id: 'Lead', title: 'Lead', name: 'Delivery' },
            { id: 'Frontend', title: 'UI', name: 'Frontend' },
            { id: 'Backend', title: 'API', name: 'Backend' },
            { id: 'QA', title: 'QA', name: 'Quality' },
            { id: 'Data', title: 'Data', name: 'Data' }
          ],
          colorByPoint: false
        }]
      },
      html: '<chart [options]="organizationOptions"></chart>'
    };
  }

  private makeCylinder(): ChartExample {
    return {
      title: 'Cylinder chart',
      description: '3D cylinder series from the cylinder module.',
      options: {
        chart: {
          type: 'cylinder',
          height: 340,
          options3d: { enabled: true, alpha: 15, beta: 15, depth: 50, viewDistance: 25 }
        },
        title: { text: 'Capacity by region' },
        xAxis: { categories: ['North', 'South', 'East', 'West'] },
        yAxis: { title: { text: 'Units' } },
        plotOptions: { series: { depth: 40, colorByPoint: true } },
        series: [{ name: 'Capacity', data: [42, 35, 28, 50] }]
      },
      html: '<chart [options]="cylinderOptions"></chart>'
    };
  }

  private makeFunnel3d(): ChartExample {
    return {
      title: 'Funnel 3D',
      description: '3D funnel series with depth and perspective.',
      options: {
        chart: {
          type: 'funnel3d',
          height: 360,
          options3d: { enabled: true, alpha: 10, depth: 50, viewDistance: 50 }
        },
        title: { text: 'Signup funnel' },
        plotOptions: {
          series: {
            neckWidth: '30%',
            neckHeight: '25%',
            width: '70%',
            height: '80%',
            dataLabels: { enabled: true, format: '<b>{point.name}</b>: {point.y}' }
          }
        },
        series: [{
          name: 'Users',
          data: [
            ['Visitors', 15654],
            ['Trials', 4064],
            ['Qualified', 1987],
            ['Customers', 976]
          ]
        }]
      },
      html: '<chart [options]="funnel3dOptions"></chart>'
    };
  }

  private makePyramid3d(): ChartExample {
    return {
      title: 'Pyramid 3D',
      description: '3D pyramid series for staged proportions.',
      options: {
        chart: {
          type: 'pyramid3d',
          height: 360,
          options3d: { enabled: true, alpha: 10, depth: 50, viewDistance: 50 }
        },
        title: { text: 'Support priority pyramid' },
        plotOptions: {
          series: {
            width: '70%',
            height: '80%',
            dataLabels: { enabled: true, format: '<b>{point.name}</b>: {point.y}' }
          }
        },
        series: [{
          name: 'Tickets',
          data: [
            ['Critical', 9],
            ['High', 24],
            ['Medium', 58],
            ['Low', 112]
          ]
        }]
      },
      html: '<chart [options]="pyramid3dOptions"></chart>'
    };
  }

  private makeDotplot(): ChartExample {
    return {
      title: 'Dot plot',
      description: 'Dotplot module for compact ranked counts.',
      options: {
        chart: { type: 'dotplot', height: 320 },
        title: { text: 'Deployments per team' },
        xAxis: { categories: ['Core', 'Web', 'Mobile', 'Data', 'QA'] },
        yAxis: { title: { text: 'Deployments' }, allowDecimals: false },
        series: [{ name: 'Deployments', data: [8, 12, 6, 10, 4] }]
      },
      html: '<chart [options]="dotplotOptions"></chart>'
    };
  }

  private makePackedBubble(): ChartExample {
    return {
      title: 'Packed bubble',
      description: 'Packed bubble from highcharts-more for grouped sizing.',
      options: {
        chart: { type: 'packedbubble', height: 360 },
        title: { text: 'Workload by domain' },
        tooltip: { pointFormat: '<b>{point.name}</b>: {point.value}' },
        plotOptions: {
          packedbubble: {
            minSize: '30%',
            maxSize: '95%',
            layoutAlgorithm: { splitSeries: false, gravitationalConstant: 0.04 }
          }
        },
        series: [{
          name: 'Product',
          data: [{ name: 'Roadmap', value: 18 }, { name: 'Research', value: 11 }]
        }, {
          name: 'Engineering',
          data: [{ name: 'API', value: 22 }, { name: 'Frontend', value: 19 }, { name: 'Platform', value: 15 }]
        }, {
          name: 'Support',
          data: [{ name: 'Tickets', value: 13 }, { name: 'Docs', value: 9 }]
        }]
      },
      html: '<chart [options]="packedBubbleOptions"></chart>'
    };
  }

  private makeParallelCoordinates(): ChartExample {
    return {
      title: 'Parallel coordinates',
      description: 'Parallel coordinates module comparing rows across metrics.',
      options: {
        chart: { parallelCoordinates: true, type: 'line', height: 360 },
        title: { text: 'Release comparison' },
        xAxis: { categories: ['Velocity', 'Quality', 'Risk', 'Coverage', 'Adoption'] },
        yAxis: { title: { text: null } },
        series: [
          { name: 'Release A', data: [8, 7, 3, 6, 8] },
          { name: 'Release B', data: [6, 9, 2, 8, 7] },
          { name: 'Release C', data: [9, 6, 5, 5, 9] }
        ]
      },
      html: '<chart [options]="parallelCoordinatesOptions"></chart>'
    };
  }

  private makeHeikinAshi(): ChartExample {
    var data = [
      [Date.UTC(2026, 0, 1), 653, 665, 645, 660],
      [Date.UTC(2026, 0, 2), 660, 672, 651, 668],
      [Date.UTC(2026, 0, 3), 668, 676, 658, 662],
      [Date.UTC(2026, 0, 4), 662, 670, 648, 652],
      [Date.UTC(2026, 0, 5), 652, 661, 640, 657],
      [Date.UTC(2026, 0, 6), 657, 681, 654, 678]
    ];
    return {
      title: 'Heikin Ashi',
      description: 'StockChart Heikin Ashi candles from the heikinashi module.',
      constructorType: 'StockChart',
      options: {
        chart: { height: 340 },
        title: { text: 'Heikin Ashi sample' },
        rangeSelector: { enabled: false },
        navigator: { enabled: false },
        scrollbar: { enabled: false },
        series: [{ type: 'heikinashi', name: 'BNB sample', data: data }]
      },
      html: '<chart [type]="\'StockChart\'" [options]="heikinAshiOptions"></chart>'
    };
  }

  private makeHollowCandlestick(): ChartExample {
    var data = [
      [Date.UTC(2026, 0, 1), 653, 665, 645, 660],
      [Date.UTC(2026, 0, 2), 660, 672, 651, 668],
      [Date.UTC(2026, 0, 3), 668, 676, 658, 662],
      [Date.UTC(2026, 0, 4), 662, 670, 648, 652],
      [Date.UTC(2026, 0, 5), 652, 661, 640, 657],
      [Date.UTC(2026, 0, 6), 657, 681, 654, 678]
    ];
    return {
      title: 'Hollow candlestick',
      description: 'StockChart hollow candle rendering from the hollowcandlestick module.',
      constructorType: 'StockChart',
      options: {
        chart: { height: 340 },
        title: { text: 'Hollow candlestick sample' },
        rangeSelector: { enabled: false },
        navigator: { enabled: false },
        scrollbar: { enabled: false },
        series: [{ type: 'hollowcandlestick', name: 'BNB sample', data: data }]
      },
      html: '<chart [type]="\'StockChart\'" [options]="hollowCandlestickOptions"></chart>'
    };
  }

  private makeVector(): ChartExample {
    return {
      title: 'Vector field',
      description: 'Vector module showing magnitude and direction.',
      options: {
        chart: { type: 'vector', height: 340 },
        title: { text: 'Regional movement vectors' },
        xAxis: { min: 0, max: 5, gridLineWidth: 1 },
        yAxis: { min: 0, max: 5, title: { text: null } },
        tooltip: { pointFormat: 'Length: <b>{point.length}</b><br>Direction: <b>{point.direction} deg</b>' },
        series: [{
          name: 'Movement',
          data: [
            [1, 1, 5, 45],
            [2, 2, 7, 90],
            [3, 1, 4, 135],
            [4, 3, 6, 210],
            [1, 4, 5, 300]
          ]
        }]
      },
      html: '<chart [options]="vectorOptions"></chart>'
    };
  }

  private makeWindbarb(): ChartExample {
    return {
      title: 'Wind barb',
      description: 'Windbarb module for speed and direction markers.',
      options: {
        chart: { height: 320 },
        title: { text: 'Wind samples' },
        xAxis: { type: 'datetime' },
        yAxis: { title: { text: 'Speed' } },
        series: [{
          type: 'windbarb',
          name: 'Wind',
          data: [
            { x: Date.UTC(2026, 0, 1), value: 4, direction: 45 },
            { x: Date.UTC(2026, 0, 2), value: 7, direction: 80 },
            { x: Date.UTC(2026, 0, 3), value: 5, direction: 120 },
            { x: Date.UTC(2026, 0, 4), value: 9, direction: 200 },
            { x: Date.UTC(2026, 0, 5), value: 6, direction: 260 }
          ],
          showInLegend: true
        }]
      },
      html: '<chart [options]="windbarbOptions"></chart>'
    };
  }

  private makeTreegraph(): ChartExample {
    return {
      title: 'Treegraph',
      description: 'Treegraph module for hierarchical relationships.',
      options: {
        chart: { type: 'treegraph', height: 380 },
        title: { text: 'Product hierarchy' },
        series: [{
          data: [
            { id: 'Platform' },
            { id: 'Core API', parent: 'Platform' },
            { id: 'Dashboard', parent: 'Platform' },
            { id: 'Billing', parent: 'Core API' },
            { id: 'Reports', parent: 'Dashboard' },
            { id: 'Exports', parent: 'Reports' }
          ],
          marker: { symbol: 'rect', width: 90 },
          dataLabels: { style: { textOutline: 'none' } }
        }]
      },
      html: '<chart [options]="treegraphOptions"></chart>'
    };
  }

  private createDynamicOptions() {
    return {
      chart: { type: 'line', height: 340 },
      title: { text: 'Dynamic update' },
      subtitle: { text: 'Changing the options object re-initializes the wrapper' },
      xAxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
      yAxis: { title: { text: 'Requests' } },
      series: [{ name: 'Updated data', data: this.dynamicData }]
    };
  }
}
