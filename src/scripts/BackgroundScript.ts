import { Engine } from "../core/Engine";
import { ApiBridge } from "./ApiBridge";
import { ProxyEngine } from "./ProxyEngine";
import { PORT_PROXY_ENGINE } from "./constants";

const engine = new Engine();

(() => {
  // Create ProxyEngine
  const proxyEngine = new ProxyEngine(engine);
  // Create ApiBridge
  const apiBridge = new ApiBridge({
    portName: PORT_PROXY_ENGINE,
    proxyEngine: proxyEngine,
  });
  apiBridge.ready();
})();
