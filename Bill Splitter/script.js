let nameList = [];
let createTable = true;
let itemNameList = [];
let itemCostList = [];
let itemPeopleList = [];

const page1Layout = document.querySelector('.defining-zone');
const page2Layout = document.querySelector('.splittingPage');

const addButton = document.querySelector('.add-btn-js');
const nextBtn   = document.querySelector('.next-btn-js');
const backBtnPC  = document.querySelector('.back-btn-js');
const backBtnPhone = document.querySelector('.back-btn-phone-js');
const divideBtn = document.querySelector('.divide-btn-js');
const showHideBtn = document.querySelector('.show-hide-btn-js');

const nameInput = document.querySelector('.name-input');
const itemCost = document.querySelector('.eachCost');
const itemName = document.querySelector('.itemName');
const showNameArea = document.querySelector('.name-shown-js');

const splittingSection = document.querySelector('.splitting-zone');
const totalShow = document.querySelector('.current-total-title');
const peopleColumn = document.querySelector('.peopleColumn');
const moneyColumn = document.querySelector('.moneyColumn');
const popUpColumn = document.querySelector('.pop-upColumn');

const resultTable = document.querySelector('.division-result')

// SECTION 0: Quick navigation when typing
itemCost.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    backBtnPC.focus();
    backBtnPhone.focus();
  }
  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    itemName.focus();
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    divideBtn.focus();
  }
})

itemName.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    backBtnPC.focus();
    backBtnPhone.focus();
  } 
  if (e.key === 'ArrowRight') {
    e.preventDefault();
    itemCost.focus();
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    divideBtn.focus();
  }
})

divideBtn.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') { itemName.focus();}
})

backBtnPC.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') { itemName.focus(); }
});
backBtnPhone.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') { itemName.focus(); }
});

// SECTION 1: Add everyone' name
nameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {addName();}
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    nextBtn.focus();
  }
});
addButton.addEventListener('click', addName);

nextBtn.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') { nameInput.focus(); }
})

function addName() {
  if (nameInput.value === '') {
    return;
  }
  nameList.splice(0,0,nameInput.value);
  nameInput.value = ``;
  showName();
  resetPage();
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
      <button class="remove-btn remove-btn-js">
        -
      </button>`;
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
  showNextBtn();
}

// SECTION 2: NEXT, RESET buttons appear
function showNextBtn() {
  backBtnPC.classList.remove('reset-shown');
  backBtnPhone.classList.remove('reset-shown');

  if (nameList.length < 2) {
    nextBtn.classList.remove('next-shown');
    return;
  };

  nextBtn.classList.add('next-shown');
};

nextBtn.addEventListener('click', () => {
  showSplittingSection();
  nextBtn.classList.remove('next-shown');
  page1Layout.classList.add('hidden');

  backBtnPC.classList.add('reset-shown');
  backBtnPhone.classList.add('reset-shown');
  document.querySelector('.current-total-title').classList.remove('hidden');
  page2Layout.classList.remove('hidden');
});

backBtnPC.addEventListener('click', () => {
  page1Layout.classList.remove('hidden');
  document.querySelector('.current-total-title').classList.add('hidden');
  page2Layout.classList.add('hidden');
  backBtnPC.classList.remove('reset-shown');
  
  // Reset display
  showName();
  resetPage();
});
backBtnPhone.addEventListener('click', () => {
  page1Layout.classList.remove('hidden');
  document.querySelector('.current-total-title').classList.add('hidden');
  page2Layout.classList.add('hidden');
  backBtnPhone.classList.remove('reset-shown');

  // Reset display
  showName();
  resetPage();
});

function resetPage() {
  peopleColumn.innerHTML = '';
  moneyColumn.innerHTML = '';
  popUpColumn.innerHTML = '';

  itemNameList = [];
  itemCostList = [];
  itemPeopleList = [];
  resultTable.innerHTML = '';

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
    moneyBtn.innerHTML = '0.00';
    moneyBtn.disabled = true;
    moneyColumn.appendChild(moneyBtn);

    // Pop-up side
    const popUpBtn = document.createElement('button');
    popUpBtn.classList.add('division-section-btn', 'popup-btn', 'hidden');
    popUpBtn.disabled = true;
    popUpColumn.appendChild(popUpBtn);
  })

  // Mark the table is already created.
  createTable = false;
}

function updateTotal() {
  const currentTotal = itemCostList.reduce((total, num) => total + Number(num), 0);
  totalShow.innerHTML = `Current Total: ${Number(currentTotal).toFixed(2)}`;
};

divideBtn.addEventListener('click', () => {performDivision();})

function performDivision() { 
  const allPeopleUsingItem = document.querySelectorAll('.peopleClick');
  
  if (itemCost.value <= 0 || 
    itemName.value === '' ||
    allPeopleUsingItem.length === 0) {
    return; 
  } // Wrong format

  itemNameList.splice(0,0,itemName.value);
  itemCostList.splice(0,0,itemCost.value);
  updateTotal();
  
  let allPeopleName = [];
  allPeopleUsingItem.forEach(personName => {
    allPeopleName.splice(0,0,personName.innerHTML);
    personName.classList.remove('peopleClick');
  } );
  itemPeopleList.splice(0,0,allPeopleName);

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

  const allPopUpButton = document.querySelectorAll('.popup-btn');
  allPopUpButton.forEach((eachPupUpBtn, idx) => {
    eachPupUpBtn.classList.remove('hidden');
    if (matchingIdx.includes(idx)) {
      eachPupUpBtn.innerHTML = `+${afterDivisionCost.toFixed(2) }`;
    } else {
      eachPupUpBtn.innerHTML = ` `;
    }

    setTimeout(() => {
      eachPupUpBtn.classList.add('hidden');
      eachPupUpBtn.innerHTML = ``;
    }, 1000)
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
    <p class='detail-devision'>${cost} of ${itemNameList[idx]} spent by ${itemPeopleList[idx].join(', ')}</p>
    <button class='undo-btn'>Undo</button>`;
    resultTable.appendChild(currentState);
  });

  const allUndoBtns = document.querySelectorAll('.undo-btn');
  allUndoBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => undoATransaction(idx));
  });

  if (itemNameList.length > 10) {
    showHideBtn.classList.remove('hidden');
  } else {
    showHideBtn.innerHTML = 'Show less'; 
    showHideBtn.classList.add('hidden'); 
  }
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

showHideBtn.addEventListener('click', () => {
  if (showHideBtn.innerHTML === 'Show less') {
    showHideBtn.innerHTML = 'Full';
    resultTable.classList.add('scroll-activate');
  } else { 
    showHideBtn.innerHTML = 'Show less'; 
    resultTable.classList.remove('scroll-activate');
  }
})
