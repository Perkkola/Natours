import "@babel/polyfill";
import { login, logout } from "./login";
import { displayMap } from "./mapbox";
import { updateSettings } from "./updateSettings";
import {bookTour} from './stripe'

const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const logOutBtn = document.querySelector(".nav__el--logout");
const updateBtn = document.querySelector(".form-user-data");
const updatePassBtn = document.querySelector(".form-user-password");
const bookBtn = document.getElementById('book-tour')

if (mapBox) {
  const locations = JSON.parse(
    document.getElementById("map").dataset.locations
  );
  displayMap(locations);
}

if (loginForm) {
  document.querySelector(".form--login").addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    login(email, password);
  });
}

if (logOutBtn) logOutBtn.addEventListener("click", logout);

if (updateBtn) {
  updateBtn.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = new FormData()
    form.append('name', document.getElementById("name").value)
    form.append('email', document.getElementById("email").value)
    form.append('photo', document.getElementById('photo').files[0])
    console.log(form)
    updateSettings(form, "data");
  });
}
if (updatePassBtn) {
  updatePassBtn.addEventListener("submit", async (e) => {
    e.preventDefault();

    document.querySelector(".btn--save-password").textContent = "Updating";

    const password = document.getElementById("password-current").value;
    const newPassword = document.getElementById("password").value;
    const newPasswordConfirm = document.getElementById("password-confirm")
      .value;

    await updateSettings(
      { password, newPassword, newPasswordConfirm },
      "password"
    );

    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";

    document.querySelector(".btn--save-password").textContent = "Save password";
  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...'
    const {tourId} = e.target.dataset
    bookTour(tourId)
  })
}
