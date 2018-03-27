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
      var seriesType = H.seriesType,
          seriesTypes = H.seriesTypes,
          each = H.each,
          pick = H.pick;
      seriesType('variwide', 'column', {
        pointPadding: 0,
        groupPadding: 0
      }, {
        pointArrayMap: ['y', 'z'],
        parallelArrays: ['x', 'y', 'z'],
        processData: function() {
          var series = this;
          this.totalZ = 0;
          this.relZ = [];
          seriesTypes.column.prototype.processData.call(this);
          each(this.zData, function(z, i) {
            series.relZ[i] = series.totalZ;
            series.totalZ += z;
          });
          if (this.xAxis.categories) {
            this.xAxis.variwide = true;
          }
        },
        postTranslate: function(index, x) {
          var axis = this.xAxis,
              relZ = this.relZ,
              i = index,
              len = axis.len,
              totalZ = this.totalZ,
              linearSlotLeft = i / relZ.length * len,
              linearSlotRight = (i + 1) / relZ.length * len,
              slotLeft = (pick(relZ[i], totalZ) / totalZ) * len,
              slotRight = (pick(relZ[i + 1], totalZ) / totalZ) * len,
              xInsideLinearSlot = x - linearSlotLeft,
              ret;
          ret = slotLeft + xInsideLinearSlot * (slotRight - slotLeft) / (linearSlotRight - linearSlotLeft);
          return ret;
        },
        translate: function() {
          var crispOption = this.options.crisp;
          this.options.crisp = false;
          seriesTypes.column.prototype.translate.call(this);
          this.options.crisp = crispOption;
          var inverted = this.chart.inverted,
              crisp = this.borderWidth % 2 / 2;
          each(this.points, function(point, i) {
            var left = this.postTranslate(i, point.shapeArgs.x),
                right = this.postTranslate(i, point.shapeArgs.x + point.shapeArgs.width);
            if (this.options.crisp) {
              left = Math.round(left) - crisp;
              right = Math.round(right) - crisp;
            }
            point.shapeArgs.x = left;
            point.shapeArgs.width = right - left;
            point.tooltipPos[inverted ? 1 : 0] = this.postTranslate(i, point.tooltipPos[inverted ? 1 : 0]);
          }, this);
        }
      }, {isValid: function() {
          return H.isNumber(this.y, true) && H.isNumber(this.z, true);
        }});
      H.Tick.prototype.postTranslate = function(xy, xOrY, index) {
        xy[xOrY] = this.axis.pos + this.axis.series[0].postTranslate(index, xy[xOrY] - this.axis.pos);
      };
      H.wrap(H.Tick.prototype, 'getPosition', function(proceed, horiz, pos) {
        var axis = this.axis,
            xy = proceed.apply(this, Array.prototype.slice.call(arguments, 1)),
            xOrY = horiz ? 'x' : 'y';
        if (axis.categories && axis.variwide) {
          this[xOrY + 'Orig'] = xy[xOrY];
          this.postTranslate(xy, xOrY, pos);
        }
        return xy;
      });
      H.wrap(H.Tick.prototype, 'getLabelPosition', function(proceed, x, y, label, horiz, labelOptions, tickmarkOffset, index) {
        var args = Array.prototype.slice.call(arguments, 1),
            xy,
            xOrY = horiz ? 'x' : 'y';
        if (this.axis.variwide && typeof this[xOrY + 'Orig'] === 'number') {
          args[horiz ? 0 : 1] = this[xOrY + 'Orig'];
        }
        xy = proceed.apply(this, args);
        if (this.axis.variwide && this.axis.categories) {
          this.postTranslate(xy, xOrY, index);
        }
        return xy;
      });
    }(Highcharts));
  }));
})(require('process'));
