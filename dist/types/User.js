'use strict';
var __decorate =
	(this && this.__decorate) ||
	function(decorators, target, key, desc) {
		var c = arguments.length,
			r = c < 3 ? target : desc === null ? (desc = Object.getOwnPropertyDescriptor(target, key)) : desc,
			d;
		if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
			r = Reflect.decorate(decorators, target, key, desc);
		else
			for (var i = decorators.length - 1; i >= 0; i--)
				if ((d = decorators[i])) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
		return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
var __metadata =
	(this && this.__metadata) ||
	function(k, v) {
		if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function') return Reflect.metadata(k, v);
	};
Object.defineProperty(exports, '__esModule', { value: true });
exports.UserSchema = exports.Users = exports.User = void 0;
const type_graphql_1 = require('type-graphql');
const typegoose_1 = require('@typegoose/typegoose');
let User = class User {};
__decorate(
	[ type_graphql_1.Field(() => type_graphql_1.ID, { nullable: true }), __metadata('design:type', Number) ],
	User.prototype,
	'_id',
	void 0
);
__decorate(
	[
		type_graphql_1.Field({ nullable: true }),
		typegoose_1.prop({ required: true }),
		__metadata('design:type', String)
	],
	User.prototype,
	'firstName',
	void 0
);
__decorate(
	[
		type_graphql_1.Field({ nullable: true }),
		typegoose_1.prop({ required: true }),
		__metadata('design:type', String)
	],
	User.prototype,
	'lastName',
	void 0
);
__decorate(
	[
		type_graphql_1.Field({ nullable: true }),
		typegoose_1.prop({ required: true }),
		__metadata('design:type', String)
	],
	User.prototype,
	'email',
	void 0
);
__decorate(
	[ typegoose_1.prop({ required: true }), __metadata('design:type', String) ],
	User.prototype,
	'password',
	void 0
);
User = __decorate([ type_graphql_1.ObjectType(), typegoose_1.index({ email: 1 }, { unique: true }) ], User);
exports.User = User;
exports.Users = typegoose_1.getModelForClass(User);
exports.UserSchema = typegoose_1.buildSchema(User);
//# sourceMappingURL=User.js.map
