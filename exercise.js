
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
        switch(selection){
            case '1':
              rli.output.write("You've elected to purchase a new pass." + '\n');
              Purchase();
              break;
            case '2':
              // in the next sprint
              rli.output.write("You've elected to redeem you're current pass." + '\n');
              Redeem();
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


// two data models
var person = new Person();
var pass = new Pass();

function Person(){
  this.id = 0;
  this.name = '';
  this.isSenior = false;
  this.isStudent = false;
  this.isEmployee = false;
  this.creditCard = {};
}

function Pass(){
  this.id = 0;
  this.person = {};
  this.type = '';
  this.mode = '';
  this.price = 0.00;
  this.rides = 0;
  this.balance = 0.00;
  this.datePurchased = function(){
     var d = new Date();
     return d.getMonth() + '/' + d.getDate() + '/' + d.getYear();
  }
}


// our purchase controller
function Purchase(){
  // first step...
  Purchase.setName();
}

// for the next sprint, add some validation here...
Purchase.setName = function(){
  rli.question('Name:  ', function(name){
    person.name = name;
    Purchase.setAge();
  });
}


// or date of birth? easier this way...
Purchase.setAge = function(){
  rli.question('Age:  ', function(age){
      if(isNaN(age)){
        rli.output.write('Please enter a valid number.' + '\n');
        Purchase.setAge();
      }
      else{
        age = parseInt(age);
        person.isSenior = (age >= 65) ? true : false;
        Purchase.setPassType();
      }
  });
}


Purchase.setPassType = function() {
  var options = "To select a prepaid pass, press 1. To select a monthly pass, press 2." + "\n";

  rli.question(options, function(selected){
    switch(selected){
      case '1':
         pass.type = 'prepaid';
         break;
      case '2':
         pass.type = 'monthly';
         break;
      default:
         rli.output.write('Please enter a valid selection.' + '\n');
         Purchase.setPassType();
         break;
    }
    rli.output.write("You've selected a " + pass.type + " pass." + '\n');
    Purchase.setModeOfTransport();
  });
}


Purchase.setModeOfTransport = function(){

  var options = 'Select mode of transport:' + '\n' + '(1 = Bus, 2 = Subway, 3 = Commuter Rail)' + '\n';

  rli.question(options, function(selected){

     switch(selected){
       case '1':
          pass.mode = 'bus';
          break;
       case '2':
          pass.mode = 'subway';
          break;
       case '3':
          pass.mode = 'commuterRail';
          break;
       default:
          rli.output.write('Please enter a valid selection.' + '\n');
          Purchase.setModeOfTransport();
     }
     rli.output.write("You've selected " + pass.mode + "."  + '\n');

     // skip # of rides if they're purchasing a monthly pass
     if(pass.type === 'prepaid'){
       Purchase.setNumberOfRides();
     }else{
       Purchase.setIsStudent();
     }

  });
}

//
Purchase.setNumberOfRides = function(){
   rli.question('Number of rides: ', function(rides){
     if(isNaN(rides)){
       rli.output.write('Please enter a valid number.' + '\n');
     }else{
       pass.rides = rides;
       Purchase.setIsStudent();
     }
   })
}

Purchase.setIsStudent = function(){
  rli.question('Are you a student? (Y/N):  ', function(isStudent){
      switch(isStudent){
        case 'Y':
        case 'y':
        case 'Yes':
        case 'yes':
        case '1':
          person.isStudent = true;
          break;
        case 'N':
        case 'n':
        case 'No':
        case 'no':
        case '0':
        case '': // allow no answer to be registered as no
          person.isStudent = false;
          break;
        default:
          rli.output.write("Please enter 'Y' or 'N'."  + '\n');
          Purchase.setIsStudent();
          break;
      }
      Purchase.setIsEmployee();
    });
}


Purchase.setIsEmployee = function(){
  var isEmployee = false;
  rli.question('Do you work for the metropolitan transportation authority? (Y/N):  ', function(isEmployee){
      switch(isEmployee){
        case 'Y':
        case 'y':
        case 'Yes':
        case 'yes':
        case '1':
          person.isEmployee = true;
          break;
        case 'N':
        case 'n':
        case 'No':
        case 'no':
        case '0':
        case '': // allow no answer to be registered as no
          person.isEmployee = false;
          break;
        default:
          rli.output.write("Please enter 'Y' or 'N'" + '\n');
          Purchase.isEmployee();
          break;
      }
      Purchase.getFair();
    });
}

Purchase.getFair = function(type, mode){

  var type = pass.type;
  var mode = pass.mode;

  // grab fairs and discounts from fairs.json
  fs.readFile(fairsData, 'utf8', function(err, data){
      if(err) throw err;
      data = JSON.parse(data);
      var fairs = data.fairs[type];
      // the normal fair for whichever mode of transport
      var normalFair = (parseFloat(fairs[mode])).toFixed(2);
      // check for discounts
      var price = Purchase.applyDiscounts(normalFair, data.discounts);
      // if prepaid, apply the fair to multiple rides.
      pass.price = (pass.type === 'prepaid') ? (price * pass.rides).toFixed(2) : (parseFloat(price)).toFixed(2);
      // until the user redeems the balance is the same as the price
      pass.balance = pass.price;

      rli.output.write("Price: $" + pass.price + '\n');
      rli.output.write("Balance: $" + pass.balance + '\n');

      Purchase.saveData();
  });
  // rli.close();
}

// gets and applies discounts
Purchase.applyDiscounts = function(normalFair, discounts){
    var fair = normalFair;
    var discount = 0;

    // currently the employee discount is free
    if(person.isEmployee){
      var employeeDiscountRate = parseFloat(discounts['employee']);
      fair = (fair * employeeDiscountRate).toFixed(2);
    }

    if(person.isSenior){
       var seniorDiscountRate = parseFloat(discounts['senior']);
       fair = (fair * seniorDiscountRate).toFixed(2);
    }

    if(person.isStudent){
       var studentDiscountRate = parseFloat(discounts['student']);
       fair = (fair * studentDiscountRate).toFixed(2);
    }

    return fair;

}

// save data needs to be debugged.
Purchase.saveData = function(){
  pass.person = person;
  writeDataToFile(personsData, person);
  writeDataToFile(passesData, pass);

  rli.output.write("Thank you for your purchase!" + '\n');
  rli.close();

  return true;
}

// kickoff redeem workflow
function Redeem(){
  // use the setName function from purchase
  Redeem.setName();

  var passData = getDataFromFile(passesData, person.name);
  console.log('Pass Data: ' + passData);

  // bind this data the hard way for now
  pass.id = passData.id;
  pass.person = passData.person;
  pass.type = passData.type;
  pass.mode = passData.mode;
  pass.price = passData.price;
  pass.rides = passData.rides;
  pass.balance = passData.balance;
  pass.datePurchased = passData.datePurchased;

  // if expired send them back to purchase screen
  // Redeem.isExpired();

  // add balance and redeem or just redeem
  // Redeem.addBalance();
  // Redeem.lowerBalance();

}

// for the next sprint, add some validation here...
Redeem.setName = function(){
  rli.question('Name:  ', function(name){
    person.name = name;
  });
}

// check if its been more than 30 days since purchase
Redeem.isExpired = function(){}

// subtract from prepaid pass
Redeem.lowerBalance = function(){}

// check if its the weekend
Redeem.isWeekend = function(){
   var d = new Date();
   var day = d.getDay();
   var isWeekend = (day === 0 || day === 6);
   return isWeekend;
}

// add $$ to prepaid pass
Redeem.addBalance = function(){}


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
  var content = fs.readFileSync(file).toString().split('\n');
  content.forEach(function(data){
    console.log(data.name);
  });
}
