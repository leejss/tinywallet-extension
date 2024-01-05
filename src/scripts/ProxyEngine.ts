import { fromEventPattern } from "rxjs";
import { Engine, EngineControllerKey } from "../core/Engine";

type UnkownController = {
  [key: string]: any;
};

// ProxyEngine will
export class ProxyEngine {
  realEngine!: Engine;

  constructor(engine: Engine) {
    this.realEngine = engine;
  }

  private async callEngine(args: { controllerKey: EngineControllerKey; methodName: string; payload: any }) {
    const { methodName, payload, controllerKey } = args;
    // TODO: Some validaiton logic here.
    // if controller is not valid, throw error
    // if methodName is not valid, throw error

    const realController: UnkownController = this.realEngine.controllers[controllerKey];
    const result = await realController[methodName](payload);
    return result;
  }

  private setup(port: chrome.runtime.Port) {
    const portObservable = fromEventPattern(
      (handler) => port.onMessage.addListener(handler),
      (handler) => port.onMessage.removeListener(handler),
      (data) => data,
    );

    let data: any;
    let error: any;

    const subscription = portObservable.subscribe(async (message) => {
      const { controller, methodName, payload, id } = message;

      const result = await this.callEngine({
        controllerKey: controller,
        methodName,
        payload,
      });
      data = result;

      // TODO: Parse and format the result
      const response = {
        id,
        data,
        error,
      };
      port.postMessage(response);
    });
    return subscription;
  }

  // listen to the comming port messages
  listen(port: chrome.runtime.Port) {
    const subscription = this.setup(port);
    port.onDisconnect.addListener(() => {
      subscription.unsubscribe();
    });
  }
}
