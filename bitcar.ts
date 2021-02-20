/*****************************************************************************
* | Description :	BitCar extension for micro:bit
* | Developer   :   CH Makered
* | More Info   :	http://chmakered.com/
******************************************************************************/
enum GrovePin {
    //% block="P0"
    P0 = DigitalPin.P0,
    //% block="P1"
    P1 = DigitalPin.P1,
    //% block="P2"
    P2 = DigitalPin.P2,
    //% block="P8"
    P8 = DigitalPin.P8,
    //% block="P12"
    P12 = DigitalPin.P12,
    //% block="P16"
    P16 = DigitalPin.P16
}

enum Joystick {
    //% block=" UpLeft"
    UpLeft,
    //% block=" ↑ Up"
    Up,
    //% block=" UpRight"
    UpRight,
    //% block=" ← Left"
    Left,
    //% block=" Middle"
    Middle,
    //% block=" → Right"
    Right,
    //% block=" LowerLeft"
    LowerLeft,
    //% block=" ↓ Down"
    Down,
    //% block=" LowerRight"
    LowerRight
}

enum BitPlayerKey {
    //% block="A"
    key_A = DAL.MICROBIT_ID_IO_P5,
    //% block="B"
    key_B = DAL.MICROBIT_ID_IO_P11,
    //% block="C"
    key_C = DAL.MICROBIT_ID_IO_P13,
    //% block="D"
    key_D = DAL.MICROBIT_ID_IO_P14,
    //% block="L"
    key_L = DAL.MICROBIT_ID_IO_P15,
    //% block="R"
    key_R = DAL.MICROBIT_ID_IO_P16,
}

enum GroveAnalogPin {
    //% block="P0"
    P0 = AnalogPin.P0,
    //% block="P1"
    P1 = AnalogPin.P1,
    //% block="P2"
    P2 = AnalogPin.P2
}

enum DistanceUnit {
    //% block="cm"
    cm,
    //% block="inch"
    inch
}

enum BitPlayerKeyEvent {
    //% block="click"
    click = DAL.MICROBIT_BUTTON_EVT_CLICK,
    //% block="pressed"
    pressed = DAL.MICROBIT_BUTTON_EVT_DOWN,
    //% block="released"
    released = DAL.MICROBIT_BUTTON_EVT_UP,
}

enum trick {
    //% block="arise"
    getUp,
    //% block=" +left"
    L_forward = AnalogPin.P14,
    //% block=" -right"
    R_backward = AnalogPin.P15,
    //% block=" +right"
    R_forward = AnalogPin.P16,
}

enum IRLineSensor {
    //% block="left sensor"
    left,
    //% block=" right sensor"
    right
}

/**
 * Provides access to BitCar blocks for micro: bit functionality.
 */
//% color=190 icon="\uf126" block= "BitCar"
//% groups="['BitCar','BitPlayer']"
namespace BitCar {

    let L_backward = AnalogPin.P13;
    let L_forward = AnalogPin.P14;
    let R_forward = AnalogPin.P15; 
    let R_backward = AnalogPin.P16;

    /**
    * Set the motors' speed of BitCar
    */
    //% blockId=move
    //% block="BitCar: left motor $left \\%, right motor$right \\%"
    //% left.shadow="speedPicker"
    //% right.shadow="speedPicker"
    //% group="BitCar"
    //% weight=1000
    export function move(left: number, right: number) {
        if (left >= 0) {
            pins.analogWritePin(L_backward, 0);
            pins.analogWritePin(L_forward, Math.map(left, 0, 100, 0, 1023));
        } else if (left < 0) {
            pins.analogWritePin(L_backward, Math.map(Math.abs(left), 0, 100, 0, 1023));
            pins.analogWritePin(L_forward, 0);
        }
        if (right >= 0) {
            pins.analogWritePin(R_backward, 0);
            pins.analogWritePin(R_forward, Math.map(right, 0, 100, 0, 1023));
        } else if (right < 0) {
            pins.analogWritePin(R_backward, Math.map(Math.abs(right), 0, 100, 0, 1023));
            pins.analogWritePin(R_forward, 0);
        }
    }

    /**
    * BitCar stop
    */
    //% blockId=stop
    //% block="BitCar: stop"
    //% group="BitCar"
    //% weight=900
    //% blockGap=40
    export function stop() {
        pins.analogWritePin(L_backward, 0);
        pins.analogWritePin(L_forward, 0);
        pins.analogWritePin(R_backward, 0);
        pins.analogWritePin(R_forward, 0);
    }

    /**
    * When BitCar is still, make it stand up from the ground and then stop, try to tweak the motor speed and the charge time if it failed to do so
    */
    //% blockId=standup_still
    //% block="BitCar: stand up with speed $speed \\% charge$charge|(ms)"
    //% speed.defl=100
    //% speed.min=0 speed.max=100
    //% charge.defl=250
    //% group="BitCar"
    //% weight=800
    //% blockGap=40
    export function standup_still(speed: number, charge: number) {
        move(-speed, -speed);
        basic.pause(200);
        move(speed, speed);
        basic.pause(charge);
        stop();
    }


    /**
    * Check the state of the IR line sensor, the LED indicator is ON if the line is detected by the corresponding sensor
    */
    //% blockId=linesensor
    //% block="BitCar: line under $sensor|"
    //% group="BitCar"
    //% weight=700 
    export function linesensor(sensor: IRLineSensor): boolean {
        let result = false;

        if (sensor == IRLineSensor.left) {
            if (pins.analogReadPin(AnalogPin.P1) < 500) {
                result = true;
            }
            else
                result = false;
        } else if (sensor == IRLineSensor.right) {
            if (pins.analogReadPin(AnalogPin.P2) < 500) { 
                result = true;
            }
            else
                result = false;
        }

        return result;
    }

    /**
    * Line following at a specified speed.
    */
    //% blockId=linefollow
    //% block="BitCar: follow line at speed $speed \\%"
    //% speed.defl=50
    //% speed.min=0 speed.max=100
    //% group="BitCar"
    //% weight=600
    export function linefollow(speed: number) {
        if (linesensor(IRLineSensor.left) && linesensor(IRLineSensor.right)) {
            move(speed, speed);
        } else {
            if (!(linesensor(IRLineSensor.left)) && linesensor(IRLineSensor.right)) {
                move(speed, 0);
                if (!(linesensor(IRLineSensor.left)) && !(linesensor(IRLineSensor.right))) {
                    move(speed, 0);
                }
            } else {
                if (!(linesensor(IRLineSensor.right)) && linesensor(IRLineSensor.left)) {
                    move(0, speed);
                    if (!(linesensor(IRLineSensor.left)) && !(linesensor(IRLineSensor.right))) {
                        move(0, speed);
                    }
                }
            }
        }
    }

    /**
    * Get the distance from Grove-Ultrasonic Sensor, the measuring range is between 2-350cm
    */
    //% blockId=grove_ultrasonic
    //% block="BitCar: |Ultrasonic Sensor $groveport|: distance in $Unit"
    //% group="BitCar"
    //% weight=500
    export function grove_ultrasonic(groveport: GrovePin, Unit: DistanceUnit): number {
        let duration = 0;
        let distance = 0;
        let port: number = groveport;

        pins.digitalWritePin(<DigitalPin>port, 0);
        control.waitMicros(2);
        pins.digitalWritePin(<DigitalPin>port, 1);
        control.waitMicros(10);
        pins.digitalWritePin(<DigitalPin>port, 0);

        duration = pins.pulseIn(<DigitalPin>port, PulseValue.High, 50000);

        if (Unit == DistanceUnit.cm) distance = duration * 153 / 58 / 100;
        else distance = duration * 153 / 148 / 100;
        basic.pause(50);
        if (distance > 0) return Math.floor(distance * 10) / 10;
        else return 350;
    }
    /**
    * (For mircro:bit V2 ONLY)Get the distance from Grove-Ultrasonic Sensor, the measuring range is between 2-350cm
    */
    //% blockId=grove_ultrasonic_v2
    //% block="BitCar: |(V2)Ultrasonic Sensor $groveport|: distance in $Unit"
    //% group="BitCar"
    //% weight=400
    export function grove_ultrasonic_v2(groveport: GrovePin, Unit: DistanceUnit): number {
        let duration = 0;
        let distance = 0;
        let port: number = groveport;

        pins.digitalWritePin(<DigitalPin>port, 0);
        control.waitMicros(2);
        pins.digitalWritePin(<DigitalPin>port, 1);
        control.waitMicros(10);
        pins.digitalWritePin(<DigitalPin>port, 0);

        duration = pins.pulseIn(<DigitalPin>port, PulseValue.High, 50000);

        if (Unit == DistanceUnit.cm) distance = duration * 153 / 88 / 100;
        else distance = duration * 153 / 226 / 100;
        basic.pause(50);
        if (distance > 0) return Math.floor(distance * 10) / 10;
        else return 350;
    }


    
 



    
}







/**
 * Provides access to BitPlayer blocks for micro: bit functionality.
 */
//% color=190 icon="\uf126" block= "BitPlayer"
//% groups="['BitPlayer']"
namespace BitPlayer {
let posi_init = 0;

    function InitialPosition(): void {
        posi_init = 1;
        return;
    }

	/**
	 * 
	 */
    //% shim=bitplayer::init
    function init(): void {
        return;
    }

    /**
     * Do something when a key is pressed, released or clicked
     */
    //% blockId=OnKey
    //% block="on key $key| is $keyEvent"
    //% group="BitPlayer"
    //% weight=20 
    export function OnKey(key: BitPlayerKey, keyEvent: BitPlayerKeyEvent, handler: Action) {
        if (!posi_init) {
            InitialPosition();
        }

        init();
        control.onEvent(<number>key, <number>keyEvent, handler); // register handler
    }


    /**
    * Get the key state (pressed or not)
    * @param key the pin that acts as a button
    */
    //% blockId=KeyPressed
    //% block="BitPlayer: |key $key| is pressed"
    //% group="BitPlayer"
    //% weight=30 
    export function KeyPressed(key: BitPlayerKey): boolean {
        if (!posi_init) {
            InitialPosition();
        }

        const pin = <DigitalPin><number>key;
        pins.setPull(pin, PinPullMode.PullUp);
        return pins.digitalReadPin(<DigitalPin><number>key) == 0;
    }



    /**
    * turn on or off the vibration motor
    */
    //% blockId=SetMotor
    //% block="BitPlayer: |vibration $on|"
    //% on.shadow="toggleOnOff"
    //% on.defl="true"
    //% group="BitPlayer"
    //% weight=10
    export function SetMotor(on: boolean) {
        if (on) {
            pins.digitalWritePin(DigitalPin.P8, 1);
        }else{
            pins.digitalWritePin(DigitalPin.P8, 0);
        }
    }


    const x0 = 500;
    const y0 = 500;
    const d0 = 250;

    /**
    * Check if the joystick is being pushed to a specified direction
    * @param position the current position of joystick
    */
    //% blockId=OnJoystick
    //% block="BitPlayer: |joystick $position|"
    //% position.fieldEditor="gridpicker"
    //% position.fieldOptions.columns=3
    //% group="BitPlayer"
    //% weight = 40
    export function OnJoystick(position: Joystick): boolean {
        let x = pins.analogReadPin(AnalogPin.P1) - x0;
        let y = pins.analogReadPin(AnalogPin.P2) - y0;
        let d = Math.round(Math.sqrt(Math.abs(x * x) + Math.abs(y * y)));
        const value1 = Math.round(d * 0.38);        //0.38 is the value of sin 22.5°
        const value2 = Math.round(d * 0.92);        //0.92 is the value of sin 67.5°
        let getPosition = Joystick.Middle;

        if (d > d0) {
            if (x > 0 && y > 0) {               // (x,y) is at top right area
                if (y > value2) {
                    getPosition = Joystick.Up;
                } else if (y < value1) {
                    getPosition = Joystick.Right;
                } else {
                    getPosition = Joystick.UpRight;
                }
            } else if (x > 0 && y < 0) {        // (x,y) is at bot right area
                if (x > value2) {
                    getPosition = Joystick.Right;
                } else if (x < value1) {
                    getPosition = Joystick.Down;
                } else {
                    getPosition = Joystick.LowerRight;
                }
            } else if (x < 0 && y < 0) {         // (x,y) is at bot left area
                y = Math.abs(y);
                if (y > value2) {
                    getPosition = Joystick.Down;
                } else if (y < value1) {
                    getPosition = Joystick.Left;
                } else {
                    getPosition = Joystick.LowerLeft;
                }
            } else if (x < 0 && y > 0) {         // (x,y) is at top left area
                if (y > value2) {
                    getPosition = Joystick.Up;
                } else if (y < value1) {
                    getPosition = Joystick.Left;
                } else {
                    getPosition = Joystick.UpLeft;
                }
            }
        } else {
            getPosition = Joystick.Middle;
        }

        if (getPosition == position) {
            return true;
        } else {
            return false;
        }
    }

}