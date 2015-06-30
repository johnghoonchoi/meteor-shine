/**
 * PostCategories
 *    _id
 *    name                String 1..100
 *    seq                 Number
 *    state               ON, OFF
 *    createdAt           Date
 *    updatedAt           Date
 */
PostCategories = new Mongo.Collection('postCategories');
