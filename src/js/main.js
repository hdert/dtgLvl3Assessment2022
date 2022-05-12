import Modal from "bootstrap/js/dist/modal";
var validator = require("email-validator");

function formHandler() {
  var firstname = document.getElementById("firstname").value;
  var lastname = document.getElementById("lastname").value;
  var email = document.getElementById("email").value;
  var agree = document.getElementById("agreetotos").checked;

  if ([firstname, lastname, email].includes("") || agree == false) {
    // var messageToUser =
    //   "<div class='alert alert-danger' role='alert'> Please make sure you have entered your full name, email address and you have agreed to your Terms of Service</div>";
    return false;
  } else if (validator.validate(email) == false) {
    var messageToUser =
      "<div class='alert alert-danger' role='alert'> Please make sure you have typed your email address in correctly </div>";
  } else {
    var messageToUser =
      "<div class='alert alert-primary' role='alert'> Thanks for subscribing to our newsletter " +
      firstname +
      " " +
      lastname +
      ". We have sent an email to " +
      email +
      " to confirm your subscription.</div>";
  }
  document.getElementById("modalBody").innerHTML = messageToUser;
  new Modal(document.getElementById("modal")).show();
}

document.getElementById("submitButton").onclick = function () {
  formHandler();
};

function tosHandler() {
  document.getElementById("modalBody").innerHTML =
    "<div class='alert alert-primary' role='alert'> The TOS is a lie, it don't exists, innit bruv.</div>";
  new Modal(document.getElementById("modal")).show();
}

document.getElementById("tos").onclick = function () {
  tosHandler();
};

// Import just what we need

import "bootstrap/js/dist/alert";
import "bootstrap/js/dist/button";
import "bootstrap/js/dist/carousel";
// import "bootstrap/js/dist/collapse";
import "bootstrap/js/dist/dropdown";
// import "bootstrap/js/dist/modal";
// import "bootstrap/js/dist/popover";
// import 'bootstrap/js/dist/scrollspy';
// import 'bootstrap/js/dist/tab';
// import 'bootstrap/js/dist/toast';
// import 'bootstrap/js/dist/tooltip';
