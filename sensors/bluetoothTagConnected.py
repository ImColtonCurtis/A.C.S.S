#!/usr/bin/env python3

import gattlib

def tagConnected(tagName="Catalytic Convertor Tag") -> bool:

    # discover bt devices
    service = gattlib.DiscoveryService()
    devices = service.discover(2)

    for _, name in list(devices.items()):
        if name == tagName:
            return True
    return False

def main():
    while True:
        if not tagConnected():
            print("Tag not found.")
            break
        print("Tag found!")

if __name__ == "__main__":
    main()
