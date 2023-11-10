const createButton = document.getElementById("createSheet");
const targetElement = document.getElementById("target");
let divCount = 0;

createButton.addEventListener("click", function () {
  // Create a new HTML element
  const newDiv = document.createElement("div");
  const newDivid = "page-" + divCount;
  newDiv.className = "pages-item";
  newDiv.id = newDivid;

  const imageDiv = document.createElement("div");

  const imgElement = document.createElement("img");
  imgElement.id = "image-preview-" + divCount;
  imgElement.src = "./assets/images/newpage.png";
  imgElement.width = "165";
  imgElement.height = "255";
  imageDiv.appendChild(imgElement);

  newDiv.appendChild(imageDiv);

  /* 
  const fileUploadDiv = document.createElement("div");

  const labelElement = document.createElement("label");
  labelElement.htmlFor = "file-upload";
  labelElement.className = "custom-file-upload";

  const iconElement = document.createElement("i");
  iconElement.className = "fa fa-cloud-upload";

  labelElement.appendChild(iconElement);
  labelElement.appendChild(document.createTextNode("Choose Image"));
  fileUploadDiv.appendChild(labelElement);

  const inputElement = document.createElement("input");
  inputElement.id = "file-upload";
  inputElement.type = "file";
  fileUploadDiv.appendChild(inputElement); 

  newDiv.appendChild(fileUploadDiv);
  */

  const uploadElement = document.createElement("div");
  const inputElement = document.createElement("input");
  inputElement.type = "file";
  inputElement.id = "file-upload-" + divCount;
  inputElement.style = "display: none";
  inputElement.accept = "image/*";
  uploadElement.appendChild(inputElement);

  const buttonElement = document.createElement("button");
  buttonElement.id = "uploadButton";
  buttonElement.innerHTML = "Upload Image";

  /* const fileInput = document.getElementById("file-upload-" + divCount);
  const image = document.getElementById("image-preview-" + divCount);

  buttonElement.addEventListener("click", function () {
    fileInput.click();
  });

  fileInput.addEventListener("change", function () {
    const file = fileInput.files[0];

    if (file) {
      image.style.display = "block";
      image.src = URL.createObjectURL(file);
    }
  }); */

  uploadElement.appendChild(buttonElement);
  newDiv.appendChild(uploadElement);

  targetElement.appendChild(newDiv);

  divCount++;
});
