// Get references to the HTML elements
const container = document.querySelector('.container');

const addRowBtn = document.querySelector('.add-row');
const refreshButton = document.querySelector('.refresh-button');

// Add event listener to the "+" button
addRowBtn.addEventListener('click', function() {
  const newRow = document.createElement('div');
  newRow.classList.add('row');
  newRow.innerHTML = `
    <div class="input-column">
        <label for="input-text">Account no.</label>
        <div class="cell"><input type="text" id="input-text" placeholder="Enter account no."></div>
    </div>
    <div class="cell payable-amount"></div>
    <div class="cell last-payment-date"></div>
    <div class="cell remarks"></div>
  `;
  container.insertBefore(newRow, addRowBtn);
});

// Add event listener to the "Refresh" button
refreshButton.addEventListener('click', async function() {
  // Get all the rows in the container
  const rows = container.querySelectorAll('.row');

  // Loop over each row and update its values
  for (let i = 0; i < rows.length; i++) {

    const row = rows[i];

    const inputText = row.querySelector('.input-text');
    const payableAmount = row.querySelector('.payable-amount');
    const lastPaymentDate = row.querySelector('.last-payment-date');
    const remarks = row.querySelector('.remarks');

    // Get the account number from the input field
    const accountNumber = inputText.value;
    // Call the `run` function with the account number
    const values = [];
    values = await run(accountNumber);
    // const [payableAmt, lastPayDt, remark] = await run(accountNumber);
    
    // Update the values in the row
    payableAmount.textContent = value[0];
    lastPaymentDate.textContent = value[1];
    remarks.textContent = value[2];
  }
});

