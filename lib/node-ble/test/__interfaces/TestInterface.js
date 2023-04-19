"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const { Variant, interface: { Interface, property, method, ACCESS_READWRITE } } = require('dbus-next');
class TestInterface extends Interface {
    SimpleProperty = 'bar';
    _VirtualProperty = 'foo';
    get VirtualProperty() {
        return this._VirtualProperty;
    }
    set VirtualProperty(value) {
        this._VirtualProperty = value;
        Interface.emitPropertiesChanged(this, {
            VirtualProperty: value
        });
    }
    Echo(what) {
        return `>>${what}`;
    }
}
__decorate([
    property({ signature: 's', access: ACCESS_READWRITE })
], TestInterface.prototype, "SimpleProperty", void 0);
__decorate([
    property({ signature: 's' })
], TestInterface.prototype, "VirtualProperty", null);
__decorate([
    method({ inSignature: 's', outSignature: 's' })
], TestInterface.prototype, "Echo", null);
module.exports = TestInterface;
