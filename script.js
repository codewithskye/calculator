document.addEventListener('DOMContentLoaded', () => {

// MAIN CALCULATOR ELEMENTS
    const operationSelect = document.getElementById('operation');
    const inputsDiv = document.getElementById('inputs');
    const calculateBtn = document.getElementById('calculate');
    const clearBtn = document.getElementById('clear');
    const resultDiv = document.getElementById('result');
    const currencySelect = document.getElementById('currency');

    const salesTaxBtn = document.getElementById('sales-tax');
    const tip15Btn = document.getElementById('tip-15');
    const tip20Btn = document.getElementById('tip-20');

// FEEDBACK MODAL ELEMENTS

    const feedbackModal = document.getElementById('feedbackModal');
    const closeModal = document.querySelector('.close-modal');
    let hasCalculated = false;

// INITIAL SETUP

    updateInputs();

    operationSelect.addEventListener('change', updateInputs);
    calculateBtn.addEventListener('click', calculate);
    clearBtn.addEventListener('click', clearAll);

    salesTaxBtn.addEventListener('click', () => setPercentagePreset(7));
    tip15Btn.addEventListener('click', () => setPercentagePreset(15));
    tip20Btn.addEventListener('click', () => setPercentagePreset(20));

// INPUT GENERATOR
    function updateInputs() {
        const op = operationSelect.value;

        if (op === 'percentage') {
            inputsDiv.innerHTML = `
                <div>
                    <label>Amount:</label>
                    <input type="number" id="amount" step="0.01">
                </div>
                <div>
                    <label>Percentage:</label>
                    <input type="number" id="percent" step="0.01">
                </div>
            `;
        } else {
            inputsDiv.innerHTML = `
                <div>
                    <label>First Number:</label>
                    <input type="number" id="num1" step="0.01">
                </div>
                <div>
                    <label>Second Number:</label>
                    <input type="number" id="num2" step="0.01">
                </div>
            `;
        }
    }

// CALCULATOR LOGIC
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
            resultText = `${percent}% of ${currency}${amount.toFixed(2)} = ${currency}${resultValue.toFixed(2)}`;

            document.getElementById('amount').value = resultValue;
            document.getElementById('percent').value = '';

        } else {
            const num1 = parseFloat(document.getElementById('num1').value);
            const num2 = parseFloat(document.getElementById('num2').value);

            if (isNaN(num1) || isNaN(num2)) return;

            switch (op) {
                case 'addition':
                    resultValue = num1 + num2;
                    resultText = `${currency}${num1.toFixed(2)} + ${currency}${num2.toFixed(2)} = ${currency}${resultValue.toFixed(2)}`;
                    break;

                case 'subtraction':
                    resultValue = num1 - num2;
                    resultText = `${currency}${num1.toFixed(2)} - ${currency}${num2.toFixed(2)} = ${currency}${resultValue.toFixed(2)}`;
                    break;

                case 'multiplication':
                    resultValue = num1 * num2;
                    resultText = `${currency}${num1.toFixed(2)} × ${currency}${num2.toFixed(2)} = ${currency}${resultValue.toFixed(2)}`;
                    break;

                case 'division':
                    if (num2 === 0) {
                        resultDiv.innerHTML = 'Error: Division by zero';
                        return;
                    }
                    resultValue = num1 / num2;
                    resultText = `${currency}${num1.toFixed(2)} ÷ ${currency}${num2.toFixed(2)} = ${currency}${resultValue.toFixed(2)}`;
                    break;
            }

            document.getElementById('num1').value = resultValue;
            document.getElementById('num2').value = '';
        }

        resultDiv.innerHTML = resultText;
        showFeedbackModal();
    }

    function clearAll() {
        updateInputs();
        resultDiv.innerHTML = '';
    }

    function setPercentagePreset(preset) {
        operationSelect.value = 'percentage';
        updateInputs();
        document.getElementById('percent').value = preset;
    }

// FEEDBACK MODAL LOGIC
    function showFeedbackModal() {
        if (!hasCalculated && feedbackModal) {
            feedbackModal.style.display = 'block';
            hasCalculated = true;
        }
    }

    closeModal.addEventListener('click', () => {
        feedbackModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === feedbackModal) {
            feedbackModal.style.display = 'none';
        }
    });

// MULTIPLE % CALCULATOR

    const multiAmountInput = document.getElementById('multi-amount');
    const calcMultiBtn = document.getElementById('calc-multi');
    const clearMultiBtn = document.getElementById('clear-multi');
    const multiResults = document.getElementById('multi-results');

    calcMultiBtn.addEventListener('click', calculateMulti);
    clearMultiBtn.addEventListener('click', clearMulti);

    function calculateMulti() {
        const amount = parseFloat(multiAmountInput.value);
        if (isNaN(amount) || amount <= 0) {
            multiResults.innerHTML = '<p style="color:#ff6b6b;">Enter a valid amount</p>';
            return;
        }

        const currency = currencySelect.value;

        multiResults.innerHTML = `
            <div class="result-box">
                <h3>Box 6 (1.45%)</h3>
                <div class="value">${currency}${(amount * 0.0145).toFixed(2)}</div>
            </div>
            <div class="result-box">
                <h3>Box 4 (6.2%)</h3>
                <div class="value">${currency}${(amount * 0.062).toFixed(2)}</div>
            </div>
            <div class="result-box">
                <h3>Box 2 (22%)</h3>
                <div class="value">${currency}${(amount * 0.22).toFixed(2)}</div>
            </div>
        `;
    }

    function clearMulti() {
        multiAmountInput.value = '';
        multiResults.innerHTML = '';
    }
});

const feedbackForm = document.getElementById('feedbackForm');

if (feedbackForm) {
    feedbackForm.addEventListener('submit', async function (e) {
        e.preventDefault(); 

        const formData = new FormData(feedbackForm);

        try {
            const response = await fetch(feedbackForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                window.location.href = '/thanks.html';
            } else {
                alert('Something went wrong. Please try again.');
            }
        } catch (error) {
            alert('Network error. Please try again.');
        }
    });
}
