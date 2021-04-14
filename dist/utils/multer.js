"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
aws_sdk_1.default.config.update({
    secretAccessKey: 'MqixYvJwA0jj8EXEwD1/3d5KgyLMr/G1UMJfFGUC',
    accessKeyId: 'AKIA3NTQEQPDHTEP7Y5T',
    region: 'us-east-2'
});
const s3 = new aws_sdk_1.default.S3();
const upload = multer_1.default({
    storage: multer_s3_1.default({
        s3: s3,
        bucket: 'cff-ac',
        acl: 'public-read',
        metadata: function (_, _1, cb) {
            cb(null, { fieldName: 'TESTING_META_DATA' });
        },
        key: function (_, _1, cb) {
            cb(null, Date.now().toString());
        }
    })
});
exports.default = upload;
//# sourceMappingURL=multer.js.map