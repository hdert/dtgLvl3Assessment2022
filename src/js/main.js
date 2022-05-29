// Import Modal at the the top of the page as we are going to use it's functions directly using js
// unlike the other modules, which just interact with our html.

import Modal from "bootstrap/js/dist/modal";
// Import email-validator for email validation.
var validator = require("email-validator");

function formHandler() {
  // This function gets called when the user presses the submit button on the form.
  // Get the values of our form inputs so we can check them and show them to the user.
  var firstname = document.getElementById("firstname").value;
  var lastname = document.getElementById("lastname").value;
  var email = document.getElementById("email").value;
  var agree = document.getElementById("agreetotos").checked;

  if ([firstname, lastname, email].includes("") || agree == false) {
    // We return false here as an additional safeguard to stop the page from reloading
    // We return here to let the browser deal with this basic validation as nearly every browser
    // is Chromium or Firefox based and will do this validation for us.
    // Obviously, we would want to do server side checks, but there is no server here.
    return false;
  } else if (validator.validate(email) == false) {
    // Tell the user if email validation failed, the browsers can handle this one to some extent, but the browser
    // email filters is a little loose sometimes, hence the dependency.
    var messageToUser =
      "<div class='alert alert-danger' role='alert'> Please make sure you have entered your email address correctly </div>";
  } else {
    // Confirm to the user to tell them they have subscribed, we wouldn't want a confused user would we?
    var messageToUser =
      "<div class='alert alert-primary' role='alert'> Thanks for subscribing to our newsletter " +
      firstname +
      " " +
      lastname +
      ". We have sent an email to " +
      email +
      " to confirm your subscription.</div>";
  }
  // Write the message to the #modalBody and show the modal, if there is no firstname, lastname or email entered
  // we won't get to this step as the function will return.
  document.getElementById("modalBody").innerHTML = messageToUser;
  new Modal(document.getElementById("modal")).show();
}

document.getElementById("submitButton").onclick = function () {
  // We attach a listener in Javascript to avoid DOM related and other problems with forms.
  formHandler();
};

function tosHandler() {
  // This function gets called when the user pressed the Terms of Service link on the form.
  // Rewrite the html on the form with the message and show the modal once that's done.
  document.getElementById("modalBody").innerHTML =
    "<div class='alert alert-primary' role='alert'> The TOS is a lie, it don't exists, innit bruv.</div>";
  new Modal(document.getElementById("modal")).show();
}

document.getElementById("tos").onclick = function () {
  // We attach a listener in Javascript to avoid DOM related and other problems with forms.
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
