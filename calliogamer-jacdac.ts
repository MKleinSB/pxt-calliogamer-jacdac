namespace modules {
    /**
     * CallioGamer gamepad
     */
    //% fixedInstance whenUsed block="CallioGamer"
    export const callioGamer = new GamepadClient("CallioGamer?dev=self&buttons_available=3135&variant=Gamepad")
}


namespace servers {
    const BUTTONS_AVAILABLE = 
          jacdac.GamepadButtons.Left // P1
        | jacdac.GamepadButtons.Right // P2
        | jacdac.GamepadButtons.Up // P0
        | jacdac.GamepadButtons.Down // P3
        | jacdac.GamepadButtons.A // P9
        | jacdac.GamepadButtons.B // P14
        | jacdac.GamepadButtons.X // P8
        | jacdac.GamepadButtons.Y // P13
    class GamepadServer extends jacdac.SensorServer {
        constructor() {
            super(jacdac.SRV_GAMEPAD, { variant: jacdac.GamepadVariant.Gamepad })

            const handler = () => {
                const state = this.serializeState()
                const buttons = state[0]
                this.sendEvent(jacdac.GamepadEvent.ButtonsChanged,
                    jacdac.jdpack(jacdac.GamepadEventPack.ButtonsChanged, [buttons]))
            }
        }

        serializeState() {
            let buttons: jacdac.GamepadButtons = 0
            let x = 0
            let y = 0
            pins.setPull(DigitalPin.P0, PinPullMode.PullUp)
            pins.setPull(DigitalPin.P1, PinPullMode.PullUp)
            pins.setPull(DigitalPin.P2, PinPullMode.PullUp)
            pins.setPull(DigitalPin.P3, PinPullMode.PullUp)
            pins.setPull(DigitalPin.P8, PinPullMode.PullUp)
            pins.setPull(DigitalPin.P9, PinPullMode.PullUp)
            pins.setPull(DigitalPin.P13, PinPullMode.PullUp)
            pins.setPull(DigitalPin.P14, PinPullMode.PullUp)
            if (pins.digitalReadPin(DigitalPin.P1) == 0) {
                buttons |= jacdac.GamepadButtons.Left
                x = -1
            }
            if (pins.digitalReadPin(DigitalPin.P2) == 0) {
                buttons |= jacdac.GamepadButtons.Right
                x = 1
            }
            if (pins.digitalReadPin(DigitalPin.P0) == 0) {
                buttons |= jacdac.GamepadButtons.Up
                y = 1
            }
            if (pins.digitalReadPin(DigitalPin.P3) == 0) {
                buttons |= jacdac.GamepadButtons.Down
                y = -1
            }
            if (pins.digitalReadPin(DigitalPin.P9) == 0) {
                buttons |= jacdac.GamepadButtons.A
            }
            if (pins.digitalReadPin(DigitalPin.P14) == 0) {
                buttons |= jacdac.GamepadButtons.B
            }
            if (pins.digitalReadPin(DigitalPin.P8) == 0) {
                buttons |= jacdac.GamepadButtons.X
            }
            if (pins.digitalReadPin(DigitalPin.P13) == 0) {
                buttons |= jacdac.GamepadButtons.Y
            }
            return jacdac.jdpack(jacdac.GamepadRegPack.Direction, [buttons, x, y])
        }

        handleCustomCommand(pkt: jacdac.JDPacket) {
            this.handleRegValue(
                pkt,
                jacdac.GamepadReg.ButtonsAvailable,
                jacdac.GamepadRegPack.ButtonsAvailable,
                BUTTONS_AVAILABLE
            )
        }
    }

    function start() {
        jacdac.productIdentifier = 0x3b23a27f
        jacdac.deviceDescription = "M.Klein's CallioGamer"
        jacdac.startSelfServers(() => {
            pins.pushButton(DigitalPin.P0);
            pins.pushButton(DigitalPin.P1);
            pins.pushButton(DigitalPin.P2);
            pins.pushButton(DigitalPin.P3);
            pins.pushButton(DigitalPin.P8);
            pins.pushButton(DigitalPin.P9);
            pins.pushButton(DigitalPin.P13);
            pins.pushButton(DigitalPin.P14);
            return [new GamepadServer()]
        })
    }
    start()
}