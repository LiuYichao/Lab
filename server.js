const zmq = require("zeromq")
// import zmq from "zeromq"

async function run() {
  const sock = new zmq.Reply()

  await sock.bind("tcp://127.0.0.1:10002")

  for await (const [msg] of sock) {
    console.log(msg.toString())

    const receiveData = {
      arm_device: {
        status: 'NORM',
      },
      biopsy_device: {
        status: 'NORM',
      },
    }
    await sock.send(JSON.stringify(receiveData))
  }
}

run()
