# howchoo.com/g/ote2mjkzzta/control-raspberry-pi-fan-temperature-python
import subprocess
import time

from gpiozero import OutputDevice

# Fan turn-on/turn-off temperatures; note that CPU throttles at 80 C anyways
ON_t = 46
OFF_t = 43

# Time in seconds between CPU temperature checks
SLEEP_t = 5

# Broadcom pin number to output signal; any GPIO works
GPIO_PIN = 23

def get_temp():
    # OS subprocess call to get CPU temperature, captured as string 
    output = subprocess.run(['vcgencmd', 'measure_temp'], capture_output = True)
    temp_str = output.stdout.decode()
    try:
        # vcgencmd measure_temp returns as "temp = ###.#'C"
        return float(temp_str.split('=')[1].split('\'')[0])
    except (IndexError, ValueError):
        raise RuntimeError('Could not parse temperature output.')
    
if __name__ == '__main__':
    # gpiozero-provided object wrapper for generic output device (e.g. fan) 
    fan = OutputDevice(GPIO_PIN)
    
    while True:
        # measure current CPU temperature
        temp = get_temp()
        print("Temp: ",temp,"\n")
        
        # Activate fan if current temperature above high threshold & fan off
        if temp > ON_t and not fan.value:
            fan.on()
            
        # Disable fan if current temperature below low threshold & fan on
        elif fan.value and temp < OFF_t:
            fan.off()
        
        # Wait X seconds before next test
        time.sleep(SLEEP_t)