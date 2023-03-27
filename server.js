const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/style.css', function(req, res) {
  res.setHeader('Content-Type', 'text/css');
  res.sendFile(__dirname + '/style.css');
});

app.get('/script.js', function(req, res) {
  res.sendFile(__dirname + '/script.js');
});

app.get('/server.js', function(req, res) {
    res.sendFile(__dirname + '/server.js');
  });

app.get('/bill', async (req, res) => {
  const accountNumber = req.query.accountNumber;

  const westzone_website = 'http://ebill.wzpdcl.gov.bd:7070/ords/f?p=1009:1009';

  const input_field_id = '#P1009_ACCNO';
  const search_button_id = '#B4348470026518114';
  const total_payable_amount_id = '#P1009_PAYABLEAMT_DISPLAY';
  const vat_amount_id = '#P1009_VAT_AMT_DISPLAY';
  const last_payment_date_id = '#P1009_LASTPAYDT_DISPLAY';
  const remarks_id = '#P1009_REMARKS_DISPLAY';

  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.goto(westzone_website);

  // Enter text into an input field
  const inputElement = await page.$(input_field_id);
  await inputElement.type(accountNumber);

  // Click a button
  const buttonElement = await page.$(search_button_id);
  await buttonElement.click();

  // Wait for the search results to be updated
  await page.waitForFunction(
    (selector, value) => {
      const element = document.querySelector(selector);
      return element && element.textContent !== value;
    },
    { timeout: 10000 },
    last_payment_date_id,
    '0'
  );

  const element1 = await page.$(total_payable_amount_id);
  const total_payable_amount = await page.evaluate(el => el.textContent, element1);

  const element2 = await page.$(vat_amount_id);
  const vat_amount = await page.evaluate(el => el.textContent, element2);

  const element3 = await page.$(last_payment_date_id);
  const last_payment_date = await page.evaluate(el => el.textContent, element3);

  const element4 = await page.$(remarks_id);
  const remarks = await page.evaluate(el => el.textContent, element4);

  await browser.close();

  res.json({
    total_payable_amount,
    last_payment_date,
    remarks
  });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
