'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2022-05-09T23:36:17.929Z',
    '2022-05-13T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Yash Harale',
  movements: [50000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'INR',
  locale: 'hi',
};

const accounts = [account1, account2, account3];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function(date, locale) {
  const calcDaysPassed =  (date1, date2) => Math.round(Math.abs(date2-date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if(daysPassed === 0) return 'Today';
  if(daysPassed === 1) return 'Yesterday';
  if(daysPassed <= 7) return `${daysPassed} days ago`;
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date)
}

const formatCurrency = function(value, locale, currency) {
  return new Intl.NumberFormat(locale , {
    style: 'currency',
    currency: currency,
  }).format(value);
}

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date,acc.locale)

    const formattedMov = formatCurrency(mov, acc.locale, acc.currency)

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements_date">${displayDate}</div>
      <div class="movements__value">${formattedMov}</div>
    </div>`;

    // 'afterbegin' is used for displaying new movement(from last of array) first in the list
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Displaying Balance

const calcDisplayBalance = function (acct) {
  const balance = acct.movements.reduce((acc, mov) => acc + mov, 0);
  acct.balance = balance;
  labelBalance.textContent = formatCurrency(acct.balance, acct.locale, acct.currency);
};

// Display Summary

const calcDisplaySummary = function (acct) {
  const incomes = acct.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCurrency(incomes, acct.locale, acct.currency)

  const out = acct.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCurrency(Math.abs(out), acct.locale, acct.currency)

  const interest = acct.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acct.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCurrency(interest, acct.locale, acct.currency)
};

// Computing username

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(Name => Name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acct) {
  // Display movements
  displayMovements(acct);

  // Display balance
  calcDisplayBalance(acct);

  // Display summary
  calcDisplaySummary(acct);
};

const startLogOutTimer = function () {

    const tick = () => {
    const min = String(Math.trunc(time/60)).padStart(2,0);
    const sec = String(time % 60).padStart(2,0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if(time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to ger started';
      containerApp.style.opacity = 0;
    }

    // Decrease 1s
    time-- ;
  }

  // Set time to 5 minutes
  let time = 120;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;

}

// Event Handler
let currentAccount, timer;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault()
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  // Use '?' to avoid error for unknown 'account' '?' is called optional chaining
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and a welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Create Current Date and Time using 'Intl' api
    const date = new Date();
    const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    weekday: 'long',
  };
  // const locale = navigator.language; //use to get locale(country) from browser
  // console.log(locale);
  labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(date);

// Creating Current Date and Time manually
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // const hour = `${date.getHours()}`.padStart(2,0)
    // const min = `${date.getMinutes()}`.padStart(2,0)
    // labelDate.textContent = `${day}/${month}/${year},${hour}:${min}`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Timer 
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) console.log('Transfer Valid');
  {
  // Doing the transfer
  currentAccount.movements.push(-amount);
  receiverAcc.movements.push(amount);

  // Add transfer date
  currentAccount.movementsDates.push(new Date().toISOString())
  receiverAcc.movementsDates.push(new Date().toISOString())

  // Update UI
  updateUI(currentAccount);

  // Reset timer
  clearInterval(timer);
  timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {

   setTimeout(() => {

    //Add movements
    currentAccount.movements.push(amount);

    // Add loan date
    currentAccount.movementsDates.push(new Date().toISOString())

    //Update UI
    updateUI(currentAccount); 
  
    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();

   }, 3000);

  };

  // Clearing the input field
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);

    // Delete Account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;

    // Remove Welcome message
    labelWelcome.textContent = 'Log in to get started';
  }
  // Clearing input fields
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// console.log(23 === 231.0);

// console.log(0.1 + 0.2);

// // Conversion
// console.log(Number('23'));
// console.log(+'23');

// // Parsing
// console.log(Number.parseInt('30px'));
// console.log(Number.parseInt('e23'));

// console.log(Number.parseInt('2.5rem'));
// console.log(Number.parseFloat('2.5rem'));

// NAN -- We can use isNaN to check if value is NaN
// console.log(Number.isNaN(23));
// console.log(Number.isNaN('23'));
// console.log(Number.isNaN(+'23x'));

// isFinite -- We can use isFinite check wheather value is number
// console.log(Number.isFinite(23 / 0));
// console.log(Number.isFinite('23'));
// console.log(Number.isFinite(23));

// Math

// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));
// console.log(8 ** (1 / 3)); // Cubic root

// console.log(Math.max(2, 33, 4, 12));
// console.log(Math.max(2, '33', 4, 12)); // Math.max() is type coversion

//console.log(Math.PI * Number.parseFloat('10px') ** 2); // Area of the circle with '10px' radius

// console.log(Math.trunc(Math.random() * 6 ) +1);

// const randomInt = (min, max) =>
//   Math.trunc(Math.random() * (max - min) + 1) + min;

// console.log(randomInt(1, 10))

// Rounding integers
// It will round the value to the nearest integers
// console.log(Math.round(23.3));
// console.log(Math.round(23.9));

// It will rounded up to the value
// console.log(Math.ceil(23.4));
// console.log(Math.ceil(23.2));

// It will round down to the value
// console.log(Math.floor(23.9));

// Rounding Decimals
// console.log((2.7).toFixed(0)); // toFixed() is used to round of the decimals. toFixed() always returns string
// console.log((2.7).toFixed(3));
// console.log(+(2.345).toFixed(2));
// console.log((2.732).toFixed(2));

// Remainder Operator
// console.log(5 % 2);
// console.log(5 / 2); // 2 * 2 + 1    ----   so, the remainder is 1

// console.log(8 % 3);
// console.log(8 / 3); // 2 * 3 + 2  ----- the remainder is 2

// console.log(6 % 2); // ---- remainder will be 0 since 6 is divisible by 2
// console.log(6 / 2); // 2 * 3 + 0

// const isEven = n => n % 2 === 0;
// console.log(isEven(2));
// console.log(isEven(223));

// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
//     // 0, 2, 4, 6
//     if (i % 2 === 0) row.style.backgroundColor = 'orangered';
//     // 0, 3, 6, 9
//     if (i % 3 === 0) row.style.backgroundColor = 'pink';
//   });
// });

// Numeric Separator

// const diameterEarth = 239000000000; // Very difficult to understand the number
// const diameterEarth1 = 23_90_000_000_000; // So we can use _ which is a numeric separator.
// console.log(diameterEarth1);

// const price = 345_99;
// console.log(price);

// const transferFee1 = 15_00;
// const transferFee2 = 1_500;

// const PI = 3._1415 // We can only place Numeric Separator '_' between numbers

// BigInt
// console.log(2 ** 53 - 1);
// console.log(Number.MAX_SAFE_INTEGER);

// console.log(4823453534523453245345324523423435345n);
// console.log(BigInt(4823453534523453245345324523423435345n));

// console.log(BigInt(4234234234)); // Generally we use BigInt for medium size integers

// console.log(10000n + 10000n);

// // Exceptions in BigInt

// // console.log(230032322334n + 23); // ⚠ Cannot mix BigInt with other types
// console.log(230032322334n + BigInt(23)); // 💃 But we can convert that other datatype to BigInt
// console.log(20n > 15); // true --- console.log('20' > 19); '>' operator does type covertion(type does not matter)
// console.log(20n === 20); // false -- since '===' operator does not do type covertion
// console.log(23423421323423n + 'is real big');

// // BigInt divisions
// console.log(11n / 3n);
console.log(11 / 3);

// Creating Dates

// const now = new Date()
// console.log(now);

// console.log(new Date('May 13 2022 12:15:51'));
// console.log(new Date('December 24, 2015'));
// console.log(new Date(account1.movementsDates[0]));

// console.log(new Date(2037, 10, 19, 15, 23, 5)); // year, month(which is zero based), day, hours, min, sec
// console.log(new Date(2037, 10, 31));

// console.log(new Date(0));
// console.log(new Date( 3 * 24 * 60 * 60 * 1000));

// // Working with dates
// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate());
// console.log(future.getDay());
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());
// console.log(future.toISOString());
// console.log(future.getTime());

// console.log(new Date(2142237180000));
// console.log(Date.now());

// future.setFullYear(2040);
// console.log(future);


// const calcDaysPassed =  (date1, date2) => Math.abs((date2-date1) / (1000 * 60 * 60 * 24));

// const days1 = calcDaysPassed(new Date(2037, 3, 14), new Date(2037, 3, 4));
// console.log(days1);

// const num = 4235345324.34

// const options = {
//   style: "currency",
//   unit: "celsius",
//   currency: 'EUR',
//   // useGrouping: false,
// }

// console.log('US: ', new Intl.NumberFormat('en-US', options).format(num));
// console.log('Korea: ', new Intl.NumberFormat('ko',  options).format(num));
// console.log('Germany: ', new Intl.NumberFormat('de-DE', options).format(num));
// console.log(navigator.language, new Intl.NumberFormat(navigator.language).format(num));

// setTimeout
// const ingredients = ['olives', 'spinach']

// const pizzaTimer = setTimeout((ing1, ing2) => console.log(`Here is your pizza 🍕 with ${ing1} and ${ing2}`),3000, ...ingredients)

// console.log('Waiting...');
// if(ingredients.includes('spinach')) clearTimeout(pizzaTimer)

// setInterval




