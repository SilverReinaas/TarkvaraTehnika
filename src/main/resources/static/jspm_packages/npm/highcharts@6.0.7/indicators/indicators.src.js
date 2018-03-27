/* */ 
(function(process) {
  'use strict';
  (function(factory) {
    if (typeof module === 'object' && module.exports) {
      module.exports = factory;
    } else {
      factory(Highcharts);
    }
  }(function(Highcharts) {
    (function(H) {
      var pick = H.pick,
          each = H.each,
          error = H.error,
          Series = H.Series,
          isArray = H.isArray,
          addEvent = H.addEvent,
          seriesType = H.seriesType;
      seriesType('sma', 'line', {
        name: undefined,
        tooltip: {valueDecimals: 4},
        linkedTo: undefined,
        params: {
          index: 0,
          period: 14
        }
      }, {
        bindTo: {
          series: true,
          eventName: 'updatedData'
        },
        nameComponents: ['period'],
        nameSuffixes: [],
        calculateOn: 'init',
        init: function(chart, options) {
          var indicator = this;
          Series.prototype.init.call(indicator, chart, options);
          chart.linkSeries();
          indicator.dataEventsToUnbind = [];
          function recalculateValues() {
            var processedData = indicator.getValues(indicator.linkedParent, indicator.options.params) || {
              values: [],
              xData: [],
              yData: []
            };
            indicator.xData = processedData.xData;
            indicator.yData = processedData.yData;
            indicator.options.data = processedData.values;
            if (indicator.bindTo.series === false) {
              delete indicator.processedXData;
              indicator.isDirty = true;
              indicator.redraw();
            }
            indicator.isDirtyData = false;
          }
          if (!indicator.linkedParent) {
            return error('Series ' + indicator.options.linkedTo + ' not found! Check `linkedTo`.');
          }
          indicator.dataEventsToUnbind.push(addEvent(indicator.bindTo.series ? indicator.linkedParent : indicator.linkedParent.xAxis, indicator.bindTo.eventName, recalculateValues));
          if (indicator.calculateOn === 'init') {
            recalculateValues();
          } else {
            var unbinder = addEvent(indicator.chart, indicator.calculateOn, function() {
              recalculateValues();
              unbinder();
            });
          }
          return indicator;
        },
        getName: function() {
          var name = this.name,
              params = [];
          if (!name) {
            each(this.nameComponents, function(component, index) {
              params.push(this.options.params[component] + pick(this.nameSuffixes[index], ''));
            }, this);
            name = (this.nameBase || this.type.toUpperCase()) + (this.nameComponents ? ' (' + params.join(', ') + ')' : '');
          }
          return name;
        },
        getValues: function(series, params) {
          var period = params.period,
              xVal = series.xData,
              yVal = series.yData,
              yValLen = yVal.length,
              range = 0,
              sum = 0,
              SMA = [],
              xData = [],
              yData = [],
              index = -1,
              i,
              SMAPoint;
          if (xVal.length < period) {
            return false;
          }
          if (isArray(yVal[0])) {
            index = params.index ? params.index : 0;
          }
          while (range < period - 1) {
            sum += index < 0 ? yVal[range] : yVal[range][index];
            range++;
          }
          for (i = range; i < yValLen; i++) {
            sum += index < 0 ? yVal[i] : yVal[i][index];
            SMAPoint = [xVal[i], sum / period];
            SMA.push(SMAPoint);
            xData.push(SMAPoint[0]);
            yData.push(SMAPoint[1]);
            sum -= index < 0 ? yVal[i - range] : yVal[i - range][index];
          }
          return {
            values: SMA,
            xData: xData,
            yData: yData
          };
        },
        destroy: function() {
          each(this.dataEventsToUnbind, function(unbinder) {
            unbinder();
          });
          Series.prototype.destroy.call(this);
        }
      });
    }(Highcharts));
  }));
})(require('process'));
