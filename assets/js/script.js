const imageContainer = document.getElementById("imageContainer");
const createSheetButton = document.getElementById("create-sheet-button");
const readOrderButton = document.getElementById("read-order-button");
const printOrderButton = document.getElementById("print-order-button");

const draggables = [];
const pageContainers = [];
const pageBoxes = [];
const pageNumbers = [];

let readOrder = true;

let pageCount = 0;
let fromSlot,
  toSlot = null;

createSheetButton.addEventListener("click", () => {
  for (let index = 0; index < 4; index++) {
    createPageElement();
  }
});

readOrderButton.addEventListener("click", () => {
  if (readOrder == false) {
    putInReadOrder();
  }
});

printOrderButton.addEventListener("click", () => {
  if (readOrder == true) {
    putInPrintOrder();
  }
});

function createPageElement() {
  //readOrder = true;
  //Page Container
  const pageContainer = document.createElement("div");
  pageContainer.classList.add("page-container-" + pageCount);
  pageContainers.push(pageContainer);

  //Page Box
  const pageBox = document.createElement("div");
  pageBox.classList.add("page-box");
  pageBox.classList.add("page-" + pageCount);
  pageBoxes.push(pageBox);

  //Page Image
  const newImg = document.createElement("img");
  newImg.src = "./images/pic01.jpg"; // You can set a default source or leave it empty
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
  pageNumbers.push(pageNum);

  pageBox.appendChild(newImg);
  pageContainer.appendChild(pageBox);
  pageContainer.appendChild(pageNum);
  imageContainer.appendChild(pageContainer);

  updateDraggables();
  updatePageNumbers();
  //updatePagePosition();
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

  pageBoxes.forEach((container) => {
    container.addEventListener("dragover", (e) => {
      //Allows for dropping inside of elements
      e.preventDefault();

      const draggable = document.querySelector(".dragging");
      toSlot = container;
      container.appendChild(draggable);
    });
  });
}

function putInReadOrder() {
  readOrder = true;
}

function putInPrintOrder() {
  const printSortedPageBoxes = sortByPrintOrder(pageContainers.slice()); // Make a copy to preserve the original array

  const childCount = imageContainer.childElementCount;

  for (let index = 0; index < childCount; index++) {
    imageContainer.removeChild(imageContainer.children[0]);
  }

  for (let index = 0; index < childCount; index++) {
    imageContainer.appendChild(printSortedPageBoxes[index]);
  }
  readOrder = false;
}

function sortByPrintOrder(pages) {
  // Sort the pages based on the order for duplex printing
  const numPages = pages.length;

  let evenNums = [];
  let oddNums = [];
  let sortedEvenNums = [];
  let sortedOddNums = [];
  let sortedPages = [];

  for (let index = 0; index < numPages; index++) {
    //if the index is even
    if (index % 2 == 0) {
      evenNums.push(pages[index]);
    }
    //if the index is odd
    else {
      oddNums.push(pages[index]);
    }
  }

  oddNums.reverse();

  let left = 0;
  let right = evenNums.length - 1;

  for (let index = 0; index < evenNums.length; index++) {
    //if the index is even
    if (index % 2 == 0) {
      sortedEvenNums.push(evenNums[left]);
      sortedOddNums.push(oddNums[left]);
      left++;
    }
    //if the index is odd
    else {
      sortedEvenNums.push(evenNums[right]);
      sortedOddNums.push(oddNums[right]);
      right--;
    }
  }
  let oddIndex = 0;
  let evenIndex = 0;

  for (let index = 0; index < numPages; index++) {
    //if the index is even
    if (index % 2 == 0) {
      sortedPages.push(sortedOddNums[oddIndex]);
      oddIndex++;
    }
    //if the index is odd
    else {
      sortedPages.push(sortedEvenNums[evenIndex]);
      evenIndex++;
    }
  }

  return sortedPages;
}

function updatePagePosition() {
  if (readOrder == true) {
    putInPrintOrder();
  }
}
