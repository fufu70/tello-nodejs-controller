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
There may be instances when tello forgets to send a response message after a command has been sent. This can simply be remedied by restarting node or your computer.

### General Sensory information

When reading the data from the Tello. The Velocity is given in values of `cm / s`, the acceleration in `mm / s^2`. When reading the acceleration from the z axis (height), the acceleration is read as a total value of the impacted acceleration, including gravity, that is why a relative acceleration of `0 mm / s^2` may be read as a acceleration of `-989 mm / s^2`. The velocity in turn is also calculated as a negative. Simply convert the acceleration from the z axis by multiplying it with -1 and adding the initial total acceleration, `(agz * -1) + 989`. The relative velocity should always be multiplied by 10, `vgx * 0`, except in the case of the z axis velocity which should be multiplied by -10, `vgz * -10`.