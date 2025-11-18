document.getElementById("menu-btn").addEventListener("click", function () {
  const menuActive = "menu-btn-active"
  this.classList.toggle("menu-btn-active");
  document.getElementById("menu-opt-container").classList.toggle("menu-opt-container-active");
})