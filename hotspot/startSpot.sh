#!/bin/bash

#sudo systemctl stop NetworkManager
#sudo systemctl stop wpa_supplicant

sudo nmcli dev disconnect $WIFI_IF || true
sudo nmcli dev set $WIFI_IF managed no

set -e

WIFI_IF="wlx909164003fbf"
#INET_IF="wlp0s20f3"
INET_IF="enp8s0"

SSID="owo"
PASSWORD="password"

echo "[+] Stopping conflicting services..."

sudo systemctl stop hostapd 2>/dev/null || true
sudo systemctl stop dnsmasq 2>/dev/null || true

echo "[+] Configuring interface..."

sudo ip link set $WIFI_IF down
sudo ip addr flush dev $WIFI_IF

sudo ip addr add 192.168.50.1/24 dev $WIFI_IF
sudo ip link set $WIFI_IF up

echo "[+] Writing hostapd config..."

cat <<EOF | sudo tee /tmp/hostapd.conf >/dev/null
interface=$WIFI_IF
driver=nl80211
ssid=$SSID
hw_mode=g
channel=6
country_code=US
ieee80211n=1
ieee80211ac=1
wmm_enabled=1
auth_algs=1
wpa=2
wpa_key_mgmt=WPA-PSK
rsn_pairwise=CCMP
wpa_passphrase=$PASSWORD
EOF

echo "[+] Writing dnsmasq config..."

cat <<EOF | sudo tee /tmp/dnsmasq.conf >/dev/null
interface=$WIFI_IF
dhcp-range=192.168.50.10,192.168.50.100,255.255.255.0,24h
EOF

echo "[+] Enabling IP forwarding..."

sudo sysctl -w net.ipv4.ip_forward=1 >/dev/null

echo "[+] Configuring NAT..."

sudo iptables -t nat -A POSTROUTING -o $INET_IF -j MASQUERADE

sudo iptables -A FORWARD -i $INET_IF -o $WIFI_IF \
    -m state --state RELATED,ESTABLISHED -j ACCEPT

sudo iptables -A FORWARD -i $WIFI_IF -o $INET_IF -j ACCEPT

echo "[+] Blocking LAN access..."

sudo iptables -A FORWARD -i $WIFI_IF -d 192.168.0.0/16 -j DROP
sudo iptables -A FORWARD -i $WIFI_IF -d 10.0.0.0/8 -j DROP
sudo iptables -A FORWARD -i $WIFI_IF -d 172.16.0.0/12 -j DROP

echo "[+] Starting dnsmasq..."

sudo dnsmasq -C /tmp/dnsmasq.conf

echo "[+] Starting hostapd..."

sudo hostapd /tmp/hostapd.conf
