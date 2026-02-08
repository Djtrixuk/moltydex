#!/usr/bin/env python3
"""
Moltgrowth Background Daemon
Runs continuous engagement cycles in the background
"""

import os
import sys
import time
import subprocess
import signal
from pathlib import Path

PROJECT_DIR = Path("/Users/danielstephenson/agentdex")
ACCOUNT = "moltydex"
LOG_FILE = PROJECT_DIR / "logs" / "moltgrowth-background.log"
PID_FILE = PROJECT_DIR / "logs" / "moltgrowth-background.pid"
CYCLE_COUNT_FILE = PROJECT_DIR / "logs" / "moltgrowth-cycle-count.txt"
INTERVAL = 1800  # 30 minutes

# Create logs directory
PROJECT_DIR / "logs" / ".gitkeep"
(PROJECT_DIR / "logs").mkdir(exist_ok=True)

def log(message):
    """Write message to log file"""
    timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
    with open(LOG_FILE, 'a') as f:
        f.write(f"[{timestamp}] {message}\n")
    print(f"[{timestamp}] {message}")

def get_venv_python():
    """Get Python executable from venv"""
    venv_python = PROJECT_DIR / "venv" / "bin" / "python3"
    if venv_python.exists():
        return str(venv_python)
    return "python3"

def run_command(cmd, description):
    """Run a command and log the result"""
    try:
        python = get_venv_python()
        result = subprocess.run(
            [python, "-m", "moltgrowth"] + cmd.split(),
            cwd=str(PROJECT_DIR),
            capture_output=True,
            text=True,
            timeout=300
        )
        output = result.stdout + result.stderr
        if output.strip():
            log(f"{description}: {output.strip()}")
        return result.returncode == 0
    except subprocess.TimeoutExpired:
        log(f"{description}: Timeout after 5 minutes")
        return False
    except Exception as e:
        log(f"{description}: Error - {str(e)}")
        return False

def engagement_cycle():
    """Run one engagement cycle"""
    log("=== Engagement Cycle Started ===")
    
    # Check status
    run_command(f"status --account {ACCOUNT}", "Status check")
    
    # Reset commented posts every 10 cycles
    cycle_count = 0
    if CYCLE_COUNT_FILE.exists():
        try:
            cycle_count = int(CYCLE_COUNT_FILE.read_text().strip())
        except:
            pass
    
    cycle_count += 1
    CYCLE_COUNT_FILE.write_text(str(cycle_count))
    
    if cycle_count % 10 == 0:
        log("Resetting commented posts (10 cycles completed)")
        commented_file = Path.home() / ".moltgrowth" / f"commented_{ACCOUNT}.txt"
        if commented_file.exists():
            commented_file.unlink()
    
    # Run engagement
    run_command(f"engage --account {ACCOUNT}", "Engagement")
    
    log("=== Engagement Cycle Completed ===")
    log(f"Sleeping for {INTERVAL} seconds...")

def signal_handler(sig, frame):
    """Handle shutdown signals"""
    log("Received shutdown signal, stopping...")
    if PID_FILE.exists():
        PID_FILE.unlink()
    sys.exit(0)

def main():
    """Main daemon loop"""
    # Set up signal handlers
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    # Write PID file
    PID_FILE.write_text(str(os.getpid()))
    log(f"Daemon started (PID: {os.getpid()})")
    
    # Main loop
    try:
        while True:
            engagement_cycle()
            time.sleep(INTERVAL)
    except KeyboardInterrupt:
        signal_handler(None, None)
    except Exception as e:
        log(f"Fatal error: {str(e)}")
        if PID_FILE.exists():
            PID_FILE.unlink()
        sys.exit(1)

if __name__ == "__main__":
    main()
