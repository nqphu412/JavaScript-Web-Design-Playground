let nameList = []; // 'Phu', 'Nhu', 'Gia', 'Diem', 'Muy'
let createTable = true;
let itemNameList = [];
let itemCostList = [];
let itemPeopleList = [];

const addButton = document.querySelector('.add-btn-js');
const nextBtn   = document.querySelector('.next-btn-js');
const resetBtn  = document.querySelector('.reset-btn-js');
const divideBtn = document.querySelector('.divide-btn-js');

const nameInput = document.querySelector('.name-input');
const showNameArea = document.querySelector('.name-shown-js');

const splittingSection = document.querySelector('.splitting-zone');
const totalShow = document.querySelector('.current-total-title');
const peopleColumn = document.querySelector('.peopleColumn');
const moneyColumn = document.querySelector('.moneyColumn');

const resultTable = document.querySelector('.division-result')

// SECTION 1: Add everyone' name
document.querySelector('.name-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {addName();}});
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
  resetPage();
}

// SECTION 2: NEXT, RESET buttons appear
function showNextBtn() {
  resetBtn.classList.remove('reset-shown');

  if (nameList.length === 0) {
    nextBtn.classList.remove('next-shown');
    return;
  };

  nextBtn.classList.add('next-shown');
};

nextBtn.addEventListener('click', () => {
  showSplittingSection();
  nextBtn.classList.remove('next-shown');
  resetBtn.classList.add('reset-shown');
});

resetBtn.addEventListener('click', () => {
  // Reset all data
  nameList = [];

  // Reset display
  showName();
  resetPage();

  resetBtn.classList.remove('reset-shown');
})

function resetPage() {
  splittingSection.classList.remove('remainder-shown');
  peopleColumn.innerHTML = '';
  moneyColumn.innerHTML = '';

  // Mark it needs to create table again
  createTable = true;
}

// SECTION 3: Add cost and item name and Choose people who used that item
function showSplittingSection() {
  splittingSection.classList.add('remainder-shown');

  // Update current total
  updateTotal();

  if (createTable === false) {
    return;
  }

  nameList.forEach((namePerson) => {
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

function updateTotal() {
  const currentTotal = itemCostList.reduce((total, num) => total + Number(num), 0);
  totalShow.innerHTML = `Current Total: ${currentTotal}`;
};

divideBtn.addEventListener('click', () => {performDivision();})

function performDivision() { 
  const itemCost = document.querySelector('.eachCost');
  const itemName = document.querySelector('.itemName');
  const allPeopleUsingItem = document.querySelectorAll('.peopleClick');
  
  if (itemCost.value <= 0 || 
    itemName.value === '' ||
    allPeopleUsingItem.length === 0) {
    return; 
  } // Wrong format

  itemNameList.push(itemName.value);
  itemCostList.push(itemCost.value);
  updateTotal();
  
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

  showCostAllocation();

  showSplittingSection();

  itemCost.value = '';
  itemName.value = '';
};

function showCostAllocation() {
  resultTable.innerHTML = '';
  itemCostList.forEach((cost, idx) => {
    let currentState = document.createElement('div');
    currentState.classList.add('splitting-row');
    currentState.innerHTML = `
    <p>Just divided ${cost} of ${itemNameList[idx]} for ${itemPeopleList[idx].join(', ')}</p>
    <button class='undo-btn'>Undo</button>`;
    resultTable.appendChild(currentState);
  });

  const allUndoBtns = document.querySelectorAll('.undo-btn');
  allUndoBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => undoATransaction(idx));
  });
}

function undoATransaction(idx) {
  const targetPeople = itemPeopleList[idx]
  const matchingIdx = targetPeople.map(name => nameList.indexOf(name));
  const afterDivisionCost = itemCostList[idx] / targetPeople.length;

  const allMoneyButton = document.querySelectorAll('.money-btn');
  allMoneyButton.forEach((eachMoneyBtn, idxBtn) => {
    if (matchingIdx.includes(idxBtn)) {
      const newTotal = Number(eachMoneyBtn.innerHTML) - afterDivisionCost
      eachMoneyBtn.innerHTML = newTotal.toFixed(2);
    }
  });

  itemNameList.splice(idx, 1);
  itemCostList.splice(idx, 1);
  itemPeopleList.splice(idx, 1);
  updateTotal();
  showCostAllocation();
};
