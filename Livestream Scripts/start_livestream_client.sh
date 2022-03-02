#!/bin/bash

ffmpeg -f v4l2 -input_format h264 -framerate 25 -video_size 480x360 -i /dev/video0 \
    -c copy \
    -f flv rtmp://your.ip.address/live/stream
