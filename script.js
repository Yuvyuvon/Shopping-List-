// Fetch Variables
const itemForm = document.getElementById('item-form');
const itemList = document.getElementById('item-list');
const itemInput = document.getElementById('item-input');
const itemFilter = document.getElementById('filter');
const clearBtn = document.getElementById('clear');
let isEditMode = false;
const formBtn = itemForm.querySelector('button');

// Functions
// ---------------------------------------------
// Display Items
function displayItems() {
  const itemsFromStorage = getItemFromStorage();

  itemsFromStorage.forEach((item) => addItemToDOM(item));

  CheckUI();
}

// Add Item To List
function onAddItemSubmit(e) {
  e.preventDefault();

  const newItem = itemInput.value;

  // Input validation
  if (newItem.value === '') {
    alert('Please Fill In The Item');
    return;
  }

  // Check For Edit Mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      alert('That Item Already Exists');
      return;
    }
  }

  // create item DOM element
  addItemToDOM(newItem);

  // Add Item to local storage
  addItemStorage(newItem);

  // check the ui
  CheckUI();

  itemInput.value = '';
}

// Add Item To DOM
function addItemToDOM(item) {
  // Create list item
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));
  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);

  itemList.appendChild(li);
}

// Create Button
function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}

// Create Icon
function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

// ------------------------------------------------------------------------

// Add Item To storage
function addItemStorage(item) {
  const itemsFromStorage = getItemFromStorage();

  // Add new item to the array
  itemsFromStorage.push(item);

  // convert to JSON string and set to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

// Get Items From Storage
function getItemFromStorage() {
  let itemsFromStorage;
  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }

  return itemsFromStorage;
}

// --------------------------------------------------------

function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    // Set Item Edit
    setItemToEdit(e.target);
  }
}

// Function TO Check If item Exists
function checkIfItemExists(item) {
  const itemsFromStorage = getItemFromStorage();

  return itemsFromStorage.includes(item);
}

// Set Edit to item and change style of button, input and li
function setItemToEdit(item) {
  isEditMode = true;

  itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'));

  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>  Update Item';
  formBtn.style.backgroundColor = '#228b22';
  itemInput.value = item.textContent;
}

// Function Remove Item From Storage
function removeItemFromStorage(item) {
  let itemsFromStorage = getItemFromStorage();

  // Filter Items to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  // Reset TO Local Storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

// Remove Item Function on X Icon Click
function removeItem(item) {
  if (confirm('Are You Sure?')) {
    // Remove item From DOM
    item.remove();
    // Remove Item From Storage

    removeItemFromStorage(item.textContent);

    CheckUI();
  }
}

// Remove Item Function on Clear Btn Click
function removeItemBtn() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }

  // Clear From Storage
  localStorage.removeItem('items');

  CheckUI();
}

function filterItems(e) {
  const text = e.target.value.toLowerCase();
  const items = itemList.querySelectorAll('li');

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.indexOf(text) != -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

// Remove Items From UI Auto
function CheckUI() {
  itemInput.value = '';

  const items = itemList.querySelectorAll('li');

  if (items.length === 0) {
    clearBtn.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    itemFilter.style.display = 'block';
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i>   Add item';
  formBtn.style.backgroundColor = '#333';

  isEditMode = false;
}

// Initialize

function init() {
  // Event Listeners
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearBtn.addEventListener('click', removeItemBtn);
  itemFilter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);

  // Run
  CheckUI();
}

init();
