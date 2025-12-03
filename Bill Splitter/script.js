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


// Navigation using keyboard (arrow up and down)
let elementIdx = 0;
let focusables = [];

function updateFocusables() {
  focusables = Array.from(
    document.querySelectorAll(`
      input:not([disabled]),
      button:not([disabled]):not(.undo-btn):not(.add-btn):not(.remove-btn)`
    )
  ).filter(element => element.offsetParent !== null);
}

document.addEventListener('keydown', (e) => {
  const navigatingKeys = ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"];
  if (!navigatingKeys.includes(e.key)) return;
  if (focusables.length === 0) return;

  e.preventDefault();

  const direction = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1 : -1;
  elementIdx = (elementIdx + direction + focusables.length) % focusables.length;    
  focusables[elementIdx].focus();
});

// Add everyone's name
nameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {addName();}
});
addButton.addEventListener('click', addName);

function addName() {
  if (nameInput.value === '') {
    return;
  }
  nameList.splice(0,0,nameInput.value);
  nameInput.value = ``;
  showName();
  resetPage();
  updateFocusables();
}

// Show all names that already added
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

// In case when we include a wrong person
// (Or just want to change name)
function removeAName(idx) {
  nameList.splice(idx, 1);
  showName();
  showNextBtn();
  resetPage();
}

// NEXT, BACK buttons appear
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
  elementIdx = 0; // Reset the idx for navigation

  showSplittingSection();
  nextBtn.classList.remove('next-shown');
  page1Layout.classList.add('hidden');

  backBtnPC.classList.add('reset-shown');
  backBtnPhone.classList.add('reset-shown');
  document.querySelector('.current-total-title').classList.remove('hidden');
  page2Layout.classList.remove('hidden');

  updateFocusables();
});

backBtnPC.addEventListener('click', () => {
  elementIdx = 0; // Reset the idx for navigation

  page1Layout.classList.remove('hidden');
  document.querySelector('.current-total-title').classList.add('hidden');
  page2Layout.classList.add('hidden');
  backBtnPC.classList.remove('reset-shown');
  backBtnPhone.classList.remove('reset-shown');
  
  showName();
  updateFocusables();
});

backBtnPhone.addEventListener('click', () => {
  elementIdx = 0; // Reset the idx for navigation

  page1Layout.classList.remove('hidden');
  document.querySelector('.current-total-title').classList.add('hidden');
  page2Layout.classList.add('hidden');
  backBtnPC.classList.remove('reset-shown');
  backBtnPhone.classList.remove('reset-shown');

  showName();
  updateFocusables();
});

// Reset page only activated when new name added or old name deleted
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

// Create an area to insert item name and item cost
// And choose the corresponding people to add to their total
function showSplittingSection() {
  splittingSection.classList.add('remainder-shown');

  // Update current total
  updateTotal();

  // Early return when the table/dividing section is already created
  if (createTable === false) {return;}

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

// Indicate the total of all transaction so far
// This would help users to track if the total is matched with what they have in real life
function updateTotal() {
  const currentTotal = itemCostList.reduce((total, num) => total + Number(num), 0);
  totalShow.innerHTML = `Current Total: ${Number(currentTotal).toFixed(2)}`;
};

// This allow users to allocate cost to the people buying the item.
// Only work when item name and cost is inserted and people are selected
divideBtn.addEventListener('click', () => {performDivision();})

function performDivision() { 
  const allPeopleUsingItem = document.querySelectorAll('.peopleClick');
  if (itemCost.value <= 0 || 
    itemName.value === '' ||
    allPeopleUsingItem.length === 0) 
    {return;} // Wrong format

  itemNameList.splice(0, 0, itemName.value);
  itemCostList.splice(0, 0, itemCost.value);
  updateTotal();

  // EXtract name of people involved in each transaction
  let allPeopleName = [];
  allPeopleUsingItem.forEach(personName => {
    allPeopleName.splice(0, 0, personName.innerHTML);
    personName.classList.remove('peopleClick');
  } );
  itemPeopleList.splice(0, 0, allPeopleName);

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

  // Pop up the corresponding additional amount
  const allPopUpButton = document.querySelectorAll('.popup-btn');
  allPopUpButton.forEach((eachPupUpBtn, idx) => {
    eachPupUpBtn.classList.remove('hidden');
    if (matchingIdx.includes(idx)) {
      eachPupUpBtn.innerHTML = `+${afterDivisionCost.toFixed(2) }`;
    } else {
      eachPupUpBtn.innerHTML = ` `;
    }

    // Only let it show for 1 second, then hide it after that
    setTimeout(() => {
      eachPupUpBtn.classList.add('hidden');
      eachPupUpBtn.innerHTML = ``;
    }, 1000)
  });

  showCostAllocation(); // Update the history table

  // Reset the input space
  itemCost.value = '';
  itemName.value = '';

  // After dividing, reset to get to the input element fast
  elementIdx = 0;
};

// Show all division history with corresponding undo button
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

  // Allow scrolling bar when there is more than 10 division activities
  if (itemNameList.length > 10) {
    showHideBtn.classList.remove('hidden');
  } else {
    showHideBtn.innerHTML = 'Show less'; 
    showHideBtn.classList.add('hidden'); 
  }
}

// When a division is wrong for any reason
// Users can undo it, corresponding amount will be deducted for those individuals
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

// Allow users to show all the division history or show less
showHideBtn.addEventListener('click', () => {
  if (showHideBtn.innerHTML === 'Show less') {
    showHideBtn.innerHTML = 'Full';
    resultTable.classList.add('scroll-activate');
  } else { 
    showHideBtn.innerHTML = 'Show less'; 
    resultTable.classList.remove('scroll-activate');
  }
})
