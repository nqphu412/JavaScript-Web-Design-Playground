let nameList = []; // 'Phu', 'Nhu', 'Gia', 'Diem', 'Muy'
let totalCost = 0;
let remainderValue = 0;
let resetRemainder = true;
let createTable = true;
let itemNameList = [];
let itemCostList = [];
let itemPeopleList = [];

const addButton = document.querySelector('.add-btn-js');
const confirmButton = document.querySelector('.confirm-btn-js');
const nextBtn   = document.querySelector('.next-btn-js');
const resetBtn  = document.querySelector('.reset-btn-js');
const divideBtn = document.querySelector('.divide-btn-js');

const nameInput = document.querySelector('.name-input');
const showNameArea = document.querySelector('.name-shown-js');

const costInput = document.querySelector('.cost-input');
const showCostArea = document.querySelector('.cost-shown-js');

const remainderSection = document.querySelector('.splitting-zone');
const peopleColumn = document.querySelector('.peopleColumn');
const moneyColumn = document.querySelector('.moneyColumn');

const deviationShow = document.querySelector('.deviation-error')
const resultTable = document.querySelector('.division-result')

// NAME SECTION
document.querySelector('.name-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addName();
  }
});
addButton.addEventListener('click', addName);

function addName() {
  if (nameInput.value === '') {
    return;
  }
  nameList.push(nameInput.value);
  nameInput.value = ``;
  showName();
}

function showName() {
  showNameArea.innerHTML = ''; // Reset display

  if (nameList.length === 0) {
    showNameArea.classList.remove('name-shown');
    nextBtn.classList.remove('next-shown');
    return;
  }; // Early return when no name add

  showNameArea.classList.add('name-shown');

  nameList.forEach(name => {
    const onePerson = document.createElement('div');
    onePerson.classList.add('eachName');

    onePerson.innerHTML = `
      <p class='personName'>${name}</p>
      <button class="remove-btn remove-btn-js">Remove</button>`;
    showNameArea.appendChild(onePerson);
  });

  const allRemoveBtns = document.querySelectorAll('.remove-btn-js');
  allRemoveBtns.forEach((eachBtn, idx) => {
    eachBtn.addEventListener('click', () => removeAName(idx));
  });

  showNextBtn();
}

function removeAName(idx) {
  nameList.splice(idx, 1);
  showName();
  resetPage2();
}

////////////////////////////////////

// COST SECTION
confirmButton.addEventListener('click', confirmCost);
document.querySelector('.cost-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    confirmCost();
  }
});

function confirmCost() {
  resetPage2();

  if (costInput.value <= 0) {
    costInput.value = '';
    alert(`Total cost need to be positive`);
    return;
  }

  totalCost = costInput.value;
  costInput.value = '';
  
  showCost();
  showNextBtn();
}

function showCost() {
  if (totalCost === 0) {
    showCostArea.classList.remove('cost-shown');
    return;
  }
  showCostArea.innerHTML = 'Total cost: $' + totalCost;
  showCostArea.classList.add('cost-shown');
}

function showNextBtn() {
  resetBtn.classList.remove('reset-shown');

  if (totalCost <= 0  || nameList.length === 0) {
    nextBtn.classList.remove('next-shown');
    return;
  };

  nextBtn.classList.add('next-shown');

  resetRemainder = true;
};

// NEXT BUTTON (ONLY SHOWN WHEN HAVE BOTH COST AND PEOPLE INVOLVED)
nextBtn.addEventListener('click', () => {
  showDivisionSection();
  nextBtn.classList.remove('next-shown');
  resetBtn.classList.add('reset-shown');
});

resetBtn.addEventListener('click', () => {
  // Reset all data
  nameList = [];
  totalCost = 0;
  remainderValue = 0;

  // Reset display
  showName();
  showCost();
  resetPage2();

  resetBtn.classList.remove('reset-shown');
})

// COST ALLOCATION
function showDivisionSection() {
  remainderSection.classList.add('remainder-shown');

  // Update current remainder
  const remainderShown = document.querySelector('.remainder-title');
  if (remainderValue === 0 && resetRemainder === true) {
    remainderShown.innerHTML = `Current Remainder: ${Math.round(totalCost * 100) / 100}`;
  } else {
    remainderShown.innerHTML = `Current Remainder: ${Math.round(remainderValue * 100) / 100}`;
  }

  if (createTable === false) {
    return;
  }

  nameList.forEach((namePerson, idx) => {
    // Name side
    const btn = document.createElement('button');
    btn.classList.add('division-section-btn', 'people-button');
    btn.innerHTML = namePerson;
    btn.addEventListener('click', () => {
      btn.classList.toggle('peopleClick')
    })
    peopleColumn.appendChild(btn);

    // Money side
    const moneyBtn = document.createElement('button');
    moneyBtn.classList.add('division-section-btn', 'money-btn');
    moneyBtn.innerHTML = 0;
    moneyColumn.appendChild(moneyBtn);
  })

  // Mark the table is already created.
  createTable = false;
}

divideBtn.addEventListener('click', () => {performDivision();})
document.querySelector('.eachCost').addEventListener('keydown', (e) => {if (e.key === 'Enter') {performDivision();}})


function performDivision() { 
  const itemCost = document.querySelector('.eachCost');
  const itemName = document.querySelector('.itemName');
  const allPeopleUsingItem = document.querySelectorAll('.peopleClick');
  
  if (resetRemainder === false || 
    itemCost.value <= 0 || itemName.value === '' ||
    allPeopleUsingItem.length === 0) { // Wrong format
    console.log('check');
    //itemCost.value = '';
    //itemName.value = '';
    return;
  }

  itemNameList.push(itemName.value);
  itemCostList.push(itemCost.value);
  
  let allPeopleName = [];
  allPeopleUsingItem.forEach(personName => {
    allPeopleName.push(personName.innerHTML);
    personName.classList.remove('peopleClick');
  } );
  itemPeopleList.push(allPeopleName);

  const matchingIdx = allPeopleName.map(name => nameList.indexOf(name));
  const afterDivisionCost = itemCost.value / allPeopleUsingItem.length;

  // Add to the corresponding money button
  const allMoneyButton = document.querySelectorAll('.money-btn');
  allMoneyButton.forEach((eachMoneyBtn, idx) => {
    if (matchingIdx.includes(idx)) {
      const newTotal = Number(eachMoneyBtn.innerHTML) + afterDivisionCost
      eachMoneyBtn.innerHTML = newTotal.toFixed(2);
    }
  });

  if (remainderValue === 0) {
    if (Number(itemCost.value) > totalCost) {
      alert(`It's higher than the total current remainder 1`)
      return;
    } else {
      remainderValue = totalCost - itemCost.value;
    }
  } else {
    if (itemCost.value > remainderValue) {
      alert(`It's higher than the total current remainder 2`);
      return;
    } else {
      remainderValue = remainderValue - itemCost.value;
      if (remainderValue < 0.01) { 
        resetRemainder = false };
    }
  }
  deviationShow.innerHTML = `Remainder stored in computer (due to JS precision error): ${remainderValue}`
  
  resultTable.innerHTML = '';
  itemCostList.forEach((cost, idx) => {
    let currentState = document.createElement('div');
    currentState.classList.add('splitting-row');
    currentState.innerHTML = `
    <p>Just divided ${cost} of ${itemNameList[idx]} for ${itemPeopleList[idx].join(', ')}</p>
    <button>Reset splitting</button>`;
    resultTable.appendChild(currentState);
  });

  showDivisionSection();

  itemCost.value = '';
  itemName.value = '';
}

function resetPage2() {
  remainderSection.classList.remove('remainder-shown');
  peopleColumn.innerHTML = '';
  moneyColumn.innerHTML = '';

  // Mark it needs to create table again
  createTable = true
}
