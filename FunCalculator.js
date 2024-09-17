// Slider Elements
const slider1 = document.getElementById("myRange");
const demo1 = document.getElementById("demo");
const slider2 = document.getElementById("myRange2");
const demo2 = document.getElementById("demo2");
const demo3 = document.getElementById("demo3");

// Initialize slider values
demo1.innerHTML = slider1.value;
demo2.innerHTML = slider2.value;
demo3.innerHTML = '0';

// Update calculation when sliders change
slider1.oninput = () => {
    demo1.innerHTML = slider1.value;
    updateCalculation();
};

slider2.oninput = () => {
    demo2.innerHTML = slider2.value;
    updateCalculation();
};

// Update the calculation and handle input
function updateCalculation() {
    const value1 = parseInt(demo1.innerHTML);
    const value2 = parseInt(demo2.innerHTML);
    demo3.innerHTML = (value1 * Math.pow(10, value2) / 1000).toFixed(2);
    handleInput(demo3.innerHTML);
}

// Wheel Element
const wheelEl = document.getElementById("wheel");
const sliceSize = 360 / 4;

function spinWheel() {
    const resultDisplay = document.getElementById("resultDisplay");
    const resultText = document.getElementById("resultText");

    // Reset wheel and animation
    wheelEl.style.transition = "none";
    wheelEl.style.transform = "rotate(0deg)";

    // Randomize index
    const index = Math.floor(Math.random() * 4) + 1;

    // Calculate rotation values
    const minRot = sliceSize * (index - 1) + (sliceSize / 15);
    const maxRot = sliceSize * index - (sliceSize / 15);
    const fullRots = Math.floor(Math.random() * 5) + 5; // 5 to 9 full rotations
    const randomRot = Math.floor(Math.random() * (maxRot - minRot + 1)) + minRot;
    const targetRotation = fullRots * 360 + randomRot;

    // Apply animation
    wheelEl.style.transition = "transform 5s ease-out";
    wheelEl.style.transform = `rotate(-${targetRotation}deg)`;

    // Function to be called when the animation ends
    function onTransitionEnd() {
        const totalDegrees = targetRotation % 360;
        const result = totalDegrees < 90 ? "Addition" :
                        totalDegrees < 180 ? "Subtraction" :
                        totalDegrees < 270 ? "Multiplication" : "Division";

        // Update result display
        resultText.innerText = `Chosen Operation is: ${result}`;
        handleOperationButton(result);

        // Remove event listener to avoid multiple calls
        wheelEl.removeEventListener('transitionend', onTransitionEnd);
    }

    // Add event listener to update result display after the animation ends
    wheelEl.addEventListener('transitionend', onTransitionEnd);
}

// Calculator State
let firstInput = '';
let secondInput = '';
let operation = '';
let result = '';
let operandHold = true;
let secondInputHold = true;
let decimalPrecision = 2;
let stateMachine = '100';

// DOM Elements
const outputBox = document.getElementById('outputText');
const statusBox = document.getElementById('outputDisplay');
const topButton = document.getElementById('TopButton');
const bottomButton = document.getElementById('BottomButton');
const leftButton = document.getElementById('LeftButton');
const rightButton = document.getElementById('RightButton');

// Utility Functions
function autoScroll() {
    outputBox.scrollTop = outputBox.scrollHeight;
    statusBox.scrollLeft = statusBox.scrollWidth;
}

function updateButtonVisibility() {
    topButton.innerHTML = outputBox.scrollTop === 0 ? '' : '&#9650;'; // Up arrow
    bottomButton.innerHTML = outputBox.scrollTop + outputBox.clientHeight >= outputBox.scrollHeight ? '' : '&#9660;'; // Down arrow
    leftButton.innerHTML = statusBox.scrollLeft === 0 ? '' : '&#9664;'; // Left arrow
    rightButton.innerHTML = statusBox.scrollLeft + statusBox.clientWidth >= statusBox.scrollWidth ? '' : '&#9654;'; // Right arrow
}

function getOperationSign(operationName) {
    switch (operationName) {
        case 'Addition': return '+';
        case 'Subtraction': return '-';
        case 'Multiplication': return '*';
        case 'Division': return '/';
        default: return '';
    }
}

function handleOperationButton(operationName) {
    const operationSign = getOperationSign(operationName);
    switch (stateMachine) {
        case '100': // Initial state
            operation = operationName;
            stateMachine = '221';
            statusBox.textContent += operationSign;
            break;

        case '221': // Operation already chosen
            if (operandHold) {
                operation = operationName;
                statusBox.textContent = statusBox.textContent.slice(0, -1) + operationSign; // Replace operation sign
            } else {
                result = performOperation(parseFloat(firstInput), parseFloat(secondInput), operation);
                firstInput = result;
                secondInput = '';
                operation = operationName;
                operandHold = true;
                outputBox.textContent = result;
                statusBox.textContent += operationSign;
            }
            break;

        case '222': // After calculation
            firstInput = result;
            secondInput = '';
            operation = operationName;
            stateMachine = '221';
            outputBox.textContent = firstInput;
            statusBox.textContent = firstInput + operationSign;
            break;

        default:
            console.error('Unknown stateMachine value:', stateMachine);
    }

    autoScroll();
}

function performOperation(first, second, operand) {
    const firstDecimalPlaces = getNumberOfDecimalPlaces(first);
    const secondDecimalPlaces = getNumberOfDecimalPlaces(second);
    const maxDecimalPlaces = Math.max(firstDecimalPlaces, secondDecimalPlaces, 5); // At least 5 decimal places

    let result;
    switch (operand) {
        case 'Addition': result = first + second; break;
        case 'Subtraction': result = first - second; break;
        case 'Multiplication': result = first * second; break;
        case 'Division': result = second !== 0 ? first / second : 'Error'; break;
        default: return '';
    }

    return result === 'Error' ? 'Error' : parseFloat(result.toFixed(maxDecimalPlaces));
}

function getNumberOfDecimalPlaces(n) {
    const s = String(+n);
    const match = /(?:\.(\d+))?(?:[eE]([+\-]?\d+))?$/.exec(s);
    const fractionLength = match?.[1]?.length || 0;
    const exponent = match?.[2] ? parseInt(match[2], 10) : 0;
    return Math.max(0, fractionLength - exponent);
}

function handleInput(numContent) {
    switch (stateMachine) {
        case '100':
            firstInput = numContent;
            outputBox.textContent = firstInput;
            statusBox.textContent = firstInput;
            break;

        case '221': // Second input stage
            if (operandHold) operandHold = false;
            outputBox.textContent = numContent;
            statusBox.textContent = statusBox.textContent.replace(secondInput, '') + numContent;
            secondInput = numContent;
            break;

        case '222': // After calculation
            firstInput = numContent;
            secondInput = '';
            stateMachine = '100';
            outputBox.textContent = firstInput;
            statusBox.textContent = firstInput;
            break;

        default:
            console.error('Unknown stateMachine value:', stateMachine);
    }

    autoScroll();
}

// Event Listeners
outputBox.addEventListener('scroll', updateButtonVisibility);
statusBox.addEventListener('scroll', updateButtonVisibility);

topButton.addEventListener('click', () => outputBox.scrollTop -= 25); // Scroll up
bottomButton.addEventListener('click', () => outputBox.scrollTop += 25); // Scroll down
leftButton.addEventListener('click', () => statusBox.scrollLeft -= 50); // Scroll left
rightButton.addEventListener('click', () => statusBox.scrollLeft += 50); // Scroll right

statusBox.addEventListener('wheel', (e) => statusBox.scrollLeft += e.deltaY, { passive: true });

document.getElementById('calculate').addEventListener('click', () => {
    if (stateMachine === '221' && secondInput !== '') {
        result = performOperation(parseFloat(firstInput), parseFloat(secondInput), operation);
        outputBox.textContent = result;
        operandHold = true;
        stateMachine = '222';
        statusBox.textContent += '=';
    }
    autoScroll();
});

document.getElementById('clear').addEventListener('click', () => {
    firstInput = '';
    secondInput = '';
    operation = '';
    result = '';
    operandHold = true;
    stateMachine = '100';
    outputBox.textContent = 'Clear all';
    statusBox.textContent = '';
    autoScroll();
});
