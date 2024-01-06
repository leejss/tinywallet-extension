import { Observable, filter, fromEventPattern, lastValueFrom, take } from "rxjs";
import Port from "./Port";
import { v4 as uuid } from "uuid";
import { PORT_PROXY_ENGINE } from "./constants";
export type BackgroundResponse<T = never> = {
  id: string;
  error: null | { code: number; msg: string };
  data: null | T;
};

export default class BackgroundApi {
  private port!: Port;
  private portObservable!: Observable<BackgroundResponse>;

  constructor() {
    this.connect();
  }

  private connect() {
    console.log("BackgroundApi:connect");
    this.port = new Port(
      { name: PORT_PROXY_ENGINE },
      {
        onConnect: (port) => {
          this.initPortObservable(port);
        },
      },
    );
  }

  private initPortObservable(port: chrome.runtime.Port) {
    this.portObservable = fromEventPattern(
      (handler) => port.onMessage.addListener(handler),
      (handler) => port.onMessage.removeListener(handler),
      (data) => data,
    );
  }

  async call<Req, Res>(funcName: string, payload: Req): Promise<Res> {
    const params = {
      id: uuid(),
      funcName,
      payload,
    };

    this.port.postMessage(params);

    const result = await lastValueFrom(
      this.portObservable.pipe(
        filter((data) => data.id === params.id),
        take(1),
      ),
    );

    if (result.error) {
      throw new Error(result.error.msg);
    }

    return result.data as Res;
  }
}
