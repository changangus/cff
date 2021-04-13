"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fridges = exports.Fridge = void 0;
const type_graphql_1 = require("type-graphql");
const typegoose_1 = require("@typegoose/typegoose");
const User_1 = require("./User");
let Fridge = class Fridge {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.ID, { nullable: true }),
    __metadata("design:type", String)
], Fridge.prototype, "_id", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], Fridge.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], Fridge.prototype, "address", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], Fridge.prototype, "description", void 0);
__decorate([
    type_graphql_1.Field(() => User_1.User),
    typegoose_1.prop({ ref: () => User_1.User }),
    __metadata("design:type", Object)
], Fridge.prototype, "author", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Float, { nullable: true }),
    typegoose_1.prop(),
    __metadata("design:type", Number)
], Fridge.prototype, "lat", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Float, { nullable: true }),
    typegoose_1.prop(),
    __metadata("design:type", Number)
], Fridge.prototype, "lng", void 0);
Fridge = __decorate([
    type_graphql_1.ObjectType()
], Fridge);
exports.Fridge = Fridge;
;
exports.Fridges = typegoose_1.getModelForClass(Fridge);
//# sourceMappingURL=Fridge.js.map