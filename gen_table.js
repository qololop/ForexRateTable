import Decimal from "./decimal.mjs";

function findEven(e) {
    // Check the last digit of the number.
    const eStr = e.toString();
    const lastDigit = eStr[eStr.length - 1];
    // If the last digit is even, return true.
    return lastDigit % 2 === 0;
}

function createTable(ori, mod) {
    const table = document.querySelector("#forexTable tbody");
    table.innerHTML = ""; // Clear the table body.

    // Loop each currency in original rates.
    for (const currency in ori) {
        // Get values from both original and modified rates for this currency.
        const oriValue = new Decimal(ori[currency]);
        const modValue = mod[currency];

        // Create a new row.
        const row = document.createElement("tr");

        // Create a cell for the currency code.
        const currencyCell = document.createElement("td");
        currencyCell.textContent = currency;
        row.appendChild(currencyCell);

        // Create a cell for the original rate.
        const oriCell = document.createElement("td");
        oriCell.textContent = oriValue;
        // If the original rate is even, add a red border to the cell.
        if (findEven(oriValue) || currency == "HKD") {
            oriCell.classList.add("red-border");
        }
        row.appendChild(oriCell);

        // Create a cell for the modified rate.
        const modCell = document.createElement("td");
        modCell.textContent = modValue;
        // If the modified rate is even, add a red border to the cell.
        if (findEven(modValue) || currency == "HKD") {
            modCell.classList.add("red-border");
        }
        row.appendChild(modCell);

        // Append the row to the table.
        table.appendChild(row);
    }
}

async function fetchForexRates() {
    const url = "https://api.apilayer.com/fixer/latest";
    const options = {
      method: "GET", // HTTP GET request
      headers: {
        apikey: "Ap5TIA61KkWCPO4Gukw6h1ig1IERqrfq" // API key
      }
    };

    try {
        // Fetch the forex rates from the API.
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error("Network response was not ok: " + response.status);
        }

        // Parse the JSON response.
        const data = await response.json();
        // Retrieve the currency rates from the API response.
        const ori = data.rates;

        // Create a new variable: modifiedRates, adding 10.0002 to each original value.
        const mod = {};
        for (const currency in ori) {
            const oriValue = new Decimal(ori[currency]);
            const modValue = oriValue.plus(10.0002);
            mod[currency] = modValue.toString();
        }

        // Build the table using both original and modified rates.
        createTable(ori, mod);

    } catch (error) {
        console.error("Error fetching forex rates:", error);
    }
}

// Call the API once the page has loaded.
window.addEventListener("DOMContentLoaded", fetchForexRates);