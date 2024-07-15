(function () {
  const button = document.querySelector("#check");
  const menuNav = document.querySelector(".menu-nav");

  if (!button || !menuNav) return;

  button.addEventListener("click", () => {
    const items = Array.from(menuNav.querySelectorAll("a"));
    menuNav.classList.toggle("hidden");

    if (!menuNav.classList.contains("hidden")) {
      items.forEach((item) => {
        item.classList.add("translate-y-0");
        item.classList.add("opacity-100");

        setTimeout(() => {
          item.classList.remove("opacity-0");

          setTimeout(() => {
            item.classList.remove("-translate-y-20");
            setTimeout(() => {
              item.classList.remove("pointer-events-none");
            }, 200);
          }, 100);
        }, 100);
      });
    } else {
      items.forEach((item) => {
        item.classList.add("-translate-y-20");
        item.classList.add("opacity-0");
        setTimeout(() => {
          item.classList.remove("opacity-100");
          setTimeout(() => {
            item.classList.remove("translate-y-0");
            setTimeout(() => {
              item.classList.add("pointer-events-none");
            }, 100);
          }, 100);
        }, 100);
      });
    }
  })
})();
