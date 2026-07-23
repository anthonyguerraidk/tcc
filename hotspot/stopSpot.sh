#!/bin/bash

sudo pkill hostapd
sudo pkill dnsmasq

sudo iptables -F
sudo iptables -t nat -F

echo "Hotspot stopped."

sudo nmcli dev set wlx909164003fbf managed yes
sudo nmcli device connect wlx909164003fbf

sudo systemctl restart NetworkManager
sudo systemctl restart wpa_supplicant

echo "NetworkManager restarted"

sudo iptables -t nat -F
sudo iptables -F FORWARD

echo "All done"