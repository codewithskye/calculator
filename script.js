// script.js
document.addEventListener('DOMContentLoaded', () => {
    const operationSelect = document.getElementById('operation');
    const inputsDiv = document.getElementById('inputs');
    const calculateBtn = document.getElementById('calculate');
    const clearBtn = document.getElementById('clear');
    const resultDiv = document.getElementById('result');
    const currencySelect = document.getElementById('currency');
    const salesTaxBtn = document.getElementById('sales-tax');
    const tip15Btn = document.getElementById('tip-15');
    const tip20Btn = document.getElementById('tip-20');

    operationSelect.addEventListener('change', updateInputs);
    calculateBtn.addEventListener('click', calculate);
    clearBtn.addEventListener('click', clearAll);
    salesTaxBtn.addEventListener('click', () => setPercentagePreset(7));
    tip15Btn.addEventListener('click', () => setPercentagePreset(15));
    tip20Btn.addEventListener('click', () => setPercentagePreset(20));

    // Initial update
    updateInputs();

    function updateInputs() {
        const op = operationSelect.value;
        let html = '';
        if (op === 'percentage') {
            html = `
                <div>
                    <label><i class="fas fa-coins"></i> Amount:</label>
                    <input type="number" id="amount" step="0.01">
                </div>
                <div>
                    <label><i class="fas fa-percentage"></i> Percentage:</label>
                    <input type="number" id="percent" step="0.01">
                </div>
            `;
        } else {
            html = `
                <div>
                    <label><i class="fas fa-hashtag"></i> First Number:</label>
                    <input type="number" id="num1" step="0.01">
                </div>
                <div>
                    <label><i class="fas fa-hashtag"></i> Second Number:</label>
                    <input type="number" id="num2" step="0.01">
                </div>
            `;
        }
        inputsDiv.innerHTML = html;
    }

    function calculate() {
        const currency = currencySelect.value;
        const op = operationSelect.value;
        let resultValue;
        let resultText;

        if (op === 'percentage') {
            const amount = parseFloat(document.getElementById('amount').value);
            const percent = parseFloat(document.getElementById('percent').value);
            if (isNaN(amount) || isNaN(percent)) return;
            resultValue = amount * (percent / 100);
            resultText = `The ${percent}% of ${currency}${amount.toFixed(2)} = ${currency}${resultValue.toFixed(2)}`;
            // Chain: set amount to result for next calc
            document.getElementById('amount').value = resultValue;
            document.getElementById('percent').value = '';
        } else {
            const num1 = parseFloat(document.getElementById('num1').value);
            const num2 = parseFloat(document.getElementById('num2').value);
            if (isNaN(num1) || isNaN(num2)) return;
            if (op === 'addition') {
                resultValue = num1 + num2;
                resultText = `${currency}${num1.toFixed(2)} + ${currency}${num2.toFixed(2)} = ${currency}${resultValue.toFixed(2)}`;
            } else if (op === 'subtraction') {
                resultValue = num1 - num2;
                resultText = `${currency}${num1.toFixed(2)} - ${currency}${num2.toFixed(2)} = ${currency}${resultValue.toFixed(2)}`;
            } else if (op === 'multiplication') {
                resultValue = num1 * num2;
                resultText = `${currency}${num1.toFixed(2)} × ${currency}${num2.toFixed(2)} = ${currency}${resultValue.toFixed(2)}`;
            } else if (op === 'division') {
                if (num2 === 0) {
                    resultText = 'Error: Division by zero';
                    return;
                }
                resultValue = num1 / num2;
                resultText = `${currency}${num1.toFixed(2)} ÷ ${currency}${num2.toFixed(2)} = ${currency}${resultValue.toFixed(2)}`;
            }
            // Chain: set num1 to result for adding more numbers
            document.getElementById('num1').value = resultValue;
            document.getElementById('num2').value = '';
        }

        resultDiv.innerHTML = resultText;
    }

    function clearAll() {
        updateInputs(); // Resets inputs
        resultDiv.innerHTML = '';
    }

    function setPercentagePreset(presetPercent) {
        operationSelect.value = 'percentage';
        updateInputs();
        document.getElementById('percent').value = presetPercent;
        // User can now input amount and calculate
    }
});

// Feedback modal logic
const feedbackModal = document.getElementById('feedbackModal');
const closeModal = document.querySelector('.close-modal');
let hasCalculated = false; // only show once after first calculation

// Show modal only after FIRST successful calculation
function showFeedbackModal() {
    if (!hasCalculated && feedbackModal) {
        feedbackModal.style.display = 'block';
        hasCalculated = true;
    }
}

// Close modal
if (closeModal) {
    closeModal.onclick = function() {
        feedbackModal.style.display = 'none';
    }
}

// Close when clicking outside
window.onclick = function(event) {
    if (event.target === feedbackModal) {
        feedbackModal.style.display = 'none';
    }
}

// Modify your existing calculate() function – add this line at the end (after showing result):
// showFeedbackModal();

// So your calculate function ending becomes something like:
    // ... existing code ...
    resultDiv.innerHTML = resultText;
    showFeedbackModal();   // ← ADD THIS LINE