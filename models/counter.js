const express = require('express');
require('../server.js')
const mongoose = require('mongoose')

const {Schema} = mongoose;

const counterSchema = new Schema({
    _id: {type:String, required: true},
    seq: {type: Number, default:0}
  })    

  counterSchema.statics.getNextNum = async function(){
    let seqNum = await this.findOne({_id: '1'});
    console.log('seqNum', seqNum)
    if(seqNum == null ) {
      seqNum = await new this({_id : '1'}).save();
    }
    seqNum.seq++;
    await seqNum.save();
    console.log('seqNum2', seqNum)
    return seqNum.seq;
  }
  

const Counter = mongoose.model('Counter', counterSchema);
exports.counter = Counter;
exports.getNextNum = this.getNextNum;