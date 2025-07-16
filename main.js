import "toastify-js/src/toastify.css";
import Toastify from "toastify-js";
import * as CocoSsd from "@tensorflow-models/coco-ssd";
import tf from "@tensorflow/tfjs";
let model = null;

const initModel = async () => {
  try {
    Toastify({
      text: "Model is Loading",

      duration: 3000,
    }).showToast();
    model = await CocoSsd.load();
    Toastify({
      text: "Model loaded succesfully",
      duration: 3000,
    }).showToast();
  } catch (error) {
    Toastify({
      text: error.message,
      duration: 3000,
    }).showToast();
  }
};

initModel().catch((err) => err);

const fileUpload = document.querySelector("#file");
const clearBtn = document.querySelector("#clear-btn");
const imgContainer = document.querySelector(".img-container");
const resultBox = document.querySelector("body > p");
fileUpload.addEventListener("change", (e) => {
  const files = e.target.files;
  if (files.length > 0) {
    const file = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.src = e.target.result;

      imgContainer.innerHTML = "";
      imgContainer.append(img);

      img.onload = () => {
        model.detect(img).then((data) => {
          let result;
          if (data.length > 0) {
            result = `  <span>Class: ${data[0].class}</span><br />
      <span>Probability: ${data[0].score}</span><br />`;
          } else {
            result = "<span>Unknown</span>";
          }
          resultBox.innerHTML = result;
        });
      };
    };
  } else {
    Toastify({
      text: "No file is uploaded",
      duration: 3000,
    }).showToast();
  }
});

clearBtn.addEventListener("click", () => {
  resultBox.innerHTML = "";
  imgContainer.innerHTML = "<p>Upload your image..</p>";
});
