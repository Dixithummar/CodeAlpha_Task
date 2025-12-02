from scapy.all import sniff, PcapWriter, IP, TCP, UDP, ICMP, ARP, Raw
from datetime import datetime
import re

PCAP_FILE = "captured.pcap"

# Console column widths (tweak if your console is narrow/wide)
COL_NO_W     = 6
COL_TIME_W   = 19
COL_SRC_W    = 22
COL_DST_W    = 22
COL_PROTO_W  = 8
COL_LEN_W    = 6
COL_INFO_W   = 60

LINE_FMT = (
    f"{{no:>{COL_NO_W}}} "
    f"{{time:<{COL_TIME_W}}} "
    f"{{src:<{COL_SRC_W}}} "
    f"{{dst:<{COL_DST_W}}} "
    f"{{proto:<{COL_PROTO_W}}} "
    f"{{length:>{COL_LEN_W}}} "
    f"{{info:<{COL_INFO_W}}}"
)

HEADER = (
    f"{'No.':>{COL_NO_W}} "
    f"{'Time':<{COL_TIME_W}} "
    f"{'Source':<{COL_SRC_W}} "
    f"{'Destination':<{COL_DST_W}} "
    f"{'Proto':<{COL_PROTO_W}} "
    f"{'Len':>{COL_LEN_W}} "
    f"{'Info':<{COL_INFO_W}}"
)

SEPARATOR = "-" * (COL_NO_W + COL_TIME_W + COL_SRC_W + COL_DST_W + COL_PROTO_W + COL_LEN_W + COL_INFO_W + 7)

packet_counter = 0
pcap_writer = PcapWriter(PCAP_FILE, append=True, sync=True)

HTTP_REQUEST_RE = re.compile(rb'^(GET|POST|PUT|DELETE|HEAD|OPTIONS|PATCH)\s+([^\s]+)\s+HTTP/1\.[01]', re.IGNORECASE)
HOST_RE = re.compile(rb'^\s*Host:\s*(.+)\r?$', re.IGNORECASE | re.MULTILINE)

def extract_http_info(payload_bytes):
    """
    If payload_bytes contains an HTTP request, return a compact string:
      "HTTP <METHOD> <host> <path>"
    Otherwise return None.
    """
    # Quick check for ASCII HTTP request-line at start
    m = HTTP_REQUEST_RE.match(payload_bytes)
    if not m:
        # maybe there's some leading whitespace/newlines; try to strip leading CR/LF
        stripped = payload_bytes.lstrip(b'\r\n')
        m = HTTP_REQUEST_RE.match(stripped)
        if not m:
            return None
        payload_bytes = stripped

    method = m.group(1).decode(errors='ignore')
    path = m.group(2).decode(errors='ignore')

    # try to find Host header (first occurrence)
    host_m = HOST_RE.search(payload_bytes)
    host = host_m.group(1).decode(errors='ignore') if host_m else "-"
    return f"HTTP {method} {host} {path}"

def get_protocol_name(pkt):
    if pkt.haslayer(TCP):
        return "TCP"
    if pkt.haslayer(UDP):
        return "UDP"
    if pkt.haslayer(ICMP):
        return "ICMP"
    if pkt.haslayer(ARP):
        return "ARP"
    if pkt.haslayer(IP):
        return "IP"
    return pkt.name or "PKT"

def format_addr(pkt):
    """Return (src, dst) with ports when available"""
    if pkt.haslayer(IP):
        ip = pkt[IP]
        src = ip.src
        dst = ip.dst
        if pkt.haslayer(TCP):
            tcp = pkt[TCP]
            return f"{src}:{tcp.sport}", f"{dst}:{tcp.dport}"
        if pkt.haslayer(UDP):
            udp = pkt[UDP]
            return f"{src}:{udp.sport}", f"{dst}:{udp.dport}"
        return src, dst
    if pkt.haslayer(ARP):
        a = pkt[ARP]
        return a.psrc, a.pdst
    return ("-", "-")

def summarize_info(pkt):
    """Return compact human-readable Info field similar to Wireshark."""
    # ARP
    if pkt.haslayer(ARP):
        arp = pkt[ARP]
        op = arp.op
        return f"ARP {arp.psrc} → {arp.pdst} [{op}]"

    # IP-based
    if pkt.haslayer(IP):
        ip = pkt[IP]
        src = ip.src
        dst = ip.dst

        # TCP
        if pkt.haslayer(TCP):
            tcp = pkt[TCP]
            # flags like 'S', 'SA', 'FA', etc.
            flags = str(tcp.flags)
            info = f"TCP {src}:{tcp.sport} → {dst}:{tcp.dport} [{flags}]"

            # HTTP detection if payload present
            if pkt.haslayer(Raw):
                raw = bytes(pkt[Raw].load)
                http_info = extract_http_info(raw)
                if http_info:
                    return http_info  # give priority to readable HTTP info
                # if not http, optionally show first printable bytes (short)
                snippet = raw[:60].decode('utf-8', errors='ignore').replace('\r', '')
                if snippet:
                    snippet_line = snippet.splitlines()[0]
                    return f"{info} {snippet_line[:40]}"

            return info

        # UDP
        if pkt.haslayer(UDP):
            udp = pkt[UDP]
            return f"UDP {src}:{udp.sport} → {dst}:{udp.dport}"

        # ICMP
        if pkt.haslayer(ICMP):
            icmp = pkt[ICMP]
            return f"ICMP {src} → {dst} type={icmp.type} code={icmp.code}"

        # fallback for raw IP
        return f"IP {src} → {dst} proto={ip.proto}"

    # fallback
    return pkt.summary()

def packet_printer(pkt):
    global packet_counter, pcap_writer
    packet_counter += 1

    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    proto = get_protocol_name(pkt)
    length = len(pkt)
    src, dst = format_addr(pkt)
    info = summarize_info(pkt)

    # truncate for columns
    src_disp = (src[:COL_SRC_W-3] + "...") if len(src) > COL_SRC_W else src
    dst_disp = (dst[:COL_DST_W-3] + "...") if len(dst) > COL_DST_W else dst
    info_disp = (info[:COL_INFO_W-3] + "...") if len(info) > COL_INFO_W else info

    # print header occasionally
    if packet_counter == 1 or packet_counter % 20 == 0:
        print("\n" + SEPARATOR)
        print(HEADER)
        print(SEPARATOR)

    print(LINE_FMT.format(
        no=packet_counter,
        time=ts,
        src=src_disp,
        dst=dst_disp,
        proto=proto,
        length=length,
        info=info_disp
    ))

    # save to pcap
    try:
        pcap_writer.write(pkt)
    except Exception as e:
        print(f"[!] pcap write error: {e}")

def main():
    print("🔍 Wireshark-like Sniffer + HTTP detector")
    print(f"Writing packets to: {PCAP_FILE}")
    print("Press CTRL+C to stop.\n")
    try:
        sniff(prn=packet_printer, store=False)
    except KeyboardInterrupt:
        print("\n\nStopping capture...")
    finally:
        try:
            pcap_writer.close()
            print(f"Wrote captured packets to {PCAP_FILE}")
        except Exception:
            pass
        print("Goodbye.")

if __name__ == "__main__":
    main()
