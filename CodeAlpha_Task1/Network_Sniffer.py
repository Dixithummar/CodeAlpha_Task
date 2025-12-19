"""

Requirement:
    pip install scapy
Run:
    sudo python3 vs_sniffer.py
"""

from scapy.all import sniff, IP, IPv6, TCP, UDP, Raw
from datetime import datetime
import binascii


def hex_ascii_preview(data, max_len=64):
    """Return small HEX + ASCII preview for payload."""
    if not data:
        return "<no payload>"

    data = data[:max_len]

    hex_part = " ".join(f"{b:02x}" for b in data)
    ascii_part = "".join(chr(b) if 32 <= b < 127 else "." for b in data)

    return f"HEX   : {hex_part}\nASCII : {ascii_part}"


def analyze_packet(pkt):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]

    # Default values
    src_ip = dst_ip = "-"
    src_port = dst_port = "-"
    protocol = "UNKNOWN"
    payload = b""

    # IPv4 / IPv6
    if IP in pkt:
        src_ip = pkt[IP].src
        dst_ip = pkt[IP].dst
    elif IPv6 in pkt:
        src_ip = pkt[IPv6].src
        dst_ip = pkt[IPv6].dst

    # Transport layer
    if TCP in pkt:
        src_port = pkt[TCP].sport
        dst_port = pkt[TCP].dport
        protocol = "TCP"
        payload = bytes(pkt[TCP].payload)
    elif UDP in pkt:
        src_port = pkt[UDP].sport
        dst_port = pkt[UDP].dport
        protocol = "UDP"
        payload = bytes(pkt[UDP].payload)
    elif Raw in pkt:
        payload = bytes(pkt[Raw].load)

    # Draw VS Code box UI
    print("┌" + "─" * 78 + "┐")
    print(f"│ Timestamp: {timestamp:<64} │")
    print("├" + "─" * 78 + "┤")
    print(f"│ Source IP      : {src_ip:<52} │")
    print(f"│ Source Port    : {str(src_port):<52} │")
    print(f"│ Destination IP : {dst_ip:<52} │")
    print(f"│ Destination Port: {str(dst_port):<51} │")
    print(f"│ Protocol       : {protocol:<52} │")
    print("├" + "─" * 78 + "┤")

    preview = hex_ascii_preview(payload)

    print("│ Payload Preview:                                                   │")
    for line in preview.split("\n"):
        print(f"│ {line:<70} │")

    print("└" + "─" * 78 + "┘")
    print()  # blank line


def main():
    print("Starting VS Code Style Packet Sniffer...\n")
    sniff(prn=analyze_packet, store=False)


if __name__ == "__main__":
    main()
