import cors from "cors";
import express, { Express, json } from "express";
import "reflect-metadata";
import { container } from "tsyringe";
import { PORT } from "./config";
import { errorMiddleware } from "./middlewares/error.middleware";
import { SampleRouter } from "./modules/sample/sample.router";
import { AuthRouter } from "./modules/auth/auth.router";
import { BlogRouter } from "./modules/blog/blog.router";
export default class App {
  public app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  private configure() {
    this.app.use(cors());
    this.app.use(json());
  }

  private routes() {
    const sampleRouter = container.resolve(SampleRouter);
    const authRouter = container.resolve(AuthRouter); // ✅ tidak konflik lagi
    const blogRouter = container.resolve(BlogRouter); // ✅ tidak konflik lagi
  
    this.app.use("/samples", sampleRouter.getRouter());
    this.app.use("/auth", authRouter.getRouter());
    this.app.use("/blogs", blogRouter.getRouter());
  }
  

  private handleError() {
    this.app.use(errorMiddleware);
  }

  public start() {
    this.app.listen(PORT, () => {
      console.log(`🚀 Server running on PORT: ${PORT}`);
    });
  }
}
