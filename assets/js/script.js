const imageContainer = document.getElementById("imageContainer");
const createSheetButton = document.getElementById("create-sheet-button");
const readOrderButton = document.getElementById("read-order-button");
const printOrderButton = document.getElementById("print-order-button");

const draggables = [];
const containers = [];
const pageNumbers = [];

let pageCount = 0;
let fromSlot,
  toSlot = null;

createSheetButton.addEventListener("click", () => {
  for (let index = 0; index < 4; index++) {
    createImageElement();
  }
});

function createImageElement() {
  //Page Container
  const pageContainer = document.createElement("div");
  pageContainer.classList.add("page-container");

  //Page Box
  const pageBox = document.createElement("div");
  pageBox.classList.add("page-box");
  pageBox.classList.add("page-" + pageCount);
  containers.push(pageBox);

  //Page Image
  const newImg = document.createElement("img");
  newImg.src = "./assets/images/defaultImage_01.png"; // You can set a default source or leave it empty
  newImg.alt = "";
  newImg.className = "draggable";
  newImg.setAttribute("draggable", true);
  draggables.push(newImg);

  newImg.addEventListener("click", () => {
    changeImage(newImg);
  });

  //Page Number
  const pageNum = document.createElement("p");
  pageNum.classList.add("page-number");

  /* if (pageCount == 0) {
    pageNum.innerHTML = "front cover";
  }
  if (pageCount > 0) {
    pageNum.innerHTML = "page " + pageCount;
  } */
  pageNumbers.push(pageNum);

  pageBox.appendChild(newImg);
  pageContainer.appendChild(pageBox);
  pageContainer.appendChild(pageNum);
  imageContainer.appendChild(pageContainer);

  updateDraggables();
  updatePageNumbers();
  pageCount++;
}

function changeImage(img) {
  const imageUploadInput = document.createElement("input");
  imageUploadInput.type = "file";
  imageUploadInput.accept = "image/*";
  imageUploadInput.style.display = "none";

  imageUploadInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  imageUploadInput.click();
}

function updatePageNumbers() {
  for (let index = 0; index < pageNumbers.length; index++) {
    if (index == 0) {
      pageNumbers[index].innerHTML = "front cover";
    }
    if (index > 0 && index < pageNumbers.length) {
      pageNumbers[index].innerHTML = "page " + index;
    }
    if (index == pageNumbers.length - 1) {
      pageNumbers[index].innerHTML = "back cover";
    }
  }
}

function updateDraggables() {
  draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", () => {
      draggable.classList.add("dragging");
      fromSlot = draggable.parentNode;

      console.log(fromSlot);
    });

    draggable.addEventListener("dragend", () => {
      draggable.classList.remove("dragging");

      //if there was an item in the slot, place it in the fromSlot
      if (toSlot != null && toSlot.childElementCount > 0) {
        fromSlot.appendChild(toSlot.querySelector(".draggable"));
      }

      fromSlot = null;
      toSlot = null;
    });
  });

  containers.forEach((container) => {
    container.addEventListener("dragover", (e) => {
      //Allows for dropping inside of elements
      e.preventDefault();

      const draggable = document.querySelector(".dragging");
      toSlot = container;
      container.appendChild(draggable);
    });
  });
}
