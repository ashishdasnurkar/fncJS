define(function (require) {
    var panel = require('ui_controls/panels/panel');

    var grid = function (name, publicProperties, privateProperties) {
        this.initialize(name, publicProperties, privateProperties);
        this.tag = "grid";
        this.rows = [];
        this.cols = [];
    }
    grid.prototype = new panel();
    grid.prototype.render = function() {
        var parseCompositeProperty = function(propertyInDom, maxPropertyValue, toBeAddedTo, toBeAddedWithPropertyName) {
            var parts = propertyInDom.split(' ');
            var cummulativeValue = 0;
            for (var i = 0, part; part = parts[i]; i++) {
                var partNumeric = parseInt(part);
                if (part.indexOf('%') > -1) {    //value is in percentage
                    if(maxPropertyValue > 0) {
                        var currentValue = partNumeric * maxPropertyValue / 100;
                        cummulativeValue = cummulativeValue + currentValue;
                        var prop = {};
                        prop[toBeAddedWithPropertyName] = currentValue;
                        toBeAddedTo.push(prop);
                    }
                } else if (part === '*') {  //add the remaining value to this part
                    var prop = {};
                    prop[toBeAddedWithPropertyName] =  maxPropertyValue - cummulativeValue;
                    toBeAddedTo.push(prop);
                    cummulativeValue = maxPropertyValue;
                } else {    //number in pixel
                    cummulativeValue = cummulativeValue + partNumeric;
                    var prop = {};
                    prop[toBeAddedWithPropertyName] = partNumeric;
                    toBeAddedTo.push(prop);
                }
            }
            if (cummulativeValue > 0) {
                this.dom.style[toBeAddedWithPropertyName] = cummulativeValue +  'px';
            }
        };

        var parseRowHeights = function() {
            parseCompositeProperty.call(this, this.properties['rowheights'], parseInt(this.properties['height']), this.rows, 'height');
            var rows = this["rows"];
            var currentTop = 0;
            for(var i= 0, row; row= rows[i]; i++) {
                row["top"] = currentTop;
                currentTop = currentTop + row["height"];
            }
        }

        var parseColWidths = function() {
            parseCompositeProperty.call(this, this.properties['colwidths'], parseInt(this.properties['width']), this.cols, 'width');
            var cols = this["cols"];
            var currentLeft = 0;
            for(var i= 0, col; col= cols[i]; i++) {
                col["left"] = currentLeft;
                currentLeft = currentLeft + col["width"];
            }
        }


        //create this.dom as per parent
        panel.prototype.render.call(this);

        //parse grid specific properties
        parseRowHeights.call(this);
        parseColWidths.call(this);

        this.renderChildren();
        return this.dom;
    };
    return grid;
});

