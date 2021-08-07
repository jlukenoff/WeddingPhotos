import firebase from "firebase/app";
// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

// Add the Firebase products that you want to use
import "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAi2pROL2o3A9hgraBpBtTPPrAJCcHGWfs",
  authDomain: "lukenoff-wedding.firebaseapp.com",
  projectId: "lukenoff-wedding",
  storageBucket: "lukenoff-wedding.appspot.com",
  messagingSenderId: "1089729436700",
  appId: "1:1089729436700:web:c3331e42e8b35a3e4f13d9",
  measurementId: "G-4CEQZS75BM",
};

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage().ref();

const $form = document.getElementById("photo-upload__form") as HTMLFormElement;
const $uploadInput = document.getElementById(
  "photo-upload__input"
) as HTMLInputElement;
const $uploadInputLabel = document.getElementById(
  "photo-upload__label"
) as HTMLLabelElement;
const $formSubmitButton = document.getElementById(
  "photo-upload__submit"
) as HTMLButtonElement;
const $formLoadingSpinner = document.querySelector(
  "#inner-content-container > .loading-spinner"
) as HTMLDivElement;
const $appHeader = document.getElementById("app-header") as HTMLHeadingElement;
const $formCompleteImg = document.getElementById(
  "complete-checkmark"
) as HTMLImageElement;

let files: File[] = [];

enum State {
  NOT_STARTED,
  PHOTOS_ADDED,
  UPLOAD_STARTED,
  UPLOAD_DONE,
  ERROR,
}

const updateButtonsWithState = (state: State) => {
  if (state === State.NOT_STARTED) {
    $uploadInputLabel.textContent = "ADD PHOTOS";
    $formSubmitButton.disabled = true;
  }

  if (state === State.PHOTOS_ADDED) {
    $uploadInputLabel.textContent = "CHANGE PHOTOS";
    $uploadInputLabel.style.opacity = "0.8";
    $formSubmitButton.disabled = false;
    return;
  }

  if (state === State.UPLOAD_STARTED) {
    // $uploadInputLabel.textContent = "UPLOAD IN PROGRESS";
    $formSubmitButton.disabled = false;
    $form.style.display = "none";
    $formLoadingSpinner.style.display = "block";
    return;
  }

  if (state === State.UPLOAD_DONE) {
    // $form.style.display = "block";
    $formLoadingSpinner.style.display = "none";
    $formCompleteImg.style.display = "block";
    $appHeader.textContent = "Your photos have been uploaded. Thank you!";
    // updateButtonsWithState(State.NOT_STARTED);
    return;
  }
};

const sendFile = (file: File) => {
  const { name } = file;
  return new Promise((resolve, reject) => {
    const uploadRef = storage.child(name).put(file);
    // convert Promise-like object returned by uploadRef to promise
    uploadRef.then(resolve).catch(reject);
  });
};

$uploadInput.addEventListener("change", (event) => {
  if (!$uploadInput.files) {
    updateButtonsWithState(State.NOT_STARTED);
    return;
  }
  files = [];
  for (let i = 0; i < $uploadInput.files.length; i++) {
    files.push($uploadInput.files[i]);
  }
  updateButtonsWithState(State.PHOTOS_ADDED);
});

$form.addEventListener("submit", (event) => {
  event.preventDefault();
  updateButtonsWithState(State.UPLOAD_STARTED);
  (async () => {
    try {
      await Promise.all(files.map((f) => sendFile(f)));
      updateButtonsWithState(State.UPLOAD_DONE);
    } catch (e) {
      updateButtonsWithState(State.ERROR);
    }
  })();
});

/**
 * TODO:
 * - Add name and note inputs and figure out where to store them
 * - show thumbnail previews
 */
