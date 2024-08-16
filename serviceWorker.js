const zmq = require("zeromq");

const HOST_ENDPOINT = "tcp://127.0.0.1:";

const US_SRV_004 = {
  endPoint: HOST_ENDPOINT.concat(13011),
  port: 13011,
  request: {
    timeout: 5000,
    retry: 3,
    interval: 10,
  },
};
const APP_STATE = {
  APP_INIT: 0,
  APP_DOWN: 1,
  APP_UP: 2,
  APP_ERROR: 3,
};

class AppServiceWorker {
  constructor() {
    this.appState = {
      errorCode: "0x0000000000000000",
      state: 0,
    };
  }

  setWindow(win) {
    this.mainWindow = win;
  }

  updateAppState(appState) {
    this.appState = appState;
  }

  getErrorCode() {
    return this.appState.errorCode;
  }

  async processStartState() {
    const startSock = new zmq.Request({
      linger: 5,
      sendTimeout: 500,
      receiveTimeout: 7000,
    });

    startSock.connect("tcp://127.0.0.1:10002");

    const request = {
      head: {
        msgName: "AppStartupRequest",
        from: "ReportApp",
        to: "GuideApp",
        timestamp: new Date().getTime(),
      },
      data: {},
    };

    await startSock.send(JSON.stringify(request));
    const [result] = await startSock.receive();

    const recvData = JSON.parse(result.toString());

    // TODO
    // this.sendToProcess(key, recvData)
    startSock.close();
  }

  async processEndState() {
    const endStock = new zmq.Push();
    await endStock.bind("tcp://127.0.0.1:10003");

    const pushData = {
      head: {
        msgName: "AppTerminated",
        from: "ReportApp",
        to: "GuideApp",
        timestamp: new Date().getTime(),
      },
      data: {},
    };
    await endStock.send(JSON.stringify(pushData));

    endStock.close();
  }

  async processHealthCheck() {
    try {
      if (!this.healthCheckStock) {
        this.healthCheckStock = new zmq.Request({
          linger: 5,
          sendTimeout: 500,
          receiveTimeout: 7000,
        });
        this.healthCheckStock.connect("tcp://127.0.0.1:10004");
      }

      if (this.healthCheckStock.closed) {
        this.healthCheckStock.connect("tcp://127.0.0.1:10004");
      }

      const request = {
        head: {
          msgName: "HeartbeatReply",
          from: "ReportApp",
          to: "GuideApp",
          timestamp: new Date().getTime(),
        },
        data: {},
      };

      await this.healthCheckStock.send(JSON.stringify(request));
      const [result] = await this.healthCheckStock.receive();

      const recvData = JSON.parse(result.toString());
    } catch (error) {
      console.error(error);
      //   this.healthCheckStop();
      // TODO
      //   this.sendToProcess(key, recvData)
    }
  }

  healthCheckStart() {
    this.healthCheckIntervId = setInterval(async () => {
      await this.processHealthCheck();
    }, 1000);
  }

  healthCheckStop() {
    if (this.healthCheckIntervId) {
      clearInterval(this.healthCheckIntervId);
    }
    if (this.healthCheckStock && !this.healthCheckStock.closed) {
      //   this.healthCheckStock.disconnect("tcp://127.0.0.1:10004");
      this.healthCheckStock.close();
    }
  }

  async autoLogout() {
    const autoLogoutStock = new zmq.Push();
    await autoLogoutStock.bind("tcp://127.0.0.1:10005");

    const pushData = {
      head: {
        msgName: "AutoLogout",
        from: "ReportApp",
        to: "GuideApp",
        timestamp: new Date().getTime(),
      },
      data: {},
    };
    await autoLogoutStock.send(JSON.stringify(pushData));

    autoLogoutStock.close();
  }

  sendToProcess(ipcKey, data) {
    this.mainWindow.webContents.send(ipcKey, JSON.stringify(data));
  }
}
const serviceWorker = new AppServiceWorker();
serviceWorker.autoLogout();

// setTimeout(() => {
//   serviceWorker.healthCheckStop();
// }, 10000);
