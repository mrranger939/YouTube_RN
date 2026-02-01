import app from "./app.js";
import { config } from "./config/index.js";
import { connectDB } from "./services/db.js";

connectDB();

app.listen(config.PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${config.PORT}`);
});
