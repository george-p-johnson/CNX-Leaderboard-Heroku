import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

console.log('✅ Starting server...');

const app = express();
const port = process.env.PORT || 3000;

try {
  // Support __dirname in ES modules
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  console.log('📁 __dirname is:', __dirname);

  // Serve static files
  app.use(express.static(path.join(__dirname, 'dist')));
  console.log('📦 Serving static files from dist');

  // Handle SPA routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });

  app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
  });
} catch (err) {
  console.error('❌ Error in server startup:', err);
}
