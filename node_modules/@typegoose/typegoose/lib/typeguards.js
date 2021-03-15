"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isModel = exports.isRefTypeArray = exports.isRefType = exports.isDocumentArray = exports.isDocument = void 0;
const mongoose = require("mongoose");
const utils_1 = require("./internal/utils");
/**
 * Check if the given document is already populated
 * @param doc The Ref with uncertain type
 */
function isDocument(doc) {
    return doc instanceof mongoose.Model;
}
exports.isDocument = isDocument;
function isDocumentArray(docs) {
    // its "any" & "unkown" because this is not listed as an overload
    return Array.isArray(docs) && docs.every((v) => isDocument(v));
}
exports.isDocumentArray = isDocumentArray;
/**
 * Check if the document is not undefined/null and is not an document
 * @param doc The Ref with uncretain type
 */
function isRefType(doc) {
    return !utils_1.isNullOrUndefined(doc) && !isDocument(doc);
}
exports.isRefType = isRefType;
function isRefTypeArray(docs) {
    // its "any" & "unkown" because this is not listed as an overload
    return Array.isArray(docs) && docs.every((v) => isRefType(v));
}
exports.isRefTypeArray = isRefTypeArray;
/**
 * Check if the input is a mongoose.Model
 * @param model The Value to check
 */
function isModel(model) {
    return (model === null || model === void 0 ? void 0 : model.prototype) instanceof mongoose.Model;
}
exports.isModel = isModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZWd1YXJkcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy90eXBlZ3VhcmRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUFxQztBQUNyQyw0Q0FBcUQ7QUFHckQ7OztHQUdHO0FBQ0gsU0FBZ0IsVUFBVSxDQUF1QixHQUFjO0lBQzdELE9BQU8sR0FBRyxZQUFZLFFBQVEsQ0FBQyxLQUFLLENBQUM7QUFDdkMsQ0FBQztBQUZELGdDQUVDO0FBVUQsU0FBZ0IsZUFBZSxDQUFDLElBQWlDO0lBQy9ELGlFQUFpRTtJQUNqRSxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakUsQ0FBQztBQUhELDBDQUdDO0FBRUQ7OztHQUdHO0FBQ0gsU0FBZ0IsU0FBUyxDQUF1QixHQUEwQjtJQUN4RSxPQUFPLENBQUMseUJBQWlCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDckQsQ0FBQztBQUZELDhCQUVDO0FBVUQsU0FBZ0IsY0FBYyxDQUFDLElBQWlDO0lBQzlELGlFQUFpRTtJQUNqRSxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEUsQ0FBQztBQUhELHdDQUdDO0FBRUQ7OztHQUdHO0FBQ0gsU0FBZ0IsT0FBTyxDQUFDLEtBQVU7SUFDaEMsT0FBTyxDQUFBLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxTQUFTLGFBQVksUUFBUSxDQUFDLEtBQUssQ0FBQztBQUNwRCxDQUFDO0FBRkQsMEJBRUMifQ==