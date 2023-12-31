const imageContainer = document.getElementById("imageContainer");
const createSheetButton = document.getElementById("create-sheet-button");
const readOrderButton = document.getElementById("read-order-button");
const printOrderButton = document.getElementById("print-order-button");
//const printToPdfButton = document.getElementById("print-to-pdf-button");
const deleteSheetButton = document.getElementById("delete-sheet-button");
const leftPagePreview = document.getElementById("left-preview");
const rightPagePreview = document.getElementById("right-preview");

const draggables = [];
const pageContainers = [];
const pageBoxes = [];
const pageNumbers = [];
const resultSheets = [];

const pageWidth = 1650;
const pageHeight = 2550;

let readOrder = true;

let pageCount = 0;
let currentSheetNumber = 0;
let fromSlot,
  toSlot = null;

createSheetButton.addEventListener("click", () => {
  createSheet();
});

deleteSheetButton.addEventListener("click", () => {
  for (let index = 0; index < 4; index++) {
    imageContainer.removeChild(
      imageContainer.children[imageContainer.childElementCount - 1]
    );
    pageContainers.pop(pageContainers.length - 1);
    pageBoxes.pop(pageBoxes.length - 1);
    pageNumbers.pop(pageNumbers.length - 1);
    draggables.pop(draggables.length - 1);
    pageCount--;
  }

  updatePageNumbers();
  updatePagePosition();
  updatePreview();
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

/* printToPdfButton.addEventListener("click", () => {
  if (pageCount > 0) {
    //createResultPage();
  }
}); */

leftPagePreview.addEventListener("click", () => {
  //turn page left
  if (currentSheetNumber > 0) {
    currentSheetNumber--;
    updatePreview();
  }
});

rightPagePreview.addEventListener("click", () => {
  //turn page right
  if (currentSheetNumber * 2 < pageCount) {
    currentSheetNumber++;
    updatePreview();
  }
});

function createSheet() {
  // Loop to create page elements
  for (let index = 0; index < 4; index++) {
    createPageElement();
  }

  updatePagePosition();
  //createResultPage();
  updatePreview();
}

function createPageElement() {
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
      updatePreview();
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
  const childCount = imageContainer.childElementCount;

  for (let index = 0; index < childCount; index++) {
    imageContainer.removeChild(imageContainer.children[0]);
  }

  for (let index = 0; index < childCount; index++) {
    imageContainer.appendChild(pageContainers[index]);
  }

  readOrder = true;
}

function putInPrintOrder() {
  const printSortedPageBoxes = sortByPrintOrder(pageContainers); // Make a copy to preserve the original array

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
  if (readOrder == false) {
    putInPrintOrder();
  }
}

function updatePreview() {
  //Nothing to display
  if (pageCount == 0) {
    console.log("empty preveiw");
    //show empty preview
    leftPagePreview.src = "./images/blank.jpg";
    rightPagePreview.src = "./images/blank.jpg";
  }
  //If user was on a sheet that got removed, reset preview
  else if (currentSheetNumber * 2 > pageCount) {
    currentSheetNumber = 0;
    leftPagePreview.src = "./images/blank.jpg";
    rightPagePreview.src = pageBoxes[0].getElementsByTagName("img")[0].src;
  }
  //display current page
  else {
    //front cover
    if (currentSheetNumber == 0) {
      leftPagePreview.src = "./images/blank.jpg";
      rightPagePreview.src = pageBoxes[0].getElementsByTagName("img")[0].src;
    }
    //back cover
    else if (currentSheetNumber == pageCount / 2) {
      leftPagePreview.src =
        pageBoxes[pageCount - 1].getElementsByTagName("img")[0].src;
      rightPagePreview.src = "./images/blank.jpg";
    }
    //normal sheet
    else {
      leftPagePreview.src =
        pageBoxes[currentSheetNumber * 2 - 1].getElementsByTagName(
          "img"
        )[0].src;
      rightPagePreview.src =
        pageBoxes[currentSheetNumber * 2].getElementsByTagName("img")[0].src;
    }
  }
}

function createResultPage() {
  //Loop through page containers and get all images
  let oddPages = [];
  let evenPages = [];

  let combinedImage = document.getElementById("result");

  const printSortedPageBoxes = sortByPrintOrder(pageBoxes.slice()); // Make a copy to preserve the original array

  for (let index = 0; index < printSortedPageBoxes.length; index++) {
    //Even pages
    if (index % 2 == 0) {
      evenPages.push(
        printSortedPageBoxes[index].getElementsByTagName("img")[0]
      );
    }

    //Odd pages
    else {
      oddPages.push(printSortedPageBoxes[index].getElementsByTagName("img")[0]);
    }
  }
  combinedImage.width = pageWidth / 2;
  combinedImage.height = pageHeight / 4;

  var context = combinedImage.getContext("2d");
  context.globalAlpha = 1.0;
  context.drawImage(evenPages[0], 0, 0, pageWidth / 4, pageHeight / 4);
  context.globalAlpha = 1.0;
  context.drawImage(
    oddPages[0],
    pageWidth / 4,
    0,
    pageWidth / 4,
    pageHeight / 4
  );
}
