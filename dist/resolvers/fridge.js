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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FridgeResolver = void 0;
const Fridge_1 = require("../models/Fridge");
const type_graphql_1 = require("type-graphql");
const User_1 = require("../models/User");
const getGeocodeRes_1 = require("../utils/getGeocodeRes");
let FridgeInput = class FridgeInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], FridgeInput.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], FridgeInput.prototype, "address", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], FridgeInput.prototype, "description", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], FridgeInput.prototype, "imageUrl", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], FridgeInput.prototype, "instagram", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], FridgeInput.prototype, "twitter", void 0);
FridgeInput = __decorate([
    type_graphql_1.InputType()
], FridgeInput);
let FridgeResolver = class FridgeResolver {
    getAllFridges() {
        return __awaiter(this, void 0, void 0, function* () {
            return Fridge_1.Fridges.find({});
        });
    }
    getMyFridges({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.session.userId;
            const user = yield User_1.Users.findOne({ _id: userId });
            if (!user) {
                return {
                    error: {
                        message: 'Not authorized',
                    },
                };
            }
            return Fridge_1.Fridges.find({ author: user });
        });
    }
    createFridge(inputs, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, address, description, instagram, twitter, imageUrl } = inputs;
            const author = yield User_1.Users.findOne({ _id: req.session.userId });
            const response = yield getGeocodeRes_1.geocode(address);
            const { lat, lng } = response.data.results[0].geometry.location;
            const fridge = new Fridge_1.Fridges({
                name,
                address,
                description,
                instagram,
                twitter,
                author,
                imageUrl: imageUrl
                    ? imageUrl
                    : 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png',
                lat,
                lng,
            });
            try {
                yield fridge.save();
            }
            catch (error) {
                console.log(error);
                return null;
            }
            return fridge;
        });
    }
    updateFridge(inputs, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, address, description, instagram, twitter, imageUrl, id } = inputs;
            const author = yield User_1.Users.findOne({ _id: req.session.userId });
            const response = yield getGeocodeRes_1.geocode(address);
            const { lat, lng } = response.data.results[0].geometry.location;
            const fridge = yield Fridge_1.Fridges.findByIdAndUpdate(id, {
                name,
                address,
                description,
                instagram,
                twitter,
                author: author,
                imageUrl: imageUrl
                    ? imageUrl
                    : 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png',
                lat,
                lng,
            });
            if (!fridge) {
                return null;
            }
            else {
                return fridge;
            }
        });
    }
    deleteFridge(id, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.Users.findById(req.session.userId);
            const fridge = yield Fridge_1.Fridges.findById(id);
            if (!user) {
                return {
                    error: {
                        message: "You must be logged in."
                    }
                };
            }
            if ((fridge === null || fridge === void 0 ? void 0 : fridge.author) !== user) {
                return {
                    error: {
                        message: "You are not authorized to complete this action."
                    }
                };
            }
            try {
                yield Fridge_1.Fridges.findByIdAndDelete(id);
                return true;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
};
__decorate([
    type_graphql_1.Query(() => [Fridge_1.Fridge]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FridgeResolver.prototype, "getAllFridges", null);
__decorate([
    type_graphql_1.Query(() => [Fridge_1.Fridge]),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FridgeResolver.prototype, "getMyFridges", null);
__decorate([
    type_graphql_1.Mutation(() => Fridge_1.Fridge),
    __param(0, type_graphql_1.Arg('inputs')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FridgeInput, Object]),
    __metadata("design:returntype", Promise)
], FridgeResolver.prototype, "createFridge", null);
__decorate([
    type_graphql_1.Mutation(() => Fridge_1.Fridge),
    __param(0, type_graphql_1.Arg('inputs')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FridgeResolver.prototype, "updateFridge", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("id")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FridgeResolver.prototype, "deleteFridge", null);
FridgeResolver = __decorate([
    type_graphql_1.Resolver()
], FridgeResolver);
exports.FridgeResolver = FridgeResolver;
//# sourceMappingURL=fridge.js.map