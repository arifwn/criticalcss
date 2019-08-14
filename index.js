#!/usr/bin/env node

'use strict';

const express = require('express')
const fetch = require('node-fetch');
const generator = require('./critical-generator');

const app = express()
const port = process.env.PORT ? process.env.PORT : 3000
const appName = process.env.APP_NAME ? process.env.APP_NAME : "Critical CSS Api Server";
const userAgent = process.env.USER_AGENT ? process.env.USER_AGENT : 'criticalGenerator';
const secretKey = process.env.SECRET_KEY ? process.env.SECRET_KEY : 'MYSECRETKEY'

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


app.get('/', (req, res) => res.send(appName))
app.get('/robots.txt', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.send("User-agent: *\nDisallow: /")
})

app.get('/web/submit/', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.send("Use POST with key and url parameters.")
})

app.post('/web/submit/', (req, res) => {
  let key = req.body.key ? req.body.key : false;
  let url = req.body.url ? req.body.url : false;
  if (!url || !key) {
    res.status(400).send('Use POST with key and url parameters.')
    return;
  }

  console.log(`generating critical css for ${url}`);
  generator.generateCritical(url)
    .then(css => {
      res.setHeader('Content-Type', 'text/plain');
      res.send(css);
    })
    .catch(err => {
      res.status(500).send('')
    })
})

app.get('/api/submit/', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: "Use POST with key and url parameters." }));
})
app.post('/api/submit/', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  let key = req.body.key ? req.body.key : false;
  let url = req.body.url ? req.body.url : false;
  if (!url || !key) {
    res.status(400).send({ error: "Use POST with key and url parameters." })
    return;
  }

  console.log(`generating critical css for ${url}`);
  generator.generateCritical(url)
    .then(css => {
      res.send({ css: css });
    })
    .catch(err => {
      res.status(500).send({ error: `${err}` })
    })
})

app.get('/api/submit/async/', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: "Use POST with key, url and callback_url parameters." }));
})
app.post('/api/submit/async/', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  let key = req.body.key ? req.body.key : false;
  let url = req.body.url ? req.body.url : false;
  let callbackUrl = req.body.callback_url ? req.body.callback_url : false;
  if (!url || !key || !callbackUrl) {
    res.status(400).send({ error: "Use POST with key, url and callback_url parameters." })
    return;
  }

  setTimeout(() => {
    console.log(`generating critical css for ${url}`);
    generator.generateCritical(url)
    .then(css => {
      console.log(`critical css generated for ${url}`);
      console.log(`calling ${callbackUrl}`);

      fetch(callbackUrl, {
        method: 'POST',
        body: JSON.stringify({
          css: css,
          url: url
        }),
        headers: { 'Content-Type': 'application/json', 'User-Agent': `${userAgent}/1.0` },
      })
        .then(function(response) {
          return response.text();
        })
        .then(function(txt) {
          console.log(txt);
        });
    })
    .catch(err => {
      console.log(err)
    })
  }, 0)
  res.send({ queued: true });
})

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(port, () => console.log(`${appName} listening on port ${port} with secret key: ${secretKey}`))
