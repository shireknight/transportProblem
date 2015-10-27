
/*
    Title: QUOIN, INC. Coding Exercise
    Author: Ben Valentine
    Client: Quoin, Inc.
    License: MIT
*/

'use strict';

var readline = require('readline'),
  fs = require('fs');

// json files for data storage
var fairsData = './json/fairs.json',
    passesData = './json/passes.json',
    personsData = './json/persons.json';

var rli = readline.createInterface({
  input: process.stdin.setEncoding('utf8'),
  output: process.stdout,
  terminal: false
});

var App = {};

// everything starts here...
App.init = function(){

  var options = 'To purchase a new pass, press 1.' + '\n' + 'To redeem your current pass, press 2.' + '\n';

  rli.question(options, function(selection){
        // use switch statement for easier handling
        var transaction = new Transaction();
        console.log(transaction);
        switch(selection){
            case '1':
              rli.output.write("You've elected to purchase a new pass." + '\n');
              transaction.purchase();
              break;
            case '2':
              // in the next sprint
              rli.output.write("You've elected to redeem you're current pass." + '\n');
              transaction.redeem();
              break;
            default:
              rli.output.write("Please make a valid selection." + '\n');
              //this.init();
              App.init();
              break;
        }
    });
}


App.init();


function Person(){
  this.id = 0;
  this.name = '';
  this.isSenior = false;
  this.isStudent = false;
  this.isEmployee = false;
  this.creditCard = {};
}

function Pass(person){
  this.id = 0;
  this.person = person;
  this.type = '';
  this.mode = '';
  this.price = 0.00;
  this.rides = 0;
  this.balance = 0.00;
}

/* Transaction controller bootstrap {sort of} */
function Transaction(){
  this.person = new Person();
}

Transaction.prototype.purchase = function(){
    this.pass = new Pass(this.person);
    this.purchase = new Purchase(this.pass);
    this.purchase.date =
    this.purchase.setName();
}

Transaction.prototype.redeem = function(){
    var passData = [];

    rli.question('Name:  ', function(name){
        passData = getDataFromFile(passesData, name);
        new Redeem(passData);
    });

}



function Purchase(pass){
   this.pass = pass;
   this.pass.dateIssued = function(){
      var d = new Date();
      return d.getMonth() + '/' + d.getDate() + '/' + d.getYear();
   };
}

// start purchases here
Purchase.prototype.setName = function(){
  var that = this;
  rli.question('Name:  ', function(name){
    that.pass.person.name = name;
    that.setAge();
  });
}

// purchase question #2
Purchase.prototype.setAge = function(){
  var that = this;
  rli.question('Age:  ', function(age){
    if(isNaN(age)){
      rli.output.write('Please enter a valid number.' + '\n');
      that.setAge();
    }
    else{
      age = parseInt(age);
      that.pass.person.isSenior = (age >= 65) ? true : false;
    }
  });
}

// purchase question #3
Purchase.prototype.setPassType = function() {
  var that = this;
  var options = "To select a prepaid pass, press 1. To select a monthly pass, press 2." + "\n";

  rli.question(options, function(selected){
    switch(selected){
      case '1':
         that.pass.type = 'prepaid';
         break;
      case '2':
         that.pass.type = 'monthly';
         break;
      default:
          // if we don't get a valid input, implement recursion
         rli.output.write('Please enter a valid selection.' + '\n');
         that.setPassType();
         break;
    }
    rli.output.write("You've selected a " + pass.type + " pass." + '\n');
    that.setModeOfTransport();
  });
}

// purchase question #4
Purchase.prototype.setModeOfTransport = function(){
  var that = this;
  var options = 'Select mode of transport:' + '\n' + '(1 = Bus, 2 = Subway, 3 = Commuter Rail)' + '\n';

  rli.question(options, function(selected){

     switch(selected){
       case '1':
          that.pass.mode = 'bus';
          break;
       case '2':
          that.pass.mode = 'subway';
          break;
       case '3':
          that.pass.mode = 'commuterRail';
          break;
       default:
          rli.output.write('Please enter a valid selection.' + '\n');
          that.setModeOfTransport();
     }
     rli.output.write("You've selected " + pass.mode + "."  + '\n');

     // skip # of rides if they're purchasing a monthly pass
     if(that.pass.type === 'prepaid'){
       that.setNumberOfRides();
     }else{
       that.setIsStudent();
     }

  });
}

// purchase question #5
Purchase.prototype.setNumberOfRides = function(){
   var that = this;
   rli.question('Number of rides: ', function(rides){
     if(isNaN(rides)){
       rli.output.write('Please enter a valid number.' + '\n');
     }else{
       that.pass.rides = rides;
       that.setIsStudent();
     }
   })
}

// purchase question #6
Purchase.prototype.setIsStudent = function(){
  var that = this;
  rli.question('Are you a student? (Y/N):  ', function(isStudent){
      switch(isStudent){
        case 'Y':
        case 'y':
        case 'Yes':
        case 'yes':
        case '1':
          that.pass.person.isStudent = true;
          break;
        case 'N':
        case 'n':
        case 'No':
        case 'no':
        case '0':
        case '': // allow no answer to be registered as no
          that.pass.person.isStudent = false;
          break;
        default:
          rli.output.write("Please enter 'Y' or 'N'."  + '\n');
          that.setIsStudent();
          break;
      }
      that.setIsEmployee();
    });
}

// purchase question #7
Purchase.prototype.setIsEmployee = function(){
  var isEmployee = false;
  rli.question('Do you work for the metropolitan transportation authority? (Y/N):  ', function(isEmployee){
      switch(isEmployee){
        case 'Y':
        case 'y':
        case 'Yes':
        case 'yes':
        case '1':
          that.pass.person.isEmployee = true;
          break;
        case 'N':
        case 'n':
        case 'No':
        case 'no':
        case '0':
        case '': // allow no answer to be registered as no
          that.pass.person.isEmployee = false;
          break;
        default:
          rli.output.write("Please enter 'Y' or 'N'" + '\n');
          that.isEmployee();
          break;
      }
      that.getFair();
    });
}

// conclude purchase
Purchase.prototype.getFair = function(type, mode){
  var that = this;
  // grab fairs and discounts from fairs.json
  fs.readFile(fairsData, 'utf8', function(err, data){
      if(err) throw err;
      data = JSON.parse(data);
      var fairs = data.fairs[that.pass.type];
      // the normal fair for whichever mode of transport
      var normalFair = (parseFloat(fairs[that.pass.mode])).toFixed(2);
      // check for discounts
      var price = that.applyDiscounts(normalFair, data.discounts);
      // if prepaid, apply the fair to multiple rides.
      that.pass.price = (type === 'prepaid') ? (price * that.pass.rides).toFixed(2) : (parseFloat(price)).toFixed(2);
      // until the user redeems the balance is the same as the price
      that.pass.balance = that.pass.price;

      rli.output.write("Price: $" + that.pass.price + '\n');
      rli.output.write("Balance: $" + that.pass.balance + '\n');

      // save the data to json files
      that.saveData();
  });
  // rli.close();
}

// gets and applies discounts
Purchase.prototype.applyDiscounts = function(normalFair, discounts){
    var fair = normalFair;
    var discount = 0;

    // currently the employee discount is free
    if(this.pass.person.isEmployee){
      var employeeDiscountRate = parseFloat(discounts['employee']);
      fair = (fair * employeeDiscountRate).toFixed(2);
    }

    if(this.pass.person.isSenior){
       var seniorDiscountRate = parseFloat(discounts['senior']);
       fair = (fair * seniorDiscountRate).toFixed(2);
    }

    if(this.pass.person.isStudent){
       var studentDiscountRate = parseFloat(discounts['student']);
       fair = (fair * studentDiscountRate).toFixed(2);
    }

    return fair;

}

// save data needs to be debugged.
Purchase.prototype.saveData = function(){
  writeDataToFile(personsData, this.person);
  writeDataToFile(passesData, this.pass);

  rli.output.write("Thank you for your purchase!" + '\n');
  rli.close();

  return true;
}

function Redeem(passData){

  this.pass = {};

  var purchases = [];

  passData.forEach(function(data){
    var purchase = new Purchase(data);
    purchases.push(purchase);
  });

  this.purchases = purchases;

  if(this.purchases.length > 1){
    this.selectPass();
  }else{
    this.pass = this.purchases[0].pass;
    this.redeemPass();
  }

}

Redeem.prototype.selectPass = function(){

  var questionBody = 'Select pass to redeem: ' + "\r\n";

  for(var i=0; i<this.purchases.length; i++){
    console.log(this.purchases[0].pass.balance);
    questionBody += i + "). " + this.purchases[i].pass.dateIssued + " " + this.purchases[i].pass.balance;
    questionBody += "\r\n";
  }

  var that = this;
  rli.question(questionBody, function(selected){
      var numSelected = parseInt(selected) - 1;
      that.redeemPass(numSelected);
  });

}

Redeem.prototype.redeemPass = function(){

  this.pass = this.purchases[num].pass;

  var that = this;
  rli.question('Press 1 to Use, Press 2 to Add $$', function(input){
    switch(input){
      case '1':
        that.lowerBalance(); // lower balance and ride
      case '2':
        that.addBalance();
      default:
        that.redeemPass();
    }
  })

}

// // kickoff redeem workflow
// function Redeem(){
//   // use the setName function from purchase
//   this.setName();
//
//   var passData = getDataFromFile(passesData, this.person.name);
//   console.log('Pass Data: ' + passData);
//
//   var pass = new Pass();
//
//   // bind this data the hard way for now
//   pass.id = passData.id;
//   pass.person = passData.person;
//   pass.type = passData.type;
//   pass.mode = passData.mode;
//   pass.price = passData.price;
//   pass.rides = passData.rides;
//   pass.balance = passData.balance;
//   pass.datePurchased = passData.datePurchased;
//
//   // if expired send them back to purchase screen
//   // Redeem.isExpired();
//
//   // add balance and redeem or just redeem
//   // Redeem.addBalance();
//   // Redeem.lowerBalance();
//
// }
//
// // for the next sprint, add some validation here...
// Redeem.prototype.setName = function(){
//   rli.question('Name:  ', function(name){
//     this.person.name = name;
//   });
// }
//
// // check if its been more than 30 days since purchase
// Redeem.prototype.isExpired = function(){}
//
// // subtract from prepaid pass
// Redeem.prototype.lowerBalance = function(){}
//
// // check if its the weekend
// Redeem.prototype.isWeekend = function(){
//    var d = new Date();
//    var day = d.getDay();
//    var isWeekend = (day === 0 || day === 6);
//    return isWeekend;
// }
//
// // add $$ to prepaid pass
// Redeem.prototype.addBalance = function(){}
//
//
//
//
//
// file accessors
function writeDataToFile(file, data){
  var encoding = 'utf8';
  fs.appendFileSync(file, JSON.stringify(data) + '\n', encoding, function(err){
     if(err) throw err;
  });
  return true;
}

// retrieve data from files...
function getDataFromFile(file, name){
  var records = [];
  var content = fs.readFileSync(file).toString().split('\n');
  content.forEach(function(data){
    records.push(data);
  });
  return records;
}
