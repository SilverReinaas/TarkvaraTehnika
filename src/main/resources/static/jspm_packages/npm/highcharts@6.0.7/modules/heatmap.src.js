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
      var Axis = H.Axis,
          Chart = H.Chart,
          color = H.color,
          ColorAxis,
          each = H.each,
          extend = H.extend,
          isNumber = H.isNumber,
          Legend = H.Legend,
          LegendSymbolMixin = H.LegendSymbolMixin,
          noop = H.noop,
          merge = H.merge,
          pick = H.pick,
          wrap = H.wrap;
      if (!H.ColorAxis) {
        ColorAxis = H.ColorAxis = function() {
          this.init.apply(this, arguments);
        };
        extend(ColorAxis.prototype, Axis.prototype);
        extend(ColorAxis.prototype, {
          defaultColorAxisOptions: {
            lineWidth: 0,
            minPadding: 0,
            maxPadding: 0,
            gridLineWidth: 1,
            tickPixelInterval: 72,
            startOnTick: true,
            endOnTick: true,
            offset: 0,
            marker: {
              animation: {duration: 50},
              width: 0.01,
              color: '#999999'
            },
            labels: {
              overflow: 'justify',
              rotation: 0
            },
            minColor: '#e6ebf5',
            maxColor: '#003399',
            tickLength: 5,
            showInLegend: true
          },
          keepProps: ['legendGroup', 'legendItemHeight', 'legendItemWidth', 'legendItem', 'legendSymbol'].concat(Axis.prototype.keepProps),
          init: function(chart, userOptions) {
            var horiz = chart.options.legend.layout !== 'vertical',
                options;
            this.coll = 'colorAxis';
            options = merge(this.defaultColorAxisOptions, {
              side: horiz ? 2 : 1,
              reversed: !horiz
            }, userOptions, {
              opposite: !horiz,
              showEmpty: false,
              title: null,
              visible: chart.options.legend.enabled
            });
            Axis.prototype.init.call(this, chart, options);
            if (userOptions.dataClasses) {
              this.initDataClasses(userOptions);
            }
            this.initStops();
            this.horiz = horiz;
            this.zoomEnabled = false;
            this.defaultLegendLength = 200;
          },
          initDataClasses: function(userOptions) {
            var chart = this.chart,
                dataClasses,
                colorCounter = 0,
                colorCount = chart.options.chart.colorCount,
                options = this.options,
                len = userOptions.dataClasses.length;
            this.dataClasses = dataClasses = [];
            this.legendItems = [];
            each(userOptions.dataClasses, function(dataClass, i) {
              var colors;
              dataClass = merge(dataClass);
              dataClasses.push(dataClass);
              if (dataClass.color) {
                return;
              }
              if (options.dataClassColor === 'category') {
                colors = chart.options.colors;
                colorCount = colors.length;
                dataClass.color = colors[colorCounter];
                dataClass.colorIndex = colorCounter;
                colorCounter++;
                if (colorCounter === colorCount) {
                  colorCounter = 0;
                }
              } else {
                dataClass.color = color(options.minColor).tweenTo(color(options.maxColor), len < 2 ? 0.5 : i / (len - 1));
              }
            });
          },
          setTickPositions: function() {
            if (!this.dataClasses) {
              return Axis.prototype.setTickPositions.call(this);
            }
          },
          initStops: function() {
            this.stops = this.options.stops || [[0, this.options.minColor], [1, this.options.maxColor]];
            each(this.stops, function(stop) {
              stop.color = color(stop[1]);
            });
          },
          setOptions: function(userOptions) {
            Axis.prototype.setOptions.call(this, userOptions);
            this.options.crosshair = this.options.marker;
          },
          setAxisSize: function() {
            var symbol = this.legendSymbol,
                chart = this.chart,
                legendOptions = chart.options.legend || {},
                x,
                y,
                width,
                height;
            if (symbol) {
              this.left = x = symbol.attr('x');
              this.top = y = symbol.attr('y');
              this.width = width = symbol.attr('width');
              this.height = height = symbol.attr('height');
              this.right = chart.chartWidth - x - width;
              this.bottom = chart.chartHeight - y - height;
              this.len = this.horiz ? width : height;
              this.pos = this.horiz ? x : y;
            } else {
              this.len = (this.horiz ? legendOptions.symbolWidth : legendOptions.symbolHeight) || this.defaultLegendLength;
            }
          },
          normalizedValue: function(value) {
            if (this.isLog) {
              value = this.val2lin(value);
            }
            return 1 - ((this.max - value) / ((this.max - this.min) || 1));
          },
          toColor: function(value, point) {
            var pos,
                stops = this.stops,
                from,
                to,
                color,
                dataClasses = this.dataClasses,
                dataClass,
                i;
            if (dataClasses) {
              i = dataClasses.length;
              while (i--) {
                dataClass = dataClasses[i];
                from = dataClass.from;
                to = dataClass.to;
                if ((from === undefined || value >= from) && (to === undefined || value <= to)) {
                  color = dataClass.color;
                  if (point) {
                    point.dataClass = i;
                    point.colorIndex = dataClass.colorIndex;
                  }
                  break;
                }
              }
            } else {
              pos = this.normalizedValue(value);
              i = stops.length;
              while (i--) {
                if (pos > stops[i][0]) {
                  break;
                }
              }
              from = stops[i] || stops[i + 1];
              to = stops[i + 1] || from;
              pos = 1 - (to[0] - pos) / ((to[0] - from[0]) || 1);
              color = from.color.tweenTo(to.color, pos);
            }
            return color;
          },
          getOffset: function() {
            var group = this.legendGroup,
                sideOffset = this.chart.axisOffset[this.side];
            if (group) {
              this.axisParent = group;
              Axis.prototype.getOffset.call(this);
              if (!this.added) {
                this.added = true;
                this.labelLeft = 0;
                this.labelRight = this.width;
              }
              this.chart.axisOffset[this.side] = sideOffset;
            }
          },
          setLegendColor: function() {
            var grad,
                horiz = this.horiz,
                reversed = this.reversed,
                one = reversed ? 1 : 0,
                zero = reversed ? 0 : 1;
            grad = horiz ? [one, 0, zero, 0] : [0, zero, 0, one];
            this.legendColor = {
              linearGradient: {
                x1: grad[0],
                y1: grad[1],
                x2: grad[2],
                y2: grad[3]
              },
              stops: this.stops
            };
          },
          drawLegendSymbol: function(legend, item) {
            var padding = legend.padding,
                legendOptions = legend.options,
                horiz = this.horiz,
                width = pick(legendOptions.symbolWidth, horiz ? this.defaultLegendLength : 12),
                height = pick(legendOptions.symbolHeight, horiz ? 12 : this.defaultLegendLength),
                labelPadding = pick(legendOptions.labelPadding, horiz ? 16 : 30),
                itemDistance = pick(legendOptions.itemDistance, 10);
            this.setLegendColor();
            item.legendSymbol = this.chart.renderer.rect(0, legend.baseline - 11, width, height).attr({zIndex: 1}).add(item.legendGroup);
            this.legendItemWidth = width + padding + (horiz ? itemDistance : labelPadding);
            this.legendItemHeight = height + padding + (horiz ? labelPadding : 0);
          },
          setState: function(state) {
            each(this.series, function(series) {
              series.setState(state);
            });
          },
          visible: true,
          setVisible: noop,
          getSeriesExtremes: function() {
            var series = this.series,
                i = series.length;
            this.dataMin = Infinity;
            this.dataMax = -Infinity;
            while (i--) {
              if (series[i].valueMin !== undefined) {
                this.dataMin = Math.min(this.dataMin, series[i].valueMin);
                this.dataMax = Math.max(this.dataMax, series[i].valueMax);
              }
            }
          },
          drawCrosshair: function(e, point) {
            var plotX = point && point.plotX,
                plotY = point && point.plotY,
                crossPos,
                axisPos = this.pos,
                axisLen = this.len;
            if (point) {
              crossPos = this.toPixels(point[point.series.colorKey]);
              if (crossPos < axisPos) {
                crossPos = axisPos - 2;
              } else if (crossPos > axisPos + axisLen) {
                crossPos = axisPos + axisLen + 2;
              }
              point.plotX = crossPos;
              point.plotY = this.len - crossPos;
              Axis.prototype.drawCrosshair.call(this, e, point);
              point.plotX = plotX;
              point.plotY = plotY;
              if (this.cross && !this.cross.addedToColorAxis && this.legendGroup) {
                this.cross.addClass('highcharts-coloraxis-marker').add(this.legendGroup);
                this.cross.addedToColorAxis = true;
                this.cross.attr({fill: this.crosshair.color});
              }
            }
          },
          getPlotLinePath: function(a, b, c, d, pos) {
            return isNumber(pos) ? (this.horiz ? ['M', pos - 4, this.top - 6, 'L', pos + 4, this.top - 6, pos, this.top, 'Z'] : ['M', this.left, pos, 'L', this.left - 6, pos + 6, this.left - 6, pos - 6, 'Z']) : Axis.prototype.getPlotLinePath.call(this, a, b, c, d);
          },
          update: function(newOptions, redraw) {
            var chart = this.chart,
                legend = chart.legend;
            each(this.series, function(series) {
              series.isDirtyData = true;
            });
            if (newOptions.dataClasses && legend.allItems) {
              each(legend.allItems, function(item) {
                if (item.isDataClass && item.legendGroup) {
                  item.legendGroup.destroy();
                }
              });
              chart.isDirtyLegend = true;
            }
            chart.options[this.coll] = merge(this.userOptions, newOptions);
            Axis.prototype.update.call(this, newOptions, redraw);
            if (this.legendItem) {
              this.setLegendColor();
              legend.colorizeItem(this, true);
            }
          },
          remove: function() {
            if (this.legendItem) {
              this.chart.legend.destroyItem(this);
            }
            Axis.prototype.remove.call(this);
          },
          getDataClassLegendSymbols: function() {
            var axis = this,
                chart = this.chart,
                legendItems = this.legendItems,
                legendOptions = chart.options.legend,
                valueDecimals = legendOptions.valueDecimals,
                valueSuffix = legendOptions.valueSuffix || '',
                name;
            if (!legendItems.length) {
              each(this.dataClasses, function(dataClass, i) {
                var vis = true,
                    from = dataClass.from,
                    to = dataClass.to;
                name = '';
                if (from === undefined) {
                  name = '< ';
                } else if (to === undefined) {
                  name = '> ';
                }
                if (from !== undefined) {
                  name += H.numberFormat(from, valueDecimals) + valueSuffix;
                }
                if (from !== undefined && to !== undefined) {
                  name += ' - ';
                }
                if (to !== undefined) {
                  name += H.numberFormat(to, valueDecimals) + valueSuffix;
                }
                legendItems.push(extend({
                  chart: chart,
                  name: name,
                  options: {},
                  drawLegendSymbol: LegendSymbolMixin.drawRectangle,
                  visible: true,
                  setState: noop,
                  isDataClass: true,
                  setVisible: function() {
                    vis = this.visible = !vis;
                    each(axis.series, function(series) {
                      each(series.points, function(point) {
                        if (point.dataClass === i) {
                          point.setVisible(vis);
                        }
                      });
                    });
                    chart.legend.colorizeItem(this, vis);
                  }
                }, dataClass));
              });
            }
            return legendItems;
          },
          name: ''
        });
        each(['fill', 'stroke'], function(prop) {
          H.Fx.prototype[prop + 'Setter'] = function() {
            this.elem.attr(prop, color(this.start).tweenTo(color(this.end), this.pos), null, true);
          };
        });
        wrap(Chart.prototype, 'getAxes', function(proceed) {
          var options = this.options,
              colorAxisOptions = options.colorAxis;
          proceed.call(this);
          this.colorAxis = [];
          if (colorAxisOptions) {
            new ColorAxis(this, colorAxisOptions);
          }
        });
        wrap(Legend.prototype, 'getAllItems', function(proceed) {
          var allItems = [],
              colorAxis = this.chart.colorAxis[0];
          if (colorAxis && colorAxis.options) {
            if (colorAxis.options.showInLegend) {
              if (colorAxis.options.dataClasses) {
                allItems = allItems.concat(colorAxis.getDataClassLegendSymbols());
              } else {
                allItems.push(colorAxis);
              }
            }
            each(colorAxis.series, function(series) {
              series.options.showInLegend = false;
            });
          }
          return allItems.concat(proceed.call(this));
        });
        wrap(Legend.prototype, 'colorizeItem', function(proceed, item, visible) {
          proceed.call(this, item, visible);
          if (visible && item.legendColor) {
            item.legendSymbol.attr({fill: item.legendColor});
          }
        });
        wrap(Legend.prototype, 'update', function(proceed) {
          proceed.apply(this, [].slice.call(arguments, 1));
          if (this.chart.colorAxis[0]) {
            this.chart.colorAxis[0].update({}, arguments[2]);
          }
        });
      }
    }(Highcharts));
    (function(H) {
      var defined = H.defined,
          each = H.each,
          noop = H.noop,
          seriesTypes = H.seriesTypes;
      H.colorPointMixin = {
        isValid: function() {
          return (this.value !== null && this.value !== Infinity && this.value !== -Infinity);
        },
        setVisible: function(vis) {
          var point = this,
              method = vis ? 'show' : 'hide';
          each(['graphic', 'dataLabel'], function(key) {
            if (point[key]) {
              point[key][method]();
            }
          });
        },
        setState: function(state) {
          H.Point.prototype.setState.call(this, state);
          if (this.graphic) {
            this.graphic.attr({zIndex: state === 'hover' ? 1 : 0});
          }
        }
      };
      H.colorSeriesMixin = {
        pointArrayMap: ['value'],
        axisTypes: ['xAxis', 'yAxis', 'colorAxis'],
        optionalAxis: 'colorAxis',
        trackerGroups: ['group', 'markerGroup', 'dataLabelsGroup'],
        getSymbol: noop,
        parallelArrays: ['x', 'y', 'value'],
        colorKey: 'value',
        pointAttribs: seriesTypes.column.prototype.pointAttribs,
        translateColors: function() {
          var series = this,
              nullColor = this.options.nullColor,
              colorAxis = this.colorAxis,
              colorKey = this.colorKey;
          each(this.data, function(point) {
            var value = point[colorKey],
                color;
            color = point.options.color || (point.isNull ? nullColor : (colorAxis && value !== undefined) ? colorAxis.toColor(value, point) : point.color || series.color);
            if (color) {
              point.color = color;
            }
          });
        },
        colorAttribs: function(point) {
          var ret = {};
          if (defined(point.color)) {
            ret[this.colorProp || 'fill'] = point.color;
          }
          return ret;
        }
      };
    }(Highcharts));
    (function(H) {
      var colorPointMixin = H.colorPointMixin,
          colorSeriesMixin = H.colorSeriesMixin,
          each = H.each,
          LegendSymbolMixin = H.LegendSymbolMixin,
          merge = H.merge,
          noop = H.noop,
          pick = H.pick,
          Series = H.Series,
          seriesType = H.seriesType,
          seriesTypes = H.seriesTypes;
      seriesType('heatmap', 'scatter', {
        animation: false,
        borderWidth: 0,
        nullColor: '#f7f7f7',
        dataLabels: {
          formatter: function() {
            return this.point.value;
          },
          inside: true,
          verticalAlign: 'middle',
          crop: false,
          overflow: false,
          padding: 0
        },
        marker: null,
        pointRange: null,
        tooltip: {pointFormat: '{point.x}, {point.y}: {point.value}<br/>'},
        states: {hover: {
            halo: false,
            brightness: 0.2
          }}
      }, merge(colorSeriesMixin, {
        pointArrayMap: ['y', 'value'],
        hasPointSpecificOptions: true,
        getExtremesFromAll: true,
        directTouch: true,
        init: function() {
          var options;
          seriesTypes.scatter.prototype.init.apply(this, arguments);
          options = this.options;
          options.pointRange = pick(options.pointRange, options.colsize || 1);
          this.yAxis.axisPointRange = options.rowsize || 1;
        },
        translate: function() {
          var series = this,
              options = series.options,
              xAxis = series.xAxis,
              yAxis = series.yAxis,
              seriesPointPadding = options.pointPadding || 0,
              between = function(x, a, b) {
                return Math.min(Math.max(a, x), b);
              };
          series.generatePoints();
          each(series.points, function(point) {
            var xPad = (options.colsize || 1) / 2,
                yPad = (options.rowsize || 1) / 2,
                x1 = between(Math.round(xAxis.len - xAxis.translate(point.x - xPad, 0, 1, 0, 1)), -xAxis.len, 2 * xAxis.len),
                x2 = between(Math.round(xAxis.len - xAxis.translate(point.x + xPad, 0, 1, 0, 1)), -xAxis.len, 2 * xAxis.len),
                y1 = between(Math.round(yAxis.translate(point.y - yPad, 0, 1, 0, 1)), -yAxis.len, 2 * yAxis.len),
                y2 = between(Math.round(yAxis.translate(point.y + yPad, 0, 1, 0, 1)), -yAxis.len, 2 * yAxis.len),
                pointPadding = pick(point.pointPadding, seriesPointPadding);
            point.plotX = point.clientX = (x1 + x2) / 2;
            point.plotY = (y1 + y2) / 2;
            point.shapeType = 'rect';
            point.shapeArgs = {
              x: Math.min(x1, x2) + pointPadding,
              y: Math.min(y1, y2) + pointPadding,
              width: Math.abs(x2 - x1) - pointPadding * 2,
              height: Math.abs(y2 - y1) - pointPadding * 2
            };
          });
          series.translateColors();
        },
        drawPoints: function() {
          seriesTypes.column.prototype.drawPoints.call(this);
          each(this.points, function(point) {
            point.graphic.attr(this.colorAttribs(point));
          }, this);
        },
        animate: noop,
        getBox: noop,
        drawLegendSymbol: LegendSymbolMixin.drawRectangle,
        alignDataLabel: seriesTypes.column.prototype.alignDataLabel,
        getExtremes: function() {
          Series.prototype.getExtremes.call(this, this.valueData);
          this.valueMin = this.dataMin;
          this.valueMax = this.dataMax;
          Series.prototype.getExtremes.call(this);
        }
      }), H.extend({haloPath: function(size) {
          if (!size) {
            return [];
          }
          var rect = this.shapeArgs;
          return ['M', rect.x - size, rect.y - size, 'L', rect.x - size, rect.y + rect.height + size, rect.x + rect.width + size, rect.y + rect.height + size, rect.x + rect.width + size, rect.y - size, 'Z'];
        }}, colorPointMixin));
    }(Highcharts));
  }));
})(require('process'));
