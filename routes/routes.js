const express = require('express');
const route = express.Router();
const dns = require('dns');
const { URL } = require('url');
//const path = require('path');

const counter = require('../models/counter').counter;
const urlShort = require('../models/urlShort').urlShort;

//root
route.get('/', (req, res) => {
  let error
  let messageOrigin;
  let messageShort;
  if (req.query?.error) {
    error = req.query.error;
    console.log('error---', error)
  }
  if (req.query.messageOrigin) {
    messageOrigin = req.query.messageOrigin;
    console.log('mess--Ori-', messageOrigin)
  }
  if (req.query.messageShort) {
    messageShort = req.query.messageShort;
    console.log('mess--Ori-', messageShort)
  }
  res.render("index", {
    error: error ? error : "",
    messageOrigin: messageOrigin ? messageOrigin : "",
    messageShort: messageShort ? messageShort : ""
  })
})

route.get('/shorturl', async (req, res) => {
  if (!req.query?.url) return res.redirect(`/?error="no url entered"`)
  const url = req.query.url;
  let url1
  console.log('/shorturl?url---', url);
  try {
    url1 = new URL(req.query.url);
  } catch (e) {
    return res.redirect(`/?error=${e}`)
  }
  const urlexist = await urlShort.findOne({ url: url }, { _id: 0, url: 0, __v: 0 }).exec();
  if (urlexist) {
    //return res.status(200).redirect(`/?messageOrigin=${urlexist.origin}&messageShort=${urlexist.short}`)
    return res.status(200)
    .render('index', {
      messageShort: urlexist.short
  })
  }
  //return res.status(200).json({ short: `${urlexist?.short}` })}

  const dnsEngine = dns.lookup(url1.hostname, async (err, address) => {
    console.log('address', address)
    if (!address) {
      console.error(err);
      let error = 'invalid url'
      // return  res.redirect(`/?error=${error}`)
      return res.redirect(`/?error="invalid url"`)

    } else {
      const newurl = new urlShort({
        url: url,
        origin: dnsEngine.hostname,
      });
      try {
        const urldata = await newurl.save();
        console.log('urldata---', urldata.short, urldata)
        return res.status(200)
                .render('index', {
                  messageOrigin: urldata.origin,
                  messageShort: urldata.short
              })
        //return res.redirect(`/?messageOrigin=${req.originalUrl}&messageShort=${urldata.short}`)
      } catch (err) {
        console.error(err);
        res.redirect(`/?error="invalid url"`)
      }
    }
  })
})

route.get('/shorturl/:short', async (req, res) => {
  console.log('req.originalUrl----', req.originalUrl)
  const short = req.params.short;
  const error = 'invalid url';
  try {
    const urldata = await urlShort.findOne({ short: short }).exec();
    console.log(urldata?.url);
    console.log('redirect')
    res.redirect(urldata.url)
  } catch (err) {
    console.log('/shorturl/:short-----error')
    res.redirect(`/?error=${error}`)
  }

})

route.post('/shorturl/:short', async (req, res) => {
  //const short = req.params.short;
  const short = req.body.short;
  console.log(short);
  try {
    const urldata = await urlShort.findOne({ short: short }).exec();
    console.log(urldata?.url);
    console.log('redirect')
    res.redirect(urldata.url)
  } catch (err) {
    console.log('/shorturl/:short-----error')
    res.redirect(`/?error="invalid url"`)
  }

})

module.exports = route;