#!/usr/bin/env bash

wrapdocker gunicorn -w 4 index:api --bind 0.0.0.0:80 --timeout 600
