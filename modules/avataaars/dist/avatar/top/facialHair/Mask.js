"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var Mask = /** @class */ (function (_super) {
    __extends(Mask, _super);
    function Mask() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Mask.prototype.render = function () {
        return (React.createElement("g", { id: 'Facial-Hair/Mask', transform: 'translate(49.000000, 72.000000)' },
            React.createElement("path", { fill: '#92cfef', d: 'M87.8,48L140,62c0,0-3.7,52-56,52S28.3,63.9,28.3,63.9l51.9-15.7C82.7,47.4,85.3,47.4,87.8,48z' }),
            React.createElement("path", { fill: '#ffffff', d: 'M27.9,63.8C28.2,66.4,33.2,114,84,114c46.1,0,54.7-40.6,56-50.2l1.2-37.4l-1.2-0.3l-1.9,35.3L87.8,48c-1.2-0.3-2.4-0.5-3.6-0.5c-1.4,0-2.7,0.2-4,0.6L29.9,63.4l-2-37.6l-1.4,0.3L27.9,63.8z M125.3,84.9C116.7,99.6,102.8,107,84,107c-18.8,0-32.7-7.1-41.2-21.2c-3.8-6.3-5.7-12.6-6.7-17l46.1-14c0.7-0.2,1.3-0.3,2-0.3c0.6,0,1.2,0.1,1.8,0.2l46.1,12.3C131.1,71.7,129.1,78.4,125.3,84.9z' }),
            React.createElement("path", { fill: '#408fb2', d: 'M111.2,75H54.8L83,71L111.2,75z M83,81l-28.2,4h56.3L83,81z' })));
    };
    Mask.optionValue = 'Mask';
    return Mask;
}(React.Component));
exports.default = Mask;
