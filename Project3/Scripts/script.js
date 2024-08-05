let currentvalue = '';
let mttr = '';
var pos =0;
function numbersbutton(value){
    currentvalue += value;
    document.getElementById('result').value = currentvalue;
}
function appendstring(value){
    currentvalue += value;
    document.getElementById('result').value = currentvalue;
}

function resultbutton(){
    currentvalue = eval(currentvalue);
    document.getElementById('result').value = currentvalue;
}



// C buttons
function CEbutton(){   
    currentvalue = document.getElementById('result').value;
    currentvalue = String(currentvalue);
    currentvalue = currentvalue.slice(0,-1);
    document.getElementById('result').value = currentvalue;
}
function plusorminusbutton(){
    currentvalue = -currentvalue;
    document.getElementById('result').value = currentvalue;
}
function Cbutton(){
    currentvalue = '';
    document.getElementById('result').value = currentvalue;
}

function squareroot(value){
    currentvalue = Math.sqrt(currentvalue);
    document.getElementById('result').value = currentvalue;
}

function onebyxbutton(){
    if(currentvalue ==0){
        document.getElementById('result').value = "undifined";
    }else{
        currentvalue = 1 / currentvalue;
        document.getElementById('result').value = currentvalue;
    }
}


function leftarrowbutton() {
    const input = document.getElementById('result');
    const cursorPos = input.selectionStart;

    if (cursorPos > 0) {
        input.setSelectionRange(cursorPos - 1, cursorPos - 1);
        pos = cursorPos;
        input.focus();
    }
}

// writing for  M functions
function MCbutton(){
    mttr = '';
}
function MRbutton(){
    currentvalue='';
    document.getElementById('result').value = mttr;
}
function MSbutton(){
    mttr = currentvalue;
}
function Mplusbutton(){
    mttr = Number(mttr) + Number(currentvalue);
}
function Mminusbutton(){
    mttr = Number(mttr) - Number(currentvalue);
}
