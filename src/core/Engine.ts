import { AssetController } from "./AssetController";
import { TransactionController } from "./TransactionContoller";

export type EngineControllers = {
  transactionController: TransactionController;
  assetController: AssetController;
};

export type EngineControllerKey = keyof EngineControllers;

export class Engine {
  state: any = {};
  controllers!: EngineControllers;

  constructor() {
    this.controllers = {
      transactionController: new TransactionController(),
      assetController: new AssetController(),
    };
  }
}
