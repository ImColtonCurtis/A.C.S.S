#!/bin/bash

if [ ! $# == 1 ]
    echo "Usage: $0 filename"
    exit
fi

ffmpeg  -re -i "/home/pi/Projects/LivestreamServer/$0" \
    -c copy -g 30 -sc_threshold 0 \
    -f tee -map 0:v -map 0:a \
    "/dev/shm/hls/streamVOD.mp4|[f=hls:hls_time=6:hls_list_size=5:method=PUT]/dev/shm/hls/live.m3u8"
