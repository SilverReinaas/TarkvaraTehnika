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
      var labelDistance = 3,
          wrap = H.wrap,
          each = H.each,
          extend = H.extend,
          isNumber = H.isNumber,
          pick = H.pick,
          Series = H.Series,
          SVGRenderer = H.SVGRenderer,
          Chart = H.Chart;
      H.setOptions({plotOptions: {series: {label: {
              enabled: true,
              connectorAllowed: true,
              connectorNeighbourDistance: 24,
              minFontSize: null,
              maxFontSize: null,
              onArea: null,
              style: {fontWeight: 'bold'},
              boxesToAvoid: []
            }}}});
      function ccw(x1, y1, x2, y2, x3, y3) {
        var cw = ((y3 - y1) * (x2 - x1)) - ((y2 - y1) * (x3 - x1));
        return cw > 0 ? true : cw < 0 ? false : true;
      }
      function intersectLine(x1, y1, x2, y2, x3, y3, x4, y4) {
        return ccw(x1, y1, x3, y3, x4, y4) !== ccw(x2, y2, x3, y3, x4, y4) && ccw(x1, y1, x2, y2, x3, y3) !== ccw(x1, y1, x2, y2, x4, y4);
      }
      function boxIntersectLine(x, y, w, h, x1, y1, x2, y2) {
        return (intersectLine(x, y, x + w, y, x1, y1, x2, y2) || intersectLine(x + w, y, x + w, y + h, x1, y1, x2, y2) || intersectLine(x, y + h, x + w, y + h, x1, y1, x2, y2) || intersectLine(x, y, x, y + h, x1, y1, x2, y2));
      }
      SVGRenderer.prototype.symbols.connector = function(x, y, w, h, options) {
        var anchorX = options && options.anchorX,
            anchorY = options && options.anchorY,
            path,
            yOffset,
            lateral = w / 2;
        if (isNumber(anchorX) && isNumber(anchorY)) {
          path = ['M', anchorX, anchorY];
          yOffset = y - anchorY;
          if (yOffset < 0) {
            yOffset = -h - yOffset;
          }
          if (yOffset < w) {
            lateral = anchorX < x + (w / 2) ? yOffset : w - yOffset;
          }
          if (anchorY > y + h) {
            path.push('L', x + lateral, y + h);
          } else if (anchorY < y) {
            path.push('L', x + lateral, y);
          } else if (anchorX < x) {
            path.push('L', x, y + h / 2);
          } else if (anchorX > x + w) {
            path.push('L', x + w, y + h / 2);
          }
        }
        return path || [];
      };
      Series.prototype.getPointsOnGraph = function() {
        if (!this.xAxis && !this.yAxis) {
          return;
        }
        var distance = 16,
            points = this.points,
            point,
            last,
            interpolated = [],
            i,
            deltaX,
            deltaY,
            delta,
            len,
            n,
            j,
            d,
            graph = this.graph || this.area,
            node = graph.element,
            inverted = this.chart.inverted,
            xAxis = this.xAxis,
            yAxis = this.yAxis,
            paneLeft = inverted ? yAxis.pos : xAxis.pos,
            paneTop = inverted ? xAxis.pos : yAxis.pos,
            onArea = pick(this.options.label.onArea, !!this.area),
            translatedThreshold = yAxis.getThreshold(this.options.threshold);
        if (this.getPointSpline && node.getPointAtLength && !onArea) {
          if (graph.toD) {
            d = graph.attr('d');
            graph.attr({d: graph.toD});
          }
          len = node.getTotalLength();
          for (i = 0; i < len; i += distance) {
            point = node.getPointAtLength(i);
            interpolated.push({
              chartX: paneLeft + point.x,
              chartY: paneTop + point.y,
              plotX: point.x,
              plotY: point.y
            });
          }
          if (d) {
            graph.attr({d: d});
          }
          point = points[points.length - 1];
          point.chartX = paneLeft + point.plotX;
          point.chartY = paneTop + point.plotY;
          interpolated.push(point);
        } else {
          len = points.length;
          for (i = 0; i < len; i += 1) {
            point = points[i];
            last = points[i - 1];
            point.chartX = paneLeft + point.plotX;
            point.chartY = paneTop + point.plotY;
            if (onArea) {
              point.chartCenterY = paneTop + (point.plotY + pick(point.yBottom, translatedThreshold)) / 2;
            }
            if (i > 0) {
              deltaX = Math.abs(point.chartX - last.chartX);
              deltaY = Math.abs(point.chartY - last.chartY);
              delta = Math.max(deltaX, deltaY);
              if (delta > distance) {
                n = Math.ceil(delta / distance);
                for (j = 1; j < n; j += 1) {
                  interpolated.push({
                    chartX: last.chartX + (point.chartX - last.chartX) * (j / n),
                    chartY: last.chartY + (point.chartY - last.chartY) * (j / n),
                    chartCenterY: last.chartCenterY + (point.chartCenterY - last.chartCenterY) * (j / n),
                    plotX: last.plotX + (point.plotX - last.plotX) * (j / n),
                    plotY: last.plotY + (point.plotY - last.plotY) * (j / n)
                  });
                }
              }
            }
            if (isNumber(point.plotY)) {
              interpolated.push(point);
            }
          }
        }
        return interpolated;
      };
      Series.prototype.labelFontSize = function(minFontSize, maxFontSize) {
        return minFontSize + ((this.sum / this.chart.labelSeriesMaxSum) * (maxFontSize - minFontSize)) + 'px';
      };
      Series.prototype.checkClearPoint = function(x, y, bBox, checkDistance) {
        var distToOthersSquared = Number.MAX_VALUE,
            distToPointSquared = Number.MAX_VALUE,
            dist,
            connectorPoint,
            connectorEnabled = this.options.label.connectorAllowed,
            onArea = pick(this.options.label.onArea, !!this.area),
            chart = this.chart,
            series,
            points,
            leastDistance = 16,
            withinRange,
            xDist,
            yDist,
            i,
            j;
        function intersectRect(r1, r2) {
          return !(r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top);
        }
        function getWeight(distToOthersSquared, distToPointSquared) {
          return distToOthersSquared - distToPointSquared;
        }
        for (i = 0; i < chart.boxesToAvoid.length; i += 1) {
          if (intersectRect(chart.boxesToAvoid[i], {
            left: x,
            right: x + bBox.width,
            top: y,
            bottom: y + bBox.height
          })) {
            return false;
          }
        }
        for (i = 0; i < chart.series.length; i += 1) {
          series = chart.series[i];
          points = series.interpolatedPoints;
          if (series.visible && points) {
            for (j = 1; j < points.length; j += 1) {
              if (points[j].chartX >= x - leastDistance && points[j - 1].chartX <= x + bBox.width + leastDistance) {
                if (boxIntersectLine(x, y, bBox.width, bBox.height, points[j - 1].chartX, points[j - 1].chartY, points[j].chartX, points[j].chartY)) {
                  return false;
                }
                if (this === series && !withinRange && checkDistance) {
                  withinRange = boxIntersectLine(x - leastDistance, y - leastDistance, bBox.width + 2 * leastDistance, bBox.height + 2 * leastDistance, points[j - 1].chartX, points[j - 1].chartY, points[j].chartX, points[j].chartY);
                }
              }
              if ((connectorEnabled || withinRange) && (this !== series || onArea)) {
                xDist = x + bBox.width / 2 - points[j].chartX;
                yDist = y + bBox.height / 2 - points[j].chartY;
                distToOthersSquared = Math.min(distToOthersSquared, xDist * xDist + yDist * yDist);
              }
            }
            if (!onArea && connectorEnabled && this === series && ((checkDistance && !withinRange) || distToOthersSquared < Math.pow(this.options.label.connectorNeighbourDistance, 2))) {
              for (j = 1; j < points.length; j += 1) {
                dist = Math.min((Math.pow(x + bBox.width / 2 - points[j].chartX, 2) + Math.pow(y + bBox.height / 2 - points[j].chartY, 2)), (Math.pow(x - points[j].chartX, 2) + Math.pow(y - points[j].chartY, 2)), (Math.pow(x + bBox.width - points[j].chartX, 2) + Math.pow(y - points[j].chartY, 2)), (Math.pow(x + bBox.width - points[j].chartX, 2) + Math.pow(y + bBox.height - points[j].chartY, 2)), (Math.pow(x - points[j].chartX, 2) + Math.pow(y + bBox.height - points[j].chartY, 2)));
                if (dist < distToPointSquared) {
                  distToPointSquared = dist;
                  connectorPoint = points[j];
                }
              }
              withinRange = true;
            }
          }
        }
        return !checkDistance || withinRange ? {
          x: x,
          y: y,
          weight: getWeight(distToOthersSquared, connectorPoint ? distToPointSquared : 0),
          connectorPoint: connectorPoint
        } : false;
      };
      Chart.prototype.drawSeriesLabels = function() {
        var chart = this,
            labelSeries = this.labelSeries;
        chart.boxesToAvoid = [];
        each(labelSeries, function(series) {
          series.interpolatedPoints = series.getPointsOnGraph();
          each(series.options.label.boxesToAvoid || [], function(box) {
            chart.boxesToAvoid.push(box);
          });
        });
        each(chart.series, function(series) {
          if (!series.xAxis && !series.yAxis) {
            return;
          }
          var bBox,
              x,
              y,
              results = [],
              clearPoint,
              i,
              best,
              labelOptions = series.options.label,
              inverted = chart.inverted,
              paneLeft = inverted ? series.yAxis.pos : series.xAxis.pos,
              paneTop = inverted ? series.xAxis.pos : series.yAxis.pos,
              paneWidth = chart.inverted ? series.yAxis.len : series.xAxis.len,
              paneHeight = chart.inverted ? series.xAxis.len : series.yAxis.len,
              points = series.interpolatedPoints,
              onArea = pick(labelOptions.onArea, !!series.area),
              label = series.labelBySeries,
              minFontSize = labelOptions.minFontSize,
              maxFontSize = labelOptions.maxFontSize;
          function insidePane(x, y, bBox) {
            return x > paneLeft && x <= paneLeft + paneWidth - bBox.width && y >= paneTop && y <= paneTop + paneHeight - bBox.height;
          }
          if (series.visible && !series.isSeriesBoosting && points) {
            if (!label) {
              series.labelBySeries = label = chart.renderer.label(series.name, 0, -9999, 'connector').css(extend({color: onArea ? chart.renderer.getContrast(series.color) : series.color}, series.options.label.style));
              if (minFontSize && maxFontSize) {
                label.css({fontSize: series.labelFontSize(minFontSize, maxFontSize)});
              }
              label.attr({
                padding: 0,
                opacity: chart.renderer.forExport ? 1 : 0,
                stroke: series.color,
                'stroke-width': 1,
                zIndex: 3
              }).add(series.group).animate({opacity: 1}, {duration: 200});
            }
            bBox = label.getBBox();
            bBox.width = Math.round(bBox.width);
            for (i = points.length - 1; i > 0; i -= 1) {
              if (onArea) {
                x = points[i].chartX - bBox.width / 2;
                y = points[i].chartCenterY - bBox.height / 2;
                if (insidePane(x, y, bBox)) {
                  best = series.checkClearPoint(x, y, bBox);
                }
                if (best) {
                  results.push(best);
                }
              } else {
                x = points[i].chartX + labelDistance;
                y = points[i].chartY - bBox.height - labelDistance;
                if (insidePane(x, y, bBox)) {
                  best = series.checkClearPoint(x, y, bBox);
                }
                if (best) {
                  results.push(best);
                }
                x = points[i].chartX + labelDistance;
                y = points[i].chartY + labelDistance;
                if (insidePane(x, y, bBox)) {
                  best = series.checkClearPoint(x, y, bBox);
                }
                if (best) {
                  results.push(best);
                }
                x = points[i].chartX - bBox.width - labelDistance;
                y = points[i].chartY + labelDistance;
                if (insidePane(x, y, bBox)) {
                  best = series.checkClearPoint(x, y, bBox);
                }
                if (best) {
                  results.push(best);
                }
                x = points[i].chartX - bBox.width - labelDistance;
                y = points[i].chartY - bBox.height - labelDistance;
                if (insidePane(x, y, bBox)) {
                  best = series.checkClearPoint(x, y, bBox);
                }
                if (best) {
                  results.push(best);
                }
              }
            }
            if (!results.length && !onArea) {
              for (x = paneLeft + paneWidth - bBox.width; x >= paneLeft; x -= 16) {
                for (y = paneTop; y < paneTop + paneHeight - bBox.height; y += 16) {
                  clearPoint = series.checkClearPoint(x, y, bBox, true);
                  if (clearPoint) {
                    results.push(clearPoint);
                  }
                }
              }
            }
            if (results.length) {
              results.sort(function(a, b) {
                return b.weight - a.weight;
              });
              best = results[0];
              chart.boxesToAvoid.push({
                left: best.x,
                right: best.x + bBox.width,
                top: best.y,
                bottom: best.y + bBox.height
              });
              var dist = Math.sqrt(Math.pow(Math.abs(best.x - label.x), 2), Math.pow(Math.abs(best.y - label.y), 2));
              if (dist) {
                var attr = {
                  opacity: chart.renderer.forExport ? 1 : 0,
                  x: best.x - paneLeft,
                  y: best.y - paneTop
                },
                    anim = {opacity: 1};
                if (dist <= 10) {
                  anim = {
                    x: attr.x,
                    y: attr.y
                  };
                  attr = {};
                }
                series.labelBySeries.attr(extend(attr, {
                  anchorX: best.connectorPoint && best.connectorPoint.plotX,
                  anchorY: best.connectorPoint && best.connectorPoint.plotY
                })).animate(anim);
                series.options.kdNow = true;
                series.buildKDTree();
                var closest = series.searchPoint({
                  chartX: best.x,
                  chartY: best.y
                }, true);
                label.closest = [closest, best.x - paneLeft - closest.plotX, best.y - paneTop - closest.plotY];
              }
            } else if (label) {
              series.labelBySeries = label.destroy();
            }
          }
        });
      };
      function drawLabels(proceed) {
        var chart = this,
            delay = Math.max(H.animObject(chart.renderer.globalAnimation).duration, 250),
            initial = !chart.hasRendered;
        proceed.apply(chart, [].slice.call(arguments, 1));
        chart.labelSeries = [];
        chart.labelSeriesMaxSum = 0;
        clearTimeout(chart.seriesLabelTimer);
        each(chart.series, function(series) {
          var options = series.options.label,
              label = series.labelBySeries,
              closest = label && label.closest;
          if (options.enabled && series.visible && (series.graph || series.area) && !series.isSeriesBoosting) {
            chart.labelSeries.push(series);
            if (options.minFontSize && options.maxFontSize) {
              series.sum = H.reduce(series.yData, function(pv, cv) {
                return (pv || 0) + (cv || 0);
              }, 0);
              chart.labelSeriesMaxSum = Math.max(chart.labelSeriesMaxSum, series.sum);
            }
            if (initial) {
              delay = Math.max(delay, H.animObject(series.options.animation).duration);
            }
            if (closest) {
              if (closest[0].plotX !== undefined) {
                label.animate({
                  x: closest[0].plotX + closest[1],
                  y: closest[0].plotY + closest[2]
                });
              } else {
                label.attr({opacity: 0});
              }
            }
          }
        });
        chart.seriesLabelTimer = H.syncTimeout(function() {
          chart.drawSeriesLabels();
        }, chart.renderer.forExport ? 0 : delay);
      }
      wrap(Chart.prototype, 'render', drawLabels);
      wrap(Chart.prototype, 'redraw', drawLabels);
    }(Highcharts));
  }));
})(require('process'));
