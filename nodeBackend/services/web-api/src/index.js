import app from "./app.js";
import { config } from "./config/index.js";
import { connectDB } from "./services/db.js";
import { connectKafka } from "./services/kafka.js";

connectDB();
connectKafka();

app.listen(config.PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${config.PORT}`);
});
