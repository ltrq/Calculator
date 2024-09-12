
let firstInput='';
let secondInput='';
let operation = '';
let result = '';
let operandHold = true;

let StateMachine = '100';  // StateMachine = abc where
                           // a = First Input State
                           // b = Operation State
                           // c = Second Input State
                           // value of a-b-c is 0, 1, or 2 with
                           // 0 = before state
                           // 1 = during state
                           // 2 = after state

const outputBox = document.getElementById('outputText');

const numpadOne = document.getElementById('one');
const numpadTwo = document.getElementById('two');
const numpadThree = document.getElementById('three');
const numpadFour = document.getElementById('four');
const numpadFive = document.getElementById('five');
const numpadSix = document.getElementById('six');
const numpadSeven = document.getElementById('seven');
const numpadEight = document.getElementById('eight');
const numpadNine = document.getElementById('nine');
const numpadZero = document.getElementById('zero');
const numpadDot = document.getElementById('dot');
const addButton = document.getElementById('add');
const subtractButton = document.getElementById('subtract');
const multiplyButton = document.getElementById('multiply');
const divideButton = document.getElementById('divide');
const CalculateButton = document.getElementById('calculate');

const clearButton = document.getElementById('clear');
const deleteButton = document.getElementById('delete');

clearButton.addEventListener('click',()=>{
    firstInput = '';
    secondInput = '';
    operation = '';
    result = '';
    outputBox.textContent = '';
    operandHold = true;
    StateMachine = '100';
})
function operationButton(operationName,operationSign){
    if(StateMachine == '100'){
        operation = operationName;
        StateMachine = '221';
        outputBox.textContent = operationSign;
        }
        else if (StateMachine == '221') {
            if(operandHold==true){
                operation = operationName;
                outputBox.textContent = operationSign}
            else{
            result = operations(parseInt(firstInput),parseInt(secondInput),operation);
            outputBox.textContent = result;
            firstInput = result;
            secondInput = '';
            operation = operationName;
            operandHold = true;}
        }
        else if (StateMachine == '222') {
            // if(operandHold==true){
            //     operation = operationName;
            //     outputBox.textContent = operationSign;
            //     firstInput = result;
            //     outputBox.textContent = firstInput;
            //     secondInput = '';}
            // else{
            firstInput = result;
            outputBox.textContent = firstInput;
            secondInput = '';
            operation = operationName;
            StateMachine = '221';
        // }
        }
}


addButton.addEventListener('click',()=>{
    operationButton('add','+');
})

subtractButton.addEventListener('click',()=>{
    operationButton('subtract','-');
})

multiplyButton.addEventListener('click',()=>{
    operationButton('multiply','×');
})

divideButton.addEventListener('click',()=>{
    operationButton('divide','÷');
})

CalculateButton.addEventListener('click',()=>{
    if(StateMachine == '221'){
        if(secondInput!=''){
        result = operations(parseFloat(firstInput),parseFloat(secondInput),operation);
        outputBox.textContent = result;
        operandHold = true;
        StateMachine = '222';
        }
    }
})



function operations(first,second,operand){
    if(operand == 'add'){
        return first + second;
    }else if(operand == 'subtract'){
        return first - second;
    }else if(operand == 'multiply'){
        return first * second;
    }else if(operand == 'divide'){
        return first / second;
    }
    else{
        return;
    }
}

function numPadButtons(numpadNumber) {
    if (StateMachine == '100') {
        firstInput = firstInput + numpadNumber.textContent;
        outputBox.textContent = firstInput;
    } else if (StateMachine == '221') {
        if(operandHold==true){
            operandHold=false;
            }
        secondInput = secondInput + numpadNumber.textContent;;
        outputBox.textContent = secondInput;
    } else if (StateMachine == '222') {
        firstInput = '';
        secondInput = '';
        StateMachine = '100';
        firstInput = numpadNumber.textContent;
        outputBox.textContent = firstInput;
    }
}

numpadOne.addEventListener('click', () => {
  numPadButtons(numpadOne);
})

numpadTwo.addEventListener('click', () => {
  numPadButtons(numpadTwo);
})

numpadThree.addEventListener('click', () => {
  numPadButtons(numpadThree);
})

numpadFour.addEventListener('click', () => {
  numPadButtons(numpadFour);
})

numpadFive.addEventListener('click', () => {
  numPadButtons(numpadFive);
})

numpadSix.addEventListener('click', () => {
  numPadButtons(numpadSix);
})

numpadSeven.addEventListener('click', () => {
  numPadButtons(numpadSeven);
})

numpadEight.addEventListener('click', () => {
  numPadButtons(numpadEight);
})

numpadNine.addEventListener('click', () => {
  numPadButtons(numpadNine);
})

numpadZero.addEventListener('click', () => {
  numPadButtons(numpadZero);
})

numpadDot.addEventListener('click', () => {
  numPadButtons(numpadDot);
})