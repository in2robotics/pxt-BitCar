/*****************************************************************************
* | Description :	BitCar extension for micro:bit
* | Developer   :   CH Makered
* | More Info   :	http://chmakered.com/
******************************************************************************/

/**
 * Provides access to BitCar blocks for micro: bit functionality.
 */
//% color=190 icon="\uf126" block= "BitCar"
//% groups="['Analog', 'Digital', 'I2C', 'Grove Modules']"
namespace BitCar {
    /**
     * Set the motors' speed of BitCar
     */
    //% block="left $leftmotor \\% right $rightmotor \\%"
    //% leftmotor.shadow="speedPicker"
    //% rightmotor.shadow="speedPicker"
    export function move(leftmotor: number, rightmotor: number) {

    }

}