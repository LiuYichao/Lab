const zmq = require("zeromq");
const { execSync } = require("child_process");

const HOST_ENDPOINT = "tcp://127.0.0.1:";
const APP_SERVICE_STATE = {
  APP_SERVICE_INIT: 0,
  APP_SERVICE_DOWN: 1,
  APP_SERVICE_SYS_UP: 2,
  APP_SERVICE_SYS01_DOWN: 3,
  APP_SERVICE_SYS02_DOWN: 4,
  APP_SERVICE_SYS_DOWN: 5,
};

const APP_STATE = {
  APP_INIT: 0,
  APP_DOWN: 1,
  APP_UP: 2,
  APP_ERROR: 3,
};

const US_SRV_004 = {
  endPoint: HOST_ENDPOINT.concat(10002),
  port: 10002,
  request: {
    timeout: 5000,
    retry: 3,
    interval: 10,
  },
};

function sleep(seconds) {
//   execSync(`sleep "${seconds}"`);
  return new Promise((resolve) => {
    setTimeout(resolve, seconds);
  });
}

class UsHealthCheckWorkder {
  constructor() {
    this.appState = {
      errorCode: "0x0000000000000000",
      state: APP_STATE.APP_INIT,
    };
  }

  updateAppState(appState) {
    this.appState = appState;
  }

  getErrorCode() {
    return this.appState.errorCode;
  }

  connect() {
    this.sock = new zmq.Request({
      linger: 5,
      sendTimeout: 500,
      receiveTimeout: 7000,
    });
    this.sock.connect(US_SRV_004.endPoint);
  }

  async send(seqNumber) {
    let send_data = {
      app_version: "v0.1",
      req_time: new Date().getTime(),
    };

    send_data.seq_number = seqNumber;
    send_data.errcode = this.getErrorCode();

    let json_data = JSON.stringify(send_data);
    await this.sock.send(json_data);
  }

  async receive() {
    const [result] = await this.sock.receive();
    const recvData = JSON.parse(result.toString());
    return recvData;
  }

  postMessage(appServiceState, recvData) {
    if (appServiceState != recvData.status) {
      appServiceState = recvData.status;
      parentPort.postMessage(JSON.stringify(recvData));
      console.log(JSON.stringify(recvData));
    }
  }

  async receiveDataProcess(recvData, seqNumber) {
    if (recvData.seq_number === seqNumber) {
      console.log("[US_SRV_004]Server replied OK=>" + recvData);
      const heart_check_data = {
        status: APP_SERVICE_STATE.APP_SERVICE_INIT,
        armDeviceData: {},
        biopsyDeviceData: {},
      };

      const statusCodes = [
        recvData.arm_device.status,
        recvData.biopsy_device.status,
      ];

      if (statusCodes.every((currentVal) => currentVal === "NORM")) {
        heart_check_data.status = APP_SERVICE_STATE.APP_SERVICE_SYS_UP;
      }

      if (statusCodes.every((currentVal) => currentVal === "ERROR")) {
        heart_check_data.status = APP_SERVICE_STATE.APP_SERVICE_SYS_DOWN;
      } else {
        if (recvData.arm_device.status === "ERROR") {
          heart_check_data.status = APP_SERVICE_STATE.APP_SERVICE_SYS02_DOWN;
        } else {
          heart_check_data.armDeviceData = recvData.arm_device;
        }

        if (recvData.biopsy_device.status === "ERROR") {
          heart_check_data.status = APP_SERVICE_STATE.APP_SERVICE_SYS01_DOWN;
        } else {
          heart_check_data.biopsyDeviceData = recvData.biopsy_device;
        }
      }
      return heart_check_data;
    }
    return null;
  }

  async test() {
    this.connect();
    let seqNumber = 0;
    await this.send(seqNumber);
    const recvData = await this.receive();
    const processRecData = this.receiveDataProcess(recvData, seqNumber);
  }

  async runServiceHealthCheck() {
    this.connect();

    while (true) {
      try {
        let appServiceState = APP_SERVICE_STATE.APP_SERVICE_INIT;

        console.log(
          `[US_SRV_004]Producer bound to port ${US_SRV_004.endPoint}`
        );

        let seqNumber = 0;
        let retry_count = 10;

        while (true) {
          await this.send(seqNumber);

          if (seqNumber === 10000) {
            seqNumber = 0;
          }

          while (true) {
            try {
              const recvData = await this.receive();
              const processRecData = this.receiveDataProcess(
                recvData,
                seqNumber
              );
              //   this.postMessage(appServiceState, processRecData)

              await sleep(1000);
              seqNumber = seqNumber + 1;
              retry_count = 10;
              console.log("[US_SRV_002]Go next seq=>" + seqNumber);
              break;
            } catch (error) {
              console.log("[US_SRV_002] error=>", error);
              retry_count = retry_count - 1;
              if (retry_count === 0) {
                retry_count = 10;
                let heart_check_data = {
                  status: APP_SERVICE_STATE.APP_SERVICE_DOWN,
                  armDeviceData: {},
                  biopsyDeviceData: {},
                };
                this.postMessage(appServiceState, heart_check_data);

                console.log(
                  "[US_SRV_002]notify to render thread, service is not working"
                );
              }
              console.log("[US_SRV_002]No response from server");
              this.sock.close();

              console.log("[US_SRV_002]Reconnecting to server…");
              this.connect();
              try {
                await this.send(seqNumber);
              } catch (error) {}
            } finally {
            }
          }
        }
      } catch (error) {
        console.log("[US_SRV_002]Can not connect to server=>" + error);
      }
    }
  }
}
const healthCheckWorker = new UsHealthCheckWorkder();
healthCheckWorker.runServiceHealthCheck();
