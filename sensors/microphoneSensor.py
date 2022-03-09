#!/usr/bin/env python3

import numpy as np
import subprocess

p = 0.001 * 32768
runbool = False

def calcPeaking():
    # record audio
    subprocess.run(["ffmpeg", "-t", "1", "-f", "pulse", "-channels", "1", "-i", "2", "-f", "s16le", "-c:a", "pcm_s16le", "/tmp/out.raw", "-y"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # analyze data
    data = np.memmap("/tmp/out.raw", dtype='h', mode='r')
    samples = len(data)
    hits = 0

    for datum in data:
        if abs(datum) >= p:
            hits += 1

    return hits/samples

def main():
    while True:
        print(round(calcPeaking(), 3))

if __name__ == "__main__":
    main()
