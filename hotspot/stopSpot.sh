#!/bin/bash

sudo pkill hostapd
sudo pkill dnsmasq

sudo iptables -F
sudo iptables -t nat -F

echo "Hotspot stopped."

WIFI_IF="wlp2s0"

sudo nmcli dev set $WIFI_IF managed yes
sudo nmcli device connect $WIFI_IF

sudo systemctl restart NetworkManager
sudo systemctl restart wpa_supplicant

echo "NetworkManager restarted"

sudo iptables -t nat -F
sudo iptables -F FORWARD

echo "All done"