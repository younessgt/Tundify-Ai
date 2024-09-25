const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");

const PORT = process.env.PORT || 8000;

console.log(process.env.NODE_ENV);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
