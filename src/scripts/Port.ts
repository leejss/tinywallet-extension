export default class Port {
  private chromePort!: chrome.runtime.Port;
  private connected!: boolean;
  private name!: string;
  private callback!: (port: chrome.runtime.Port) => void | Promise<void>;

  constructor(
    connectInfo: chrome.runtime.ConnectInfo,
    opts?: {
      onConnect: (port: chrome.runtime.Port) => void;
    },
  ) {
    if (!connectInfo.name) {
      throw new Error("Port name is required");
    }

    this.name = connectInfo.name;
    this.callback = opts?.onConnect ?? (() => {});

    // createPort means that starting a new connection
    this.chromePort = this.createPort();
  }

  private createPort(): chrome.runtime.Port {
    const newPort = chrome.runtime.connect({
      name: this.name,
    });
    this.connected = true;
    newPort.onDisconnect.addListener(() => {
      this.connected = false;
    });
    this.callback(newPort);
    return newPort;
  }

  postMessage<T>(msg: T) {
    if (!this.connected) {
      this.chromePort = this.createPort();
    }
    this.chromePort.postMessage(msg);
  }
}
