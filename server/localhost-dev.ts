import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { initializeDatabase } from "./db";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    // Initialize database (may fail gracefully if no DB connection)
    log("Initializing database...");
    try {
      await initializeDatabase();
      log("Database initialized successfully");
    } catch (dbError) {
      log("Database initialization failed, continuing with in-memory storage");
      // Continue execution, don't exit
    }
    
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      console.error(err);
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // MODIFIED FOR LOCAL DEVELOPMENT:
    // Use localhost instead of 0.0.0.0
    // Try different ports if 5000 fails
    const tryPorts = [3000, 8000, 8080];
    let success = false;
    
    for (const port of tryPorts) {
      try {
        server.listen(port, 'localhost', () => {
          log(`Local server running at http://localhost:${port}`);
          success = true;
        });
        break; // Exit loop on success
      } catch (e) {
        log(`Failed to start server on port ${port}, trying next port...`);
        // Continue to next port
      }
    }
    
    if (!success) {
      log("Could not start server on any of the attempted ports.");
      process.exit(1);
    }
  } catch (error) {
    log(`Error starting server: ${error}`);
    process.exit(1);
  }
})();