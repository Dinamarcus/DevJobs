/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/hamburMenu.js":
/*!******************************!*\
  !*** ./src/js/hamburMenu.js ***!
  \******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function () {\r\n  const button = document.querySelector(\"#check\");\r\n  const menuNav = document.querySelector(\".menu-nav\");\r\n\r\n  if (!button || !menuNav) return;\r\n\r\n  button.addEventListener(\"click\", () => {\r\n    const items = Array.from(menuNav.querySelectorAll(\"a\"));\r\n    menuNav.classList.toggle(\"hidden\");\r\n\r\n    if (!menuNav.classList.contains(\"hidden\")) {\r\n      items.forEach((item) => {\r\n        item.classList.add(\"translate-y-0\");\r\n        item.classList.add(\"opacity-100\");\r\n\r\n        setTimeout(() => {\r\n          item.classList.remove(\"opacity-0\");\r\n\r\n          setTimeout(() => {\r\n            item.classList.remove(\"-translate-y-20\");\r\n            setTimeout(() => {\r\n              item.classList.remove(\"pointer-events-none\");\r\n            }, 200);\r\n          }, 100);\r\n        }, 100);\r\n      });\r\n    } else {\r\n      items.forEach((item) => {\r\n        item.classList.add(\"-translate-y-20\");\r\n        item.classList.add(\"opacity-0\");\r\n        setTimeout(() => {\r\n          item.classList.remove(\"opacity-100\");\r\n          setTimeout(() => {\r\n            item.classList.remove(\"translate-y-0\");\r\n            setTimeout(() => {\r\n              item.classList.add(\"pointer-events-none\");\r\n            }, 100);\r\n          }, 100);\r\n        }, 100);\r\n      });\r\n    }\r\n  })\r\n})();\r\n\n\n//# sourceURL=webpack://devjobs/./src/js/hamburMenu.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/hamburMenu.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;