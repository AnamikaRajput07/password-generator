const inputSlider=document.querySelector("[data-lengthSlider]"); 
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copybtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generator=document.querySelector(".generateBtn");
const allCheckBox= document.querySelectorAll("input[type=checkbox]");
const symbols='~`!@#$%^&*()_+=-{}[]\|?/.<,":>;';

let password="";
let passwordLength=10;
let checkCount=0;
// set strength circle color gray
setIndicator("#ccc");

handleSlider();  // call function

// set password length according to slider
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

// set indicator color
function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// get random numbers
/* Math.random : gives random num btw 0 & 1
   if this gets multiplied by max-min then we get num btw 0 & max-min
   also this can be floating num so get the floor value by using Math.floor
   also we want range min to max so add min in the ans hence we get the range min to max
*/

function getRndInteger(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRndNum(){
    return getRndInteger(0,9);
}

function generateLwrcase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUprcase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSym(){
    const randNum=getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUppr=false;
    let hasLwr=false;
    let hasNum=false;
    let hasSym=false;

    if(uppercaseCheck.checked) hasUppr=true;
    if(lowercaseCheck.checked) hasLwr=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSym=true;

    if(hasUppr && hasLwr && (hasNum || hasSym) && passwordLength>=8){
        setIndicator("#0f0");
    }
    else if((hasLwr || hasUppr) && (hasNum || hasSym) && passwordLength>=6){
        setIndicator("#ff0");
    }
    else {
        setIndicator("#f00");
    }
}

async function copyCnt(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value)  // copy onto clipboard
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="failed";
    }

    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function shufflePassword(array){
    // fisher yates method
    for(let i=array.length-1; i>0; i--){
        const j=Math.floor(Math.random() * (i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el) => (str += el));
    return str;
    
}

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked) 
            checkCount++;
    });
        // special condition
        if(passwordLength < checkCount){
            passwordLength=checkCount;
            handleSlider();
        }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange);
});

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

copybtn.addEventListener('click', ()=>{
    if(passwordDisplay.value){
        copyCnt();
    }
})


generator.addEventListener('click', ()=>{
    // none of the checkbox are selected
    if(checkCount ==0) return ;
    
    // special case
    if(passwordLength < checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    // start generating password

    // remove old password
    password="";

    /*
    if(uppercaseCheck.checked) {
        password+=generateUprcase();
    }
    if(lowercaseCheck.checked) {
        password+=generateLwrcase();
    }
    if(numbersCheck.checked) {
        password+=generateRndNum();
    }
    if(symbolsCheck.checked) {
        password+=generateSym();
    }
    */

    let funcArr=[];
    if(uppercaseCheck.checked) {
        funcArr.push(generateUprcase());
    }
    if(lowercaseCheck.checked) {
        funcArr.push(generateLwrcase());
    }
    if(numbersCheck.checked) {
        funcArr.push(generateRndNum());
    }
    if(symbolsCheck.checked) {
        funcArr.push(generateSym());
    }

    // compulsory addition
    for(let i=0; i<funcArr.length;i++){
        password += funcArr[i];
    }

    // remaining addition
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let rndIndex=getRndInteger(0,funcArr.length);
        password+=funcArr[rndIndex];
    }

    // shuffle characters
    password=shufflePassword(Array.from(password));

    // show password
    passwordDisplay.value=password;
    
    // calculate strength
    calcStrength();
});