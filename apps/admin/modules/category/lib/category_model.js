/**
 * Categories
 *    _id
 *    name                String 1..100
 *    seq                 Number
 *    state               ON, OFF
 *    permissions
 *      read
 *      write
 *      admin
 *    createdAt           Date
 *    updatedAt           Date
 */
Categories = new Mongo.Collection('categories');
