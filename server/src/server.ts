import app from './app';
import { connectDB, disconnectDB } from './config/db';
import { env } from './config/env';
import { isCloudinaryConfigured } from './config/cloudinary';

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    const server = app.listen(env.PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 CareerLens AI API Server running on port ${env.PORT}`);
      console.log(`📡 Environment: ${env.NODE_ENV}`);
      console.log(`🔗 API Base: http://localhost:${env.PORT}/api`);
      console.log(`🌐 Allowed Client URL: ${env.CLIENT_URL}`);
      console.log(`🤖 Gemini AI Mode: ${env.GEMINI_API_KEY ? 'Active (API Key Configured)' : 'Deterministic Fallback Active'}`);
      console.log(`☁️ Cloudinary Storage: ${isCloudinaryConfigured() ? `Connected (${env.CLOUDINARY_CLOUD_NAME})` : 'Disabled (Local disk only)'}`);
      console.log(`====================================================`);
    });

    const shutdown = async (signal: string) => {
      console.log(`\n[Server] Received ${signal}. Gracefully shutting down...`);
      server.close(async () => {
        await disconnectDB();
        console.log('[Server] Process terminated cleanly.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err: any) {
    console.error('Fatal server startup failure:', err.message);
    process.exit(1);
  }
};

startServer();
