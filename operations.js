function add (items){
    return items.reduce((a, b) => a + b,0); 
}

function subtract(items){
    return items.reduce((a,b)=>a-b,a);
}

function multiply(items){
    return items.reduce((a,b)=>a*b,1);
}

function divide(items){
    return items.reduce((a,b)=>a/b,1);
}
