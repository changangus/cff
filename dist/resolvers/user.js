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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const User_1 = require("../models/User");
const type_graphql_1 = require("type-graphql");
const argon2_1 = __importDefault(require("argon2"));
const validators_1 = require("../utils/validators");
const constants_1 = require("../constants");
const sendEmail_1 = require("../utils/sendEmail");
const uuid_1 = require("uuid");
const registerInput_1 = require("./types/registerInput");
const loginInput_1 = require("./types/loginInput");
const UserResponse_1 = require("./types/UserResponse");
const Fridge_1 = require("../models/Fridge");
const updateInput_1 = require("./types/updateInput");
let UserResolver = class UserResolver {
    me({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.session);
            console.log(req.session.userId);
            if (!req.session.userId) {
                return null;
            }
            ;
            const user = yield User_1.Users.findOne({ _id: req.session.userId });
            return user;
        });
    }
    ;
    register(options, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { firstName, lastName, email, password } = options;
            const errors = validators_1.validateRegister(options);
            if (errors) {
                return { errors };
            }
            ;
            const hashedPassword = yield argon2_1.default.hash(password);
            const user = new User_1.Users({
                firstName,
                lastName,
                email,
                password: hashedPassword
            });
            try {
                yield user.save();
                console.log("saving");
            }
            catch (error) {
                if (error.code === 11000) {
                    return {
                        errors: [{
                                field: 'email',
                                message: 'Email already has an account, please login',
                            }]
                    };
                }
            }
            ;
            req.session.userId = user._id;
            req.session.save();
            return { user };
        });
    }
    ;
    login(options, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = options;
            const user = yield User_1.Users.findOne({ email: email });
            if (!user) {
                return {
                    errors: [{
                            message: "Email invalid, please register to create an account.",
                            field: "email"
                        }]
                };
            }
            ;
            const isValid = yield argon2_1.default.verify(user.password, password);
            if (!isValid) {
                return {
                    errors: [{
                            message: "Incorrect password",
                            field: "password"
                        }]
                };
            }
            ;
            req.session.userId = user._id;
            req.session.save();
            console.log("USERID:", req.session.userId);
            console.log("SESSION:", req.session);
            return { user };
        });
    }
    ;
    logout({ req, res }) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                req.session.destroy((err) => {
                    res.clearCookie(constants_1.COOKIE_NAME);
                    if (err) {
                        console.log(err);
                        resolve(false);
                        return;
                    }
                    resolve(true);
                });
            });
        });
    }
    ;
    updateUser(options, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.userId) {
                return {
                    errors: [{
                            field: "username",
                            message: "You must be logged in to complete this action."
                        }]
                };
            }
            ;
            const errors = validators_1.validateRegister(options);
            if (errors) {
                return { errors };
            }
            ;
            const userId = req.session.userId;
            const { firstName, lastName, email, password } = options;
            if (password) {
                const hashedPassword = yield argon2_1.default.hash(password);
                const updatedUser = yield User_1.Users.findByIdAndUpdate(userId, {
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword
                });
                if (!updatedUser) {
                    return {
                        errors: [{
                                field: "user",
                                message: "Update failed."
                            }]
                    };
                }
                ;
                return { user: updatedUser };
            }
            else {
                const updatedUser = yield User_1.Users.findByIdAndUpdate(userId, {
                    firstName,
                    lastName,
                    email,
                }, { new: true });
                if (!updatedUser) {
                    return {
                        errors: [{
                                field: "user",
                                message: "Update failed."
                            }]
                    };
                }
                ;
                return { user: updatedUser };
            }
        });
    }
    deleteUser({ req, res }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.Users.findByIdAndDelete(req.session.userId);
            if (user) {
                yield Fridge_1.Fridges.deleteMany({ author: user });
                return new Promise((resolve) => {
                    req.session.destroy((err) => {
                        res.clearCookie(constants_1.COOKIE_NAME);
                        if (err) {
                            console.log(err);
                            resolve(false);
                            return;
                        }
                        resolve(true);
                    });
                });
            }
            return false;
        });
    }
    forgotPassword(email, { redis }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.Users.findOne({ email });
            if (!user) {
                return true;
            }
            const token = uuid_1.v4();
            const key = constants_1.FORGET_PASSWORD_PREFIX + token;
            redis.set(key, user._id, 'ex', 1000 * 60 * 60 * 2);
            const html = `<a href='http://localhost:3000/change-password/${token}'>Link to reset password</a>`;
            sendEmail_1.sendEmail(user.email, html);
            return true;
        });
    }
    ;
    changePassword(token, newPassword, { redis, req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (newPassword.length < 8) {
                return {
                    errors: [{
                            field: 'newPassword',
                            message: 'password must be at least 8 characters long'
                        }]
                };
            }
            const key = constants_1.FORGET_PASSWORD_PREFIX + token;
            const userId = yield redis.get(key);
            if (!userId) {
                console.log('here');
                return {
                    errors: [{
                            field: 'token',
                            message: 'Token Expired'
                        }]
                };
            }
            ;
            const user = yield User_1.Users.findOne({ _id: userId });
            if (!user) {
                return {
                    errors: [{
                            field: 'token',
                            message: 'This user does not exist'
                        }]
                };
            }
            ;
            yield User_1.Users.findByIdAndUpdate({ _id: userId }, {
                password: yield argon2_1.default.hash(newPassword)
            });
            req.session.userId = userId;
            redis.del(key);
            return {
                user
            };
        });
    }
};
__decorate([
    type_graphql_1.Query(() => User_1.User, { nullable: true }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "me", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse_1.UserResponse),
    __param(0, type_graphql_1.Arg('options')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [registerInput_1.registerInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse_1.UserResponse),
    __param(0, type_graphql_1.Arg('options')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [loginInput_1.loginInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "logout", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse_1.UserResponse),
    __param(0, type_graphql_1.Arg("options")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [updateInput_1.updateInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "updateUser", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "deleteUser", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg('email')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "forgotPassword", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse_1.UserResponse),
    __param(0, type_graphql_1.Arg('token')),
    __param(1, type_graphql_1.Arg('newPassword')),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "changePassword", null);
UserResolver = __decorate([
    type_graphql_1.Resolver()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map