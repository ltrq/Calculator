let firstInput = '';
let secondInput = '';
let operation = '';
let result = '';
let operandHold = true;

let StateMachine = '100'; // StateMachine = abc where a = First Input State, b = Operation State, c = Second Input State
                          // 0 = Before Entering State
                          // 1 = During State
                          // 2 = After State

const outputBox = document.getElementById('outputText');
const statusBox = document.getElementById('outputDisplay');

function OnOverflowChanged() {
    if (outputBox.scrollHeight > outputBox.clientHeight) {
        console.log('overflow');
    }
}

// Auto-scroll function for the statusBox on mouse wheel
statusBox.addEventListener("wheel", (e) => {
    statusBox.scrollLeft += e.deltaY;
}, { passive: true });

// Handle operations
function operationButton(operationName, operationSign) {
    OnOverflowChanged();

    switch (StateMachine) {
        case '100': // Initial state: First input
            operation = operationName;
            StateMachine = '221';
            statusBox.textContent += operationSign;
            break;

        case '221': // Operation already chosen
            if (operandHold) { // No second input yet
                operation = operationName;
                statusBox.textContent = statusBox.textContent.slice(0, -1) + operationSign; // Replace operation sign
            } else { // Perform calculation if second input exists
                result = operations(parseFloat(firstInput), parseFloat(secondInput), operation);
                firstInput = result;
                secondInput = '';
                operation = operationName;
                operandHold = true;
                outputBox.textContent = result;
                statusBox.textContent += operationSign;
            }
            break;

        case '222': // After calculation, reset for next input
            firstInput = result;
            secondInput = '';
            operation = operationName;
            StateMachine = '221';
            outputBox.textContent = firstInput;
            statusBox.textContent = firstInput + operationSign;
            break;

        default:
            console.error('Unknown StateMachine value:', StateMachine);
    }

    // Auto-scroll
    statusBox.scrollLeft = statusBox.scrollWidth;
    outputBox.scrollTop = outputBox.scrollHeight;
}

// Handle calculation on "=" click
document.getElementById('calculate').addEventListener('click', () => {
    if (StateMachine === '221' && secondInput !== '') {
        result = operations(parseFloat(firstInput), parseFloat(secondInput), operation);
        outputBox.textContent = result;
        operandHold = true;
        StateMachine = '222';
        statusBox.textContent += '=';
        statusBox.scrollLeft = statusBox.scrollWidth;
    }
});

// Operations logic
function operations(first, second, operand) {
    switch (operand) {
        case 'add': return first + second;
        case 'subtract': return first - second;
        case 'multiply': return first * second;
        case 'divide': return second !== 0 ? first / second : 'Error';
        default: return '';
    }
}

// Handle number pad input
function numPadButtons(numpadNumber) {
    const numContent = numpadNumber.textContent;

    switch (StateMachine) {
        case '100': // Initial state: First input
            firstInput += numContent;
            outputBox.textContent = firstInput;
            statusBox.textContent = firstInput;
            break;

        case '221': // Second input stage
            if (operandHold) operandHold = false;
            secondInput += numContent;
            outputBox.textContent = secondInput;
            statusBox.textContent += numContent;
            break;

        case '222': // After calculation, reset for new input
            firstInput = numContent;
            secondInput = '';
            StateMachine = '100';
            outputBox.textContent = firstInput;
            statusBox.textContent = firstInput;
            break;

        default:
            console.error('Unknown StateMachine value:', StateMachine);
    }

    // Auto-scroll
    outputBox.scrollTop = outputBox.scrollHeight;
    statusBox.scrollLeft = statusBox.scrollWidth;
    OnOverflowChanged();
}

// Event listeners for number pad
document.querySelectorAll('.numpad').forEach(button => {
    button.addEventListener('click', () => numPadButtons(button));
});

// Event listeners for operation pad
document.querySelectorAll('.operationpad').forEach(button => {
    button.addEventListener('click', () => {
        operationButton(button.getAttribute('data-operation'), button.getAttribute('data-sign'));
    });
});
