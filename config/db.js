import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const db = mongoose.connect(process.env.DATABASE);

db.then(() => {
  console.log("DB Connected\n");
}).catch((e) => {
  console.log(e);
});

export default db;
