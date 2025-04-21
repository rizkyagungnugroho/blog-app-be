import { NextFunction, Response, Request } from "express";
import { SampleService } from "./sample.service";
import { injectable } from "tsyringe";

@injectable()
export class SampleController {
  private sampleService: SampleService;

  constructor(SampleService: SampleService) {
    this.sampleService = SampleService;
  }

  getSamples = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.sampleService.getSamples();
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };

  getSample = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.sampleService.getsample(Number(req.params.id));
      res.status(200).send({
        message: "ini adalah data sample",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  createSample = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.sampleService.createSample(req.body);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };

  updateSample = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.sampleService.updateSample(
        Number(req.params.id),
        req.body
      );
      res.status(200).send({
        message: "anda berhasil mengupdate sample",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteSample = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.sampleService.deleteSample(
        Number(req.params.id)
      );
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };
}