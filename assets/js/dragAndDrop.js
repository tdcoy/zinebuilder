const draggables = document.querySelectorAll(".draggable");
const containers = document.querySelectorAll(".page-box");

draggables.forEach((draggable) => {
  draggable.addEventListener("dragstart", () => {
    console.log("drag start");
  });
});
