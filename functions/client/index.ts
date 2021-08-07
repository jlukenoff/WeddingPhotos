import { v4 as uuid } from "uuid";

// Initialize Firebase
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/storage";
import "firebase/firestore";

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
const db = firebase.firestore();

// Get DOM elements
const $appHeader = document.getElementById("app-header") as HTMLHeadingElement;
const $form = document.getElementById("photo-upload__form") as HTMLFormElement;
const $nameInput = document.getElementById(
  "user-name__input"
) as HTMLInputElement;
const $noteInput = document.getElementById(
  "note__input"
) as HTMLTextAreaElement;
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
    $formLoadingSpinner.style.display = "none";
    $formCompleteImg.style.display = "block";
    $appHeader.textContent = "Your photos have been uploaded. Thank you!";
    return;
  }

  if (state === State.ERROR) {
    $appHeader.textContent =
      "Something went wrong. Please refresh the page and try again";
    [$form, $formLoadingSpinner, $uploadInputLabel, $formSubmitButton].forEach(
      ($e) => ($e.style.display = "none")
    );
  }
};

const sendFile = (file: File, id: string, createdAt: string) => {
  const { name } = file;
  const fileName = `${uuid()}-${name}`;
  return Promise.all([
    storage.child(name).put(file),
    db.collection("submissions").add({
      id,
      name: $nameInput.value,
      note: $noteInput.value,
      photo_name: fileName,
      created_at: createdAt,
    }),
  ]);
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

  const createdAt = new Date().toISOString();
  const id = uuid();

  // Begin photo upload
  updateButtonsWithState(State.UPLOAD_STARTED);
  (async () => {
    try {
      await Promise.all(files.map((f) => sendFile(f, id, createdAt)));
      updateButtonsWithState(State.UPLOAD_DONE);
    } catch (e) {
      console.error(e);
      updateButtonsWithState(State.ERROR);
    }
  })();
});
