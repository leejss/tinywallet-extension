import { type ProxyEngine } from "./ProxyEngine";

// handle connection to the port
export class ApiBridge {
  portName!: string;
  proxyEngine!: ProxyEngine;
  constructor(args: { portName: string; proxyEngine: any }) {
    const { portName, proxyEngine } = args;
    this.portName = portName;
    this.proxyEngine = proxyEngine;
  }

  ready() {
    chrome.runtime.onConnect.addListener((port) => {
      if (port.name !== this.portName) {
        console.warn(`ApiBridge: port name ${port.name} does not match ${this.portName}`);
        return;
      }

      console.log("ApiBridge: port connected");
      this.proxyEngine.listen(port);
    });
  }
}
