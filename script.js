/** @type {typeof import("./static.json")} */
const data = await fetch("/static.json").then((x) => x.json())

let version = data.version

document.getElementById("static").innerHTML =
  'Version ' + version /**'·' */