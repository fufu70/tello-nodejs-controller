# Tello-NodeJS-Controller

Controls a tello quadrotor through a UDP connection. Uses the generic [Tello Architecture](https://dl-cdn.ryzerobotics.com/downloads/tello/20180910/Tello%20SDK%20Documentation%20EN_1.3.pdf) to send commands and receive command outputs.

To start, run the installation process for npm, start the controller using node, and start the listener in a seperate terminal.

```bash
$ npm install
$ node controller.js
> : ...

# In seperate Terminal
$ node listener.js
```

### Note

The controller will accept any commands for reading or commanding the Tello craft but the first command sent to the craft should always be `command`, afterwards Tello is ready to takeoff and fly.
Make sure that your computer is connected to the Tello wifi. 😉