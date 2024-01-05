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
    const transactionController = new TransactionController();
    const assetController = new AssetController();
    this.controllers = {
      transactionController,
      assetController,
    };

    this.state = {
      transactionController: transactionController.state,
      assetController: assetController.state,
    };
  }
}
