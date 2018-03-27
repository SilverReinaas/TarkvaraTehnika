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
    (function(Highcharts) {
      var H = Highcharts,
          defined = H.defined,
          each = H.each,
          extend = H.extend,
          merge = H.merge,
          pick = H.pick,
          timeUnits = H.timeUnits,
          win = H.win;
      Highcharts.Time = function(options) {
        this.update(options, false);
      };
      Highcharts.Time.prototype = {
        defaultOptions: {},
        update: function(options) {
          var useUTC = pick(options && options.useUTC, true),
              time = this;
          this.options = options = merge(true, this.options || {}, options);
          this.Date = options.Date || win.Date;
          this.useUTC = useUTC;
          this.timezoneOffset = useUTC && options.timezoneOffset;
          this.getTimezoneOffset = this.timezoneOffsetFunction();
          this.variableTimezone = !!(!useUTC || options.getTimezoneOffset || options.timezone);
          if (this.variableTimezone || this.timezoneOffset) {
            this.get = function(unit, date) {
              var realMs = date.getTime(),
                  ms = realMs - time.getTimezoneOffset(date),
                  ret;
              date.setTime(ms);
              ret = date['getUTC' + unit]();
              date.setTime(realMs);
              return ret;
            };
            this.set = function(unit, date, value) {
              var ms,
                  offset,
                  newOffset;
              if (H.inArray(unit, ['Milliseconds', 'Seconds', 'Minutes']) !== -1) {
                date['set' + unit](value);
              } else {
                offset = time.getTimezoneOffset(date);
                ms = date.getTime() - offset;
                date.setTime(ms);
                date['setUTC' + unit](value);
                newOffset = time.getTimezoneOffset(date);
                ms = date.getTime() + newOffset;
                date.setTime(ms);
              }
            };
          } else if (useUTC) {
            this.get = function(unit, date) {
              return date['getUTC' + unit]();
            };
            this.set = function(unit, date, value) {
              return date['setUTC' + unit](value);
            };
          } else {
            this.get = function(unit, date) {
              return date['get' + unit]();
            };
            this.set = function(unit, date, value) {
              return date['set' + unit](value);
            };
          }
        },
        makeTime: function(year, month, date, hours, minutes, seconds) {
          var d,
              offset,
              newOffset;
          if (this.useUTC) {
            d = this.Date.UTC.apply(0, arguments);
            offset = this.getTimezoneOffset(d);
            d += offset;
            newOffset = this.getTimezoneOffset(d);
            if (offset !== newOffset) {
              d += newOffset - offset;
            } else if (offset - 36e5 === this.getTimezoneOffset(d - 36e5) && !H.isSafari) {
              d -= 36e5;
            }
          } else {
            d = new this.Date(year, month, pick(date, 1), pick(hours, 0), pick(minutes, 0), pick(seconds, 0)).getTime();
          }
          return d;
        },
        timezoneOffsetFunction: function() {
          var time = this,
              options = this.options,
              moment = win.moment;
          if (!this.useUTC) {
            return function(timestamp) {
              return new Date(timestamp).getTimezoneOffset() * 60000;
            };
          }
          if (options.timezone) {
            if (!moment) {
              H.error(25);
            } else {
              return function(timestamp) {
                return -moment.tz(timestamp, options.timezone).utcOffset() * 60000;
              };
            }
          }
          if (this.useUTC && options.getTimezoneOffset) {
            return function(timestamp) {
              return options.getTimezoneOffset(timestamp) * 60000;
            };
          }
          return function() {
            return (time.timezoneOffset || 0) * 60000;
          };
        },
        dateFormat: function(format, timestamp, capitalize) {
          if (!H.defined(timestamp) || isNaN(timestamp)) {
            return H.defaultOptions.lang.invalidDate || '';
          }
          format = H.pick(format, '%Y-%m-%d %H:%M:%S');
          var time = this,
              date = new this.Date(timestamp),
              hours = this.get('Hours', date),
              day = this.get('Day', date),
              dayOfMonth = this.get('Date', date),
              month = this.get('Month', date),
              fullYear = this.get('FullYear', date),
              lang = H.defaultOptions.lang,
              langWeekdays = lang.weekdays,
              shortWeekdays = lang.shortWeekdays,
              pad = H.pad,
              replacements = H.extend({
                'a': shortWeekdays ? shortWeekdays[day] : langWeekdays[day].substr(0, 3),
                'A': langWeekdays[day],
                'd': pad(dayOfMonth),
                'e': pad(dayOfMonth, 2, ' '),
                'w': day,
                'b': lang.shortMonths[month],
                'B': lang.months[month],
                'm': pad(month + 1),
                'y': fullYear.toString().substr(2, 2),
                'Y': fullYear,
                'H': pad(hours),
                'k': hours,
                'I': pad((hours % 12) || 12),
                'l': (hours % 12) || 12,
                'M': pad(time.get('Minutes', date)),
                'p': hours < 12 ? 'AM' : 'PM',
                'P': hours < 12 ? 'am' : 'pm',
                'S': pad(date.getSeconds()),
                'L': pad(Math.round(timestamp % 1000), 3)
              }, H.dateFormats);
          H.objectEach(replacements, function(val, key) {
            while (format.indexOf('%' + key) !== -1) {
              format = format.replace('%' + key, typeof val === 'function' ? val.call(time, timestamp) : val);
            }
          });
          return capitalize ? format.substr(0, 1).toUpperCase() + format.substr(1) : format;
        },
        getTimeTicks: function(normalizedInterval, min, max, startOfWeek) {
          var time = this,
              Date = time.Date,
              tickPositions = [],
              i,
              higherRanks = {},
              minYear,
              minDate = new Date(min),
              interval = normalizedInterval.unitRange,
              count = normalizedInterval.count || 1,
              variableDayLength;
          if (defined(min)) {
            time.set('Milliseconds', minDate, interval >= timeUnits.second ? 0 : count * Math.floor(time.get('Milliseconds', minDate) / count));
            if (interval >= timeUnits.second) {
              time.set('Seconds', minDate, interval >= timeUnits.minute ? 0 : count * Math.floor(time.get('Seconds', minDate) / count));
            }
            if (interval >= timeUnits.minute) {
              time.set('Minutes', minDate, interval >= timeUnits.hour ? 0 : count * Math.floor(time.get('Minutes', minDate) / count));
            }
            if (interval >= timeUnits.hour) {
              time.set('Hours', minDate, interval >= timeUnits.day ? 0 : count * Math.floor(time.get('Hours', minDate) / count));
            }
            if (interval >= timeUnits.day) {
              time.set('Date', minDate, interval >= timeUnits.month ? 1 : count * Math.floor(time.get('Date', minDate) / count));
            }
            if (interval >= timeUnits.month) {
              time.set('Month', minDate, interval >= timeUnits.year ? 0 : count * Math.floor(time.get('Month', minDate) / count));
              minYear = time.get('FullYear', minDate);
            }
            if (interval >= timeUnits.year) {
              minYear -= minYear % count;
              time.set('FullYear', minDate, minYear);
            }
            if (interval === timeUnits.week) {
              time.set('Date', minDate, (time.get('Date', minDate) - time.get('Day', minDate) + pick(startOfWeek, 1)));
            }
            minYear = time.get('FullYear', minDate);
            var minMonth = time.get('Month', minDate),
                minDateDate = time.get('Date', minDate),
                minHours = time.get('Hours', minDate);
            min = minDate.getTime();
            if (time.variableTimezone) {
              variableDayLength = (max - min > 4 * timeUnits.month || time.getTimezoneOffset(min) !== time.getTimezoneOffset(max));
            }
            var t = minDate.getTime();
            i = 1;
            while (t < max) {
              tickPositions.push(t);
              if (interval === timeUnits.year) {
                t = time.makeTime(minYear + i * count, 0);
              } else if (interval === timeUnits.month) {
                t = time.makeTime(minYear, minMonth + i * count);
              } else if (variableDayLength && (interval === timeUnits.day || interval === timeUnits.week)) {
                t = time.makeTime(minYear, minMonth, minDateDate + i * count * (interval === timeUnits.day ? 1 : 7));
              } else if (variableDayLength && interval === timeUnits.hour && count > 1) {
                t = time.makeTime(minYear, minMonth, minDateDate, minHours + i * count);
              } else {
                t += interval * count;
              }
              i++;
            }
            tickPositions.push(t);
            if (interval <= timeUnits.hour && tickPositions.length < 10000) {
              each(tickPositions, function(t) {
                if (t % 1800000 === 0 && time.dateFormat('%H%M%S%L', t) === '000000000') {
                  higherRanks[t] = 'day';
                }
              });
            }
          }
          tickPositions.info = extend(normalizedInterval, {
            higherRanks: higherRanks,
            totalRange: interval * count
          });
          return tickPositions;
        }
      };
    }(Highcharts));
    (function(H) {
      var addEvent = H.addEvent,
          Axis = H.Axis,
          Chart = H.Chart,
          css = H.css,
          defined = H.defined,
          each = H.each,
          extend = H.extend,
          noop = H.noop,
          pick = H.pick,
          Series = H.Series,
          timeUnits = H.timeUnits,
          wrap = H.wrap;
      wrap(Series.prototype, 'init', function(proceed) {
        var series = this,
            xAxis;
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));
        xAxis = series.xAxis;
        if (xAxis && xAxis.options.ordinal) {
          addEvent(series, 'updatedData', function() {
            delete xAxis.ordinalIndex;
          });
        }
      });
      wrap(Axis.prototype, 'getTimeTicks', function(proceed, normalizedInterval, min, max, startOfWeek, positions, closestDistance, findHigherRanks) {
        var start = 0,
            end,
            segmentPositions,
            higherRanks = {},
            hasCrossedHigherRank,
            info,
            posLength,
            outsideMax,
            groupPositions = [],
            lastGroupPosition = -Number.MAX_VALUE,
            tickPixelIntervalOption = this.options.tickPixelInterval,
            time = this.chart.time;
        if ((!this.options.ordinal && !this.options.breaks) || !positions || positions.length < 3 || min === undefined) {
          return proceed.call(this, normalizedInterval, min, max, startOfWeek);
        }
        posLength = positions.length;
        for (end = 0; end < posLength; end++) {
          outsideMax = end && positions[end - 1] > max;
          if (positions[end] < min) {
            start = end;
          }
          if (end === posLength - 1 || positions[end + 1] - positions[end] > closestDistance * 5 || outsideMax) {
            if (positions[end] > lastGroupPosition) {
              segmentPositions = proceed.call(this, normalizedInterval, positions[start], positions[end], startOfWeek);
              while (segmentPositions.length && segmentPositions[0] <= lastGroupPosition) {
                segmentPositions.shift();
              }
              if (segmentPositions.length) {
                lastGroupPosition = segmentPositions[segmentPositions.length - 1];
              }
              groupPositions = groupPositions.concat(segmentPositions);
            }
            start = end + 1;
          }
          if (outsideMax) {
            break;
          }
        }
        info = segmentPositions.info;
        if (findHigherRanks && info.unitRange <= timeUnits.hour) {
          end = groupPositions.length - 1;
          for (start = 1; start < end; start++) {
            if (time.dateFormat('%d', groupPositions[start]) !== time.dateFormat('%d', groupPositions[start - 1])) {
              higherRanks[groupPositions[start]] = 'day';
              hasCrossedHigherRank = true;
            }
          }
          if (hasCrossedHigherRank) {
            higherRanks[groupPositions[0]] = 'day';
          }
          info.higherRanks = higherRanks;
        }
        groupPositions.info = info;
        if (findHigherRanks && defined(tickPixelIntervalOption)) {
          var length = groupPositions.length,
              i = length,
              itemToRemove,
              translated,
              translatedArr = [],
              lastTranslated,
              medianDistance,
              distance,
              distances = [];
          while (i--) {
            translated = this.translate(groupPositions[i]);
            if (lastTranslated) {
              distances[i] = lastTranslated - translated;
            }
            translatedArr[i] = lastTranslated = translated;
          }
          distances.sort();
          medianDistance = distances[Math.floor(distances.length / 2)];
          if (medianDistance < tickPixelIntervalOption * 0.6) {
            medianDistance = null;
          }
          i = groupPositions[length - 1] > max ? length - 1 : length;
          lastTranslated = undefined;
          while (i--) {
            translated = translatedArr[i];
            distance = Math.abs(lastTranslated - translated);
            if (lastTranslated && distance < tickPixelIntervalOption * 0.8 && (medianDistance === null || distance < medianDistance * 0.8)) {
              if (higherRanks[groupPositions[i]] && !higherRanks[groupPositions[i + 1]]) {
                itemToRemove = i + 1;
                lastTranslated = translated;
              } else {
                itemToRemove = i;
              }
              groupPositions.splice(itemToRemove, 1);
            } else {
              lastTranslated = translated;
            }
          }
        }
        return groupPositions;
      });
      extend(Axis.prototype, {
        beforeSetTickPositions: function() {
          var axis = this,
              len,
              ordinalPositions = [],
              useOrdinal = false,
              dist,
              extremes = axis.getExtremes(),
              min = extremes.min,
              max = extremes.max,
              minIndex,
              maxIndex,
              slope,
              hasBreaks = axis.isXAxis && !!axis.options.breaks,
              isOrdinal = axis.options.ordinal,
              overscrollPointsRange = Number.MAX_VALUE,
              ignoreHiddenSeries = axis.chart.options.chart.ignoreHiddenSeries,
              isNavigatorAxis = axis.options.className === 'highcharts-navigator-xaxis',
              i;
          if (axis.options.overscroll && axis.max === axis.dataMax && (!axis.chart.mouseIsDown || isNavigatorAxis) && (!axis.eventArgs || axis.eventArgs && axis.eventArgs.trigger !== 'navigator')) {
            axis.max += axis.options.overscroll;
            if (!isNavigatorAxis && defined(axis.userMin)) {
              axis.min += axis.options.overscroll;
            }
          }
          if (isOrdinal || hasBreaks) {
            each(axis.series, function(series, i) {
              if ((!ignoreHiddenSeries || series.visible !== false) && (series.takeOrdinalPosition !== false || hasBreaks)) {
                ordinalPositions = ordinalPositions.concat(series.processedXData);
                len = ordinalPositions.length;
                ordinalPositions.sort(function(a, b) {
                  return a - b;
                });
                overscrollPointsRange = Math.min(overscrollPointsRange, pick(series.closestPointRange, overscrollPointsRange));
                if (len) {
                  i = len - 1;
                  while (i--) {
                    if (ordinalPositions[i] === ordinalPositions[i + 1]) {
                      ordinalPositions.splice(i, 1);
                    }
                  }
                }
              }
            });
            len = ordinalPositions.length;
            if (len > 2) {
              dist = ordinalPositions[1] - ordinalPositions[0];
              i = len - 1;
              while (i-- && !useOrdinal) {
                if (ordinalPositions[i + 1] - ordinalPositions[i] !== dist) {
                  useOrdinal = true;
                }
              }
              if (!axis.options.keepOrdinalPadding && (ordinalPositions[0] - min > dist || max - ordinalPositions[ordinalPositions.length - 1] > dist)) {
                useOrdinal = true;
              }
            } else if (axis.options.overscroll) {
              if (len === 2) {
                overscrollPointsRange = ordinalPositions[1] - ordinalPositions[0];
              } else if (len === 1) {
                overscrollPointsRange = axis.options.overscroll;
                ordinalPositions = [ordinalPositions[0], ordinalPositions[0] + overscrollPointsRange];
              } else {
                overscrollPointsRange = axis.overscrollPointsRange;
              }
            }
            if (useOrdinal) {
              if (axis.options.overscroll) {
                axis.overscrollPointsRange = overscrollPointsRange;
                ordinalPositions = ordinalPositions.concat(axis.getOverscrollPositions());
              }
              axis.ordinalPositions = ordinalPositions;
              minIndex = axis.ordinal2lin(Math.max(min, ordinalPositions[0]), true);
              maxIndex = Math.max(axis.ordinal2lin(Math.min(max, ordinalPositions[ordinalPositions.length - 1]), true), 1);
              axis.ordinalSlope = slope = (max - min) / (maxIndex - minIndex);
              axis.ordinalOffset = min - (minIndex * slope);
            } else {
              axis.overscrollPointsRange = pick(axis.closestPointRange, axis.overscrollPointsRange);
              axis.ordinalPositions = axis.ordinalSlope = axis.ordinalOffset = undefined;
            }
          }
          axis.isOrdinal = isOrdinal && useOrdinal;
          axis.groupIntervalFactor = null;
        },
        val2lin: function(val, toIndex) {
          var axis = this,
              ordinalPositions = axis.ordinalPositions,
              ret;
          if (!ordinalPositions) {
            ret = val;
          } else {
            var ordinalLength = ordinalPositions.length,
                i,
                distance,
                ordinalIndex;
            i = ordinalLength;
            while (i--) {
              if (ordinalPositions[i] === val) {
                ordinalIndex = i;
                break;
              }
            }
            i = ordinalLength - 1;
            while (i--) {
              if (val > ordinalPositions[i] || i === 0) {
                distance = (val - ordinalPositions[i]) / (ordinalPositions[i + 1] - ordinalPositions[i]);
                ordinalIndex = i + distance;
                break;
              }
            }
            ret = toIndex ? ordinalIndex : axis.ordinalSlope * (ordinalIndex || 0) + axis.ordinalOffset;
          }
          return ret;
        },
        lin2val: function(val, fromIndex) {
          var axis = this,
              ordinalPositions = axis.ordinalPositions,
              ret;
          if (!ordinalPositions) {
            ret = val;
          } else {
            var ordinalSlope = axis.ordinalSlope,
                ordinalOffset = axis.ordinalOffset,
                i = ordinalPositions.length - 1,
                linearEquivalentLeft,
                linearEquivalentRight,
                distance;
            if (fromIndex) {
              if (val < 0) {
                val = ordinalPositions[0];
              } else if (val > i) {
                val = ordinalPositions[i];
              } else {
                i = Math.floor(val);
                distance = val - i;
              }
            } else {
              while (i--) {
                linearEquivalentLeft = (ordinalSlope * i) + ordinalOffset;
                if (val >= linearEquivalentLeft) {
                  linearEquivalentRight = (ordinalSlope * (i + 1)) + ordinalOffset;
                  distance = (val - linearEquivalentLeft) / (linearEquivalentRight - linearEquivalentLeft);
                  break;
                }
              }
            }
            return distance !== undefined && ordinalPositions[i] !== undefined ? ordinalPositions[i] + (distance ? distance * (ordinalPositions[i + 1] - ordinalPositions[i]) : 0) : val;
          }
          return ret;
        },
        getExtendedPositions: function() {
          var axis = this,
              chart = axis.chart,
              grouping = axis.series[0].currentDataGrouping,
              ordinalIndex = axis.ordinalIndex,
              key = grouping ? grouping.count + grouping.unitName : 'raw',
              overscroll = axis.options.overscroll,
              extremes = axis.getExtremes(),
              fakeAxis,
              fakeSeries;
          if (!ordinalIndex) {
            ordinalIndex = axis.ordinalIndex = {};
          }
          if (!ordinalIndex[key]) {
            fakeAxis = {
              series: [],
              chart: chart,
              getExtremes: function() {
                return {
                  min: extremes.dataMin,
                  max: extremes.dataMax + overscroll
                };
              },
              options: {ordinal: true},
              val2lin: Axis.prototype.val2lin,
              ordinal2lin: Axis.prototype.ordinal2lin
            };
            each(axis.series, function(series) {
              fakeSeries = {
                xAxis: fakeAxis,
                xData: series.xData.slice(),
                chart: chart,
                destroyGroupedData: noop
              };
              fakeSeries.xData = fakeSeries.xData.concat(axis.getOverscrollPositions());
              fakeSeries.options = {dataGrouping: grouping ? {
                  enabled: true,
                  forced: true,
                  approximation: 'open',
                  units: [[grouping.unitName, [grouping.count]]]
                } : {enabled: false}};
              series.processData.apply(fakeSeries);
              fakeAxis.series.push(fakeSeries);
            });
            axis.beforeSetTickPositions.apply(fakeAxis);
            ordinalIndex[key] = fakeAxis.ordinalPositions;
          }
          return ordinalIndex[key];
        },
        getOverscrollPositions: function() {
          var axis = this,
              extraRange = axis.options.overscroll,
              distance = axis.overscrollPointsRange,
              positions = [],
              max = axis.dataMax;
          if (H.defined(distance)) {
            positions.push(max);
            while (max <= axis.dataMax + extraRange) {
              max += distance;
              positions.push(max);
            }
          }
          return positions;
        },
        getGroupIntervalFactor: function(xMin, xMax, series) {
          var i,
              processedXData = series.processedXData,
              len = processedXData.length,
              distances = [],
              median,
              groupIntervalFactor = this.groupIntervalFactor;
          if (!groupIntervalFactor) {
            for (i = 0; i < len - 1; i++) {
              distances[i] = processedXData[i + 1] - processedXData[i];
            }
            distances.sort(function(a, b) {
              return a - b;
            });
            median = distances[Math.floor(len / 2)];
            xMin = Math.max(xMin, processedXData[0]);
            xMax = Math.min(xMax, processedXData[len - 1]);
            this.groupIntervalFactor = groupIntervalFactor = (len * median) / (xMax - xMin);
          }
          return groupIntervalFactor;
        },
        postProcessTickInterval: function(tickInterval) {
          var ordinalSlope = this.ordinalSlope,
              ret;
          if (ordinalSlope) {
            if (!this.options.breaks) {
              ret = tickInterval / (ordinalSlope / this.closestPointRange);
            } else {
              ret = this.closestPointRange || tickInterval;
            }
          } else {
            ret = tickInterval;
          }
          return ret;
        }
      });
      Axis.prototype.ordinal2lin = Axis.prototype.val2lin;
      wrap(Chart.prototype, 'pan', function(proceed, e) {
        var chart = this,
            xAxis = chart.xAxis[0],
            overscroll = xAxis.options.overscroll,
            chartX = e.chartX,
            runBase = false;
        if (xAxis.options.ordinal && xAxis.series.length) {
          var mouseDownX = chart.mouseDownX,
              extremes = xAxis.getExtremes(),
              dataMax = extremes.dataMax,
              min = extremes.min,
              max = extremes.max,
              trimmedRange,
              hoverPoints = chart.hoverPoints,
              closestPointRange = xAxis.closestPointRange || xAxis.overscrollPointsRange,
              pointPixelWidth = xAxis.translationSlope * (xAxis.ordinalSlope || closestPointRange),
              movedUnits = (mouseDownX - chartX) / pointPixelWidth,
              extendedAxis = {ordinalPositions: xAxis.getExtendedPositions()},
              ordinalPositions,
              searchAxisLeft,
              lin2val = xAxis.lin2val,
              val2lin = xAxis.val2lin,
              searchAxisRight;
          if (!extendedAxis.ordinalPositions) {
            runBase = true;
          } else if (Math.abs(movedUnits) > 1) {
            if (hoverPoints) {
              each(hoverPoints, function(point) {
                point.setState();
              });
            }
            if (movedUnits < 0) {
              searchAxisLeft = extendedAxis;
              searchAxisRight = xAxis.ordinalPositions ? xAxis : extendedAxis;
            } else {
              searchAxisLeft = xAxis.ordinalPositions ? xAxis : extendedAxis;
              searchAxisRight = extendedAxis;
            }
            ordinalPositions = searchAxisRight.ordinalPositions;
            if (dataMax > ordinalPositions[ordinalPositions.length - 1]) {
              ordinalPositions.push(dataMax);
            }
            chart.fixedRange = max - min;
            trimmedRange = xAxis.toFixedRange(null, null, lin2val.apply(searchAxisLeft, [val2lin.apply(searchAxisLeft, [min, true]) + movedUnits, true]), lin2val.apply(searchAxisRight, [val2lin.apply(searchAxisRight, [max, true]) + movedUnits, true]));
            if (trimmedRange.min >= Math.min(extremes.dataMin, min) && trimmedRange.max <= Math.max(dataMax, max) + overscroll) {
              xAxis.setExtremes(trimmedRange.min, trimmedRange.max, true, false, {trigger: 'pan'});
            }
            chart.mouseDownX = chartX;
            css(chart.container, {cursor: 'move'});
          }
        } else {
          runBase = true;
        }
        if (runBase) {
          if (overscroll) {
            xAxis.max = xAxis.dataMax + overscroll;
          }
          proceed.apply(this, Array.prototype.slice.call(arguments, 1));
        }
      });
    }(Highcharts));
    (function(H) {
      var pick = H.pick,
          wrap = H.wrap,
          each = H.each,
          extend = H.extend,
          isArray = H.isArray,
          fireEvent = H.fireEvent,
          Axis = H.Axis,
          Series = H.Series;
      function stripArguments() {
        return Array.prototype.slice.call(arguments, 1);
      }
      extend(Axis.prototype, {
        isInBreak: function(brk, val) {
          var ret,
              repeat = brk.repeat || Infinity,
              from = brk.from,
              length = brk.to - brk.from,
              test = (val >= from ? (val - from) % repeat : repeat - ((from - val) % repeat));
          if (!brk.inclusive) {
            ret = test < length && test !== 0;
          } else {
            ret = test <= length;
          }
          return ret;
        },
        isInAnyBreak: function(val, testKeep) {
          var breaks = this.options.breaks,
              i = breaks && breaks.length,
              inbrk,
              keep,
              ret;
          if (i) {
            while (i--) {
              if (this.isInBreak(breaks[i], val)) {
                inbrk = true;
                if (!keep) {
                  keep = pick(breaks[i].showPoints, this.isXAxis ? false : true);
                }
              }
            }
            if (inbrk && testKeep) {
              ret = inbrk && !keep;
            } else {
              ret = inbrk;
            }
          }
          return ret;
        }
      });
      wrap(Axis.prototype, 'setTickPositions', function(proceed) {
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));
        if (this.options.breaks) {
          var axis = this,
              tickPositions = this.tickPositions,
              info = this.tickPositions.info,
              newPositions = [],
              i;
          for (i = 0; i < tickPositions.length; i++) {
            if (!axis.isInAnyBreak(tickPositions[i])) {
              newPositions.push(tickPositions[i]);
            }
          }
          this.tickPositions = newPositions;
          this.tickPositions.info = info;
        }
      });
      wrap(Axis.prototype, 'init', function(proceed, chart, userOptions) {
        var axis = this,
            breaks;
        if (userOptions.breaks && userOptions.breaks.length) {
          userOptions.ordinal = false;
        }
        proceed.call(this, chart, userOptions);
        breaks = this.options.breaks;
        axis.isBroken = (isArray(breaks) && !!breaks.length);
        if (axis.isBroken) {
          axis.val2lin = function(val) {
            var nval = val,
                brk,
                i;
            for (i = 0; i < axis.breakArray.length; i++) {
              brk = axis.breakArray[i];
              if (brk.to <= val) {
                nval -= brk.len;
              } else if (brk.from >= val) {
                break;
              } else if (axis.isInBreak(brk, val)) {
                nval -= (val - brk.from);
                break;
              }
            }
            return nval;
          };
          axis.lin2val = function(val) {
            var nval = val,
                brk,
                i;
            for (i = 0; i < axis.breakArray.length; i++) {
              brk = axis.breakArray[i];
              if (brk.from >= nval) {
                break;
              } else if (brk.to < nval) {
                nval += brk.len;
              } else if (axis.isInBreak(brk, nval)) {
                nval += brk.len;
              }
            }
            return nval;
          };
          axis.setExtremes = function(newMin, newMax, redraw, animation, eventArguments) {
            while (this.isInAnyBreak(newMin)) {
              newMin -= this.closestPointRange;
            }
            while (this.isInAnyBreak(newMax)) {
              newMax -= this.closestPointRange;
            }
            Axis.prototype.setExtremes.call(this, newMin, newMax, redraw, animation, eventArguments);
          };
          axis.setAxisTranslation = function(saveOld) {
            Axis.prototype.setAxisTranslation.call(this, saveOld);
            var breaks = axis.options.breaks,
                breakArrayT = [],
                breakArray = [],
                length = 0,
                inBrk,
                repeat,
                min = axis.userMin || axis.min,
                max = axis.userMax || axis.max,
                pointRangePadding = pick(axis.pointRangePadding, 0),
                start,
                i;
            each(breaks, function(brk) {
              repeat = brk.repeat || Infinity;
              if (axis.isInBreak(brk, min)) {
                min += (brk.to % repeat) - (min % repeat);
              }
              if (axis.isInBreak(brk, max)) {
                max -= (max % repeat) - (brk.from % repeat);
              }
            });
            each(breaks, function(brk) {
              start = brk.from;
              repeat = brk.repeat || Infinity;
              while (start - repeat > min) {
                start -= repeat;
              }
              while (start < min) {
                start += repeat;
              }
              for (i = start; i < max; i += repeat) {
                breakArrayT.push({
                  value: i,
                  move: 'in'
                });
                breakArrayT.push({
                  value: i + (brk.to - brk.from),
                  move: 'out',
                  size: brk.breakSize
                });
              }
            });
            breakArrayT.sort(function(a, b) {
              var ret;
              if (a.value === b.value) {
                ret = (a.move === 'in' ? 0 : 1) - (b.move === 'in' ? 0 : 1);
              } else {
                ret = a.value - b.value;
              }
              return ret;
            });
            inBrk = 0;
            start = min;
            each(breakArrayT, function(brk) {
              inBrk += (brk.move === 'in' ? 1 : -1);
              if (inBrk === 1 && brk.move === 'in') {
                start = brk.value;
              }
              if (inBrk === 0) {
                breakArray.push({
                  from: start,
                  to: brk.value,
                  len: brk.value - start - (brk.size || 0)
                });
                length += brk.value - start - (brk.size || 0);
              }
            });
            axis.breakArray = breakArray;
            axis.unitLength = max - min - length + pointRangePadding;
            fireEvent(axis, 'afterBreaks');
            if (axis.options.staticScale) {
              axis.transA = axis.options.staticScale;
            } else if (axis.unitLength) {
              axis.transA *= (max - axis.min + pointRangePadding) / axis.unitLength;
            }
            if (pointRangePadding) {
              axis.minPixelPadding = axis.transA * axis.minPointOffset;
            }
            axis.min = min;
            axis.max = max;
          };
        }
      });
      wrap(Series.prototype, 'generatePoints', function(proceed) {
        proceed.apply(this, stripArguments(arguments));
        var series = this,
            xAxis = series.xAxis,
            yAxis = series.yAxis,
            points = series.points,
            point,
            i = points.length,
            connectNulls = series.options.connectNulls,
            nullGap;
        if (xAxis && yAxis && (xAxis.options.breaks || yAxis.options.breaks)) {
          while (i--) {
            point = points[i];
            nullGap = point.y === null && connectNulls === false;
            if (!nullGap && (xAxis.isInAnyBreak(point.x, true) || yAxis.isInAnyBreak(point.y, true))) {
              points.splice(i, 1);
              if (this.data[i]) {
                this.data[i].destroyElements();
              }
            }
          }
        }
      });
      function drawPointsWrapped(proceed) {
        proceed.apply(this);
        this.drawBreaks(this.xAxis, ['x']);
        this.drawBreaks(this.yAxis, pick(this.pointArrayMap, ['y']));
      }
      H.Series.prototype.drawBreaks = function(axis, keys) {
        var series = this,
            points = series.points,
            breaks,
            threshold,
            eventName,
            y;
        if (!axis) {
          return;
        }
        each(keys, function(key) {
          breaks = axis.breakArray || [];
          threshold = axis.isXAxis ? axis.min : pick(series.options.threshold, axis.min);
          each(points, function(point) {
            y = pick(point['stack' + key.toUpperCase()], point[key]);
            each(breaks, function(brk) {
              eventName = false;
              if ((threshold < brk.from && y > brk.to) || (threshold > brk.from && y < brk.from)) {
                eventName = 'pointBreak';
              } else if ((threshold < brk.from && y > brk.from && y < brk.to) || (threshold > brk.from && y > brk.to && y < brk.from)) {
                eventName = 'pointInBreak';
              }
              if (eventName) {
                fireEvent(axis, eventName, {
                  point: point,
                  brk: brk
                });
              }
            });
          });
        });
      };
      H.Series.prototype.gappedPath = function() {
        var currentDataGrouping = this.currentDataGrouping,
            groupingSize = currentDataGrouping && currentDataGrouping.totalRange,
            gapSize = this.options.gapSize,
            points = this.points.slice(),
            i = points.length - 1,
            yAxis = this.yAxis,
            xRange,
            stack;
        if (gapSize && i > 0) {
          if (this.options.gapUnit !== 'value') {
            gapSize *= this.closestPointRange;
          }
          if (groupingSize && groupingSize > gapSize) {
            gapSize = groupingSize;
          }
          while (i--) {
            if (points[i + 1].x - points[i].x > gapSize) {
              xRange = (points[i].x + points[i + 1].x) / 2;
              points.splice(i + 1, 0, {
                isNull: true,
                x: xRange
              });
              if (this.options.stacking) {
                stack = yAxis.stacks[this.stackKey][xRange] = new H.StackItem(yAxis, yAxis.options.stackLabels, false, xRange, this.stack);
                stack.total = 0;
              }
            }
          }
        }
        return this.getGraphPath(points);
      };
      wrap(H.seriesTypes.column.prototype, 'drawPoints', drawPointsWrapped);
      wrap(H.Series.prototype, 'drawPoints', drawPointsWrapped);
    }(Highcharts));
    (function() {}());
    (function(H) {
      var arrayMax = H.arrayMax,
          arrayMin = H.arrayMin,
          Axis = H.Axis,
          defaultPlotOptions = H.defaultPlotOptions,
          defined = H.defined,
          each = H.each,
          extend = H.extend,
          format = H.format,
          isNumber = H.isNumber,
          merge = H.merge,
          pick = H.pick,
          Point = H.Point,
          Series = H.Series,
          Tooltip = H.Tooltip,
          wrap = H.wrap;
      var seriesProto = Series.prototype,
          baseProcessData = seriesProto.processData,
          baseGeneratePoints = seriesProto.generatePoints,
          commonOptions = {
            approximation: 'average',
            groupPixelWidth: 2,
            dateTimeLabelFormats: {
              millisecond: ['%A, %b %e, %H:%M:%S.%L', '%A, %b %e, %H:%M:%S.%L', '-%H:%M:%S.%L'],
              second: ['%A, %b %e, %H:%M:%S', '%A, %b %e, %H:%M:%S', '-%H:%M:%S'],
              minute: ['%A, %b %e, %H:%M', '%A, %b %e, %H:%M', '-%H:%M'],
              hour: ['%A, %b %e, %H:%M', '%A, %b %e, %H:%M', '-%H:%M'],
              day: ['%A, %b %e, %Y', '%A, %b %e', '-%A, %b %e, %Y'],
              week: ['Week from %A, %b %e, %Y', '%A, %b %e', '-%A, %b %e, %Y'],
              month: ['%B %Y', '%B', '-%B %Y'],
              year: ['%Y', '%Y', '-%Y']
            }
          },
          specificOptions = {
            line: {},
            spline: {},
            area: {},
            areaspline: {},
            column: {
              approximation: 'sum',
              groupPixelWidth: 10
            },
            arearange: {approximation: 'range'},
            areasplinerange: {approximation: 'range'},
            columnrange: {
              approximation: 'range',
              groupPixelWidth: 10
            },
            candlestick: {
              approximation: 'ohlc',
              groupPixelWidth: 10
            },
            ohlc: {
              approximation: 'ohlc',
              groupPixelWidth: 5
            }
          },
          defaultDataGroupingUnits = H.defaultDataGroupingUnits = [['millisecond', [1, 2, 5, 10, 20, 25, 50, 100, 200, 500]], ['second', [1, 2, 5, 10, 15, 30]], ['minute', [1, 2, 5, 10, 15, 30]], ['hour', [1, 2, 3, 4, 6, 8, 12]], ['day', [1]], ['week', [1]], ['month', [1, 3, 6]], ['year', null]],
          approximations = H.approximations = {
            sum: function(arr) {
              var len = arr.length,
                  ret;
              if (!len && arr.hasNulls) {
                ret = null;
              } else if (len) {
                ret = 0;
                while (len--) {
                  ret += arr[len];
                }
              }
              return ret;
            },
            average: function(arr) {
              var len = arr.length,
                  ret = approximations.sum(arr);
              if (isNumber(ret) && len) {
                ret = ret / len;
              }
              return ret;
            },
            averages: function() {
              var ret = [];
              each(arguments, function(arr) {
                ret.push(approximations.average(arr));
              });
              return ret[0] === undefined ? undefined : ret;
            },
            open: function(arr) {
              return arr.length ? arr[0] : (arr.hasNulls ? null : undefined);
            },
            high: function(arr) {
              return arr.length ? arrayMax(arr) : (arr.hasNulls ? null : undefined);
            },
            low: function(arr) {
              return arr.length ? arrayMin(arr) : (arr.hasNulls ? null : undefined);
            },
            close: function(arr) {
              return arr.length ? arr[arr.length - 1] : (arr.hasNulls ? null : undefined);
            },
            ohlc: function(open, high, low, close) {
              open = approximations.open(open);
              high = approximations.high(high);
              low = approximations.low(low);
              close = approximations.close(close);
              if (isNumber(open) || isNumber(high) || isNumber(low) || isNumber(close)) {
                return [open, high, low, close];
              }
            },
            range: function(low, high) {
              low = approximations.low(low);
              high = approximations.high(high);
              if (isNumber(low) || isNumber(high)) {
                return [low, high];
              } else if (low === null && high === null) {
                return null;
              }
            }
          };
      seriesProto.groupData = function(xData, yData, groupPositions, approximation) {
        var series = this,
            data = series.data,
            dataOptions = series.options.data,
            groupedXData = [],
            groupedYData = [],
            groupMap = [],
            dataLength = xData.length,
            pointX,
            pointY,
            groupedY,
            handleYData = !!yData,
            values = [],
            approximationFn = typeof approximation === 'function' ? approximation : approximations[approximation] || (specificOptions[series.type] && approximations[specificOptions[series.type].approximation]) || approximations[commonOptions.approximation],
            pointArrayMap = series.pointArrayMap,
            pointArrayMapLength = pointArrayMap && pointArrayMap.length,
            pos = 0,
            start = 0,
            valuesLen,
            i,
            j;
        if (pointArrayMapLength) {
          each(pointArrayMap, function() {
            values.push([]);
          });
        } else {
          values.push([]);
        }
        valuesLen = pointArrayMapLength || 1;
        for (i = 0; i <= dataLength; i++) {
          if (xData[i] >= groupPositions[0]) {
            break;
          }
        }
        for (i; i <= dataLength; i++) {
          while ((groupPositions[pos + 1] !== undefined && xData[i] >= groupPositions[pos + 1]) || i === dataLength) {
            pointX = groupPositions[pos];
            series.dataGroupInfo = {
              start: start,
              length: values[0].length
            };
            groupedY = approximationFn.apply(series, values);
            if (groupedY !== undefined) {
              groupedXData.push(pointX);
              groupedYData.push(groupedY);
              groupMap.push(series.dataGroupInfo);
            }
            start = i;
            for (j = 0; j < valuesLen; j++) {
              values[j].length = 0;
              values[j].hasNulls = false;
            }
            pos += 1;
            if (i === dataLength) {
              break;
            }
          }
          if (i === dataLength) {
            break;
          }
          if (pointArrayMap) {
            var index = series.cropStart + i,
                point = (data && data[index]) || series.pointClass.prototype.applyOptions.apply({series: series}, [dataOptions[index]]),
                val;
            for (j = 0; j < pointArrayMapLength; j++) {
              val = point[pointArrayMap[j]];
              if (isNumber(val)) {
                values[j].push(val);
              } else if (val === null) {
                values[j].hasNulls = true;
              }
            }
          } else {
            pointY = handleYData ? yData[i] : null;
            if (isNumber(pointY)) {
              values[0].push(pointY);
            } else if (pointY === null) {
              values[0].hasNulls = true;
            }
          }
        }
        return [groupedXData, groupedYData, groupMap];
      };
      seriesProto.processData = function() {
        var series = this,
            chart = series.chart,
            options = series.options,
            dataGroupingOptions = options.dataGrouping,
            groupingEnabled = series.allowDG !== false && dataGroupingOptions && pick(dataGroupingOptions.enabled, chart.options.isStock),
            visible = series.visible || !chart.options.chart.ignoreHiddenSeries,
            hasGroupedData,
            skip,
            lastDataGrouping = this.currentDataGrouping,
            currentDataGrouping;
        series.forceCrop = groupingEnabled;
        series.groupPixelWidth = null;
        series.hasProcessed = true;
        skip = (baseProcessData.apply(series, arguments) === false || !groupingEnabled);
        if (!skip) {
          series.destroyGroupedData();
          var i,
              processedXData = series.processedXData,
              processedYData = series.processedYData,
              plotSizeX = chart.plotSizeX,
              xAxis = series.xAxis,
              ordinal = xAxis.options.ordinal,
              groupPixelWidth = series.groupPixelWidth = xAxis.getGroupPixelWidth && xAxis.getGroupPixelWidth();
          if (groupPixelWidth) {
            hasGroupedData = true;
            series.isDirty = true;
            series.points = null;
            var extremes = xAxis.getExtremes(),
                xMin = extremes.min,
                xMax = extremes.max,
                groupIntervalFactor = (ordinal && xAxis.getGroupIntervalFactor(xMin, xMax, series)) || 1,
                interval = (groupPixelWidth * (xMax - xMin) / plotSizeX) * groupIntervalFactor,
                groupPositions = xAxis.getTimeTicks(xAxis.normalizeTimeTickInterval(interval, dataGroupingOptions.units || defaultDataGroupingUnits), Math.min(xMin, processedXData[0]), Math.max(xMax, processedXData[processedXData.length - 1]), xAxis.options.startOfWeek, processedXData, series.closestPointRange),
                groupedData = seriesProto.groupData.apply(series, [processedXData, processedYData, groupPositions, dataGroupingOptions.approximation]),
                groupedXData = groupedData[0],
                groupedYData = groupedData[1];
            if (dataGroupingOptions.smoothed && groupedXData.length) {
              i = groupedXData.length - 1;
              groupedXData[i] = Math.min(groupedXData[i], xMax);
              while (i-- && i > 0) {
                groupedXData[i] += interval / 2;
              }
              groupedXData[0] = Math.max(groupedXData[0], xMin);
            }
            currentDataGrouping = groupPositions.info;
            series.closestPointRange = groupPositions.info.totalRange;
            series.groupMap = groupedData[2];
            if (defined(groupedXData[0]) && groupedXData[0] < xAxis.dataMin && visible) {
              if (xAxis.min === xAxis.dataMin) {
                xAxis.min = groupedXData[0];
              }
              xAxis.dataMin = groupedXData[0];
            }
            series.processedXData = groupedXData;
            series.processedYData = groupedYData;
          } else {
            series.groupMap = null;
          }
          series.hasGroupedData = hasGroupedData;
          series.currentDataGrouping = currentDataGrouping;
          series.preventGraphAnimation = (lastDataGrouping && lastDataGrouping.totalRange) !== (currentDataGrouping && currentDataGrouping.totalRange);
        }
      };
      seriesProto.destroyGroupedData = function() {
        var groupedData = this.groupedData;
        each(groupedData || [], function(point, i) {
          if (point) {
            groupedData[i] = point.destroy ? point.destroy() : null;
          }
        });
        this.groupedData = null;
      };
      seriesProto.generatePoints = function() {
        baseGeneratePoints.apply(this);
        this.destroyGroupedData();
        this.groupedData = this.hasGroupedData ? this.points : null;
      };
      H.addEvent(Point.prototype, 'update', function() {
        if (this.dataGroup) {
          H.error(24);
          return false;
        }
      });
      wrap(Tooltip.prototype, 'tooltipFooterHeaderFormatter', function(proceed, labelConfig, isFooter) {
        var tooltip = this,
            time = this.chart.time,
            series = labelConfig.series,
            options = series.options,
            tooltipOptions = series.tooltipOptions,
            dataGroupingOptions = options.dataGrouping,
            xDateFormat = tooltipOptions.xDateFormat,
            xDateFormatEnd,
            xAxis = series.xAxis,
            currentDataGrouping,
            dateTimeLabelFormats,
            labelFormats,
            formattedKey;
        if (xAxis && xAxis.options.type === 'datetime' && dataGroupingOptions && isNumber(labelConfig.key)) {
          currentDataGrouping = series.currentDataGrouping;
          dateTimeLabelFormats = dataGroupingOptions.dateTimeLabelFormats;
          if (currentDataGrouping) {
            labelFormats = dateTimeLabelFormats[currentDataGrouping.unitName];
            if (currentDataGrouping.count === 1) {
              xDateFormat = labelFormats[0];
            } else {
              xDateFormat = labelFormats[1];
              xDateFormatEnd = labelFormats[2];
            }
          } else if (!xDateFormat && dateTimeLabelFormats) {
            xDateFormat = tooltip.getXDateFormat(labelConfig, tooltipOptions, xAxis);
          }
          formattedKey = time.dateFormat(xDateFormat, labelConfig.key);
          if (xDateFormatEnd) {
            formattedKey += time.dateFormat(xDateFormatEnd, labelConfig.key + currentDataGrouping.totalRange - 1);
          }
          return format(tooltipOptions[(isFooter ? 'footer' : 'header') + 'Format'], {
            point: extend(labelConfig.point, {key: formattedKey}),
            series: series
          }, time);
        }
        return proceed.call(tooltip, labelConfig, isFooter);
      });
      H.addEvent(seriesProto, 'destroy', seriesProto.destroyGroupedData);
      wrap(seriesProto, 'setOptions', function(proceed, itemOptions) {
        var options = proceed.call(this, itemOptions),
            type = this.type,
            plotOptions = this.chart.options.plotOptions,
            defaultOptions = defaultPlotOptions[type].dataGrouping;
        if (specificOptions[type]) {
          if (!defaultOptions) {
            defaultOptions = merge(commonOptions, specificOptions[type]);
          }
          options.dataGrouping = merge(defaultOptions, plotOptions.series && plotOptions.series.dataGrouping, plotOptions[type].dataGrouping, itemOptions.dataGrouping);
        }
        if (this.chart.options.isStock) {
          this.requireSorting = true;
        }
        return options;
      });
      H.addEvent(Axis.prototype, 'afterSetScale', function() {
        each(this.series, function(series) {
          series.hasProcessed = false;
        });
      });
      Axis.prototype.getGroupPixelWidth = function() {
        var series = this.series,
            len = series.length,
            i,
            groupPixelWidth = 0,
            doGrouping = false,
            dataLength,
            dgOptions;
        i = len;
        while (i--) {
          dgOptions = series[i].options.dataGrouping;
          if (dgOptions) {
            groupPixelWidth = Math.max(groupPixelWidth, dgOptions.groupPixelWidth);
          }
        }
        i = len;
        while (i--) {
          dgOptions = series[i].options.dataGrouping;
          if (dgOptions && series[i].hasProcessed) {
            dataLength = (series[i].processedXData || series[i].data).length;
            if (series[i].groupPixelWidth || dataLength > (this.chart.plotSizeX / groupPixelWidth) || (dataLength && dgOptions.forced)) {
              doGrouping = true;
            }
          }
        }
        return doGrouping ? groupPixelWidth : 0;
      };
      Axis.prototype.setDataGrouping = function(dataGrouping, redraw) {
        var i;
        redraw = pick(redraw, true);
        if (!dataGrouping) {
          dataGrouping = {
            forced: false,
            units: null
          };
        }
        if (this instanceof Axis) {
          i = this.series.length;
          while (i--) {
            this.series[i].update({dataGrouping: dataGrouping}, false);
          }
        } else {
          each(this.chart.options.series, function(seriesOptions) {
            seriesOptions.dataGrouping = dataGrouping;
          }, false);
        }
        if (redraw) {
          this.chart.redraw();
        }
      };
    }(Highcharts));
    (function(H) {
      var each = H.each,
          Point = H.Point,
          seriesType = H.seriesType,
          seriesTypes = H.seriesTypes;
      seriesType('ohlc', 'column', {
        lineWidth: 1,
        tooltip: {pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name}</b><br/>' + 'Open: {point.open}<br/>' + 'High: {point.high}<br/>' + 'Low: {point.low}<br/>' + 'Close: {point.close}<br/>'},
        threshold: null,
        states: {hover: {lineWidth: 3}},
        stickyTracking: true
      }, {
        directTouch: false,
        pointArrayMap: ['open', 'high', 'low', 'close'],
        toYData: function(point) {
          return [point.open, point.high, point.low, point.close];
        },
        pointValKey: 'close',
        pointAttrToOptions: {
          'stroke': 'color',
          'stroke-width': 'lineWidth'
        },
        pointAttribs: function(point, state) {
          var attribs = seriesTypes.column.prototype.pointAttribs.call(this, point, state),
              options = this.options;
          delete attribs.fill;
          if (!point.options.color && options.upColor && point.open < point.close) {
            attribs.stroke = options.upColor;
          }
          return attribs;
        },
        translate: function() {
          var series = this,
              yAxis = series.yAxis,
              hasModifyValue = !!series.modifyValue,
              translated = ['plotOpen', 'plotHigh', 'plotLow', 'plotClose', 'yBottom'];
          seriesTypes.column.prototype.translate.apply(series);
          each(series.points, function(point) {
            each([point.open, point.high, point.low, point.close, point.low], function(value, i) {
              if (value !== null) {
                if (hasModifyValue) {
                  value = series.modifyValue(value);
                }
                point[translated[i]] = yAxis.toPixels(value, true);
              }
            });
            point.tooltipPos[1] = point.plotHigh + yAxis.pos - series.chart.plotTop;
          });
        },
        drawPoints: function() {
          var series = this,
              points = series.points,
              chart = series.chart;
          each(points, function(point) {
            var plotOpen,
                plotClose,
                crispCorr,
                halfWidth,
                path,
                graphic = point.graphic,
                crispX,
                isNew = !graphic;
            if (point.plotY !== undefined) {
              if (!graphic) {
                point.graphic = graphic = chart.renderer.path().add(series.group);
              }
              graphic.attr(series.pointAttribs(point, point.selected && 'select'));
              crispCorr = (graphic.strokeWidth() % 2) / 2;
              crispX = Math.round(point.plotX) - crispCorr;
              halfWidth = Math.round(point.shapeArgs.width / 2);
              path = ['M', crispX, Math.round(point.yBottom), 'L', crispX, Math.round(point.plotHigh)];
              if (point.open !== null) {
                plotOpen = Math.round(point.plotOpen) + crispCorr;
                path.push('M', crispX, plotOpen, 'L', crispX - halfWidth, plotOpen);
              }
              if (point.close !== null) {
                plotClose = Math.round(point.plotClose) + crispCorr;
                path.push('M', crispX, plotClose, 'L', crispX + halfWidth, plotClose);
              }
              graphic[isNew ? 'attr' : 'animate']({d: path}).addClass(point.getClassName(), true);
            }
          });
        },
        animate: null
      }, {getClassName: function() {
          return Point.prototype.getClassName.call(this) + (this.open < this.close ? ' highcharts-point-up' : ' highcharts-point-down');
        }});
    }(Highcharts));
    (function(H) {
      var defaultPlotOptions = H.defaultPlotOptions,
          each = H.each,
          merge = H.merge,
          seriesType = H.seriesType,
          seriesTypes = H.seriesTypes;
      var candlestickOptions = {
        states: {hover: {lineWidth: 2}},
        tooltip: defaultPlotOptions.ohlc.tooltip,
        threshold: null,
        lineColor: '#000000',
        lineWidth: 1,
        upColor: '#ffffff',
        stickyTracking: true
      };
      seriesType('candlestick', 'ohlc', merge(defaultPlotOptions.column, candlestickOptions), {
        pointAttribs: function(point, state) {
          var attribs = seriesTypes.column.prototype.pointAttribs.call(this, point, state),
              options = this.options,
              isUp = point.open < point.close,
              stroke = options.lineColor || this.color,
              stateOptions;
          attribs['stroke-width'] = options.lineWidth;
          attribs.fill = point.options.color || (isUp ? (options.upColor || this.color) : this.color);
          attribs.stroke = point.lineColor || (isUp ? (options.upLineColor || stroke) : stroke);
          if (state) {
            stateOptions = options.states[state];
            attribs.fill = stateOptions.color || attribs.fill;
            attribs.stroke = stateOptions.lineColor || attribs.stroke;
            attribs['stroke-width'] = stateOptions.lineWidth || attribs['stroke-width'];
          }
          return attribs;
        },
        drawPoints: function() {
          var series = this,
              points = series.points,
              chart = series.chart;
          each(points, function(point) {
            var graphic = point.graphic,
                plotOpen,
                plotClose,
                topBox,
                bottomBox,
                hasTopWhisker,
                hasBottomWhisker,
                crispCorr,
                crispX,
                path,
                halfWidth,
                isNew = !graphic;
            if (point.plotY !== undefined) {
              if (!graphic) {
                point.graphic = graphic = chart.renderer.path().add(series.group);
              }
              graphic.attr(series.pointAttribs(point, point.selected && 'select')).shadow(series.options.shadow);
              crispCorr = (graphic.strokeWidth() % 2) / 2;
              crispX = Math.round(point.plotX) - crispCorr;
              plotOpen = point.plotOpen;
              plotClose = point.plotClose;
              topBox = Math.min(plotOpen, plotClose);
              bottomBox = Math.max(plotOpen, plotClose);
              halfWidth = Math.round(point.shapeArgs.width / 2);
              hasTopWhisker = Math.round(topBox) !== Math.round(point.plotHigh);
              hasBottomWhisker = bottomBox !== point.yBottom;
              topBox = Math.round(topBox) + crispCorr;
              bottomBox = Math.round(bottomBox) + crispCorr;
              path = [];
              path.push('M', crispX - halfWidth, bottomBox, 'L', crispX - halfWidth, topBox, 'L', crispX + halfWidth, topBox, 'L', crispX + halfWidth, bottomBox, 'Z', 'M', crispX, topBox, 'L', crispX, hasTopWhisker ? Math.round(point.plotHigh) : topBox, 'M', crispX, bottomBox, 'L', crispX, hasBottomWhisker ? Math.round(point.yBottom) : bottomBox);
              graphic[isNew ? 'attr' : 'animate']({d: path}).addClass(point.getClassName(), true);
            }
          });
        }
      });
    }(Highcharts));
    var onSeriesMixin = (function(H) {
      var each = H.each,
          seriesTypes = H.seriesTypes,
          stableSort = H.stableSort;
      var onSeriesMixin = {
        getPlotBox: function() {
          return H.Series.prototype.getPlotBox.call((this.options.onSeries && this.chart.get(this.options.onSeries)) || this);
        },
        translate: function() {
          seriesTypes.column.prototype.translate.apply(this);
          var series = this,
              options = series.options,
              chart = series.chart,
              points = series.points,
              cursor = points.length - 1,
              point,
              lastPoint,
              optionsOnSeries = options.onSeries,
              onSeries = optionsOnSeries && chart.get(optionsOnSeries),
              onKey = options.onKey || 'y',
              step = onSeries && onSeries.options.step,
              onData = onSeries && onSeries.points,
              i = onData && onData.length,
              xAxis = series.xAxis,
              yAxis = series.yAxis,
              xOffset = 0,
              leftPoint,
              lastX,
              rightPoint,
              currentDataGrouping,
              distanceRatio;
          if (onSeries && onSeries.visible && i) {
            xOffset = (onSeries.pointXOffset || 0) + (onSeries.barW || 0) / 2;
            currentDataGrouping = onSeries.currentDataGrouping;
            lastX = (onData[i - 1].x + (currentDataGrouping ? currentDataGrouping.totalRange : 0));
            stableSort(points, function(a, b) {
              return (a.x - b.x);
            });
            onKey = 'plot' + onKey[0].toUpperCase() + onKey.substr(1);
            while (i-- && points[cursor]) {
              leftPoint = onData[i];
              point = points[cursor];
              point.y = leftPoint.y;
              if (leftPoint.x <= point.x && leftPoint[onKey] !== undefined) {
                if (point.x <= lastX) {
                  point.plotY = leftPoint[onKey];
                  if (leftPoint.x < point.x && !step) {
                    rightPoint = onData[i + 1];
                    if (rightPoint && rightPoint[onKey] !== undefined) {
                      distanceRatio = (point.x - leftPoint.x) / (rightPoint.x - leftPoint.x);
                      point.plotY += distanceRatio * (rightPoint[onKey] - leftPoint[onKey]);
                      point.y += distanceRatio * (rightPoint.y - leftPoint.y);
                    }
                  }
                }
                cursor--;
                i++;
                if (cursor < 0) {
                  break;
                }
              }
            }
          }
          each(points, function(point, i) {
            var stackIndex;
            point.plotX += xOffset;
            if (point.plotY === undefined) {
              if (point.plotX >= 0 && point.plotX <= xAxis.len) {
                point.plotY = chart.chartHeight - xAxis.bottom - (xAxis.opposite ? xAxis.height : 0) + xAxis.offset - yAxis.top;
              } else {
                point.shapeArgs = {};
              }
            }
            lastPoint = points[i - 1];
            if (lastPoint && lastPoint.plotX === point.plotX) {
              if (lastPoint.stackIndex === undefined) {
                lastPoint.stackIndex = 0;
              }
              stackIndex = lastPoint.stackIndex + 1;
            }
            point.stackIndex = stackIndex;
          });
        }
      };
      return onSeriesMixin;
    }(Highcharts));
    (function(H, onSeriesMixin) {
      var addEvent = H.addEvent,
          each = H.each,
          merge = H.merge,
          noop = H.noop,
          Renderer = H.Renderer,
          Series = H.Series,
          seriesType = H.seriesType,
          SVGRenderer = H.SVGRenderer,
          TrackerMixin = H.TrackerMixin,
          VMLRenderer = H.VMLRenderer,
          symbols = SVGRenderer.prototype.symbols;
      seriesType('flags', 'column', {
        pointRange: 0,
        allowOverlapX: false,
        shape: 'flag',
        stackDistance: 12,
        textAlign: 'center',
        tooltip: {pointFormat: '{point.text}<br/>'},
        threshold: null,
        y: -30,
        fillColor: '#ffffff',
        lineWidth: 1,
        states: {hover: {
            lineColor: '#000000',
            fillColor: '#ccd6eb'
          }},
        style: {
          fontSize: '11px',
          fontWeight: 'bold'
        }
      }, {
        sorted: false,
        noSharedTooltip: true,
        allowDG: false,
        takeOrdinalPosition: false,
        trackerGroups: ['markerGroup'],
        forceCrop: true,
        init: Series.prototype.init,
        pointAttribs: function(point, state) {
          var options = this.options,
              color = (point && point.color) || this.color,
              lineColor = options.lineColor,
              lineWidth = (point && point.lineWidth),
              fill = (point && point.fillColor) || options.fillColor;
          if (state) {
            fill = options.states[state].fillColor;
            lineColor = options.states[state].lineColor;
            lineWidth = options.states[state].lineWidth;
          }
          return {
            'fill': fill || color,
            'stroke': lineColor || color,
            'stroke-width': lineWidth || options.lineWidth || 0
          };
        },
        translate: onSeriesMixin.translate,
        getPlotBox: onSeriesMixin.getPlotBox,
        drawPoints: function() {
          var series = this,
              points = series.points,
              chart = series.chart,
              renderer = chart.renderer,
              plotX,
              plotY,
              options = series.options,
              optionsY = options.y,
              shape,
              i,
              point,
              graphic,
              stackIndex,
              anchorY,
              attribs,
              outsideRight,
              yAxis = series.yAxis,
              boxesMap = {},
              boxes = [];
          i = points.length;
          while (i--) {
            point = points[i];
            outsideRight = point.plotX > series.xAxis.len;
            plotX = point.plotX;
            stackIndex = point.stackIndex;
            shape = point.options.shape || options.shape;
            plotY = point.plotY;
            if (plotY !== undefined) {
              plotY = point.plotY + optionsY - (stackIndex !== undefined && stackIndex * options.stackDistance);
            }
            point.anchorX = stackIndex ? undefined : point.plotX;
            anchorY = stackIndex ? undefined : point.plotY;
            graphic = point.graphic;
            if (plotY !== undefined && plotX >= 0 && !outsideRight) {
              if (!graphic) {
                graphic = point.graphic = renderer.label('', null, null, shape, null, null, options.useHTML).attr(series.pointAttribs(point)).css(merge(options.style, point.style)).attr({
                  align: shape === 'flag' ? 'left' : 'center',
                  width: options.width,
                  height: options.height,
                  'text-align': options.textAlign
                }).addClass('highcharts-point').add(series.markerGroup);
                if (point.graphic.div) {
                  point.graphic.div.point = point;
                }
                graphic.shadow(options.shadow);
                graphic.isNew = true;
              }
              if (plotX > 0) {
                plotX -= graphic.strokeWidth() % 2;
              }
              attribs = {
                y: plotY,
                anchorY: anchorY
              };
              if (options.allowOverlapX) {
                attribs.x = plotX;
                attribs.anchorX = point.anchorX;
              }
              graphic.attr({text: point.options.title || options.title || 'A'})[graphic.isNew ? 'attr' : 'animate'](attribs);
              if (!options.allowOverlapX) {
                if (!boxesMap[point.plotX]) {
                  boxesMap[point.plotX] = {
                    align: 0,
                    size: graphic.width,
                    target: plotX,
                    anchorX: plotX
                  };
                } else {
                  boxesMap[point.plotX].size = Math.max(boxesMap[point.plotX].size, graphic.width);
                }
              }
              point.tooltipPos = chart.inverted ? [yAxis.len + yAxis.pos - chart.plotLeft - plotY, series.xAxis.len - plotX] : [plotX, plotY + yAxis.pos - chart.plotTop];
            } else if (graphic) {
              point.graphic = graphic.destroy();
            }
          }
          if (!options.allowOverlapX) {
            H.objectEach(boxesMap, function(box) {
              box.plotX = box.anchorX;
              boxes.push(box);
            });
            H.distribute(boxes, this.xAxis.len);
            each(points, function(point) {
              var box = point.graphic && boxesMap[point.plotX];
              if (box) {
                point.graphic[point.graphic.isNew ? 'attr' : 'animate']({
                  x: box.pos,
                  anchorX: point.anchorX
                });
                point.graphic.isNew = false;
              }
            });
          }
          if (options.useHTML) {
            H.wrap(series.markerGroup, 'on', function(proceed) {
              return H.SVGElement.prototype.on.apply(proceed.apply(this, [].slice.call(arguments, 1)), [].slice.call(arguments, 1));
            });
          }
        },
        drawTracker: function() {
          var series = this,
              points = series.points;
          TrackerMixin.drawTrackerPoint.apply(this);
          each(points, function(point) {
            var graphic = point.graphic;
            if (graphic) {
              addEvent(graphic.element, 'mouseover', function() {
                if (point.stackIndex > 0 && !point.raised) {
                  point._y = graphic.y;
                  graphic.attr({y: point._y - 8});
                  point.raised = true;
                }
                each(points, function(otherPoint) {
                  if (otherPoint !== point && otherPoint.raised && otherPoint.graphic) {
                    otherPoint.graphic.attr({y: otherPoint._y});
                    otherPoint.raised = false;
                  }
                });
              });
            }
          });
        },
        animate: noop,
        buildKDTree: noop,
        setClip: noop
      });
      symbols.flag = function(x, y, w, h, options) {
        var anchorX = (options && options.anchorX) || x,
            anchorY = (options && options.anchorY) || y;
        return symbols.circle(anchorX - 1, anchorY - 1, 2, 2).concat(['M', anchorX, anchorY, 'L', x, y + h, x, y, x + w, y, x + w, y + h, x, y + h, 'Z']);
      };
      function createPinSymbol(shape) {
        symbols[shape + 'pin'] = function(x, y, w, h, options) {
          var anchorX = options && options.anchorX,
              anchorY = options && options.anchorY,
              path,
              labelTopOrBottomY;
          if (shape === 'circle' && h > w) {
            x -= Math.round((h - w) / 2);
            w = h;
          }
          path = symbols[shape](x, y, w, h);
          if (anchorX && anchorY) {
            labelTopOrBottomY = (y > anchorY) ? y : y + h;
            path.push('M', shape === 'circle' ? path[1] - path[4] : path[1] + path[4] / 2, labelTopOrBottomY, 'L', anchorX, anchorY);
            path = path.concat(symbols.circle(anchorX - 1, anchorY - 1, 2, 2));
          }
          return path;
        };
      }
      createPinSymbol('circle');
      createPinSymbol('square');
      if (Renderer === VMLRenderer) {
        each(['flag', 'circlepin', 'squarepin'], function(shape) {
          VMLRenderer.prototype.symbols[shape] = symbols[shape];
        });
      }
    }(Highcharts, onSeriesMixin));
    (function(H) {
      var addEvent = H.addEvent,
          Axis = H.Axis,
          correctFloat = H.correctFloat,
          defaultOptions = H.defaultOptions,
          defined = H.defined,
          destroyObjectProperties = H.destroyObjectProperties,
          each = H.each,
          fireEvent = H.fireEvent,
          hasTouch = H.hasTouch,
          isTouchDevice = H.isTouchDevice,
          merge = H.merge,
          pick = H.pick,
          removeEvent = H.removeEvent,
          svg = H.svg,
          wrap = H.wrap,
          swapXY;
      var defaultScrollbarOptions = {
        height: isTouchDevice ? 20 : 14,
        barBorderRadius: 0,
        buttonBorderRadius: 0,
        liveRedraw: svg && !isTouchDevice,
        margin: 10,
        minWidth: 6,
        step: 0.2,
        zIndex: 3,
        barBackgroundColor: '#cccccc',
        barBorderWidth: 1,
        barBorderColor: '#cccccc',
        buttonArrowColor: '#333333',
        buttonBackgroundColor: '#e6e6e6',
        buttonBorderColor: '#cccccc',
        buttonBorderWidth: 1,
        rifleColor: '#333333',
        trackBackgroundColor: '#f2f2f2',
        trackBorderColor: '#f2f2f2',
        trackBorderWidth: 1
      };
      defaultOptions.scrollbar = merge(true, defaultScrollbarOptions, defaultOptions.scrollbar);
      H.swapXY = swapXY = function(path, vertical) {
        var i,
            len = path.length,
            temp;
        if (vertical) {
          for (i = 0; i < len; i += 3) {
            temp = path[i + 1];
            path[i + 1] = path[i + 2];
            path[i + 2] = temp;
          }
        }
        return path;
      };
      function Scrollbar(renderer, options, chart) {
        this.init(renderer, options, chart);
      }
      Scrollbar.prototype = {
        init: function(renderer, options, chart) {
          this.scrollbarButtons = [];
          this.renderer = renderer;
          this.userOptions = options;
          this.options = merge(defaultScrollbarOptions, options);
          this.chart = chart;
          this.size = pick(this.options.size, this.options.height);
          if (options.enabled) {
            this.render();
            this.initEvents();
            this.addEvents();
          }
        },
        render: function() {
          var scroller = this,
              renderer = scroller.renderer,
              options = scroller.options,
              size = scroller.size,
              group;
          scroller.group = group = renderer.g('scrollbar').attr({
            zIndex: options.zIndex,
            translateY: -99999
          }).add();
          scroller.track = renderer.rect().addClass('highcharts-scrollbar-track').attr({
            x: 0,
            r: options.trackBorderRadius || 0,
            height: size,
            width: size
          }).add(group);
          scroller.track.attr({
            fill: options.trackBackgroundColor,
            stroke: options.trackBorderColor,
            'stroke-width': options.trackBorderWidth
          });
          this.trackBorderWidth = scroller.track.strokeWidth();
          scroller.track.attr({y: -this.trackBorderWidth % 2 / 2});
          scroller.scrollbarGroup = renderer.g().add(group);
          scroller.scrollbar = renderer.rect().addClass('highcharts-scrollbar-thumb').attr({
            height: size,
            width: size,
            r: options.barBorderRadius || 0
          }).add(scroller.scrollbarGroup);
          scroller.scrollbarRifles = renderer.path(swapXY(['M', -3, size / 4, 'L', -3, 2 * size / 3, 'M', 0, size / 4, 'L', 0, 2 * size / 3, 'M', 3, size / 4, 'L', 3, 2 * size / 3], options.vertical)).addClass('highcharts-scrollbar-rifles').add(scroller.scrollbarGroup);
          scroller.scrollbar.attr({
            fill: options.barBackgroundColor,
            stroke: options.barBorderColor,
            'stroke-width': options.barBorderWidth
          });
          scroller.scrollbarRifles.attr({
            stroke: options.rifleColor,
            'stroke-width': 1
          });
          scroller.scrollbarStrokeWidth = scroller.scrollbar.strokeWidth();
          scroller.scrollbarGroup.translate(-scroller.scrollbarStrokeWidth % 2 / 2, -scroller.scrollbarStrokeWidth % 2 / 2);
          scroller.drawScrollbarButton(0);
          scroller.drawScrollbarButton(1);
        },
        position: function(x, y, width, height) {
          var scroller = this,
              options = scroller.options,
              vertical = options.vertical,
              xOffset = height,
              yOffset = 0,
              method = scroller.rendered ? 'animate' : 'attr';
          scroller.x = x;
          scroller.y = y + this.trackBorderWidth;
          scroller.width = width;
          scroller.height = height;
          scroller.xOffset = xOffset;
          scroller.yOffset = yOffset;
          if (vertical) {
            scroller.width = scroller.yOffset = width = yOffset = scroller.size;
            scroller.xOffset = xOffset = 0;
            scroller.barWidth = height - width * 2;
            scroller.x = x = x + scroller.options.margin;
          } else {
            scroller.height = scroller.xOffset = height = xOffset = scroller.size;
            scroller.barWidth = width - height * 2;
            scroller.y = scroller.y + scroller.options.margin;
          }
          scroller.group[method]({
            translateX: x,
            translateY: scroller.y
          });
          scroller.track[method]({
            width: width,
            height: height
          });
          scroller.scrollbarButtons[1][method]({
            translateX: vertical ? 0 : width - xOffset,
            translateY: vertical ? height - yOffset : 0
          });
        },
        drawScrollbarButton: function(index) {
          var scroller = this,
              renderer = scroller.renderer,
              scrollbarButtons = scroller.scrollbarButtons,
              options = scroller.options,
              size = scroller.size,
              group,
              tempElem;
          group = renderer.g().add(scroller.group);
          scrollbarButtons.push(group);
          tempElem = renderer.rect().addClass('highcharts-scrollbar-button').add(group);
          tempElem.attr({
            stroke: options.buttonBorderColor,
            'stroke-width': options.buttonBorderWidth,
            fill: options.buttonBackgroundColor
          });
          tempElem.attr(tempElem.crisp({
            x: -0.5,
            y: -0.5,
            width: size + 1,
            height: size + 1,
            r: options.buttonBorderRadius
          }, tempElem.strokeWidth()));
          tempElem = renderer.path(swapXY(['M', size / 2 + (index ? -1 : 1), size / 2 - 3, 'L', size / 2 + (index ? -1 : 1), size / 2 + 3, 'L', size / 2 + (index ? 2 : -2), size / 2], options.vertical)).addClass('highcharts-scrollbar-arrow').add(scrollbarButtons[index]);
          tempElem.attr({fill: options.buttonArrowColor});
        },
        setRange: function(from, to) {
          var scroller = this,
              options = scroller.options,
              vertical = options.vertical,
              minWidth = options.minWidth,
              fullWidth = scroller.barWidth,
              fromPX,
              toPX,
              newPos,
              newSize,
              newRiflesPos,
              method = this.rendered && !this.hasDragged ? 'animate' : 'attr';
          if (!defined(fullWidth)) {
            return;
          }
          from = Math.max(from, 0);
          fromPX = Math.ceil(fullWidth * from);
          toPX = fullWidth * Math.min(to, 1);
          scroller.calculatedWidth = newSize = correctFloat(toPX - fromPX);
          if (newSize < minWidth) {
            fromPX = (fullWidth - minWidth + newSize) * from;
            newSize = minWidth;
          }
          newPos = Math.floor(fromPX + scroller.xOffset + scroller.yOffset);
          newRiflesPos = newSize / 2 - 0.5;
          scroller.from = from;
          scroller.to = to;
          if (!vertical) {
            scroller.scrollbarGroup[method]({translateX: newPos});
            scroller.scrollbar[method]({width: newSize});
            scroller.scrollbarRifles[method]({translateX: newRiflesPos});
            scroller.scrollbarLeft = newPos;
            scroller.scrollbarTop = 0;
          } else {
            scroller.scrollbarGroup[method]({translateY: newPos});
            scroller.scrollbar[method]({height: newSize});
            scroller.scrollbarRifles[method]({translateY: newRiflesPos});
            scroller.scrollbarTop = newPos;
            scroller.scrollbarLeft = 0;
          }
          if (newSize <= 12) {
            scroller.scrollbarRifles.hide();
          } else {
            scroller.scrollbarRifles.show(true);
          }
          if (options.showFull === false) {
            if (from <= 0 && to >= 1) {
              scroller.group.hide();
            } else {
              scroller.group.show();
            }
          }
          scroller.rendered = true;
        },
        initEvents: function() {
          var scroller = this;
          scroller.mouseMoveHandler = function(e) {
            var normalizedEvent = scroller.chart.pointer.normalize(e),
                options = scroller.options,
                direction = options.vertical ? 'chartY' : 'chartX',
                initPositions = scroller.initPositions,
                scrollPosition,
                chartPosition,
                change;
            if (scroller.grabbedCenter && (!e.touches || e.touches[0][direction] !== 0)) {
              chartPosition = scroller.cursorToScrollbarPosition(normalizedEvent)[direction];
              scrollPosition = scroller[direction];
              change = chartPosition - scrollPosition;
              scroller.hasDragged = true;
              scroller.updatePosition(initPositions[0] + change, initPositions[1] + change);
              if (scroller.hasDragged) {
                fireEvent(scroller, 'changed', {
                  from: scroller.from,
                  to: scroller.to,
                  trigger: 'scrollbar',
                  DOMType: e.type,
                  DOMEvent: e
                });
              }
            }
          };
          scroller.mouseUpHandler = function(e) {
            if (scroller.hasDragged) {
              fireEvent(scroller, 'changed', {
                from: scroller.from,
                to: scroller.to,
                trigger: 'scrollbar',
                DOMType: e.type,
                DOMEvent: e
              });
            }
            scroller.grabbedCenter = scroller.hasDragged = scroller.chartX = scroller.chartY = null;
          };
          scroller.mouseDownHandler = function(e) {
            var normalizedEvent = scroller.chart.pointer.normalize(e),
                mousePosition = scroller.cursorToScrollbarPosition(normalizedEvent);
            scroller.chartX = mousePosition.chartX;
            scroller.chartY = mousePosition.chartY;
            scroller.initPositions = [scroller.from, scroller.to];
            scroller.grabbedCenter = true;
          };
          scroller.buttonToMinClick = function(e) {
            var range = correctFloat(scroller.to - scroller.from) * scroller.options.step;
            scroller.updatePosition(correctFloat(scroller.from - range), correctFloat(scroller.to - range));
            fireEvent(scroller, 'changed', {
              from: scroller.from,
              to: scroller.to,
              trigger: 'scrollbar',
              DOMEvent: e
            });
          };
          scroller.buttonToMaxClick = function(e) {
            var range = (scroller.to - scroller.from) * scroller.options.step;
            scroller.updatePosition(scroller.from + range, scroller.to + range);
            fireEvent(scroller, 'changed', {
              from: scroller.from,
              to: scroller.to,
              trigger: 'scrollbar',
              DOMEvent: e
            });
          };
          scroller.trackClick = function(e) {
            var normalizedEvent = scroller.chart.pointer.normalize(e),
                range = scroller.to - scroller.from,
                top = scroller.y + scroller.scrollbarTop,
                left = scroller.x + scroller.scrollbarLeft;
            if ((scroller.options.vertical && normalizedEvent.chartY > top) || (!scroller.options.vertical && normalizedEvent.chartX > left)) {
              scroller.updatePosition(scroller.from + range, scroller.to + range);
            } else {
              scroller.updatePosition(scroller.from - range, scroller.to - range);
            }
            fireEvent(scroller, 'changed', {
              from: scroller.from,
              to: scroller.to,
              trigger: 'scrollbar',
              DOMEvent: e
            });
          };
        },
        cursorToScrollbarPosition: function(normalizedEvent) {
          var scroller = this,
              options = scroller.options,
              minWidthDifference = options.minWidth > scroller.calculatedWidth ? options.minWidth : 0;
          return {
            chartX: (normalizedEvent.chartX - scroller.x - scroller.xOffset) / (scroller.barWidth - minWidthDifference),
            chartY: (normalizedEvent.chartY - scroller.y - scroller.yOffset) / (scroller.barWidth - minWidthDifference)
          };
        },
        updatePosition: function(from, to) {
          if (to > 1) {
            from = correctFloat(1 - correctFloat(to - from));
            to = 1;
          }
          if (from < 0) {
            to = correctFloat(to - from);
            from = 0;
          }
          this.from = from;
          this.to = to;
        },
        update: function(options) {
          this.destroy();
          this.init(this.chart.renderer, merge(true, this.options, options), this.chart);
        },
        addEvents: function() {
          var buttonsOrder = this.options.inverted ? [1, 0] : [0, 1],
              buttons = this.scrollbarButtons,
              bar = this.scrollbarGroup.element,
              track = this.track.element,
              mouseDownHandler = this.mouseDownHandler,
              mouseMoveHandler = this.mouseMoveHandler,
              mouseUpHandler = this.mouseUpHandler,
              _events;
          _events = [[buttons[buttonsOrder[0]].element, 'click', this.buttonToMinClick], [buttons[buttonsOrder[1]].element, 'click', this.buttonToMaxClick], [track, 'click', this.trackClick], [bar, 'mousedown', mouseDownHandler], [bar.ownerDocument, 'mousemove', mouseMoveHandler], [bar.ownerDocument, 'mouseup', mouseUpHandler]];
          if (hasTouch) {
            _events.push([bar, 'touchstart', mouseDownHandler], [bar.ownerDocument, 'touchmove', mouseMoveHandler], [bar.ownerDocument, 'touchend', mouseUpHandler]);
          }
          each(_events, function(args) {
            addEvent.apply(null, args);
          });
          this._events = _events;
        },
        removeEvents: function() {
          each(this._events, function(args) {
            removeEvent.apply(null, args);
          });
          this._events.length = 0;
        },
        destroy: function() {
          var scroller = this.chart.scroller;
          this.removeEvents();
          each(['track', 'scrollbarRifles', 'scrollbar', 'scrollbarGroup', 'group'], function(prop) {
            if (this[prop] && this[prop].destroy) {
              this[prop] = this[prop].destroy();
            }
          }, this);
          if (scroller && this === scroller.scrollbar) {
            scroller.scrollbar = null;
            destroyObjectProperties(scroller.scrollbarButtons);
          }
        }
      };
      wrap(Axis.prototype, 'init', function(proceed) {
        var axis = this;
        proceed.apply(axis, Array.prototype.slice.call(arguments, 1));
        if (axis.options.scrollbar && axis.options.scrollbar.enabled) {
          axis.options.scrollbar.vertical = !axis.horiz;
          axis.options.startOnTick = axis.options.endOnTick = false;
          axis.scrollbar = new Scrollbar(axis.chart.renderer, axis.options.scrollbar, axis.chart);
          addEvent(axis.scrollbar, 'changed', function(e) {
            var unitedMin = Math.min(pick(axis.options.min, axis.min), axis.min, axis.dataMin),
                unitedMax = Math.max(pick(axis.options.max, axis.max), axis.max, axis.dataMax),
                range = unitedMax - unitedMin,
                to,
                from;
            if ((axis.horiz && !axis.reversed) || (!axis.horiz && axis.reversed)) {
              to = unitedMin + range * this.to;
              from = unitedMin + range * this.from;
            } else {
              to = unitedMin + range * (1 - this.from);
              from = unitedMin + range * (1 - this.to);
            }
            axis.setExtremes(from, to, true, false, e);
          });
        }
      });
      wrap(Axis.prototype, 'render', function(proceed) {
        var axis = this,
            scrollMin = Math.min(pick(axis.options.min, axis.min), axis.min, pick(axis.dataMin, axis.min)),
            scrollMax = Math.max(pick(axis.options.max, axis.max), axis.max, pick(axis.dataMax, axis.max)),
            scrollbar = axis.scrollbar,
            titleOffset = axis.titleOffset || 0,
            offsetsIndex,
            from,
            to;
        proceed.apply(axis, Array.prototype.slice.call(arguments, 1));
        if (scrollbar) {
          if (axis.horiz) {
            scrollbar.position(axis.left, axis.top + axis.height + 2 + axis.chart.scrollbarsOffsets[1] + (axis.opposite ? 0 : titleOffset + axis.axisTitleMargin + axis.offset), axis.width, axis.height);
            offsetsIndex = 1;
          } else {
            scrollbar.position(axis.left + axis.width + 2 + axis.chart.scrollbarsOffsets[0] + (axis.opposite ? titleOffset + axis.axisTitleMargin + axis.offset : 0), axis.top, axis.width, axis.height);
            offsetsIndex = 0;
          }
          if ((!axis.opposite && !axis.horiz) || (axis.opposite && axis.horiz)) {
            axis.chart.scrollbarsOffsets[offsetsIndex] += axis.scrollbar.size + axis.scrollbar.options.margin;
          }
          if (isNaN(scrollMin) || isNaN(scrollMax) || !defined(axis.min) || !defined(axis.max)) {
            scrollbar.setRange(0, 0);
          } else {
            from = (axis.min - scrollMin) / (scrollMax - scrollMin);
            to = (axis.max - scrollMin) / (scrollMax - scrollMin);
            if ((axis.horiz && !axis.reversed) || (!axis.horiz && axis.reversed)) {
              scrollbar.setRange(from, to);
            } else {
              scrollbar.setRange(1 - to, 1 - from);
            }
          }
        }
      });
      wrap(Axis.prototype, 'getOffset', function(proceed) {
        var axis = this,
            index = axis.horiz ? 2 : 1,
            scrollbar = axis.scrollbar;
        proceed.apply(axis, Array.prototype.slice.call(arguments, 1));
        if (scrollbar) {
          axis.chart.scrollbarsOffsets = [0, 0];
          axis.chart.axisOffset[index] += scrollbar.size + scrollbar.options.margin;
        }
      });
      wrap(Axis.prototype, 'destroy', function(proceed) {
        if (this.scrollbar) {
          this.scrollbar = this.scrollbar.destroy();
        }
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));
      });
      H.Scrollbar = Scrollbar;
    }(Highcharts));
    (function(H) {
      var addEvent = H.addEvent,
          Axis = H.Axis,
          Chart = H.Chart,
          color = H.color,
          defaultDataGroupingUnits = H.defaultDataGroupingUnits,
          defaultOptions = H.defaultOptions,
          defined = H.defined,
          destroyObjectProperties = H.destroyObjectProperties,
          each = H.each,
          erase = H.erase,
          error = H.error,
          extend = H.extend,
          grep = H.grep,
          hasTouch = H.hasTouch,
          isArray = H.isArray,
          isNumber = H.isNumber,
          isObject = H.isObject,
          merge = H.merge,
          pick = H.pick,
          removeEvent = H.removeEvent,
          Scrollbar = H.Scrollbar,
          Series = H.Series,
          seriesTypes = H.seriesTypes,
          wrap = H.wrap,
          units = [].concat(defaultDataGroupingUnits),
          defaultSeriesType,
          numExt = function(extreme) {
            var numbers = grep(arguments, isNumber);
            if (numbers.length) {
              return Math[extreme].apply(0, numbers);
            }
          };
      units[4] = ['day', [1, 2, 3, 4]];
      units[5] = ['week', [1, 2, 3]];
      defaultSeriesType = seriesTypes.areaspline === undefined ? 'line' : 'areaspline';
      extend(defaultOptions, {navigator: {
          height: 40,
          margin: 25,
          maskInside: true,
          handles: {
            width: 7,
            height: 15,
            symbols: ['navigator-handle', 'navigator-handle'],
            enabled: true,
            lineWidth: 1,
            backgroundColor: '#f2f2f2',
            borderColor: '#999999'
          },
          maskFill: color('#6685c2').setOpacity(0.3).get(),
          outlineColor: '#cccccc',
          outlineWidth: 1,
          series: {
            type: defaultSeriesType,
            fillOpacity: 0.05,
            lineWidth: 1,
            compare: null,
            dataGrouping: {
              approximation: 'average',
              enabled: true,
              groupPixelWidth: 2,
              smoothed: true,
              units: units
            },
            dataLabels: {
              enabled: false,
              zIndex: 2
            },
            id: 'highcharts-navigator-series',
            className: 'highcharts-navigator-series',
            lineColor: null,
            marker: {enabled: false},
            pointRange: 0,
            threshold: null
          },
          xAxis: {
            overscroll: 0,
            className: 'highcharts-navigator-xaxis',
            tickLength: 0,
            lineWidth: 0,
            gridLineColor: '#e6e6e6',
            gridLineWidth: 1,
            tickPixelInterval: 200,
            labels: {
              align: 'left',
              style: {color: '#999999'},
              x: 3,
              y: -4
            },
            crosshair: false
          },
          yAxis: {
            className: 'highcharts-navigator-yaxis',
            gridLineWidth: 0,
            startOnTick: false,
            endOnTick: false,
            minPadding: 0.1,
            maxPadding: 0.1,
            labels: {enabled: false},
            crosshair: false,
            title: {text: null},
            tickLength: 0,
            tickWidth: 0
          }
        }});
      H.Renderer.prototype.symbols['navigator-handle'] = function(x, y, w, h, options) {
        var halfWidth = options.width / 2,
            markerPosition = Math.round(halfWidth / 3) + 0.5,
            height = options.height;
        return ['M', -halfWidth - 1, 0.5, 'L', halfWidth, 0.5, 'L', halfWidth, height + 0.5, 'L', -halfWidth - 1, height + 0.5, 'L', -halfWidth - 1, 0.5, 'M', -markerPosition, 4, 'L', -markerPosition, height - 3, 'M', markerPosition - 1, 4, 'L', markerPosition - 1, height - 3];
      };
      function Navigator(chart) {
        this.init(chart);
      }
      Navigator.prototype = {
        drawHandle: function(x, index, inverted, verb) {
          var navigator = this,
              height = navigator.navigatorOptions.handles.height;
          navigator.handles[index][verb](inverted ? {
            translateX: Math.round(navigator.left + navigator.height / 2),
            translateY: Math.round(navigator.top + parseInt(x, 10) + 0.5 - height)
          } : {
            translateX: Math.round(navigator.left + parseInt(x, 10)),
            translateY: Math.round(navigator.top + navigator.height / 2 - height / 2 - 1)
          });
        },
        drawOutline: function(zoomedMin, zoomedMax, inverted, verb) {
          var navigator = this,
              maskInside = navigator.navigatorOptions.maskInside,
              outlineWidth = navigator.outline.strokeWidth(),
              halfOutline = outlineWidth / 2,
              outlineCorrection = (outlineWidth % 2) / 2,
              outlineHeight = navigator.outlineHeight,
              scrollbarHeight = navigator.scrollbarHeight,
              navigatorSize = navigator.size,
              left = navigator.left - scrollbarHeight,
              navigatorTop = navigator.top,
              verticalMin,
              path;
          if (inverted) {
            left -= halfOutline;
            verticalMin = navigatorTop + zoomedMax + outlineCorrection;
            zoomedMax = navigatorTop + zoomedMin + outlineCorrection;
            path = ['M', left + outlineHeight, navigatorTop - scrollbarHeight - outlineCorrection, 'L', left + outlineHeight, verticalMin, 'L', left, verticalMin, 'L', left, zoomedMax, 'L', left + outlineHeight, zoomedMax, 'L', left + outlineHeight, navigatorTop + navigatorSize + scrollbarHeight].concat(maskInside ? ['M', left + outlineHeight, verticalMin - halfOutline, 'L', left + outlineHeight, zoomedMax + halfOutline] : []);
          } else {
            zoomedMin += left + scrollbarHeight - outlineCorrection;
            zoomedMax += left + scrollbarHeight - outlineCorrection;
            navigatorTop += halfOutline;
            path = ['M', left, navigatorTop, 'L', zoomedMin, navigatorTop, 'L', zoomedMin, navigatorTop + outlineHeight, 'L', zoomedMax, navigatorTop + outlineHeight, 'L', zoomedMax, navigatorTop, 'L', left + navigatorSize + scrollbarHeight * 2, navigatorTop].concat(maskInside ? ['M', zoomedMin - halfOutline, navigatorTop, 'L', zoomedMax + halfOutline, navigatorTop] : []);
          }
          navigator.outline[verb]({d: path});
        },
        drawMasks: function(zoomedMin, zoomedMax, inverted, verb) {
          var navigator = this,
              left = navigator.left,
              top = navigator.top,
              navigatorHeight = navigator.height,
              height,
              width,
              x,
              y;
          if (inverted) {
            x = [left, left, left];
            y = [top, top + zoomedMin, top + zoomedMax];
            width = [navigatorHeight, navigatorHeight, navigatorHeight];
            height = [zoomedMin, zoomedMax - zoomedMin, navigator.size - zoomedMax];
          } else {
            x = [left, left + zoomedMin, left + zoomedMax];
            y = [top, top, top];
            width = [zoomedMin, zoomedMax - zoomedMin, navigator.size - zoomedMax];
            height = [navigatorHeight, navigatorHeight, navigatorHeight];
          }
          each(navigator.shades, function(shade, i) {
            shade[verb]({
              x: x[i],
              y: y[i],
              width: width[i],
              height: height[i]
            });
          });
        },
        renderElements: function() {
          var navigator = this,
              navigatorOptions = navigator.navigatorOptions,
              maskInside = navigatorOptions.maskInside,
              chart = navigator.chart,
              inverted = chart.inverted,
              renderer = chart.renderer,
              navigatorGroup;
          navigator.navigatorGroup = navigatorGroup = renderer.g('navigator').attr({
            zIndex: 8,
            visibility: 'hidden'
          }).add();
          var mouseCursor = {cursor: inverted ? 'ns-resize' : 'ew-resize'};
          each([!maskInside, maskInside, !maskInside], function(hasMask, index) {
            navigator.shades[index] = renderer.rect().addClass('highcharts-navigator-mask' + (index === 1 ? '-inside' : '-outside')).attr({fill: hasMask ? navigatorOptions.maskFill : 'rgba(0,0,0,0)'}).css(index === 1 && mouseCursor).add(navigatorGroup);
          });
          navigator.outline = renderer.path().addClass('highcharts-navigator-outline').attr({
            'stroke-width': navigatorOptions.outlineWidth,
            stroke: navigatorOptions.outlineColor
          }).add(navigatorGroup);
          if (navigatorOptions.handles.enabled) {
            each([0, 1], function(index) {
              navigatorOptions.handles.inverted = chart.inverted;
              navigator.handles[index] = renderer.symbol(navigatorOptions.handles.symbols[index], -navigatorOptions.handles.width / 2 - 1, 0, navigatorOptions.handles.width, navigatorOptions.handles.height, navigatorOptions.handles);
              navigator.handles[index].attr({zIndex: 7 - index}).addClass('highcharts-navigator-handle ' + 'highcharts-navigator-handle-' + ['left', 'right'][index]).add(navigatorGroup);
              var handlesOptions = navigatorOptions.handles;
              navigator.handles[index].attr({
                fill: handlesOptions.backgroundColor,
                stroke: handlesOptions.borderColor,
                'stroke-width': handlesOptions.lineWidth
              }).css(mouseCursor);
            });
          }
        },
        update: function(options) {
          each(this.series || [], function(series) {
            if (series.baseSeries) {
              delete series.baseSeries.navigatorSeries;
            }
          });
          this.destroy();
          var chartOptions = this.chart.options;
          merge(true, chartOptions.navigator, this.options, options);
          this.init(this.chart);
        },
        render: function(min, max, pxMin, pxMax) {
          var navigator = this,
              chart = navigator.chart,
              navigatorWidth,
              scrollbarLeft,
              scrollbarTop,
              scrollbarHeight = navigator.scrollbarHeight,
              navigatorSize,
              xAxis = navigator.xAxis,
              scrollbarXAxis = xAxis.fake ? chart.xAxis[0] : xAxis,
              navigatorEnabled = navigator.navigatorEnabled,
              zoomedMin,
              zoomedMax,
              rendered = navigator.rendered,
              inverted = chart.inverted,
              verb,
              newMin,
              newMax,
              currentRange,
              minRange = chart.xAxis[0].minRange,
              maxRange = chart.xAxis[0].options.maxRange;
          if (this.hasDragged && !defined(pxMin)) {
            return;
          }
          if (!isNumber(min) || !isNumber(max)) {
            if (rendered) {
              pxMin = 0;
              pxMax = pick(xAxis.width, scrollbarXAxis.width);
            } else {
              return;
            }
          }
          navigator.left = pick(xAxis.left, chart.plotLeft + scrollbarHeight + (inverted ? chart.plotWidth : 0));
          navigator.size = zoomedMax = navigatorSize = pick(xAxis.len, (inverted ? chart.plotHeight : chart.plotWidth) - 2 * scrollbarHeight);
          if (inverted) {
            navigatorWidth = scrollbarHeight;
          } else {
            navigatorWidth = navigatorSize + 2 * scrollbarHeight;
          }
          pxMin = pick(pxMin, xAxis.toPixels(min, true));
          pxMax = pick(pxMax, xAxis.toPixels(max, true));
          if (!isNumber(pxMin) || Math.abs(pxMin) === Infinity) {
            pxMin = 0;
            pxMax = navigatorWidth;
          }
          newMin = xAxis.toValue(pxMin, true);
          newMax = xAxis.toValue(pxMax, true);
          currentRange = Math.abs(H.correctFloat(newMax - newMin));
          if (currentRange < minRange) {
            if (this.grabbedLeft) {
              pxMin = xAxis.toPixels(newMax - minRange, true);
            } else if (this.grabbedRight) {
              pxMax = xAxis.toPixels(newMin + minRange, true);
            }
          } else if (defined(maxRange) && currentRange > maxRange) {
            if (this.grabbedLeft) {
              pxMin = xAxis.toPixels(newMax - maxRange, true);
            } else if (this.grabbedRight) {
              pxMax = xAxis.toPixels(newMin + maxRange, true);
            }
          }
          navigator.zoomedMax = Math.min(Math.max(pxMin, pxMax, 0), zoomedMax);
          navigator.zoomedMin = Math.min(Math.max(navigator.fixedWidth ? navigator.zoomedMax - navigator.fixedWidth : Math.min(pxMin, pxMax), 0), zoomedMax);
          navigator.range = navigator.zoomedMax - navigator.zoomedMin;
          zoomedMax = Math.round(navigator.zoomedMax);
          zoomedMin = Math.round(navigator.zoomedMin);
          if (navigatorEnabled) {
            navigator.navigatorGroup.attr({visibility: 'visible'});
            verb = rendered && !navigator.hasDragged ? 'animate' : 'attr';
            navigator.drawMasks(zoomedMin, zoomedMax, inverted, verb);
            navigator.drawOutline(zoomedMin, zoomedMax, inverted, verb);
            if (navigator.navigatorOptions.handles.enabled) {
              navigator.drawHandle(zoomedMin, 0, inverted, verb);
              navigator.drawHandle(zoomedMax, 1, inverted, verb);
            }
          }
          if (navigator.scrollbar) {
            if (inverted) {
              scrollbarTop = navigator.top - scrollbarHeight;
              scrollbarLeft = navigator.left - scrollbarHeight + (navigatorEnabled || !scrollbarXAxis.opposite ? 0 : (scrollbarXAxis.titleOffset || 0) + scrollbarXAxis.axisTitleMargin);
              scrollbarHeight = navigatorSize + 2 * scrollbarHeight;
            } else {
              scrollbarTop = navigator.top + (navigatorEnabled ? navigator.height : -scrollbarHeight);
              scrollbarLeft = navigator.left - scrollbarHeight;
            }
            navigator.scrollbar.position(scrollbarLeft, scrollbarTop, navigatorWidth, scrollbarHeight);
            navigator.scrollbar.setRange(navigator.zoomedMin / navigatorSize, navigator.zoomedMax / navigatorSize);
          }
          navigator.rendered = true;
        },
        addMouseEvents: function() {
          var navigator = this,
              chart = navigator.chart,
              container = chart.container,
              eventsToUnbind = [],
              mouseMoveHandler,
              mouseUpHandler;
          navigator.mouseMoveHandler = mouseMoveHandler = function(e) {
            navigator.onMouseMove(e);
          };
          navigator.mouseUpHandler = mouseUpHandler = function(e) {
            navigator.onMouseUp(e);
          };
          eventsToUnbind = navigator.getPartsEvents('mousedown');
          eventsToUnbind.push(addEvent(container, 'mousemove', mouseMoveHandler), addEvent(container.ownerDocument, 'mouseup', mouseUpHandler));
          if (hasTouch) {
            eventsToUnbind.push(addEvent(container, 'touchmove', mouseMoveHandler), addEvent(container.ownerDocument, 'touchend', mouseUpHandler));
            eventsToUnbind.concat(navigator.getPartsEvents('touchstart'));
          }
          navigator.eventsToUnbind = eventsToUnbind;
          if (navigator.series && navigator.series[0]) {
            eventsToUnbind.push(addEvent(navigator.series[0].xAxis, 'foundExtremes', function() {
              chart.navigator.modifyNavigatorAxisExtremes();
            }));
          }
        },
        getPartsEvents: function(eventName) {
          var navigator = this,
              events = [];
          each(['shades', 'handles'], function(name) {
            each(navigator[name], function(navigatorItem, index) {
              events.push(addEvent(navigatorItem.element, eventName, function(e) {
                navigator[name + 'Mousedown'](e, index);
              }));
            });
          });
          return events;
        },
        shadesMousedown: function(e, index) {
          e = this.chart.pointer.normalize(e);
          var navigator = this,
              chart = navigator.chart,
              xAxis = navigator.xAxis,
              zoomedMin = navigator.zoomedMin,
              navigatorPosition = navigator.left,
              navigatorSize = navigator.size,
              range = navigator.range,
              chartX = e.chartX,
              fixedMax,
              fixedMin,
              ext,
              left;
          if (chart.inverted) {
            chartX = e.chartY;
            navigatorPosition = navigator.top;
          }
          if (index === 1) {
            navigator.grabbedCenter = chartX;
            navigator.fixedWidth = range;
            navigator.dragOffset = chartX - zoomedMin;
          } else {
            left = chartX - navigatorPosition - range / 2;
            if (index === 0) {
              left = Math.max(0, left);
            } else if (index === 2 && left + range >= navigatorSize) {
              left = navigatorSize - range;
              if (xAxis.reversed) {
                left -= range;
                fixedMin = navigator.getUnionExtremes().dataMin;
              } else {
                fixedMax = navigator.getUnionExtremes().dataMax;
              }
            }
            if (left !== zoomedMin) {
              navigator.fixedWidth = range;
              ext = xAxis.toFixedRange(left, left + range, fixedMin, fixedMax);
              if (defined(ext.min)) {
                chart.xAxis[0].setExtremes(Math.min(ext.min, ext.max), Math.max(ext.min, ext.max), true, null, {trigger: 'navigator'});
              }
            }
          }
        },
        handlesMousedown: function(e, index) {
          e = this.chart.pointer.normalize(e);
          var navigator = this,
              chart = navigator.chart,
              baseXAxis = chart.xAxis[0],
              reverse = (chart.inverted && !baseXAxis.reversed) || (!chart.inverted && baseXAxis.reversed);
          if (index === 0) {
            navigator.grabbedLeft = true;
            navigator.otherHandlePos = navigator.zoomedMax;
            navigator.fixedExtreme = reverse ? baseXAxis.min : baseXAxis.max;
          } else {
            navigator.grabbedRight = true;
            navigator.otherHandlePos = navigator.zoomedMin;
            navigator.fixedExtreme = reverse ? baseXAxis.max : baseXAxis.min;
          }
          chart.fixedRange = null;
        },
        onMouseMove: function(e) {
          var navigator = this,
              chart = navigator.chart,
              left = navigator.left,
              navigatorSize = navigator.navigatorSize,
              range = navigator.range,
              dragOffset = navigator.dragOffset,
              inverted = chart.inverted,
              chartX;
          if (!e.touches || e.touches[0].pageX !== 0) {
            e = chart.pointer.normalize(e);
            chartX = e.chartX;
            if (inverted) {
              left = navigator.top;
              chartX = e.chartY;
            }
            if (navigator.grabbedLeft) {
              navigator.hasDragged = true;
              navigator.render(0, 0, chartX - left, navigator.otherHandlePos);
            } else if (navigator.grabbedRight) {
              navigator.hasDragged = true;
              navigator.render(0, 0, navigator.otherHandlePos, chartX - left);
            } else if (navigator.grabbedCenter) {
              navigator.hasDragged = true;
              if (chartX < dragOffset) {
                chartX = dragOffset;
              } else if (chartX > navigatorSize + dragOffset - range) {
                chartX = navigatorSize + dragOffset - range;
              }
              navigator.render(0, 0, chartX - dragOffset, chartX - dragOffset + range);
            }
            if (navigator.hasDragged && navigator.scrollbar && navigator.scrollbar.options.liveRedraw) {
              e.DOMType = e.type;
              setTimeout(function() {
                navigator.onMouseUp(e);
              }, 0);
            }
          }
        },
        onMouseUp: function(e) {
          var navigator = this,
              chart = navigator.chart,
              xAxis = navigator.xAxis,
              reversed = xAxis && xAxis.reversed,
              scrollbar = navigator.scrollbar,
              unionExtremes,
              fixedMin,
              fixedMax,
              ext,
              DOMEvent = e.DOMEvent || e;
          if ((navigator.hasDragged && (!scrollbar || !scrollbar.hasDragged)) || e.trigger === 'scrollbar') {
            unionExtremes = navigator.getUnionExtremes();
            if (navigator.zoomedMin === navigator.otherHandlePos) {
              fixedMin = navigator.fixedExtreme;
            } else if (navigator.zoomedMax === navigator.otherHandlePos) {
              fixedMax = navigator.fixedExtreme;
            }
            if (navigator.zoomedMax === navigator.size) {
              fixedMax = reversed ? unionExtremes.dataMin : unionExtremes.dataMax;
            }
            if (navigator.zoomedMin === 0) {
              fixedMin = reversed ? unionExtremes.dataMax : unionExtremes.dataMin;
            }
            ext = xAxis.toFixedRange(navigator.zoomedMin, navigator.zoomedMax, fixedMin, fixedMax);
            if (defined(ext.min)) {
              chart.xAxis[0].setExtremes(Math.min(ext.min, ext.max), Math.max(ext.min, ext.max), true, navigator.hasDragged ? false : null, {
                trigger: 'navigator',
                triggerOp: 'navigator-drag',
                DOMEvent: DOMEvent
              });
            }
          }
          if (e.DOMType !== 'mousemove') {
            navigator.grabbedLeft = navigator.grabbedRight = navigator.grabbedCenter = navigator.fixedWidth = navigator.fixedExtreme = navigator.otherHandlePos = navigator.hasDragged = navigator.dragOffset = null;
          }
        },
        removeEvents: function() {
          if (this.eventsToUnbind) {
            each(this.eventsToUnbind, function(unbind) {
              unbind();
            });
            this.eventsToUnbind = undefined;
          }
          this.removeBaseSeriesEvents();
        },
        removeBaseSeriesEvents: function() {
          var baseSeries = this.baseSeries || [];
          if (this.navigatorEnabled && baseSeries[0]) {
            if (this.navigatorOptions.adaptToUpdatedData !== false) {
              each(baseSeries, function(series) {
                removeEvent(series, 'updatedData', this.updatedDataHandler);
              }, this);
            }
            if (baseSeries[0].xAxis) {
              removeEvent(baseSeries[0].xAxis, 'foundExtremes', this.modifyBaseAxisExtremes);
            }
          }
        },
        init: function(chart) {
          var chartOptions = chart.options,
              navigatorOptions = chartOptions.navigator,
              navigatorEnabled = navigatorOptions.enabled,
              scrollbarOptions = chartOptions.scrollbar,
              scrollbarEnabled = scrollbarOptions.enabled,
              height = navigatorEnabled ? navigatorOptions.height : 0,
              scrollbarHeight = scrollbarEnabled ? scrollbarOptions.height : 0;
          this.handles = [];
          this.shades = [];
          this.chart = chart;
          this.setBaseSeries();
          this.height = height;
          this.scrollbarHeight = scrollbarHeight;
          this.scrollbarEnabled = scrollbarEnabled;
          this.navigatorEnabled = navigatorEnabled;
          this.navigatorOptions = navigatorOptions;
          this.scrollbarOptions = scrollbarOptions;
          this.outlineHeight = height + scrollbarHeight;
          this.opposite = pick(navigatorOptions.opposite, !navigatorEnabled && chart.inverted);
          var navigator = this,
              baseSeries = navigator.baseSeries,
              xAxisIndex = chart.xAxis.length,
              yAxisIndex = chart.yAxis.length,
              baseXaxis = baseSeries && baseSeries[0] && baseSeries[0].xAxis || chart.xAxis[0];
          chart.extraMargin = {
            type: navigator.opposite ? 'plotTop' : 'marginBottom',
            value: (navigatorEnabled || !chart.inverted ? navigator.outlineHeight : 0) + navigatorOptions.margin
          };
          if (chart.inverted) {
            chart.extraMargin.type = navigator.opposite ? 'marginRight' : 'plotLeft';
          }
          chart.isDirtyBox = true;
          if (navigator.navigatorEnabled) {
            navigator.xAxis = new Axis(chart, merge({
              breaks: baseXaxis.options.breaks,
              ordinal: baseXaxis.options.ordinal
            }, navigatorOptions.xAxis, {
              id: 'navigator-x-axis',
              yAxis: 'navigator-y-axis',
              isX: true,
              type: 'datetime',
              index: xAxisIndex,
              offset: 0,
              keepOrdinalPadding: true,
              startOnTick: false,
              endOnTick: false,
              minPadding: 0,
              maxPadding: 0,
              zoomEnabled: false
            }, chart.inverted ? {
              offsets: [scrollbarHeight, 0, -scrollbarHeight, 0],
              width: height
            } : {
              offsets: [0, -scrollbarHeight, 0, scrollbarHeight],
              height: height
            }));
            navigator.yAxis = new Axis(chart, merge(navigatorOptions.yAxis, {
              id: 'navigator-y-axis',
              alignTicks: false,
              offset: 0,
              index: yAxisIndex,
              zoomEnabled: false
            }, chart.inverted ? {width: height} : {height: height}));
            if (baseSeries || navigatorOptions.series.data) {
              navigator.updateNavigatorSeries();
            } else if (chart.series.length === 0) {
              wrap(chart, 'redraw', function(proceed, animation) {
                if (chart.series.length > 0 && !navigator.series) {
                  navigator.setBaseSeries();
                  chart.redraw = proceed;
                }
                proceed.call(chart, animation);
              });
            }
            navigator.renderElements();
            navigator.addMouseEvents();
          } else {
            navigator.xAxis = {
              translate: function(value, reverse) {
                var axis = chart.xAxis[0],
                    ext = axis.getExtremes(),
                    scrollTrackWidth = axis.len - 2 * scrollbarHeight,
                    min = numExt('min', axis.options.min, ext.dataMin),
                    valueRange = numExt('max', axis.options.max, ext.dataMax) - min;
                return reverse ? (value * valueRange / scrollTrackWidth) + min : scrollTrackWidth * (value - min) / valueRange;
              },
              toPixels: function(value) {
                return this.translate(value);
              },
              toValue: function(value) {
                return this.translate(value, true);
              },
              toFixedRange: Axis.prototype.toFixedRange,
              fake: true
            };
          }
          if (chart.options.scrollbar.enabled) {
            chart.scrollbar = navigator.scrollbar = new Scrollbar(chart.renderer, merge(chart.options.scrollbar, {
              margin: navigator.navigatorEnabled ? 0 : 10,
              vertical: chart.inverted
            }), chart);
            addEvent(navigator.scrollbar, 'changed', function(e) {
              var range = navigator.size,
                  to = range * this.to,
                  from = range * this.from;
              navigator.hasDragged = navigator.scrollbar.hasDragged;
              navigator.render(0, 0, from, to);
              if (chart.options.scrollbar.liveRedraw || (e.DOMType !== 'mousemove' && e.DOMType !== 'touchmove')) {
                setTimeout(function() {
                  navigator.onMouseUp(e);
                });
              }
            });
          }
          navigator.addBaseSeriesEvents();
          navigator.addChartEvents();
        },
        getUnionExtremes: function(returnFalseOnNoBaseSeries) {
          var baseAxis = this.chart.xAxis[0],
              navAxis = this.xAxis,
              navAxisOptions = navAxis.options,
              baseAxisOptions = baseAxis.options,
              ret;
          if (!returnFalseOnNoBaseSeries || baseAxis.dataMin !== null) {
            ret = {
              dataMin: pick(navAxisOptions && navAxisOptions.min, numExt('min', baseAxisOptions.min, baseAxis.dataMin, navAxis.dataMin, navAxis.min)),
              dataMax: pick(navAxisOptions && navAxisOptions.max, numExt('max', baseAxisOptions.max, baseAxis.dataMax, navAxis.dataMax, navAxis.max))
            };
          }
          return ret;
        },
        setBaseSeries: function(baseSeriesOptions, redraw) {
          var chart = this.chart,
              baseSeries = this.baseSeries = [];
          baseSeriesOptions = (baseSeriesOptions || chart.options && chart.options.navigator.baseSeries || 0);
          each(chart.series || [], function(series, i) {
            if (!series.options.isInternal && (series.options.showInNavigator || (i === baseSeriesOptions || series.options.id === baseSeriesOptions) && series.options.showInNavigator !== false)) {
              baseSeries.push(series);
            }
          });
          if (this.xAxis && !this.xAxis.fake) {
            this.updateNavigatorSeries(redraw);
          }
        },
        updateNavigatorSeries: function(redraw) {
          var navigator = this,
              chart = navigator.chart,
              baseSeries = navigator.baseSeries,
              baseOptions,
              mergedNavSeriesOptions,
              chartNavigatorSeriesOptions = navigator.navigatorOptions.series,
              baseNavigatorOptions,
              navSeriesMixin = {
                enableMouseTracking: false,
                index: null,
                linkedTo: null,
                group: 'nav',
                padXAxis: false,
                xAxis: 'navigator-x-axis',
                yAxis: 'navigator-y-axis',
                showInLegend: false,
                stacking: false,
                isInternal: true,
                visible: true
              },
              navigatorSeries = navigator.series = H.grep(navigator.series || [], function(navSeries) {
                var base = navSeries.baseSeries;
                if (H.inArray(base, baseSeries) < 0) {
                  if (base) {
                    removeEvent(base, 'updatedData', navigator.updatedDataHandler);
                    delete base.navigatorSeries;
                  }
                  navSeries.destroy();
                  return false;
                }
                return true;
              });
          if (baseSeries && baseSeries.length) {
            each(baseSeries, function eachBaseSeries(base) {
              var linkedNavSeries = base.navigatorSeries,
                  userNavOptions = extend({color: base.color}, !isArray(chartNavigatorSeriesOptions) ? chartNavigatorSeriesOptions : defaultOptions.navigator.series);
              if (linkedNavSeries && navigator.navigatorOptions.adaptToUpdatedData === false) {
                return;
              }
              navSeriesMixin.name = 'Navigator ' + baseSeries.length;
              baseOptions = base.options || {};
              baseNavigatorOptions = baseOptions.navigatorOptions || {};
              mergedNavSeriesOptions = merge(baseOptions, navSeriesMixin, userNavOptions, baseNavigatorOptions);
              var navigatorSeriesData = baseNavigatorOptions.data || userNavOptions.data;
              navigator.hasNavigatorData = navigator.hasNavigatorData || !!navigatorSeriesData;
              mergedNavSeriesOptions.data = navigatorSeriesData || baseOptions.data && baseOptions.data.slice(0);
              if (linkedNavSeries && linkedNavSeries.options) {
                linkedNavSeries.update(mergedNavSeriesOptions, redraw);
              } else {
                base.navigatorSeries = chart.initSeries(mergedNavSeriesOptions);
                base.navigatorSeries.baseSeries = base;
                navigatorSeries.push(base.navigatorSeries);
              }
            });
          }
          if (chartNavigatorSeriesOptions.data && !(baseSeries && baseSeries.length) || isArray(chartNavigatorSeriesOptions)) {
            navigator.hasNavigatorData = false;
            chartNavigatorSeriesOptions = H.splat(chartNavigatorSeriesOptions);
            each(chartNavigatorSeriesOptions, function(userSeriesOptions, i) {
              navSeriesMixin.name = 'Navigator ' + (navigatorSeries.length + 1);
              mergedNavSeriesOptions = merge(defaultOptions.navigator.series, {color: chart.series[i] && !chart.series[i].options.isInternal && chart.series[i].color || chart.options.colors[i] || chart.options.colors[0]}, navSeriesMixin, userSeriesOptions);
              mergedNavSeriesOptions.data = userSeriesOptions.data;
              if (mergedNavSeriesOptions.data) {
                navigator.hasNavigatorData = true;
                navigatorSeries.push(chart.initSeries(mergedNavSeriesOptions));
              }
            });
          }
          this.addBaseSeriesEvents();
        },
        addBaseSeriesEvents: function() {
          var navigator = this,
              baseSeries = navigator.baseSeries || [];
          if (baseSeries[0] && baseSeries[0].xAxis) {
            addEvent(baseSeries[0].xAxis, 'foundExtremes', this.modifyBaseAxisExtremes);
          }
          each(baseSeries, function(base) {
            addEvent(base, 'show', function() {
              if (this.navigatorSeries) {
                this.navigatorSeries.setVisible(true, false);
              }
            });
            addEvent(base, 'hide', function() {
              if (this.navigatorSeries) {
                this.navigatorSeries.setVisible(false, false);
              }
            });
            if (this.navigatorOptions.adaptToUpdatedData !== false) {
              if (base.xAxis) {
                addEvent(base, 'updatedData', this.updatedDataHandler);
              }
            }
            addEvent(base, 'remove', function() {
              if (this.navigatorSeries) {
                erase(navigator.series, this.navigatorSeries);
                this.navigatorSeries.remove(false);
                delete this.navigatorSeries;
              }
            });
          }, this);
        },
        modifyNavigatorAxisExtremes: function() {
          var xAxis = this.xAxis,
              unionExtremes;
          if (xAxis.getExtremes) {
            unionExtremes = this.getUnionExtremes(true);
            if (unionExtremes && (unionExtremes.dataMin !== xAxis.min || unionExtremes.dataMax !== xAxis.max)) {
              xAxis.min = unionExtremes.dataMin;
              xAxis.max = unionExtremes.dataMax;
            }
          }
        },
        modifyBaseAxisExtremes: function() {
          var baseXAxis = this,
              navigator = baseXAxis.chart.navigator,
              baseExtremes = baseXAxis.getExtremes(),
              baseMin = baseExtremes.min,
              baseMax = baseExtremes.max,
              baseDataMin = baseExtremes.dataMin,
              baseDataMax = baseExtremes.dataMax,
              range = baseMax - baseMin,
              stickToMin = navigator.stickToMin,
              stickToMax = navigator.stickToMax,
              overscroll = baseXAxis.options.overscroll,
              newMax,
              newMin,
              navigatorSeries = navigator.series && navigator.series[0],
              hasSetExtremes = !!baseXAxis.setExtremes,
              unmutable = baseXAxis.eventArgs && baseXAxis.eventArgs.trigger === 'rangeSelectorButton';
          if (!unmutable) {
            if (stickToMin) {
              newMin = baseDataMin;
              newMax = newMin + range;
            }
            if (stickToMax) {
              newMax = baseDataMax + overscroll;
              if (!stickToMin) {
                newMin = Math.max(newMax - range, navigatorSeries && navigatorSeries.xData ? navigatorSeries.xData[0] : -Number.MAX_VALUE);
              }
            }
            if (hasSetExtremes && (stickToMin || stickToMax)) {
              if (isNumber(newMin)) {
                baseXAxis.min = baseXAxis.userMin = newMin;
                baseXAxis.max = baseXAxis.userMax = newMax;
              }
            }
          }
          navigator.stickToMin = navigator.stickToMax = null;
        },
        updatedDataHandler: function() {
          var navigator = this.chart.navigator,
              baseSeries = this,
              navigatorSeries = this.navigatorSeries;
          navigator.stickToMax = navigator.xAxis.reversed ? Math.round(navigator.zoomedMin) === 0 : Math.round(navigator.zoomedMax) >= Math.round(navigator.size);
          navigator.stickToMin = isNumber(baseSeries.xAxis.min) && (baseSeries.xAxis.min <= baseSeries.xData[0]) && (!this.chart.fixedRange || !navigator.stickToMax);
          if (navigatorSeries && !navigator.hasNavigatorData) {
            navigatorSeries.options.pointStart = baseSeries.xData[0];
            navigatorSeries.setData(baseSeries.options.data, false, null, false);
          }
        },
        addChartEvents: function() {
          addEvent(this.chart, 'redraw', function() {
            var navigator = this.navigator,
                xAxis = navigator && (navigator.baseSeries && navigator.baseSeries[0] && navigator.baseSeries[0].xAxis || navigator.scrollbar && this.xAxis[0]);
            if (xAxis) {
              navigator.render(xAxis.min, xAxis.max);
            }
          });
        },
        destroy: function() {
          this.removeEvents();
          if (this.xAxis) {
            erase(this.chart.xAxis, this.xAxis);
            erase(this.chart.axes, this.xAxis);
          }
          if (this.yAxis) {
            erase(this.chart.yAxis, this.yAxis);
            erase(this.chart.axes, this.yAxis);
          }
          each(this.series || [], function(s) {
            if (s.destroy) {
              s.destroy();
            }
          });
          each(['series', 'xAxis', 'yAxis', 'shades', 'outline', 'scrollbarTrack', 'scrollbarRifles', 'scrollbarGroup', 'scrollbar', 'navigatorGroup', 'rendered'], function(prop) {
            if (this[prop] && this[prop].destroy) {
              this[prop].destroy();
            }
            this[prop] = null;
          }, this);
          each([this.handles], function(coll) {
            destroyObjectProperties(coll);
          }, this);
        }
      };
      H.Navigator = Navigator;
      wrap(Axis.prototype, 'zoom', function(proceed, newMin, newMax) {
        var chart = this.chart,
            chartOptions = chart.options,
            zoomType = chartOptions.chart.zoomType,
            previousZoom,
            navigator = chartOptions.navigator,
            rangeSelector = chartOptions.rangeSelector,
            ret;
        if (this.isXAxis && ((navigator && navigator.enabled) || (rangeSelector && rangeSelector.enabled))) {
          if (zoomType === 'x') {
            chart.resetZoomButton = 'blocked';
          } else if (zoomType === 'y') {
            ret = false;
          } else if (zoomType === 'xy' && this.options.range) {
            previousZoom = this.previousZoom;
            if (defined(newMin)) {
              this.previousZoom = [this.min, this.max];
            } else if (previousZoom) {
              newMin = previousZoom[0];
              newMax = previousZoom[1];
              delete this.previousZoom;
            }
          }
        }
        return ret !== undefined ? ret : proceed.call(this, newMin, newMax);
      });
      wrap(Chart.prototype, 'init', function(proceed, options, callback) {
        addEvent(this, 'beforeRender', function() {
          var options = this.options;
          if (options.navigator.enabled || options.scrollbar.enabled) {
            this.scroller = this.navigator = new Navigator(this);
          }
        });
        proceed.call(this, options, callback);
      });
      wrap(Chart.prototype, 'setChartSize', function(proceed) {
        var legend = this.legend,
            navigator = this.navigator,
            scrollbarHeight,
            legendOptions,
            xAxis,
            yAxis;
        proceed.apply(this, [].slice.call(arguments, 1));
        if (navigator) {
          legendOptions = legend && legend.options;
          xAxis = navigator.xAxis;
          yAxis = navigator.yAxis;
          scrollbarHeight = navigator.scrollbarHeight;
          if (this.inverted) {
            navigator.left = navigator.opposite ? this.chartWidth - scrollbarHeight - navigator.height : this.spacing[3] + scrollbarHeight;
            navigator.top = this.plotTop + scrollbarHeight;
          } else {
            navigator.left = this.plotLeft + scrollbarHeight;
            navigator.top = navigator.navigatorOptions.top || this.chartHeight - navigator.height - scrollbarHeight - this.spacing[2] - (this.rangeSelector && this.extraBottomMargin ? this.rangeSelector.getHeight() : 0) - ((legendOptions && legendOptions.verticalAlign === 'bottom' && legendOptions.enabled && !legendOptions.floating) ? legend.legendHeight + pick(legendOptions.margin, 10) : 0);
          }
          if (xAxis && yAxis) {
            if (this.inverted) {
              xAxis.options.left = yAxis.options.left = navigator.left;
            } else {
              xAxis.options.top = yAxis.options.top = navigator.top;
            }
            xAxis.setAxisSize();
            yAxis.setAxisSize();
          }
        }
      });
      wrap(Series.prototype, 'addPoint', function(proceed, options, redraw, shift, animation) {
        var turboThreshold = this.options.turboThreshold;
        if (turboThreshold && this.xData.length > turboThreshold && isObject(options, true) && this.chart.navigator) {
          error(20, true);
        }
        proceed.call(this, options, redraw, shift, animation);
      });
      wrap(Chart.prototype, 'addSeries', function(proceed, options, redraw, animation) {
        var series = proceed.call(this, options, false, animation);
        if (this.navigator) {
          this.navigator.setBaseSeries(null, false);
        }
        if (pick(redraw, true)) {
          this.redraw();
        }
        return series;
      });
      wrap(Series.prototype, 'update', function(proceed, newOptions, redraw) {
        proceed.call(this, newOptions, false);
        if (this.chart.navigator && !this.options.isInternal) {
          this.chart.navigator.setBaseSeries(null, false);
        }
        if (pick(redraw, true)) {
          this.chart.redraw();
        }
      });
      Chart.prototype.callbacks.push(function(chart) {
        var extremes,
            navigator = chart.navigator;
        if (navigator) {
          extremes = chart.xAxis[0].getExtremes();
          navigator.render(extremes.min, extremes.max);
        }
      });
    }(Highcharts));
    (function(H) {
      var addEvent = H.addEvent,
          Axis = H.Axis,
          Chart = H.Chart,
          css = H.css,
          createElement = H.createElement,
          defaultOptions = H.defaultOptions,
          defined = H.defined,
          destroyObjectProperties = H.destroyObjectProperties,
          discardElement = H.discardElement,
          each = H.each,
          extend = H.extend,
          fireEvent = H.fireEvent,
          isNumber = H.isNumber,
          merge = H.merge,
          pick = H.pick,
          pInt = H.pInt,
          splat = H.splat,
          wrap = H.wrap;
      extend(defaultOptions, {rangeSelector: {
          verticalAlign: 'top',
          buttonTheme: {
            'stroke-width': 0,
            width: 28,
            height: 18,
            padding: 2,
            zIndex: 7
          },
          floating: false,
          x: 0,
          y: 0,
          height: undefined,
          inputPosition: {
            align: 'right',
            x: 0,
            y: 0
          },
          buttonPosition: {
            align: 'left',
            x: 0,
            y: 0
          },
          labelStyle: {color: '#666666'}
        }});
      defaultOptions.lang = merge(defaultOptions.lang, {
        rangeSelectorZoom: 'Zoom',
        rangeSelectorFrom: 'From',
        rangeSelectorTo: 'To'
      });
      function RangeSelector(chart) {
        this.init(chart);
      }
      RangeSelector.prototype = {
        clickButton: function(i, redraw) {
          var rangeSelector = this,
              chart = rangeSelector.chart,
              rangeOptions = rangeSelector.buttonOptions[i],
              baseAxis = chart.xAxis[0],
              unionExtremes = (chart.scroller && chart.scroller.getUnionExtremes()) || baseAxis || {},
              dataMin = unionExtremes.dataMin,
              dataMax = unionExtremes.dataMax,
              newMin,
              newMax = baseAxis && Math.round(Math.min(baseAxis.max, pick(dataMax, baseAxis.max))),
              type = rangeOptions.type,
              baseXAxisOptions,
              range = rangeOptions._range,
              rangeMin,
              minSetting,
              rangeSetting,
              ctx,
              ytdExtremes,
              dataGrouping = rangeOptions.dataGrouping;
          if (dataMin === null || dataMax === null) {
            return;
          }
          chart.fixedRange = range;
          if (dataGrouping) {
            this.forcedDataGrouping = true;
            Axis.prototype.setDataGrouping.call(baseAxis || {chart: this.chart}, dataGrouping, false);
          }
          if (type === 'month' || type === 'year') {
            if (!baseAxis) {
              range = rangeOptions;
            } else {
              ctx = {
                range: rangeOptions,
                max: newMax,
                chart: chart,
                dataMin: dataMin,
                dataMax: dataMax
              };
              newMin = baseAxis.minFromRange.call(ctx);
              if (isNumber(ctx.newMax)) {
                newMax = ctx.newMax;
              }
            }
          } else if (range) {
            newMin = Math.max(newMax - range, dataMin);
            newMax = Math.min(newMin + range, dataMax);
          } else if (type === 'ytd') {
            if (baseAxis) {
              if (dataMax === undefined) {
                dataMin = Number.MAX_VALUE;
                dataMax = Number.MIN_VALUE;
                each(chart.series, function(series) {
                  var xData = series.xData;
                  dataMin = Math.min(xData[0], dataMin);
                  dataMax = Math.max(xData[xData.length - 1], dataMax);
                });
                redraw = false;
              }
              ytdExtremes = rangeSelector.getYTDExtremes(dataMax, dataMin, chart.time.useUTC);
              newMin = rangeMin = ytdExtremes.min;
              newMax = ytdExtremes.max;
            } else {
              addEvent(chart, 'beforeRender', function() {
                rangeSelector.clickButton(i);
              });
              return;
            }
          } else if (type === 'all' && baseAxis) {
            newMin = dataMin;
            newMax = dataMax;
          }
          newMin += rangeOptions._offsetMin;
          newMax += rangeOptions._offsetMax;
          rangeSelector.setSelected(i);
          if (!baseAxis) {
            baseXAxisOptions = splat(chart.options.xAxis)[0];
            rangeSetting = baseXAxisOptions.range;
            baseXAxisOptions.range = range;
            minSetting = baseXAxisOptions.min;
            baseXAxisOptions.min = rangeMin;
            addEvent(chart, 'load', function resetMinAndRange() {
              baseXAxisOptions.range = rangeSetting;
              baseXAxisOptions.min = minSetting;
            });
          } else {
            baseAxis.setExtremes(newMin, newMax, pick(redraw, 1), null, {
              trigger: 'rangeSelectorButton',
              rangeSelectorButton: rangeOptions
            });
          }
        },
        setSelected: function(selected) {
          this.selected = this.options.selected = selected;
        },
        defaultButtons: [{
          type: 'month',
          count: 1,
          text: '1m'
        }, {
          type: 'month',
          count: 3,
          text: '3m'
        }, {
          type: 'month',
          count: 6,
          text: '6m'
        }, {
          type: 'ytd',
          text: 'YTD'
        }, {
          type: 'year',
          count: 1,
          text: '1y'
        }, {
          type: 'all',
          text: 'All'
        }],
        init: function(chart) {
          var rangeSelector = this,
              options = chart.options.rangeSelector,
              buttonOptions = options.buttons || [].concat(rangeSelector.defaultButtons),
              selectedOption = options.selected,
              blurInputs = function() {
                var minInput = rangeSelector.minInput,
                    maxInput = rangeSelector.maxInput;
                if (minInput && minInput.blur) {
                  fireEvent(minInput, 'blur');
                }
                if (maxInput && maxInput.blur) {
                  fireEvent(maxInput, 'blur');
                }
              };
          rangeSelector.chart = chart;
          rangeSelector.options = options;
          rangeSelector.buttons = [];
          chart.extraTopMargin = options.height;
          rangeSelector.buttonOptions = buttonOptions;
          this.unMouseDown = addEvent(chart.container, 'mousedown', blurInputs);
          this.unResize = addEvent(chart, 'resize', blurInputs);
          each(buttonOptions, rangeSelector.computeButtonRange);
          if (selectedOption !== undefined && buttonOptions[selectedOption]) {
            this.clickButton(selectedOption, false);
          }
          addEvent(chart, 'load', function() {
            if (chart.xAxis && chart.xAxis[0]) {
              addEvent(chart.xAxis[0], 'setExtremes', function(e) {
                if (this.max - this.min !== chart.fixedRange && e.trigger !== 'rangeSelectorButton' && e.trigger !== 'updatedData' && rangeSelector.forcedDataGrouping) {
                  this.setDataGrouping(false, false);
                }
              });
            }
          });
        },
        updateButtonStates: function() {
          var rangeSelector = this,
              chart = this.chart,
              baseAxis = chart.xAxis[0],
              actualRange = Math.round(baseAxis.max - baseAxis.min),
              hasNoData = !baseAxis.hasVisibleSeries,
              day = 24 * 36e5,
              unionExtremes = (chart.scroller && chart.scroller.getUnionExtremes()) || baseAxis,
              dataMin = unionExtremes.dataMin,
              dataMax = unionExtremes.dataMax,
              ytdExtremes = rangeSelector.getYTDExtremes(dataMax, dataMin, chart.time.useUTC),
              ytdMin = ytdExtremes.min,
              ytdMax = ytdExtremes.max,
              selected = rangeSelector.selected,
              selectedExists = isNumber(selected),
              allButtonsEnabled = rangeSelector.options.allButtonsEnabled,
              buttons = rangeSelector.buttons;
          each(rangeSelector.buttonOptions, function(rangeOptions, i) {
            var range = rangeOptions._range,
                type = rangeOptions.type,
                count = rangeOptions.count || 1,
                button = buttons[i],
                state = 0,
                disable,
                select,
                offsetRange = rangeOptions._offsetMax - rangeOptions._offsetMin,
                isSelected = i === selected,
                isTooGreatRange = range > dataMax - dataMin,
                isTooSmallRange = range < baseAxis.minRange,
                isYTDButNotSelected = false,
                isAllButAlreadyShowingAll = false,
                isSameRange = range === actualRange;
            if ((type === 'month' || type === 'year') && (actualRange + 36e5 >= {
              month: 28,
              year: 365
            }[type] * day * count - offsetRange) && (actualRange - 36e5 <= {
              month: 31,
              year: 366
            }[type] * day * count + offsetRange)) {
              isSameRange = true;
            } else if (type === 'ytd') {
              isSameRange = (ytdMax - ytdMin + offsetRange) === actualRange;
              isYTDButNotSelected = !isSelected;
            } else if (type === 'all') {
              isSameRange = baseAxis.max - baseAxis.min >= dataMax - dataMin;
              isAllButAlreadyShowingAll = (!isSelected && selectedExists && isSameRange);
            }
            disable = (!allButtonsEnabled && (isTooGreatRange || isTooSmallRange || isAllButAlreadyShowingAll || hasNoData));
            select = ((isSelected && isSameRange) || (isSameRange && !selectedExists && !isYTDButNotSelected));
            if (disable) {
              state = 3;
            } else if (select) {
              selectedExists = true;
              state = 2;
            }
            if (button.state !== state) {
              button.setState(state);
            }
          });
        },
        computeButtonRange: function(rangeOptions) {
          var type = rangeOptions.type,
              count = rangeOptions.count || 1,
              fixedTimes = {
                millisecond: 1,
                second: 1000,
                minute: 60 * 1000,
                hour: 3600 * 1000,
                day: 24 * 3600 * 1000,
                week: 7 * 24 * 3600 * 1000
              };
          if (fixedTimes[type]) {
            rangeOptions._range = fixedTimes[type] * count;
          } else if (type === 'month' || type === 'year') {
            rangeOptions._range = {
              month: 30,
              year: 365
            }[type] * 24 * 36e5 * count;
          }
          rangeOptions._offsetMin = pick(rangeOptions.offsetMin, 0);
          rangeOptions._offsetMax = pick(rangeOptions.offsetMax, 0);
          rangeOptions._range += rangeOptions._offsetMax - rangeOptions._offsetMin;
        },
        setInputValue: function(name, inputTime) {
          var options = this.chart.options.rangeSelector,
              time = this.chart.time,
              input = this[name + 'Input'];
          if (defined(inputTime)) {
            input.previousValue = input.HCTime;
            input.HCTime = inputTime;
          }
          input.value = time.dateFormat(options.inputEditDateFormat || '%Y-%m-%d', input.HCTime);
          this[name + 'DateBox'].attr({text: time.dateFormat(options.inputDateFormat || '%b %e, %Y', input.HCTime)});
        },
        showInput: function(name) {
          var inputGroup = this.inputGroup,
              dateBox = this[name + 'DateBox'];
          css(this[name + 'Input'], {
            left: (inputGroup.translateX + dateBox.x) + 'px',
            top: inputGroup.translateY + 'px',
            width: (dateBox.width - 2) + 'px',
            height: (dateBox.height - 2) + 'px',
            border: '2px solid silver'
          });
        },
        hideInput: function(name) {
          css(this[name + 'Input'], {
            border: 0,
            width: '1px',
            height: '1px'
          });
          this.setInputValue(name);
        },
        drawInput: function(name) {
          var rangeSelector = this,
              chart = rangeSelector.chart,
              chartStyle = chart.renderer.style || {},
              renderer = chart.renderer,
              options = chart.options.rangeSelector,
              lang = defaultOptions.lang,
              div = rangeSelector.div,
              isMin = name === 'min',
              input,
              label,
              dateBox,
              inputGroup = this.inputGroup;
          function updateExtremes() {
            var inputValue = input.value,
                value = (options.inputDateParser || Date.parse)(inputValue),
                chartAxis = chart.xAxis[0],
                dataAxis = chart.scroller && chart.scroller.xAxis ? chart.scroller.xAxis : chartAxis,
                dataMin = dataAxis.dataMin,
                dataMax = dataAxis.dataMax;
            if (value !== input.previousValue) {
              input.previousValue = value;
              if (!isNumber(value)) {
                value = inputValue.split('-');
                value = Date.UTC(pInt(value[0]), pInt(value[1]) - 1, pInt(value[2]));
              }
              if (isNumber(value)) {
                if (!chart.time.useUTC) {
                  value = value + new Date().getTimezoneOffset() * 60 * 1000;
                }
                if (isMin) {
                  if (value > rangeSelector.maxInput.HCTime) {
                    value = undefined;
                  } else if (value < dataMin) {
                    value = dataMin;
                  }
                } else {
                  if (value < rangeSelector.minInput.HCTime) {
                    value = undefined;
                  } else if (value > dataMax) {
                    value = dataMax;
                  }
                }
                if (value !== undefined) {
                  chartAxis.setExtremes(isMin ? value : chartAxis.min, isMin ? chartAxis.max : value, undefined, undefined, {trigger: 'rangeSelectorInput'});
                }
              }
            }
          }
          this[name + 'Label'] = label = renderer.label(lang[isMin ? 'rangeSelectorFrom' : 'rangeSelectorTo'], this.inputGroup.offset).addClass('highcharts-range-label').attr({padding: 2}).add(inputGroup);
          inputGroup.offset += label.width + 5;
          this[name + 'DateBox'] = dateBox = renderer.label('', inputGroup.offset).addClass('highcharts-range-input').attr({
            padding: 2,
            width: options.inputBoxWidth || 90,
            height: options.inputBoxHeight || 17,
            stroke: options.inputBoxBorderColor || '#cccccc',
            'stroke-width': 1,
            'text-align': 'center'
          }).on('click', function() {
            rangeSelector.showInput(name);
            rangeSelector[name + 'Input'].focus();
          }).add(inputGroup);
          inputGroup.offset += dateBox.width + (isMin ? 10 : 0);
          this[name + 'Input'] = input = createElement('input', {
            name: name,
            className: 'highcharts-range-selector',
            type: 'text'
          }, {top: chart.plotTop + 'px'}, div);
          label.css(merge(chartStyle, options.labelStyle));
          dateBox.css(merge({color: '#333333'}, chartStyle, options.inputStyle));
          css(input, extend({
            position: 'absolute',
            border: 0,
            width: '1px',
            height: '1px',
            padding: 0,
            textAlign: 'center',
            fontSize: chartStyle.fontSize,
            fontFamily: chartStyle.fontFamily,
            top: '-9999em'
          }, options.inputStyle));
          input.onfocus = function() {
            rangeSelector.showInput(name);
          };
          input.onblur = function() {
            rangeSelector.hideInput(name);
          };
          input.onchange = updateExtremes;
          input.onkeypress = function(event) {
            if (event.keyCode === 13) {
              updateExtremes();
            }
          };
        },
        getPosition: function() {
          var chart = this.chart,
              options = chart.options.rangeSelector,
              top = (options.verticalAlign) === 'top' ? chart.plotTop - chart.axisOffset[0] : 0;
          return {
            buttonTop: top + options.buttonPosition.y,
            inputTop: top + options.inputPosition.y - 10
          };
        },
        getYTDExtremes: function(dataMax, dataMin, useUTC) {
          var time = this.chart.time,
              min,
              now = new time.Date(dataMax),
              year = time.get('FullYear', now),
              startOfYear = useUTC ? time.Date.UTC(year, 0, 1) : +new time.Date(year, 0, 1);
          min = Math.max(dataMin || 0, startOfYear);
          now = now.getTime();
          return {
            max: Math.min(dataMax || now, now),
            min: min
          };
        },
        render: function(min, max) {
          var rangeSelector = this,
              chart = rangeSelector.chart,
              renderer = chart.renderer,
              container = chart.container,
              chartOptions = chart.options,
              navButtonOptions = chartOptions.exporting && chartOptions.exporting.enabled !== false && chartOptions.navigation && chartOptions.navigation.buttonOptions,
              lang = defaultOptions.lang,
              div = rangeSelector.div,
              options = chartOptions.rangeSelector,
              floating = options.floating,
              buttons = rangeSelector.buttons,
              inputGroup = rangeSelector.inputGroup,
              buttonTheme = options.buttonTheme,
              buttonPosition = options.buttonPosition,
              inputPosition = options.inputPosition,
              inputEnabled = options.inputEnabled,
              states = buttonTheme && buttonTheme.states,
              plotLeft = chart.plotLeft,
              buttonLeft,
              buttonGroup = rangeSelector.buttonGroup,
              group,
              groupHeight,
              rendered = rangeSelector.rendered,
              verticalAlign = rangeSelector.options.verticalAlign,
              legend = chart.legend,
              legendOptions = legend && legend.options,
              buttonPositionY = buttonPosition.y,
              inputPositionY = inputPosition.y,
              animate = rendered || false,
              exportingX = 0,
              alignTranslateY,
              legendHeight,
              minPosition,
              translateY = 0,
              translateX;
          if (options.enabled === false) {
            return;
          }
          if (!rendered) {
            rangeSelector.group = group = renderer.g('range-selector-group').attr({zIndex: 7}).add();
            rangeSelector.buttonGroup = buttonGroup = renderer.g('range-selector-buttons').add(group);
            rangeSelector.zoomText = renderer.text(lang.rangeSelectorZoom, pick(plotLeft + buttonPosition.x, plotLeft), 15).css(options.labelStyle).add(buttonGroup);
            buttonLeft = pick(plotLeft + buttonPosition.x, plotLeft) + rangeSelector.zoomText.getBBox().width + 5;
            each(rangeSelector.buttonOptions, function(rangeOptions, i) {
              buttons[i] = renderer.button(rangeOptions.text, buttonLeft, 0, function() {
                var buttonEvents = rangeOptions.events && rangeOptions.events.click,
                    callDefaultEvent;
                if (buttonEvents) {
                  callDefaultEvent = buttonEvents.call(rangeOptions);
                }
                if (callDefaultEvent !== false) {
                  rangeSelector.clickButton(i);
                }
                rangeSelector.isActive = true;
              }, buttonTheme, states && states.hover, states && states.select, states && states.disabled).attr({'text-align': 'center'}).add(buttonGroup);
              buttonLeft += buttons[i].width + pick(options.buttonSpacing, 5);
            });
            if (inputEnabled !== false) {
              rangeSelector.div = div = createElement('div', null, {
                position: 'relative',
                height: 0,
                zIndex: 1
              });
              container.parentNode.insertBefore(div, container);
              rangeSelector.inputGroup = inputGroup = renderer.g('input-group').add(group);
              inputGroup.offset = 0;
              rangeSelector.drawInput('min');
              rangeSelector.drawInput('max');
            }
          }
          plotLeft = chart.plotLeft - chart.spacing[3];
          rangeSelector.updateButtonStates();
          if (navButtonOptions && this.titleCollision(chart) && verticalAlign === 'top' && buttonPosition.align === 'right' && ((buttonPosition.y + buttonGroup.getBBox().height - 12) < ((navButtonOptions.y || 0) + navButtonOptions.height))) {
            exportingX = -40;
          }
          if (buttonPosition.align === 'left') {
            translateX = buttonPosition.x - chart.spacing[3];
          } else if (buttonPosition.align === 'right') {
            translateX = buttonPosition.x + exportingX - chart.spacing[1];
          }
          buttonGroup.align({
            y: buttonPosition.y,
            width: buttonGroup.getBBox().width,
            align: buttonPosition.align,
            x: translateX
          }, true, chart.spacingBox);
          rangeSelector.group.placed = animate;
          rangeSelector.buttonGroup.placed = animate;
          if (inputEnabled !== false) {
            var inputGroupX,
                inputGroupWidth,
                buttonGroupX,
                buttonGroupWidth;
            if (navButtonOptions && this.titleCollision(chart) && verticalAlign === 'top' && inputPosition.align === 'right' && ((inputPosition.y - inputGroup.getBBox().height - 12) < ((navButtonOptions.y || 0) + navButtonOptions.height + chart.spacing[0]))) {
              exportingX = -40;
            } else {
              exportingX = 0;
            }
            if (inputPosition.align === 'left') {
              translateX = plotLeft;
            } else if (inputPosition.align === 'right') {
              translateX = -Math.max(chart.axisOffset[1], -exportingX);
            }
            inputGroup.align({
              y: inputPosition.y,
              width: inputGroup.getBBox().width,
              align: inputPosition.align,
              x: inputPosition.x + translateX - 2
            }, true, chart.spacingBox);
            inputGroupX = inputGroup.alignAttr.translateX + inputGroup.alignOptions.x - exportingX + inputGroup.getBBox().x + 2;
            inputGroupWidth = inputGroup.alignOptions.width;
            buttonGroupX = buttonGroup.alignAttr.translateX + buttonGroup.getBBox().x;
            buttonGroupWidth = buttonGroup.getBBox().width + 20;
            if ((inputPosition.align === buttonPosition.align) || ((buttonGroupX + buttonGroupWidth > inputGroupX) && (inputGroupX + inputGroupWidth > buttonGroupX) && (buttonPositionY < (inputPositionY + inputGroup.getBBox().height)))) {
              inputGroup.attr({
                translateX: inputGroup.alignAttr.translateX + (chart.axisOffset[1] >= -exportingX ? 0 : -exportingX),
                translateY: inputGroup.alignAttr.translateY + buttonGroup.getBBox().height + 10
              });
            }
            rangeSelector.setInputValue('min', min);
            rangeSelector.setInputValue('max', max);
            rangeSelector.inputGroup.placed = animate;
          }
          rangeSelector.group.align({verticalAlign: verticalAlign}, true, chart.spacingBox);
          groupHeight = rangeSelector.group.getBBox().height + 20;
          alignTranslateY = rangeSelector.group.alignAttr.translateY;
          if (verticalAlign === 'bottom') {
            legendHeight = legendOptions && legendOptions.verticalAlign === 'bottom' && legendOptions.enabled && !legendOptions.floating ? legend.legendHeight + pick(legendOptions.margin, 10) : 0;
            groupHeight = groupHeight + legendHeight - 20;
            translateY = alignTranslateY - groupHeight - (floating ? 0 : options.y) - 10;
          }
          if (verticalAlign === 'top') {
            if (floating) {
              translateY = 0;
            }
            if (chart.titleOffset) {
              translateY = chart.titleOffset + chart.options.title.margin;
            }
            translateY += ((chart.margin[0] - chart.spacing[0]) || 0);
          } else if (verticalAlign === 'middle') {
            if (inputPositionY === buttonPositionY) {
              if (inputPositionY < 0) {
                translateY = alignTranslateY + minPosition;
              } else {
                translateY = alignTranslateY;
              }
            } else if (inputPositionY || buttonPositionY) {
              if (inputPositionY < 0 || buttonPositionY < 0) {
                translateY -= Math.min(inputPositionY, buttonPositionY);
              } else {
                translateY = alignTranslateY - groupHeight + minPosition;
              }
            }
          }
          rangeSelector.group.translate(options.x, options.y + Math.floor(translateY));
          if (inputEnabled !== false) {
            rangeSelector.minInput.style.marginTop = rangeSelector.group.translateY + 'px';
            rangeSelector.maxInput.style.marginTop = rangeSelector.group.translateY + 'px';
          }
          rangeSelector.rendered = true;
        },
        getHeight: function() {
          var rangeSelector = this,
              options = rangeSelector.options,
              rangeSelectorGroup = rangeSelector.group,
              inputPosition = options.inputPosition,
              buttonPosition = options.buttonPosition,
              yPosition = options.y,
              buttonPositionY = buttonPosition.y,
              inputPositionY = inputPosition.y,
              rangeSelectorHeight = 0,
              minPosition;
          rangeSelectorHeight = rangeSelectorGroup ? (rangeSelectorGroup.getBBox(true).height) + 13 + yPosition : 0;
          minPosition = Math.min(inputPositionY, buttonPositionY);
          if ((inputPositionY < 0 && buttonPositionY < 0) || (inputPositionY > 0 && buttonPositionY > 0)) {
            rangeSelectorHeight += Math.abs(minPosition);
          }
          return rangeSelectorHeight;
        },
        titleCollision: function(chart) {
          return !(chart.options.title.text || chart.options.subtitle.text);
        },
        update: function(options) {
          var chart = this.chart;
          merge(true, chart.options.rangeSelector, options);
          this.destroy();
          this.init(chart);
          chart.rangeSelector.render();
        },
        destroy: function() {
          var rSelector = this,
              minInput = rSelector.minInput,
              maxInput = rSelector.maxInput;
          rSelector.unMouseDown();
          rSelector.unResize();
          destroyObjectProperties(rSelector.buttons);
          if (minInput) {
            minInput.onfocus = minInput.onblur = minInput.onchange = null;
          }
          if (maxInput) {
            maxInput.onfocus = maxInput.onblur = maxInput.onchange = null;
          }
          H.objectEach(rSelector, function(val, key) {
            if (val && key !== 'chart') {
              if (val.destroy) {
                val.destroy();
              } else if (val.nodeType) {
                discardElement(this[key]);
              }
            }
            if (val !== RangeSelector.prototype[key]) {
              rSelector[key] = null;
            }
          }, this);
        }
      };
      Axis.prototype.toFixedRange = function(pxMin, pxMax, fixedMin, fixedMax) {
        var fixedRange = this.chart && this.chart.fixedRange,
            newMin = pick(fixedMin, this.translate(pxMin, true, !this.horiz)),
            newMax = pick(fixedMax, this.translate(pxMax, true, !this.horiz)),
            changeRatio = fixedRange && (newMax - newMin) / fixedRange;
        if (changeRatio > 0.7 && changeRatio < 1.3) {
          if (fixedMax) {
            newMin = newMax - fixedRange;
          } else {
            newMax = newMin + fixedRange;
          }
        }
        if (!isNumber(newMin) || !isNumber(newMax)) {
          newMin = newMax = undefined;
        }
        return {
          min: newMin,
          max: newMax
        };
      };
      Axis.prototype.minFromRange = function() {
        var rangeOptions = this.range,
            type = rangeOptions.type,
            timeName = {
              month: 'Month',
              year: 'FullYear'
            }[type],
            min,
            max = this.max,
            dataMin,
            range,
            getTrueRange = function(base, count) {
              var date = new Date(base),
                  basePeriod = date['get' + timeName]();
              date['set' + timeName](basePeriod + count);
              if (basePeriod === date['get' + timeName]()) {
                date.setDate(0);
              }
              return date.getTime() - base;
            };
        if (isNumber(rangeOptions)) {
          min = max - rangeOptions;
          range = rangeOptions;
        } else {
          min = max + getTrueRange(max, -rangeOptions.count);
          if (this.chart) {
            this.chart.fixedRange = max - min;
          }
        }
        dataMin = pick(this.dataMin, Number.MIN_VALUE);
        if (!isNumber(min)) {
          min = dataMin;
        }
        if (min <= dataMin) {
          min = dataMin;
          if (range === undefined) {
            range = getTrueRange(min, rangeOptions.count);
          }
          this.newMax = Math.min(min + range, this.dataMax);
        }
        if (!isNumber(max)) {
          min = undefined;
        }
        return min;
      };
      wrap(Chart.prototype, 'init', function(proceed, options, callback) {
        addEvent(this, 'init', function() {
          if (this.options.rangeSelector.enabled) {
            this.rangeSelector = new RangeSelector(this);
          }
        });
        proceed.call(this, options, callback);
      });
      wrap(Chart.prototype, 'render', function(proceed, options, callback) {
        var chart = this,
            axes = chart.axes,
            rangeSelector = chart.rangeSelector,
            verticalAlign;
        if (rangeSelector) {
          each(axes, function(axis) {
            axis.updateNames();
            axis.setScale();
          });
          chart.getAxisMargins();
          rangeSelector.render();
          verticalAlign = rangeSelector.options.verticalAlign;
          if (!rangeSelector.options.floating) {
            if (verticalAlign === 'bottom') {
              this.extraBottomMargin = true;
            } else if (verticalAlign !== 'middle') {
              this.extraTopMargin = true;
            }
          }
        }
        proceed.call(this, options, callback);
      });
      wrap(Chart.prototype, 'update', function(proceed, options, redraw, oneToOne) {
        var chart = this,
            rangeSelector = chart.rangeSelector,
            verticalAlign;
        this.extraBottomMargin = false;
        this.extraTopMargin = false;
        if (rangeSelector) {
          rangeSelector.render();
          verticalAlign = (options.rangeSelector && options.rangeSelector.verticalAlign) || (rangeSelector.options && rangeSelector.options.verticalAlign);
          if (!rangeSelector.options.floating) {
            if (verticalAlign === 'bottom') {
              this.extraBottomMargin = true;
            } else if (verticalAlign !== 'middle') {
              this.extraTopMargin = true;
            }
          }
        }
        proceed.call(this, H.merge(true, options, {chart: {
            marginBottom: pick(options.chart && options.chart.marginBottom, chart.margin.bottom),
            spacingBottom: pick(options.chart && options.chart.spacingBottom, chart.spacing.bottom)
          }}), redraw, oneToOne);
      });
      wrap(Chart.prototype, 'redraw', function(proceed, options, callback) {
        var chart = this,
            rangeSelector = chart.rangeSelector,
            verticalAlign;
        if (rangeSelector && !rangeSelector.options.floating) {
          rangeSelector.render();
          verticalAlign = rangeSelector.options.verticalAlign;
          if (verticalAlign === 'bottom') {
            this.extraBottomMargin = true;
          } else if (verticalAlign !== 'middle') {
            this.extraTopMargin = true;
          }
        }
        proceed.call(this, options, callback);
      });
      Chart.prototype.adjustPlotArea = function() {
        var chart = this,
            rangeSelector = chart.rangeSelector,
            rangeSelectorHeight;
        if (this.rangeSelector) {
          rangeSelectorHeight = rangeSelector.getHeight();
          if (this.extraTopMargin) {
            this.plotTop += rangeSelectorHeight;
          }
          if (this.extraBottomMargin) {
            this.marginBottom += rangeSelectorHeight;
          }
        }
      };
      Chart.prototype.callbacks.push(function(chart) {
        var extremes,
            rangeSelector = chart.rangeSelector,
            unbindRender,
            unbindSetExtremes;
        function renderRangeSelector() {
          extremes = chart.xAxis[0].getExtremes();
          if (isNumber(extremes.min)) {
            rangeSelector.render(extremes.min, extremes.max);
          }
        }
        if (rangeSelector) {
          unbindSetExtremes = addEvent(chart.xAxis[0], 'afterSetExtremes', function(e) {
            rangeSelector.render(e.min, e.max);
          });
          unbindRender = addEvent(chart, 'redraw', renderRangeSelector);
          renderRangeSelector();
        }
        addEvent(chart, 'destroy', function destroyEvents() {
          if (rangeSelector) {
            unbindRender();
            unbindSetExtremes();
          }
        });
      });
      H.RangeSelector = RangeSelector;
    }(Highcharts));
    (function(H) {
      var arrayMax = H.arrayMax,
          arrayMin = H.arrayMin,
          Axis = H.Axis,
          Chart = H.Chart,
          defined = H.defined,
          each = H.each,
          extend = H.extend,
          format = H.format,
          grep = H.grep,
          inArray = H.inArray,
          isNumber = H.isNumber,
          isString = H.isString,
          map = H.map,
          merge = H.merge,
          pick = H.pick,
          Point = H.Point,
          Renderer = H.Renderer,
          Series = H.Series,
          splat = H.splat,
          SVGRenderer = H.SVGRenderer,
          VMLRenderer = H.VMLRenderer,
          wrap = H.wrap,
          seriesProto = Series.prototype,
          seriesInit = seriesProto.init,
          seriesProcessData = seriesProto.processData,
          pointTooltipFormatter = Point.prototype.tooltipFormatter;
      H.StockChart = H.stockChart = function(a, b, c) {
        var hasRenderToArg = isString(a) || a.nodeName,
            options = arguments[hasRenderToArg ? 1 : 0],
            seriesOptions = options.series,
            defaultOptions = H.getOptions(),
            opposite,
            navigatorEnabled = pick(options.navigator && options.navigator.enabled, defaultOptions.navigator.enabled, true),
            disableStartOnTick = navigatorEnabled ? {
              startOnTick: false,
              endOnTick: false
            } : null,
            lineOptions = {marker: {
                enabled: false,
                radius: 2
              }},
            columnOptions = {
              shadow: false,
              borderWidth: 0
            };
        options.xAxis = map(splat(options.xAxis || {}), function(xAxisOptions, i) {
          return merge({
            minPadding: 0,
            maxPadding: 0,
            overscroll: 0,
            ordinal: true,
            title: {text: null},
            labels: {overflow: 'justify'},
            showLastLabel: true
          }, defaultOptions.xAxis, defaultOptions.xAxis && defaultOptions.xAxis[i], xAxisOptions, {
            type: 'datetime',
            categories: null
          }, disableStartOnTick);
        });
        options.yAxis = map(splat(options.yAxis || {}), function(yAxisOptions, i) {
          opposite = pick(yAxisOptions.opposite, true);
          return merge({
            labels: {y: -2},
            opposite: opposite,
            showLastLabel: !!(yAxisOptions.categories || yAxisOptions.type === 'category'),
            title: {text: null}
          }, defaultOptions.yAxis, defaultOptions.yAxis && defaultOptions.yAxis[i], yAxisOptions);
        });
        options.series = null;
        options = merge({
          chart: {
            panning: true,
            pinchType: 'x'
          },
          navigator: {enabled: navigatorEnabled},
          scrollbar: {enabled: pick(defaultOptions.scrollbar.enabled, true)},
          rangeSelector: {enabled: pick(defaultOptions.rangeSelector.enabled, true)},
          title: {text: null},
          tooltip: {
            split: pick(defaultOptions.tooltip.split, true),
            crosshairs: true
          },
          legend: {enabled: false},
          plotOptions: {
            line: lineOptions,
            spline: lineOptions,
            area: lineOptions,
            areaspline: lineOptions,
            arearange: lineOptions,
            areasplinerange: lineOptions,
            column: columnOptions,
            columnrange: columnOptions,
            candlestick: columnOptions,
            ohlc: columnOptions
          }
        }, options, {isStock: true});
        options.series = seriesOptions;
        return hasRenderToArg ? new Chart(a, options, c) : new Chart(options, b);
      };
      wrap(Axis.prototype, 'autoLabelAlign', function(proceed) {
        var chart = this.chart,
            options = this.options,
            panes = chart._labelPanes = chart._labelPanes || {},
            key,
            labelOptions = this.options.labels;
        if (this.chart.options.isStock && this.coll === 'yAxis') {
          key = options.top + ',' + options.height;
          if (!panes[key] && labelOptions.enabled) {
            if (labelOptions.x === 15) {
              labelOptions.x = 0;
            }
            if (labelOptions.align === undefined) {
              labelOptions.align = 'right';
            }
            panes[key] = this;
            return 'right';
          }
        }
        return proceed.apply(this, [].slice.call(arguments, 1));
      });
      wrap(Axis.prototype, 'destroy', function(proceed) {
        var chart = this.chart,
            key = this.options && (this.options.top + ',' + this.options.height);
        if (key && chart._labelPanes && chart._labelPanes[key] === this) {
          delete chart._labelPanes[key];
        }
        return proceed.apply(this, Array.prototype.slice.call(arguments, 1));
      });
      wrap(Axis.prototype, 'getPlotLinePath', function(proceed, value, lineWidth, old, force, translatedValue) {
        var axis = this,
            series = (this.isLinked && !this.series ? this.linkedParent.series : this.series),
            chart = axis.chart,
            renderer = chart.renderer,
            axisLeft = axis.left,
            axisTop = axis.top,
            x1,
            y1,
            x2,
            y2,
            result = [],
            axes = [],
            axes2,
            uniqueAxes,
            transVal;
        function getAxis(coll) {
          var otherColl = coll === 'xAxis' ? 'yAxis' : 'xAxis',
              opt = axis.options[otherColl];
          if (isNumber(opt)) {
            return [chart[otherColl][opt]];
          }
          if (isString(opt)) {
            return [chart.get(opt)];
          }
          return map(series, function(s) {
            return s[otherColl];
          });
        }
        if (axis.coll !== 'xAxis' && axis.coll !== 'yAxis') {
          return proceed.apply(this, [].slice.call(arguments, 1));
        }
        axes = getAxis(axis.coll);
        axes2 = (axis.isXAxis ? chart.yAxis : chart.xAxis);
        each(axes2, function(A) {
          if (defined(A.options.id) ? A.options.id.indexOf('navigator') === -1 : true) {
            var a = (A.isXAxis ? 'yAxis' : 'xAxis'),
                rax = (defined(A.options[a]) ? chart[a][A.options[a]] : chart[a][0]);
            if (axis === rax) {
              axes.push(A);
            }
          }
        });
        uniqueAxes = axes.length ? [] : [axis.isXAxis ? chart.yAxis[0] : chart.xAxis[0]];
        each(axes, function(axis2) {
          if (inArray(axis2, uniqueAxes) === -1 && !H.find(uniqueAxes, function(unique) {
            return unique.pos === axis2.pos && unique.len && axis2.len;
          })) {
            uniqueAxes.push(axis2);
          }
        });
        transVal = pick(translatedValue, axis.translate(value, null, null, old));
        if (isNumber(transVal)) {
          if (axis.horiz) {
            each(uniqueAxes, function(axis2) {
              var skip;
              y1 = axis2.pos;
              y2 = y1 + axis2.len;
              x1 = x2 = Math.round(transVal + axis.transB);
              if (x1 < axisLeft || x1 > axisLeft + axis.width) {
                if (force) {
                  x1 = x2 = Math.min(Math.max(axisLeft, x1), axisLeft + axis.width);
                } else {
                  skip = true;
                }
              }
              if (!skip) {
                result.push('M', x1, y1, 'L', x2, y2);
              }
            });
          } else {
            each(uniqueAxes, function(axis2) {
              var skip;
              x1 = axis2.pos;
              x2 = x1 + axis2.len;
              y1 = y2 = Math.round(axisTop + axis.height - transVal);
              if (y1 < axisTop || y1 > axisTop + axis.height) {
                if (force) {
                  y1 = y2 = Math.min(Math.max(axisTop, y1), axis.top + axis.height);
                } else {
                  skip = true;
                }
              }
              if (!skip) {
                result.push('M', x1, y1, 'L', x2, y2);
              }
            });
          }
        }
        return result.length > 0 ? renderer.crispPolyLine(result, lineWidth || 1) : null;
      });
      SVGRenderer.prototype.crispPolyLine = function(points, width) {
        var i;
        for (i = 0; i < points.length; i = i + 6) {
          if (points[i + 1] === points[i + 4]) {
            points[i + 1] = points[i + 4] = Math.round(points[i + 1]) - (width % 2 / 2);
          }
          if (points[i + 2] === points[i + 5]) {
            points[i + 2] = points[i + 5] = Math.round(points[i + 2]) + (width % 2 / 2);
          }
        }
        return points;
      };
      if (Renderer === VMLRenderer) {
        VMLRenderer.prototype.crispPolyLine = SVGRenderer.prototype.crispPolyLine;
      }
      wrap(Axis.prototype, 'hideCrosshair', function(proceed, i) {
        proceed.call(this, i);
        if (this.crossLabel) {
          this.crossLabel = this.crossLabel.hide();
        }
      });
      wrap(Axis.prototype, 'drawCrosshair', function(proceed, e, point) {
        proceed.call(this, e, point);
        if (!defined(this.crosshair.label) || !this.crosshair.label.enabled || !this.cross) {
          return;
        }
        var chart = this.chart,
            options = this.options.crosshair.label,
            horiz = this.horiz,
            opposite = this.opposite,
            left = this.left,
            top = this.top,
            crossLabel = this.crossLabel,
            posx,
            posy,
            crossBox,
            formatOption = options.format,
            formatFormat = '',
            limit,
            align,
            tickInside = this.options.tickPosition === 'inside',
            snap = this.crosshair.snap !== false,
            value,
            offset = 0;
        if (!e) {
          e = this.cross && this.cross.e;
        }
        align = (horiz ? 'center' : opposite ? (this.labelAlign === 'right' ? 'right' : 'left') : (this.labelAlign === 'left' ? 'left' : 'center'));
        if (!crossLabel) {
          crossLabel = this.crossLabel = chart.renderer.label(null, null, null, options.shape || 'callout').addClass('highcharts-crosshair-label' + (this.series[0] && ' highcharts-color-' + this.series[0].colorIndex)).attr({
            align: options.align || align,
            padding: pick(options.padding, 8),
            r: pick(options.borderRadius, 3),
            zIndex: 2
          }).add(this.labelGroup);
          crossLabel.attr({
            fill: options.backgroundColor || (this.series[0] && this.series[0].color) || '#666666',
            stroke: options.borderColor || '',
            'stroke-width': options.borderWidth || 0
          }).css(extend({
            color: '#ffffff',
            fontWeight: 'normal',
            fontSize: '11px',
            textAlign: 'center'
          }, options.style));
        }
        if (horiz) {
          posx = snap ? point.plotX + left : e.chartX;
          posy = top + (opposite ? 0 : this.height);
        } else {
          posx = opposite ? this.width + left : 0;
          posy = snap ? point.plotY + top : e.chartY;
        }
        if (!formatOption && !options.formatter) {
          if (this.isDatetimeAxis) {
            formatFormat = '%b %d, %Y';
          }
          formatOption = '{value' + (formatFormat ? ':' + formatFormat : '') + '}';
        }
        value = snap ? point[this.isXAxis ? 'x' : 'y'] : this.toValue(horiz ? e.chartX : e.chartY);
        crossLabel.attr({
          text: formatOption ? format(formatOption, {value: value}, chart.time) : options.formatter.call(this, value),
          x: posx,
          y: posy,
          visibility: value < this.min || value > this.max ? 'hidden' : 'visible'
        });
        crossBox = crossLabel.getBBox();
        if (horiz) {
          if ((tickInside && !opposite) || (!tickInside && opposite)) {
            posy = crossLabel.y - crossBox.height;
          }
        } else {
          posy = crossLabel.y - (crossBox.height / 2);
        }
        if (horiz) {
          limit = {
            left: left - crossBox.x,
            right: left + this.width - crossBox.x
          };
        } else {
          limit = {
            left: this.labelAlign === 'left' ? left : 0,
            right: this.labelAlign === 'right' ? left + this.width : chart.chartWidth
          };
        }
        if (crossLabel.translateX < limit.left) {
          offset = limit.left - crossLabel.translateX;
        }
        if (crossLabel.translateX + crossBox.width >= limit.right) {
          offset = -(crossLabel.translateX + crossBox.width - limit.right);
        }
        crossLabel.attr({
          x: posx + offset,
          y: posy,
          anchorX: horiz ? posx : (this.opposite ? 0 : chart.chartWidth),
          anchorY: horiz ? (this.opposite ? chart.chartHeight : 0) : posy + crossBox.height / 2
        });
      });
      seriesProto.init = function() {
        seriesInit.apply(this, arguments);
        this.setCompare(this.options.compare);
      };
      seriesProto.setCompare = function(compare) {
        this.modifyValue = (compare === 'value' || compare === 'percent') ? function(value, point) {
          var compareValue = this.compareValue;
          if (value !== undefined && compareValue !== undefined) {
            if (compare === 'value') {
              value -= compareValue;
            } else {
              value = 100 * (value / compareValue) - (this.options.compareBase === 100 ? 0 : 100);
            }
            if (point) {
              point.change = value;
            }
            return value;
          }
        } : null;
        this.userOptions.compare = compare;
        if (this.chart.hasRendered) {
          this.isDirty = true;
        }
      };
      seriesProto.processData = function() {
        var series = this,
            i,
            keyIndex = -1,
            processedXData,
            processedYData,
            compareStart = series.options.compareStart === true ? 0 : 1,
            length,
            compareValue;
        seriesProcessData.apply(this, arguments);
        if (series.xAxis && series.processedYData) {
          processedXData = series.processedXData;
          processedYData = series.processedYData;
          length = processedYData.length;
          if (series.pointArrayMap) {
            keyIndex = inArray('close', series.pointArrayMap);
            if (keyIndex === -1) {
              keyIndex = inArray(series.pointValKey || 'y', series.pointArrayMap);
            }
          }
          for (i = 0; i < length - compareStart; i++) {
            compareValue = processedYData[i] && keyIndex > -1 ? processedYData[i][keyIndex] : processedYData[i];
            if (isNumber(compareValue) && processedXData[i + compareStart] >= series.xAxis.min && compareValue !== 0) {
              series.compareValue = compareValue;
              break;
            }
          }
        }
      };
      wrap(seriesProto, 'getExtremes', function(proceed) {
        var extremes;
        proceed.apply(this, [].slice.call(arguments, 1));
        if (this.modifyValue) {
          extremes = [this.modifyValue(this.dataMin), this.modifyValue(this.dataMax)];
          this.dataMin = arrayMin(extremes);
          this.dataMax = arrayMax(extremes);
        }
      });
      Axis.prototype.setCompare = function(compare, redraw) {
        if (!this.isXAxis) {
          each(this.series, function(series) {
            series.setCompare(compare);
          });
          if (pick(redraw, true)) {
            this.chart.redraw();
          }
        }
      };
      Point.prototype.tooltipFormatter = function(pointFormat) {
        var point = this;
        pointFormat = pointFormat.replace('{point.change}', (point.change > 0 ? '+' : '') + H.numberFormat(point.change, pick(point.series.tooltipOptions.changeDecimals, 2)));
        return pointTooltipFormatter.apply(this, [pointFormat]);
      };
      wrap(Series.prototype, 'render', function(proceed) {
        if (!(this.chart.is3d && this.chart.is3d()) && !this.chart.polar && this.xAxis && !this.xAxis.isRadial) {
          if (!this.clipBox && this.animate) {
            this.clipBox = merge(this.chart.clipBox);
            this.clipBox.width = this.xAxis.len;
            this.clipBox.height = this.yAxis.len;
          } else if (this.chart[this.sharedClipKey]) {
            this.chart[this.sharedClipKey].attr({
              width: this.xAxis.len,
              height: this.yAxis.len
            });
          } else if (this.clipBox) {
            this.clipBox.width = this.xAxis.len;
            this.clipBox.height = this.yAxis.len;
          }
        }
        proceed.call(this);
      });
      wrap(Chart.prototype, 'getSelectedPoints', function(proceed) {
        var points = proceed.call(this);
        each(this.series, function(serie) {
          if (serie.hasGroupedData) {
            points = points.concat(grep(serie.points || [], function(point) {
              return point.selected;
            }));
          }
        });
        return points;
      });
      wrap(Chart.prototype, 'update', function(proceed, options) {
        if ('scrollbar' in options && this.navigator) {
          merge(true, this.options.scrollbar, options.scrollbar);
          this.navigator.update({}, false);
          delete options.scrollbar;
        }
        return proceed.apply(this, Array.prototype.slice.call(arguments, 1));
      });
    }(Highcharts));
  }));
})(require('process'));
