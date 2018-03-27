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
          each = H.each,
          pick = H.pick,
          wrap = H.wrap;
      wrap(Axis.prototype, 'getSeriesExtremes', function(proceed) {
        var isXAxis = this.isXAxis,
            dataMin,
            dataMax,
            xData = [],
            useMapGeometry;
        if (isXAxis) {
          each(this.series, function(series, i) {
            if (series.useMapGeometry) {
              xData[i] = series.xData;
              series.xData = [];
            }
          });
        }
        proceed.call(this);
        if (isXAxis) {
          dataMin = pick(this.dataMin, Number.MAX_VALUE);
          dataMax = pick(this.dataMax, -Number.MAX_VALUE);
          each(this.series, function(series, i) {
            if (series.useMapGeometry) {
              dataMin = Math.min(dataMin, pick(series.minX, dataMin));
              dataMax = Math.max(dataMax, pick(series.maxX, dataMax));
              series.xData = xData[i];
              useMapGeometry = true;
            }
          });
          if (useMapGeometry) {
            this.dataMin = dataMin;
            this.dataMax = dataMax;
          }
        }
      });
      wrap(Axis.prototype, 'setAxisTranslation', function(proceed) {
        var chart = this.chart,
            mapRatio,
            plotRatio = chart.plotWidth / chart.plotHeight,
            adjustedAxisLength,
            xAxis = chart.xAxis[0],
            padAxis,
            fixTo,
            fixDiff,
            preserveAspectRatio;
        proceed.call(this);
        if (this.coll === 'yAxis' && xAxis.transA !== undefined) {
          each(this.series, function(series) {
            if (series.preserveAspectRatio) {
              preserveAspectRatio = true;
            }
          });
        }
        if (preserveAspectRatio) {
          this.transA = xAxis.transA = Math.min(this.transA, xAxis.transA);
          mapRatio = plotRatio / ((xAxis.max - xAxis.min) / (this.max - this.min));
          padAxis = mapRatio < 1 ? this : xAxis;
          adjustedAxisLength = (padAxis.max - padAxis.min) * padAxis.transA;
          padAxis.pixelPadding = padAxis.len - adjustedAxisLength;
          padAxis.minPixelPadding = padAxis.pixelPadding / 2;
          fixTo = padAxis.fixTo;
          if (fixTo) {
            fixDiff = fixTo[1] - padAxis.toValue(fixTo[0], true);
            fixDiff *= padAxis.transA;
            if (Math.abs(fixDiff) > padAxis.minPixelPadding || (padAxis.min === padAxis.dataMin && padAxis.max === padAxis.dataMax)) {
              fixDiff = 0;
            }
            padAxis.minPixelPadding -= fixDiff;
          }
        }
      });
      wrap(Axis.prototype, 'render', function(proceed) {
        proceed.call(this);
        this.fixTo = null;
      });
    }(Highcharts));
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
              width: 0.01
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
              if (options.dataClassColor === 'category') {
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
      var addEvent = H.addEvent,
          Chart = H.Chart,
          doc = H.doc,
          each = H.each,
          extend = H.extend,
          merge = H.merge,
          pick = H.pick,
          wrap = H.wrap;
      function stopEvent(e) {
        if (e) {
          if (e.preventDefault) {
            e.preventDefault();
          }
          if (e.stopPropagation) {
            e.stopPropagation();
          }
          e.cancelBubble = true;
        }
      }
      function MapNavigation(chart) {
        this.init(chart);
      }
      MapNavigation.prototype.init = function(chart) {
        this.chart = chart;
        chart.mapNavButtons = [];
      };
      MapNavigation.prototype.update = function(options) {
        var chart = this.chart,
            o = chart.options.mapNavigation,
            buttonOptions,
            attr,
            states,
            hoverStates,
            selectStates,
            outerHandler = function(e) {
              this.handler.call(chart, e);
              stopEvent(e);
            },
            mapNavButtons = chart.mapNavButtons;
        if (options) {
          o = chart.options.mapNavigation = merge(chart.options.mapNavigation, options);
        }
        while (mapNavButtons.length) {
          mapNavButtons.pop().destroy();
        }
        if (pick(o.enableButtons, o.enabled) && !chart.renderer.forExport) {
          H.objectEach(o.buttons, function(button, n) {
            buttonOptions = merge(o.buttonOptions, button);
            button = chart.renderer.button(buttonOptions.text, 0, 0, outerHandler, attr, hoverStates, selectStates, 0, n === 'zoomIn' ? 'topbutton' : 'bottombutton').addClass('highcharts-map-navigation').attr({
              width: buttonOptions.width,
              height: buttonOptions.height,
              title: chart.options.lang[n],
              padding: buttonOptions.padding,
              zIndex: 5
            }).add();
            button.handler = buttonOptions.onclick;
            button.align(extend(buttonOptions, {
              width: button.width,
              height: 2 * button.height
            }), null, buttonOptions.alignTo);
            addEvent(button.element, 'dblclick', stopEvent);
            mapNavButtons.push(button);
          });
        }
        this.updateEvents(o);
      };
      MapNavigation.prototype.updateEvents = function(options) {
        var chart = this.chart;
        if (pick(options.enableDoubleClickZoom, options.enabled) || options.enableDoubleClickZoomTo) {
          this.unbindDblClick = this.unbindDblClick || addEvent(chart.container, 'dblclick', function(e) {
            chart.pointer.onContainerDblClick(e);
          });
        } else if (this.unbindDblClick) {
          this.unbindDblClick = this.unbindDblClick();
        }
        if (pick(options.enableMouseWheelZoom, options.enabled)) {
          this.unbindMouseWheel = this.unbindMouseWheel || addEvent(chart.container, doc.onmousewheel === undefined ? 'DOMMouseScroll' : 'mousewheel', function(e) {
            chart.pointer.onContainerMouseWheel(e);
            stopEvent(e);
            return false;
          });
        } else if (this.unbindMouseWheel) {
          this.unbindMouseWheel = this.unbindMouseWheel();
        }
      };
      extend(Chart.prototype, {
        fitToBox: function(inner, outer) {
          each([['x', 'width'], ['y', 'height']], function(dim) {
            var pos = dim[0],
                size = dim[1];
            if (inner[pos] + inner[size] > outer[pos] + outer[size]) {
              if (inner[size] > outer[size]) {
                inner[size] = outer[size];
                inner[pos] = outer[pos];
              } else {
                inner[pos] = outer[pos] + outer[size] - inner[size];
              }
            }
            if (inner[size] > outer[size]) {
              inner[size] = outer[size];
            }
            if (inner[pos] < outer[pos]) {
              inner[pos] = outer[pos];
            }
          });
          return inner;
        },
        mapZoom: function(howMuch, centerXArg, centerYArg, mouseX, mouseY) {
          var chart = this,
              xAxis = chart.xAxis[0],
              xRange = xAxis.max - xAxis.min,
              centerX = pick(centerXArg, xAxis.min + xRange / 2),
              newXRange = xRange * howMuch,
              yAxis = chart.yAxis[0],
              yRange = yAxis.max - yAxis.min,
              centerY = pick(centerYArg, yAxis.min + yRange / 2),
              newYRange = yRange * howMuch,
              fixToX = mouseX ? ((mouseX - xAxis.pos) / xAxis.len) : 0.5,
              fixToY = mouseY ? ((mouseY - yAxis.pos) / yAxis.len) : 0.5,
              newXMin = centerX - newXRange * fixToX,
              newYMin = centerY - newYRange * fixToY,
              newExt = chart.fitToBox({
                x: newXMin,
                y: newYMin,
                width: newXRange,
                height: newYRange
              }, {
                x: xAxis.dataMin,
                y: yAxis.dataMin,
                width: xAxis.dataMax - xAxis.dataMin,
                height: yAxis.dataMax - yAxis.dataMin
              }),
              zoomOut = newExt.x <= xAxis.dataMin && newExt.width >= xAxis.dataMax - xAxis.dataMin && newExt.y <= yAxis.dataMin && newExt.height >= yAxis.dataMax - yAxis.dataMin;
          if (mouseX) {
            xAxis.fixTo = [mouseX - xAxis.pos, centerXArg];
          }
          if (mouseY) {
            yAxis.fixTo = [mouseY - yAxis.pos, centerYArg];
          }
          if (howMuch !== undefined && !zoomOut) {
            xAxis.setExtremes(newExt.x, newExt.x + newExt.width, false);
            yAxis.setExtremes(newExt.y, newExt.y + newExt.height, false);
          } else {
            xAxis.setExtremes(undefined, undefined, false);
            yAxis.setExtremes(undefined, undefined, false);
          }
          chart.redraw();
        }
      });
      wrap(Chart.prototype, 'render', function(proceed) {
        this.mapNavigation = new MapNavigation(this);
        this.mapNavigation.update();
        proceed.call(this);
      });
    }(Highcharts));
    (function(H) {
      var extend = H.extend,
          pick = H.pick,
          Pointer = H.Pointer,
          wrap = H.wrap;
      extend(Pointer.prototype, {
        onContainerDblClick: function(e) {
          var chart = this.chart;
          e = this.normalize(e);
          if (chart.options.mapNavigation.enableDoubleClickZoomTo) {
            if (chart.pointer.inClass(e.target, 'highcharts-tracker') && chart.hoverPoint) {
              chart.hoverPoint.zoomTo();
            }
          } else if (chart.isInsidePlot(e.chartX - chart.plotLeft, e.chartY - chart.plotTop)) {
            chart.mapZoom(0.5, chart.xAxis[0].toValue(e.chartX), chart.yAxis[0].toValue(e.chartY), e.chartX, e.chartY);
          }
        },
        onContainerMouseWheel: function(e) {
          var chart = this.chart,
              delta;
          e = this.normalize(e);
          delta = e.detail || -(e.wheelDelta / 120);
          if (chart.isInsidePlot(e.chartX - chart.plotLeft, e.chartY - chart.plotTop)) {
            chart.mapZoom(Math.pow(chart.options.mapNavigation.mouseWheelSensitivity, delta), chart.xAxis[0].toValue(e.chartX), chart.yAxis[0].toValue(e.chartY), e.chartX, e.chartY);
          }
        }
      });
      wrap(Pointer.prototype, 'zoomOption', function(proceed) {
        var mapNavigation = this.chart.options.mapNavigation;
        if (pick(mapNavigation.enableTouchZoom, mapNavigation.enabled)) {
          this.chart.options.chart.pinchType = 'xy';
        }
        proceed.apply(this, [].slice.call(arguments, 1));
      });
      wrap(Pointer.prototype, 'pinchTranslate', function(proceed, pinchDown, touches, transform, selectionMarker, clip, lastValidTouch) {
        var xBigger;
        proceed.call(this, pinchDown, touches, transform, selectionMarker, clip, lastValidTouch);
        if (this.chart.options.chart.type === 'map' && this.hasZoom) {
          xBigger = transform.scaleX > transform.scaleY;
          this.pinchTranslateDirection(!xBigger, pinchDown, touches, transform, selectionMarker, clip, lastValidTouch, xBigger ? transform.scaleX : transform.scaleY);
        }
      });
    }(Highcharts));
    (function(H) {
      var colorPointMixin = H.colorPointMixin,
          colorSeriesMixin = H.colorSeriesMixin,
          doc = H.doc,
          each = H.each,
          extend = H.extend,
          isNumber = H.isNumber,
          LegendSymbolMixin = H.LegendSymbolMixin,
          map = H.map,
          merge = H.merge,
          noop = H.noop,
          pick = H.pick,
          isArray = H.isArray,
          Point = H.Point,
          Series = H.Series,
          seriesType = H.seriesType,
          seriesTypes = H.seriesTypes,
          splat = H.splat;
      var supportsVectorEffect = doc.documentElement.style.vectorEffect !== undefined;
      seriesType('map', 'scatter', {
        allAreas: true,
        animation: false,
        nullColor: '#f7f7f7',
        borderColor: '#cccccc',
        borderWidth: 1,
        marker: null,
        stickyTracking: false,
        joinBy: 'hc-key',
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
        turboThreshold: 0,
        tooltip: {
          followPointer: true,
          pointFormat: '{point.name}: {point.value}<br/>'
        },
        states: {
          normal: {animation: true},
          hover: {
            halo: null,
            brightness: 0.2
          },
          select: {color: '#cccccc'}
        }
      }, merge(colorSeriesMixin, {
        type: 'map',
        getExtremesFromAll: true,
        useMapGeometry: true,
        forceDL: true,
        searchPoint: noop,
        directTouch: true,
        preserveAspectRatio: true,
        pointArrayMap: ['value'],
        getBox: function(paths) {
          var MAX_VALUE = Number.MAX_VALUE,
              maxX = -MAX_VALUE,
              minX = MAX_VALUE,
              maxY = -MAX_VALUE,
              minY = MAX_VALUE,
              minRange = MAX_VALUE,
              xAxis = this.xAxis,
              yAxis = this.yAxis,
              hasBox;
          each(paths || [], function(point) {
            if (point.path) {
              if (typeof point.path === 'string') {
                point.path = H.splitPath(point.path);
              }
              var path = point.path || [],
                  i = path.length,
                  even = false,
                  pointMaxX = -MAX_VALUE,
                  pointMinX = MAX_VALUE,
                  pointMaxY = -MAX_VALUE,
                  pointMinY = MAX_VALUE,
                  properties = point.properties;
              if (!point._foundBox) {
                while (i--) {
                  if (isNumber(path[i])) {
                    if (even) {
                      pointMaxX = Math.max(pointMaxX, path[i]);
                      pointMinX = Math.min(pointMinX, path[i]);
                    } else {
                      pointMaxY = Math.max(pointMaxY, path[i]);
                      pointMinY = Math.min(pointMinY, path[i]);
                    }
                    even = !even;
                  }
                }
                point._midX = pointMinX + (pointMaxX - pointMinX) * pick(point.middleX, properties && properties['hc-middle-x'], 0.5);
                point._midY = pointMinY + (pointMaxY - pointMinY) * pick(point.middleY, properties && properties['hc-middle-y'], 0.5);
                point._maxX = pointMaxX;
                point._minX = pointMinX;
                point._maxY = pointMaxY;
                point._minY = pointMinY;
                point.labelrank = pick(point.labelrank, (pointMaxX - pointMinX) * (pointMaxY - pointMinY));
                point._foundBox = true;
              }
              maxX = Math.max(maxX, point._maxX);
              minX = Math.min(minX, point._minX);
              maxY = Math.max(maxY, point._maxY);
              minY = Math.min(minY, point._minY);
              minRange = Math.min(point._maxX - point._minX, point._maxY - point._minY, minRange);
              hasBox = true;
            }
          });
          if (hasBox) {
            this.minY = Math.min(minY, pick(this.minY, MAX_VALUE));
            this.maxY = Math.max(maxY, pick(this.maxY, -MAX_VALUE));
            this.minX = Math.min(minX, pick(this.minX, MAX_VALUE));
            this.maxX = Math.max(maxX, pick(this.maxX, -MAX_VALUE));
            if (xAxis && xAxis.options.minRange === undefined) {
              xAxis.minRange = Math.min(5 * minRange, (this.maxX - this.minX) / 5, xAxis.minRange || MAX_VALUE);
            }
            if (yAxis && yAxis.options.minRange === undefined) {
              yAxis.minRange = Math.min(5 * minRange, (this.maxY - this.minY) / 5, yAxis.minRange || MAX_VALUE);
            }
          }
        },
        getExtremes: function() {
          Series.prototype.getExtremes.call(this, this.valueData);
          if (this.chart.hasRendered && this.isDirtyData) {
            this.getBox(this.options.data);
          }
          this.valueMin = this.dataMin;
          this.valueMax = this.dataMax;
          this.dataMin = this.minY;
          this.dataMax = this.maxY;
        },
        translatePath: function(path) {
          var series = this,
              even = false,
              xAxis = series.xAxis,
              yAxis = series.yAxis,
              xMin = xAxis.min,
              xTransA = xAxis.transA,
              xMinPixelPadding = xAxis.minPixelPadding,
              yMin = yAxis.min,
              yTransA = yAxis.transA,
              yMinPixelPadding = yAxis.minPixelPadding,
              i,
              ret = [];
          if (path) {
            i = path.length;
            while (i--) {
              if (isNumber(path[i])) {
                ret[i] = even ? (path[i] - xMin) * xTransA + xMinPixelPadding : (path[i] - yMin) * yTransA + yMinPixelPadding;
                even = !even;
              } else {
                ret[i] = path[i];
              }
            }
          }
          return ret;
        },
        setData: function(data, redraw, animation, updatePoints) {
          var options = this.options,
              chartOptions = this.chart.options.chart,
              globalMapData = chartOptions && chartOptions.map,
              mapData = options.mapData,
              joinBy = options.joinBy,
              joinByNull = joinBy === null,
              pointArrayMap = options.keys || this.pointArrayMap,
              dataUsed = [],
              mapMap = {},
              mapPoint,
              mapTransforms = this.chart.mapTransforms,
              props,
              i;
          if (!mapData && globalMapData) {
            mapData = typeof globalMapData === 'string' ? H.maps[globalMapData] : globalMapData;
          }
          if (joinByNull) {
            joinBy = '_i';
          }
          joinBy = this.joinBy = splat(joinBy);
          if (!joinBy[1]) {
            joinBy[1] = joinBy[0];
          }
          if (data) {
            each(data, function(val, i) {
              var ix = 0;
              if (isNumber(val)) {
                data[i] = {value: val};
              } else if (isArray(val)) {
                data[i] = {};
                if (!options.keys && val.length > pointArrayMap.length && typeof val[0] === 'string') {
                  data[i]['hc-key'] = val[0];
                  ++ix;
                }
                for (var j = 0; j < pointArrayMap.length; ++j, ++ix) {
                  if (pointArrayMap[j]) {
                    data[i][pointArrayMap[j]] = val[ix];
                  }
                }
              }
              if (joinByNull) {
                data[i]._i = i;
              }
            });
          }
          this.getBox(data);
          this.chart.mapTransforms = mapTransforms = chartOptions && chartOptions.mapTransforms || mapData && mapData['hc-transform'] || mapTransforms;
          if (mapTransforms) {
            H.objectEach(mapTransforms, function(transform) {
              if (transform.rotation) {
                transform.cosAngle = Math.cos(transform.rotation);
                transform.sinAngle = Math.sin(transform.rotation);
              }
            });
          }
          if (mapData) {
            if (mapData.type === 'FeatureCollection') {
              this.mapTitle = mapData.title;
              mapData = H.geojson(mapData, this.type, this);
            }
            this.mapData = mapData;
            this.mapMap = {};
            for (i = 0; i < mapData.length; i++) {
              mapPoint = mapData[i];
              props = mapPoint.properties;
              mapPoint._i = i;
              if (joinBy[0] && props && props[joinBy[0]]) {
                mapPoint[joinBy[0]] = props[joinBy[0]];
              }
              mapMap[mapPoint[joinBy[0]]] = mapPoint;
            }
            this.mapMap = mapMap;
            if (data && joinBy[1]) {
              each(data, function(point) {
                if (mapMap[point[joinBy[1]]]) {
                  dataUsed.push(mapMap[point[joinBy[1]]]);
                }
              });
            }
            if (options.allAreas) {
              this.getBox(mapData);
              data = data || [];
              if (joinBy[1]) {
                each(data, function(point) {
                  dataUsed.push(point[joinBy[1]]);
                });
              }
              dataUsed = '|' + map(dataUsed, function(point) {
                return point && point[joinBy[0]];
              }).join('|') + '|';
              each(mapData, function(mapPoint) {
                if (!joinBy[0] || dataUsed.indexOf('|' + mapPoint[joinBy[0]] + '|') === -1) {
                  data.push(merge(mapPoint, {value: null}));
                  updatePoints = false;
                }
              });
            } else {
              this.getBox(dataUsed);
            }
          }
          Series.prototype.setData.call(this, data, redraw, animation, updatePoints);
        },
        drawGraph: noop,
        drawDataLabels: noop,
        doFullTranslate: function() {
          return this.isDirtyData || this.chart.isResizing || this.chart.renderer.isVML || !this.baseTrans;
        },
        translate: function() {
          var series = this,
              xAxis = series.xAxis,
              yAxis = series.yAxis,
              doFullTranslate = series.doFullTranslate();
          series.generatePoints();
          each(series.data, function(point) {
            point.plotX = xAxis.toPixels(point._midX, true);
            point.plotY = yAxis.toPixels(point._midY, true);
            if (doFullTranslate) {
              point.shapeType = 'path';
              point.shapeArgs = {d: series.translatePath(point.path)};
            }
          });
          series.translateColors();
        },
        pointAttribs: function(point, state) {
          var attr;
          attr = this.colorAttribs(point);
          if (supportsVectorEffect) {
            attr['vector-effect'] = 'non-scaling-stroke';
          } else {
            attr['stroke-width'] = 'inherit';
          }
          return attr;
        },
        drawPoints: function() {
          var series = this,
              xAxis = series.xAxis,
              yAxis = series.yAxis,
              group = series.group,
              chart = series.chart,
              renderer = chart.renderer,
              scaleX,
              scaleY,
              translateX,
              translateY,
              baseTrans = this.baseTrans,
              transformGroup,
              startTranslateX,
              startTranslateY,
              startScaleX,
              startScaleY;
          if (!series.transformGroup) {
            series.transformGroup = renderer.g().attr({
              scaleX: 1,
              scaleY: 1
            }).add(group);
            series.transformGroup.survive = true;
          }
          if (series.doFullTranslate()) {
            series.group = series.transformGroup;
            seriesTypes.column.prototype.drawPoints.apply(series);
            series.group = group;
            each(series.points, function(point) {
              if (point.graphic) {
                if (point.name) {
                  point.graphic.addClass('highcharts-name-' + point.name.replace(/ /g, '-').toLowerCase());
                }
                if (point.properties && point.properties['hc-key']) {
                  point.graphic.addClass('highcharts-key-' + point.properties['hc-key'].toLowerCase());
                }
                point.graphic.css(series.pointAttribs(point, point.selected && 'select'));
              }
            });
            this.baseTrans = {
              originX: xAxis.min - xAxis.minPixelPadding / xAxis.transA,
              originY: yAxis.min - yAxis.minPixelPadding / yAxis.transA + (yAxis.reversed ? 0 : yAxis.len / yAxis.transA),
              transAX: xAxis.transA,
              transAY: yAxis.transA
            };
            this.transformGroup.animate({
              translateX: 0,
              translateY: 0,
              scaleX: 1,
              scaleY: 1
            });
          } else {
            scaleX = xAxis.transA / baseTrans.transAX;
            scaleY = yAxis.transA / baseTrans.transAY;
            translateX = xAxis.toPixels(baseTrans.originX, true);
            translateY = yAxis.toPixels(baseTrans.originY, true);
            if (scaleX > 0.99 && scaleX < 1.01 && scaleY > 0.99 && scaleY < 1.01) {
              scaleX = 1;
              scaleY = 1;
              translateX = Math.round(translateX);
              translateY = Math.round(translateY);
            }
            transformGroup = this.transformGroup;
            if (chart.renderer.globalAnimation) {
              startTranslateX = transformGroup.attr('translateX');
              startTranslateY = transformGroup.attr('translateY');
              startScaleX = transformGroup.attr('scaleX');
              startScaleY = transformGroup.attr('scaleY');
              transformGroup.attr({animator: 0}).animate({animator: 1}, {step: function(now, fx) {
                  transformGroup.attr({
                    translateX: startTranslateX + (translateX - startTranslateX) * fx.pos,
                    translateY: startTranslateY + (translateY - startTranslateY) * fx.pos,
                    scaleX: startScaleX + (scaleX - startScaleX) * fx.pos,
                    scaleY: startScaleY + (scaleY - startScaleY) * fx.pos
                  });
                }});
            } else {
              transformGroup.attr({
                translateX: translateX,
                translateY: translateY,
                scaleX: scaleX,
                scaleY: scaleY
              });
            }
          }
          if (!supportsVectorEffect) {
            series.group.element.setAttribute('stroke-width', series.options[(series.pointAttrToOptions && series.pointAttrToOptions['stroke-width']) || 'borderWidth'] / (scaleX || 1));
          }
          this.drawMapDataLabels();
        },
        drawMapDataLabels: function() {
          Series.prototype.drawDataLabels.call(this);
          if (this.dataLabelsGroup) {
            this.dataLabelsGroup.clip(this.chart.clipRect);
          }
        },
        render: function() {
          var series = this,
              render = Series.prototype.render;
          if (series.chart.renderer.isVML && series.data.length > 3000) {
            setTimeout(function() {
              render.call(series);
            });
          } else {
            render.call(series);
          }
        },
        animate: function(init) {
          var chart = this.chart,
              animation = this.options.animation,
              group = this.group,
              xAxis = this.xAxis,
              yAxis = this.yAxis,
              left = xAxis.pos,
              top = yAxis.pos;
          if (chart.renderer.isSVG) {
            if (animation === true) {
              animation = {duration: 1000};
            }
            if (init) {
              group.attr({
                translateX: left + xAxis.len / 2,
                translateY: top + yAxis.len / 2,
                scaleX: 0.001,
                scaleY: 0.001
              });
            } else {
              group.animate({
                translateX: left,
                translateY: top,
                scaleX: 1,
                scaleY: 1
              }, animation);
              this.animate = null;
            }
          }
        },
        animateDrilldown: function(init) {
          var toBox = this.chart.plotBox,
              level = this.chart.drilldownLevels[this.chart.drilldownLevels.length - 1],
              fromBox = level.bBox,
              animationOptions = this.chart.options.drilldown.animation,
              scale;
          if (!init) {
            scale = Math.min(fromBox.width / toBox.width, fromBox.height / toBox.height);
            level.shapeArgs = {
              scaleX: scale,
              scaleY: scale,
              translateX: fromBox.x,
              translateY: fromBox.y
            };
            each(this.points, function(point) {
              if (point.graphic) {
                point.graphic.attr(level.shapeArgs).animate({
                  scaleX: 1,
                  scaleY: 1,
                  translateX: 0,
                  translateY: 0
                }, animationOptions);
              }
            });
            this.animate = null;
          }
        },
        drawLegendSymbol: LegendSymbolMixin.drawRectangle,
        animateDrillupFrom: function(level) {
          seriesTypes.column.prototype.animateDrillupFrom.call(this, level);
        },
        animateDrillupTo: function(init) {
          seriesTypes.column.prototype.animateDrillupTo.call(this, init);
        }
      }), extend({
        applyOptions: function(options, x) {
          var point = Point.prototype.applyOptions.call(this, options, x),
              series = this.series,
              joinBy = series.joinBy,
              mapPoint;
          if (series.mapData) {
            mapPoint = point[joinBy[1]] !== undefined && series.mapMap[point[joinBy[1]]];
            if (mapPoint) {
              if (series.xyFromShape) {
                point.x = mapPoint._midX;
                point.y = mapPoint._midY;
              }
              extend(point, mapPoint);
            } else {
              point.value = point.value || null;
            }
          }
          return point;
        },
        onMouseOver: function(e) {
          clearTimeout(this.colorInterval);
          if (this.value !== null || this.series.options.nullInteraction) {
            Point.prototype.onMouseOver.call(this, e);
          } else {
            this.series.onMouseOut(e);
          }
        },
        zoomTo: function() {
          var point = this,
              series = point.series;
          series.xAxis.setExtremes(point._minX, point._maxX, false);
          series.yAxis.setExtremes(point._minY, point._maxY, false);
          series.chart.redraw();
        }
      }, colorPointMixin));
    }(Highcharts));
    (function(H) {
      var seriesType = H.seriesType,
          seriesTypes = H.seriesTypes;
      seriesType('mapline', 'map', {}, {
        type: 'mapline',
        colorProp: 'stroke',
        drawLegendSymbol: seriesTypes.line.prototype.drawLegendSymbol
      });
    }(Highcharts));
    (function(H) {
      var merge = H.merge,
          Point = H.Point,
          seriesType = H.seriesType;
      seriesType('mappoint', 'scatter', {dataLabels: {
          enabled: true,
          formatter: function() {
            return this.point.name;
          },
          crop: false,
          defer: false,
          overflow: false,
          style: {color: '#000000'}
        }}, {
        type: 'mappoint',
        forceDL: true
      }, {applyOptions: function(options, x) {
          var mergedOptions = (options.lat !== undefined && options.lon !== undefined ? merge(options, this.series.chart.fromLatLonToPoint(options)) : options);
          return Point.prototype.applyOptions.call(this, mergedOptions, x);
        }});
    }(Highcharts));
    (function(H) {
      var arrayMax = H.arrayMax,
          arrayMin = H.arrayMin,
          Axis = H.Axis,
          color = H.color,
          each = H.each,
          isNumber = H.isNumber,
          noop = H.noop,
          pick = H.pick,
          pInt = H.pInt,
          Point = H.Point,
          Series = H.Series,
          seriesType = H.seriesType,
          seriesTypes = H.seriesTypes;
      seriesType('bubble', 'scatter', {
        dataLabels: {
          formatter: function() {
            return this.point.z;
          },
          inside: true,
          verticalAlign: 'middle'
        },
        marker: {
          radius: null,
          states: {hover: {radiusPlus: 0}},
          symbol: 'circle'
        },
        minSize: 8,
        maxSize: '20%',
        softThreshold: false,
        states: {hover: {halo: {size: 5}}},
        tooltip: {pointFormat: '({point.x}, {point.y}), Size: {point.z}'},
        turboThreshold: 0,
        zThreshold: 0,
        zoneAxis: 'z'
      }, {
        pointArrayMap: ['y', 'z'],
        parallelArrays: ['x', 'y', 'z'],
        trackerGroups: ['group', 'dataLabelsGroup'],
        specialGroup: 'group',
        bubblePadding: true,
        zoneAxis: 'z',
        directTouch: true,
        getRadii: function(zMin, zMax, minSize, maxSize) {
          var len,
              i,
              pos,
              zData = this.zData,
              radii = [],
              options = this.options,
              sizeByArea = options.sizeBy !== 'width',
              zThreshold = options.zThreshold,
              zRange = zMax - zMin,
              value,
              radius;
          for (i = 0, len = zData.length; i < len; i++) {
            value = zData[i];
            if (options.sizeByAbsoluteValue && value !== null) {
              value = Math.abs(value - zThreshold);
              zMax = Math.max(zMax - zThreshold, Math.abs(zMin - zThreshold));
              zMin = 0;
            }
            if (value === null) {
              radius = null;
            } else if (value < zMin) {
              radius = minSize / 2 - 1;
            } else {
              pos = zRange > 0 ? (value - zMin) / zRange : 0.5;
              if (sizeByArea && pos >= 0) {
                pos = Math.sqrt(pos);
              }
              radius = Math.ceil(minSize + pos * (maxSize - minSize)) / 2;
            }
            radii.push(radius);
          }
          this.radii = radii;
        },
        animate: function(init) {
          var animation = this.options.animation;
          if (!init) {
            each(this.points, function(point) {
              var graphic = point.graphic,
                  animationTarget;
              if (graphic && graphic.width) {
                animationTarget = {
                  x: graphic.x,
                  y: graphic.y,
                  width: graphic.width,
                  height: graphic.height
                };
                graphic.attr({
                  x: point.plotX,
                  y: point.plotY,
                  width: 1,
                  height: 1
                });
                graphic.animate(animationTarget, animation);
              }
            });
            this.animate = null;
          }
        },
        translate: function() {
          var i,
              data = this.data,
              point,
              radius,
              radii = this.radii;
          seriesTypes.scatter.prototype.translate.call(this);
          i = data.length;
          while (i--) {
            point = data[i];
            radius = radii ? radii[i] : 0;
            if (isNumber(radius) && radius >= this.minPxSize / 2) {
              point.marker = H.extend(point.marker, {
                radius: radius,
                width: 2 * radius,
                height: 2 * radius
              });
              point.dlBox = {
                x: point.plotX - radius,
                y: point.plotY - radius,
                width: 2 * radius,
                height: 2 * radius
              };
            } else {
              point.shapeArgs = point.plotY = point.dlBox = undefined;
            }
          }
        },
        alignDataLabel: seriesTypes.column.prototype.alignDataLabel,
        buildKDTree: noop,
        applyZones: noop
      }, {
        haloPath: function(size) {
          return Point.prototype.haloPath.call(this, size === 0 ? 0 : (this.marker ? this.marker.radius || 0 : 0) + size);
        },
        ttBelow: false
      });
      Axis.prototype.beforePadding = function() {
        var axis = this,
            axisLength = this.len,
            chart = this.chart,
            pxMin = 0,
            pxMax = axisLength,
            isXAxis = this.isXAxis,
            dataKey = isXAxis ? 'xData' : 'yData',
            min = this.min,
            extremes = {},
            smallestSize = Math.min(chart.plotWidth, chart.plotHeight),
            zMin = Number.MAX_VALUE,
            zMax = -Number.MAX_VALUE,
            range = this.max - min,
            transA = axisLength / range,
            activeSeries = [];
        each(this.series, function(series) {
          var seriesOptions = series.options,
              zData;
          if (series.bubblePadding && (series.visible || !chart.options.chart.ignoreHiddenSeries)) {
            axis.allowZoomOutside = true;
            activeSeries.push(series);
            if (isXAxis) {
              each(['minSize', 'maxSize'], function(prop) {
                var length = seriesOptions[prop],
                    isPercent = /%$/.test(length);
                length = pInt(length);
                extremes[prop] = isPercent ? smallestSize * length / 100 : length;
              });
              series.minPxSize = extremes.minSize;
              series.maxPxSize = Math.max(extremes.maxSize, extremes.minSize);
              zData = series.zData;
              if (zData.length) {
                zMin = pick(seriesOptions.zMin, Math.min(zMin, Math.max(arrayMin(zData), seriesOptions.displayNegative === false ? seriesOptions.zThreshold : -Number.MAX_VALUE)));
                zMax = pick(seriesOptions.zMax, Math.max(zMax, arrayMax(zData)));
              }
            }
          }
        });
        each(activeSeries, function(series) {
          var data = series[dataKey],
              i = data.length,
              radius;
          if (isXAxis) {
            series.getRadii(zMin, zMax, series.minPxSize, series.maxPxSize);
          }
          if (range > 0) {
            while (i--) {
              if (isNumber(data[i]) && axis.dataMin <= data[i] && data[i] <= axis.dataMax) {
                radius = series.radii[i];
                pxMin = Math.min(((data[i] - min) * transA) - radius, pxMin);
                pxMax = Math.max(((data[i] - min) * transA) + radius, pxMax);
              }
            }
          }
        });
        if (activeSeries.length && range > 0 && !this.isLog) {
          pxMax -= axisLength;
          transA *= (axisLength + pxMin - pxMax) / axisLength;
          each([['min', 'userMin', pxMin], ['max', 'userMax', pxMax]], function(keys) {
            if (pick(axis.options[keys[0]], axis[keys[1]]) === undefined) {
              axis[keys[0]] += keys[2] / transA;
            }
          });
        }
      };
    }(Highcharts));
    (function(H) {
      var merge = H.merge,
          Point = H.Point,
          seriesType = H.seriesType,
          seriesTypes = H.seriesTypes;
      if (seriesTypes.bubble) {
        seriesType('mapbubble', 'bubble', {
          animationLimit: 500,
          tooltip: {pointFormat: '{point.name}: {point.z}'}
        }, {
          xyFromShape: true,
          type: 'mapbubble',
          pointArrayMap: ['z'],
          getMapData: seriesTypes.map.prototype.getMapData,
          getBox: seriesTypes.map.prototype.getBox,
          setData: seriesTypes.map.prototype.setData
        }, {
          applyOptions: function(options, x) {
            var point;
            if (options && options.lat !== undefined && options.lon !== undefined) {
              point = Point.prototype.applyOptions.call(this, merge(options, this.series.chart.fromLatLonToPoint(options)), x);
            } else {
              point = seriesTypes.map.prototype.pointClass.prototype.applyOptions.call(this, options, x);
            }
            return point;
          },
          isValid: function() {
            return typeof this.z === 'number';
          },
          ttBelow: false
        });
      }
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
            point.graphic.css(this.colorAttribs(point));
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
    (function(H) {
      var Chart = H.Chart,
          each = H.each,
          extend = H.extend,
          format = H.format,
          merge = H.merge,
          win = H.win,
          wrap = H.wrap;
      function pointInPolygon(point, polygon) {
        var i,
            j,
            rel1,
            rel2,
            c = false,
            x = point.x,
            y = point.y;
        for (i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
          rel1 = polygon[i][1] > y;
          rel2 = polygon[j][1] > y;
          if (rel1 !== rel2 && (x < (polygon[j][0] - polygon[i][0]) * (y - polygon[i][1]) / (polygon[j][1] - polygon[i][1]) + polygon[i][0])) {
            c = !c;
          }
        }
        return c;
      }
      Chart.prototype.transformFromLatLon = function(latLon, transform) {
        if (win.proj4 === undefined) {
          H.error(21);
          return {
            x: 0,
            y: null
          };
        }
        var projected = win.proj4(transform.crs, [latLon.lon, latLon.lat]),
            cosAngle = transform.cosAngle || (transform.rotation && Math.cos(transform.rotation)),
            sinAngle = transform.sinAngle || (transform.rotation && Math.sin(transform.rotation)),
            rotated = transform.rotation ? [projected[0] * cosAngle + projected[1] * sinAngle, -projected[0] * sinAngle + projected[1] * cosAngle] : projected;
        return {
          x: ((rotated[0] - (transform.xoffset || 0)) * (transform.scale || 1) + (transform.xpan || 0)) * (transform.jsonres || 1) + (transform.jsonmarginX || 0),
          y: (((transform.yoffset || 0) - rotated[1]) * (transform.scale || 1) + (transform.ypan || 0)) * (transform.jsonres || 1) - (transform.jsonmarginY || 0)
        };
      };
      Chart.prototype.transformToLatLon = function(point, transform) {
        if (win.proj4 === undefined) {
          H.error(21);
          return;
        }
        var normalized = {
          x: ((point.x - (transform.jsonmarginX || 0)) / (transform.jsonres || 1) - (transform.xpan || 0)) / (transform.scale || 1) + (transform.xoffset || 0),
          y: ((-point.y - (transform.jsonmarginY || 0)) / (transform.jsonres || 1) + (transform.ypan || 0)) / (transform.scale || 1) + (transform.yoffset || 0)
        },
            cosAngle = transform.cosAngle || (transform.rotation && Math.cos(transform.rotation)),
            sinAngle = transform.sinAngle || (transform.rotation && Math.sin(transform.rotation)),
            projected = win.proj4(transform.crs, 'WGS84', transform.rotation ? {
              x: normalized.x * cosAngle + normalized.y * -sinAngle,
              y: normalized.x * sinAngle + normalized.y * cosAngle
            } : normalized);
        return {
          lat: projected.y,
          lon: projected.x
        };
      };
      Chart.prototype.fromPointToLatLon = function(point) {
        var transforms = this.mapTransforms,
            transform;
        if (!transforms) {
          H.error(22);
          return;
        }
        for (transform in transforms) {
          if (transforms.hasOwnProperty(transform) && transforms[transform].hitZone && pointInPolygon({
            x: point.x,
            y: -point.y
          }, transforms[transform].hitZone.coordinates[0])) {
            return this.transformToLatLon(point, transforms[transform]);
          }
        }
        return this.transformToLatLon(point, transforms['default']);
      };
      Chart.prototype.fromLatLonToPoint = function(latLon) {
        var transforms = this.mapTransforms,
            transform,
            coords;
        if (!transforms) {
          H.error(22);
          return {
            x: 0,
            y: null
          };
        }
        for (transform in transforms) {
          if (transforms.hasOwnProperty(transform) && transforms[transform].hitZone) {
            coords = this.transformFromLatLon(latLon, transforms[transform]);
            if (pointInPolygon({
              x: coords.x,
              y: -coords.y
            }, transforms[transform].hitZone.coordinates[0])) {
              return coords;
            }
          }
        }
        return this.transformFromLatLon(latLon, transforms['default']);
      };
      H.geojson = function(geojson, hType, series) {
        var mapData = [],
            path = [],
            polygonToPath = function(polygon) {
              var i,
                  len = polygon.length;
              path.push('M');
              for (i = 0; i < len; i++) {
                if (i === 1) {
                  path.push('L');
                }
                path.push(polygon[i][0], -polygon[i][1]);
              }
            };
        hType = hType || 'map';
        each(geojson.features, function(feature) {
          var geometry = feature.geometry,
              type = geometry.type,
              coordinates = geometry.coordinates,
              properties = feature.properties,
              point;
          path = [];
          if (hType === 'map' || hType === 'mapbubble') {
            if (type === 'Polygon') {
              each(coordinates, polygonToPath);
              path.push('Z');
            } else if (type === 'MultiPolygon') {
              each(coordinates, function(items) {
                each(items, polygonToPath);
              });
              path.push('Z');
            }
            if (path.length) {
              point = {path: path};
            }
          } else if (hType === 'mapline') {
            if (type === 'LineString') {
              polygonToPath(coordinates);
            } else if (type === 'MultiLineString') {
              each(coordinates, polygonToPath);
            }
            if (path.length) {
              point = {path: path};
            }
          } else if (hType === 'mappoint') {
            if (type === 'Point') {
              point = {
                x: coordinates[0],
                y: -coordinates[1]
              };
            }
          }
          if (point) {
            mapData.push(extend(point, {
              name: properties.name || properties.NAME,
              properties: properties
            }));
          }
        });
        if (series && geojson.copyrightShort) {
          series.chart.mapCredits = format(series.chart.options.credits.mapText, {geojson: geojson});
          series.chart.mapCreditsFull = format(series.chart.options.credits.mapTextFull, {geojson: geojson});
        }
        return mapData;
      };
      wrap(Chart.prototype, 'addCredits', function(proceed, credits) {
        credits = merge(true, this.options.credits, credits);
        if (this.mapCredits) {
          credits.href = null;
        }
        proceed.call(this, credits);
        if (this.credits && this.mapCreditsFull) {
          this.credits.attr({title: this.mapCreditsFull});
        }
      });
    }(Highcharts));
    (function(H) {
      var Chart = H.Chart,
          defaultOptions = H.defaultOptions,
          each = H.each,
          extend = H.extend,
          merge = H.merge,
          pick = H.pick,
          Renderer = H.Renderer,
          SVGRenderer = H.SVGRenderer,
          VMLRenderer = H.VMLRenderer;
      extend(defaultOptions.lang, {
        zoomIn: 'Zoom in',
        zoomOut: 'Zoom out'
      });
      defaultOptions.mapNavigation = {
        buttonOptions: {
          alignTo: 'plotBox',
          align: 'left',
          verticalAlign: 'top',
          x: 0,
          width: 18,
          height: 18,
          padding: 5
        },
        buttons: {
          zoomIn: {
            onclick: function() {
              this.mapZoom(0.5);
            },
            text: '+',
            y: 0
          },
          zoomOut: {
            onclick: function() {
              this.mapZoom(2);
            },
            text: '-',
            y: 28
          }
        },
        mouseWheelSensitivity: 1.1
      };
      H.splitPath = function(path) {
        var i;
        path = path.replace(/([A-Za-z])/g, ' $1 ');
        path = path.replace(/^\s*/, '').replace(/\s*$/, '');
        path = path.split(/[ ,]+/);
        for (i = 0; i < path.length; i++) {
          if (!/[a-zA-Z]/.test(path[i])) {
            path[i] = parseFloat(path[i]);
          }
        }
        return path;
      };
      H.maps = {};
      function selectiveRoundedRect(x, y, w, h, rTopLeft, rTopRight, rBottomRight, rBottomLeft) {
        return ['M', x + rTopLeft, y, 'L', x + w - rTopRight, y, 'C', x + w - rTopRight / 2, y, x + w, y + rTopRight / 2, x + w, y + rTopRight, 'L', x + w, y + h - rBottomRight, 'C', x + w, y + h - rBottomRight / 2, x + w - rBottomRight / 2, y + h, x + w - rBottomRight, y + h, 'L', x + rBottomLeft, y + h, 'C', x + rBottomLeft / 2, y + h, x, y + h - rBottomLeft / 2, x, y + h - rBottomLeft, 'L', x, y + rTopLeft, 'C', x, y + rTopLeft / 2, x + rTopLeft / 2, y, x + rTopLeft, y, 'Z'];
      }
      SVGRenderer.prototype.symbols.topbutton = function(x, y, w, h, attr) {
        return selectiveRoundedRect(x - 1, y - 1, w, h, attr.r, attr.r, 0, 0);
      };
      SVGRenderer.prototype.symbols.bottombutton = function(x, y, w, h, attr) {
        return selectiveRoundedRect(x - 1, y - 1, w, h, 0, 0, attr.r, attr.r);
      };
      if (Renderer === VMLRenderer) {
        each(['topbutton', 'bottombutton'], function(shape) {
          VMLRenderer.prototype.symbols[shape] = SVGRenderer.prototype.symbols[shape];
        });
      }
      H.Map = H.mapChart = function(a, b, c) {
        var hasRenderToArg = typeof a === 'string' || a.nodeName,
            options = arguments[hasRenderToArg ? 1 : 0],
            hiddenAxis = {
              endOnTick: false,
              visible: false,
              minPadding: 0,
              maxPadding: 0,
              startOnTick: false
            },
            seriesOptions,
            defaultCreditsOptions = H.getOptions().credits;
        seriesOptions = options.series;
        options.series = null;
        options = merge({
          chart: {
            panning: 'xy',
            type: 'map'
          },
          credits: {
            mapText: pick(defaultCreditsOptions.mapText, ' \u00a9 <a href="{geojson.copyrightUrl}">' + '{geojson.copyrightShort}</a>'),
            mapTextFull: pick(defaultCreditsOptions.mapTextFull, '{geojson.copyright}')
          },
          tooltip: {followTouchMove: false},
          xAxis: hiddenAxis,
          yAxis: merge(hiddenAxis, {reversed: true})
        }, options, {chart: {
            inverted: false,
            alignTicks: false
          }});
        options.series = seriesOptions;
        return hasRenderToArg ? new Chart(a, options, c) : new Chart(options, b);
      };
    }(Highcharts));
  }));
})(require('process'));
