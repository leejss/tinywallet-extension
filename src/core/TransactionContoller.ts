export class TransactionController {
  state = {
    latestTxHash: "",
  };
  constructor() {}

  startTransaction() {
    console.log("TransactionController.startTransaction");
  }
}
