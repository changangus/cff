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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadResolver = void 0;
const multer_1 = __importDefault(require("../utils/multer"));
const type_graphql_1 = require("type-graphql");
let UploadResolver = class UploadResolver {
    uploadImage({ req, res }) {
        const singleUpload = multer_1.default.single('image');
        singleUpload(req, res, (err) => {
            if (err) {
                console.log(err);
                return false;
            }
            res.json({
                'imageUrl': req.file.location,
                'name': req.body.name,
            });
            return true;
        });
        return true;
    }
};
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Boolean)
], UploadResolver.prototype, "uploadImage", null);
UploadResolver = __decorate([
    type_graphql_1.Resolver()
], UploadResolver);
exports.UploadResolver = UploadResolver;
//# sourceMappingURL=uploadedFile.js.map