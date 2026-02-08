#!/bin/bash
# Growth Monitoring Script
# Tracks key metrics and opportunities for MoltyDEX

PROJECT_DIR="/Users/danielstephenson/agentdex"
LOG_FILE="$PROJECT_DIR/logs/growth-monitor.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

mkdir -p "$PROJECT_DIR/logs"

log() {
    echo "[$DATE] $1" | tee -a "$LOG_FILE"
}

log "=========================================="
log "MoltyDEX Growth Monitor"
log "=========================================="

# Check API health
log "Checking API health..."
API_URL="${MOLTYDEX_API_URL:-https://api.moltydex.com}"
if curl -s -f "$API_URL/api/health" > /dev/null 2>&1; then
    log "✅ API is online"
else
    log "⚠️  API health check failed"
fi

# Check website
log "Checking website..."
WEBSITE_URL="${MOLTYDEX_WEBSITE_URL:-https://www.moltydex.com}"
if curl -s -f "$WEBSITE_URL" > /dev/null 2>&1; then
    log "✅ Website is online"
else
    log "⚠️  Website check failed"
fi

# Check Moltbook status
log "Checking Moltbook status..."
cd "$PROJECT_DIR" || exit 1
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
    if command -v moltgrowth > /dev/null 2>&1; then
        moltgrowth status --account moltydex >> "$LOG_FILE" 2>&1
        log "✅ Moltbook status checked"
    else
        log "⚠️  moltgrowth not found"
    fi
else
    log "⚠️  Virtual environment not found"
fi

log "=========================================="
log ""
