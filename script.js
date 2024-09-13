// Initial values and state
let firstInput = '';
let secondInput = '';
let operation = '';
let result = '';
let operandHold = true;
let decimalPrecision = 2;
let stateMachine = '100'; // StateMachine = abc where a = First Input State, b = Operation State, c = Second Input State

// DOM elements
const outputBox = document.getElementById('outputText');
const statusBox = document.getElementById('outputDisplay');
const topButton = document.getElementById('TopButton');
const bottomButton = document.getElementById('BottomButton');
const leftButton = document.getElementById('LeftButton');
const rightButton = document.getElementById('RightButton');
const calculateButton = document.getElementById('calculate');

// Utility functions
function autoScroll() {
  outputBox.scrollTop = outputBox.scrollHeight;
  statusBox.scrollLeft = statusBox.scrollWidth;
}

function updateButtonVisibility() {
  const outputScrollTop = outputBox.scrollTop;
  const outputScrollHeight = outputBox.scrollHeight;
  const outputClientHeight = outputBox.clientHeight;

  const statusScrollLeft = statusBox.scrollLeft;
  const statusScrollWidth = statusBox.scrollWidth;
  const statusClientWidth = statusBox.clientWidth;

  topButton.innerHTML = outputScrollTop === 0 ? '' : '&#9650;'; // Up arrow
  bottomButton.innerHTML = (outputScrollTop + outputClientHeight >= outputScrollHeight) ? '' : '&#9660;'; // Down arrow

  leftButton.innerHTML = statusScrollLeft === 0 ? '' : '&#9664;'; // Left arrow
  rightButton.innerHTML = (statusScrollLeft + statusClientWidth >= statusScrollWidth) ? '' : '&#9654;'; // Right arrow
}

function handleOperationButton(operationName, operationSign) {
  switch (stateMachine) {
    case '100': // Initial state: First input
      operation = operationName;
      stateMachine = '221';
      statusBox.textContent += operationSign;
      break;

    case '221': // Operation already chosen
      if (operandHold) { // No second input yet
        operation = operationName;
        statusBox.textContent = statusBox.textContent.slice(0, -1) + operationSign; // Replace operation sign
      } else { // Perform calculation if second input exists
        result = performOperation(parseFloat(firstInput), parseFloat(secondInput), operation);
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
  const maxDecimalPlaces = Math.max(firstDecimalPlaces, secondDecimalPlaces, 5); // Ensure at least 5 decimal places

  let result;

  switch (operand) {
    case 'add':
      result = first + second;
      break;
    case 'subtract':
      result = first - second;
      break;
    case 'multiply':
      result = first * second;
      break;
    case 'divide':
      result = second !== 0 ? first / second : 'Error';
      break;
    default:
      return '';
  }

  return result === 'Error' ? 'Error' : Math.round((result + Number.EPSILON) * 10 ** maxDecimalPlaces) / 10 ** maxDecimalPlaces;
}


function getNumberOfDecimalPlaces(n) {
  // Ensure n is a number and convert to string
  const s = String(+n);

  // Extract the fractional part and exponent using regex
  const match = /(?:\.(\d+))?(?:[eE]([+\-]?\d+))?$/.exec(s);

  // Return 0 for cases where the number is NaN, Infinity, or an integer
  if (!match) return 0;

  // Number of decimal places is the length of the fraction minus the exponent
  const fractionLength = match[1] ? match[1].length : 0;
  const exponent = match[2] ? parseInt(match[2], 10) : 0;

  return Math.max(0, fractionLength - exponent);
}


function handleNumPadButtonClick(numContent) {

  switch (stateMachine) {
    case '100': // Initial state: First input
      // Append number content to firstInput
      if (numContent !== '.') {
        firstInput += numContent;
      } else if (firstInput.indexOf('.') === -1) {
        // Add decimal point only if it's not already present
        firstInput += numContent;
      }

      // Update outputBox and statusBox
      outputBox.textContent = firstInput;
      statusBox.textContent = firstInput;

      // Add leading zero if needed
      if (firstInput.startsWith('.') && !firstInput.startsWith('0')) {
        outputBox.textContent = '0' + firstInput;
        statusBox.textContent = '0' + firstInput;
      }
      break;

    case '221': // Second input stage
      // Update operandHold only if it is true
      if (operandHold) operandHold = false;
      if (numContent !== '.') {
        // Handle non-decimal number input
        secondInput += numContent;
        outputBox.textContent = secondInput;
        statusBox.textContent += numContent;
      } else if (secondInput.indexOf('.') === -1) {
        // Handle decimal point input, if not already present
        secondInput += numContent;
        outputBox.textContent = secondInput;
        statusBox.textContent += numContent;
      }
      // Add leading zero if needed
      if (outputBox.textContent.startsWith('.') && !outputBox.textContent.startsWith('0')) {
        outputBox.textContent = '0' + outputBox.textContent;

        const lastDotIndex = statusBox.textContent.lastIndexOf('.');
        if (lastDotIndex > 0 && statusBox.textContent.charAt(lastDotIndex - 1) !== '0') {
          statusBox.textContent = statusBox.textContent.slice(0, lastDotIndex) + '0' + statusBox.textContent.slice(lastDotIndex);
        }
      }

      break;

    case '222': // After calculation, reset for new input
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

calculateButton.addEventListener('click', () => {
  if (stateMachine === '221' && secondInput !== '') {
    result = performOperation(parseFloat(firstInput), parseFloat(secondInput), operation);
    outputBox.textContent = result;
    operandHold = true;
    stateMachine = '222';
    statusBox.textContent += '=';
  }
  autoScroll();
});

document.querySelectorAll('.numpad').forEach(button => {
  button.addEventListener('click', () => handleNumPadButtonClick(button.textContent));
});

document.querySelectorAll('.operationpad').forEach(button => {
  button.addEventListener('click', () => {
    handleOperationButton(button.getAttribute('data-operation'), button.getAttribute('data-sign'));
  });
});

document.getElementById('clear').addEventListener('click', () => {
  firstInput = '';
  secondInput = '';
  operation = '';
  result = '';
  operandHold = true;
  stateMachine = '100';
  outputBox.textContent = 'Clear all Entry';
  statusBox.textContent = '';
  autoScroll();
})

document.getElementById('delete').addEventListener('click', () => {
  if (stateMachine === '221' && secondInput !== '') {
    secondInput = secondInput.slice(0, -1);
    outputBox.textContent = secondInput;
    statusBox.textContent = statusBox.textContent.slice(0, -1);
  } else if (stateMachine === '100' && firstInput !== '') {
    firstInput = firstInput.slice(0, -1);
    outputBox.textContent = firstInput;
    statusBox.textContent = statusBox.textContent.slice(0, -1);
  }
  autoScroll();
})