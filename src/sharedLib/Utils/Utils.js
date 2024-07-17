function isSubset(sub, set) {
  return Boolean(sub.map((x) => set.includes(x)).reduce((p, c) => p * c));
}

function nestedCopy(array) {
  return JSON.parse(JSON.stringify(array));
}
function isTablet() {
  // Check for touch support
  var isTouchDevice =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0;

  // Check screen size
  var screenWidth = window.screen.width;
  var screenHeight = window.screen.height;

  // Check user agent for common tablet identifiers
  var userAgent = navigator.userAgent.toLowerCase();
  var isTabletUA = /tablet|ipad|playbook|silk|android(?!.*mobi)/.test(
    userAgent
  );

  // Heuristic to determine if it's a tablet
  if (
    isTouchDevice &&
    screenWidth >= 600 &&
    screenWidth <= 1280 &&
    screenHeight >= 800 &&
    screenHeight <= 1920 &&
    isTabletUA
  ) {
    return true;
  }

  return false;
}

function isLaptop() {
  // Check screen size
  var screenWidth = window.screen.width;
  var screenHeight = window.screen.height;

  // Check user agent for common laptop/desktop identifiers
  var userAgent = navigator.userAgent.toLowerCase();
  var isLaptopUA = /windows|macintosh|linux|cros/.test(userAgent);

  // Heuristic to determine if it's a laptop
  if (!isTablet() && screenWidth >= 1024 && screenHeight >= 768 && isLaptopUA) {
    return true;
  }

  return false;
}

// if (isTablet()) {
//     console.log("This device is likely a tablet.");
// } else if (isLaptop()) {
//     console.log("This device is likely a laptop.");
// } else {
//     console.log("This device type is not determined.");
// }

export { nestedCopy, isSubset, isTablet };
