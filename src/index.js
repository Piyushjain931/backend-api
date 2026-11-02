require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

const port = Number(process.env.PORT) || 8000;

async function start() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be set to a random value of at least 32 characters.');
  }
  await connectDB(process.env.MONGODB_URI);
  app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
}

start().catch((error) => {
  console.error(`Startup failed: ${error.message}`);
  process.exit(1);
});
