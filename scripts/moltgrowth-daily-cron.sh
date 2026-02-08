#!/bin/bash
# Cron-friendly daily automation script for MoltyDEX Moltbook growth
# This script ensures the virtual environment is activated and logs output

PROJECT_DIR="/Users/danielstephenson/agentdex"
LOG_FILE="$PROJECT_DIR/logs/moltgrowth-daily.log"
VENV="$PROJECT_DIR/venv"

# Create logs directory if it doesn't exist
mkdir -p "$PROJECT_DIR/logs"

# Log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "=========================================="
log "Starting MoltyDEX daily automation"
log "=========================================="

# Change to project directory
cd "$PROJECT_DIR" || {
    log "ERROR: Failed to change to project directory"
    exit 1
}

# Activate virtual environment
if [ -f "$VENV/bin/activate" ]; then
    source "$VENV/bin/activate"
    log "Virtual environment activated"
else
    log "ERROR: Virtual environment not found at $VENV"
    exit 1
}

# Run the daily automation
log "Running engagement cycle..."
"$PROJECT_DIR/scripts/moltgrowth-daily.sh" >> "$LOG_FILE" 2>&1

EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
    log "✅ Daily automation completed successfully"
else
    log "❌ Daily automation failed with exit code $EXIT_CODE"
fi

log "=========================================="
log ""

exit $EXIT_CODE
