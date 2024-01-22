const mongoose  = require("mongoose");
const counter = require('./counter').counter;
const getNextNum = require('./counter').getNextNum;
require('../server.js')
const { Schema } = mongoose;


const urlSchema = new Schema({
  url : {type: String},
  origin: String,
  short: {type: Number, unique: true}
});

urlSchema.pre('save', async function(next){
    console.log('pre---this', this)
    const seq = await counter.getNextNum();
    this.short = seq;
    return next();
})

const UrlShort = mongoose.model('UrlShort', urlSchema);
exports.urlShort = UrlShort;