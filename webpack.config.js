import path from "path";

export default {
  mode: "development",
  entry: { app: "./src/js/app.js", hamburMenu: "./src/js/hamburMenu.js" },
  output: {
    filename: "[name].js",
    path: path.resolve("public/js"),
  },
};
