const puppeteer = require('puppeteer');

async function run(account_no) {

  // website to obtain bills from
  westzone_website = 'http://ebill.wzpdcl.gov.bd:7070/ords/f?p=1009:1009';

  // HTML ids of different elements
  input_field_id = '#P1009_ACCNO';
  search_button_id = '#B4348470026518114';
  total_payable_amount_id = '#P1009_PAYABLEAMT_DISPLAY';
  vat_amount_id = '#P1009_VAT_AMT_DISPLAY';
  last_payment_date_id = '#P1009_LASTPAYDT_DISPLAY';
  remarks_id = '#P1009_REMARKS_DISPLAY';

  // initiating headless browser
  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.goto(westzone_website);

  // Enter text into an input field
  const inputElement = await page.$(input_field_id);
  await inputElement.type(account_no);

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

  element = await page.$(total_payable_amount_id);
  const total_payable_amount = await page.evaluate(el => el.textContent, element);

  element = await page.$(vat_amount_id);
  const vat_amount = await page.evaluate(el => el.textContent, element);

  element = await page.$(last_payment_date_id);
  const last_payment_date = await page.evaluate(el => el.textContent, element);

  element = await page.$(remarks_id);
  const remarks = await page.evaluate(el => el.textContent, element);

  await browser.close();

  // console.log(`Total Payable Amount: ${total_payable_amount}`);
  // console.log(`Vat Amount: ${vat_amount}`);
  // console.log(`Last Payment Date: ${last_payment_date}`);
  // console.log(`Remarks: ${remarks}`);

  const value = [total_payable_amount, last_payment_date, remarks];

  return value;
}

// async function main() {
//   const values = await run('303110124');

//   for (let i = 0; i < values.length; i++){
//     console.log(values[i]);
//   }
// }

// main();