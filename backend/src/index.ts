import app from "./app";
import { env } from "./config/env";

const startServer = async () => {
  const port = env.port;

  app.listen(port, () => {
    console.log(`StatusMarket API ready on port ${port}`);
  });
};

void startServer();

