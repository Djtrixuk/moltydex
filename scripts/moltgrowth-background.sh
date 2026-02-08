#!/bin/bash
# Background Moltgrowth Automation for MoltyDEX
# Runs continuous engagement cycles in the background

PROJECT_DIR="/Users/danielstephenson/agentdex"
ACCOUNT="moltydex"
LOG_FILE="$PROJECT_DIR/logs/moltgrowth-background.log"
PID_FILE="$PROJECT_DIR/logs/moltgrowth-background.pid"
INTERVAL=1800  # 30 minutes between cycles

# Create logs directory if it doesn't exist
mkdir -p "$PROJECT_DIR/logs"

# Function to log messages
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# Function to check if process is running
is_running() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p "$PID" > /dev/null 2>&1; then
            return 0
        else
            rm -f "$PID_FILE"
            return 1
        fi
    fi
    return 1
}

# Function to start background process
start() {
    if is_running; then
        echo "❌ Moltgrowth background process is already running (PID: $(cat $PID_FILE))"
        exit 1
    fi
    
    echo "🚀 Starting Moltgrowth background process..."
    echo "📝 Logs: $LOG_FILE"
    echo "⏱️  Interval: $INTERVAL seconds (30 minutes)"
    
    # Start background process
    (
        cd "$PROJECT_DIR"
        source venv/bin/activate
        
        while true; do
            log '=== Engagement Cycle Started ==='
            
            # Check status
            moltgrowth status --account $ACCOUNT >> "$LOG_FILE" 2>&1 || log "Status check failed"
            
            # Reset commented posts if needed (every 10 cycles)
            CYCLE_COUNT=$(cat "$PROJECT_DIR/logs/moltgrowth-cycle-count.txt" 2>/dev/null || echo '0')
            CYCLE_COUNT=$((CYCLE_COUNT + 1))
            echo $CYCLE_COUNT > "$PROJECT_DIR/logs/moltgrowth-cycle-count.txt"
            
            if [ $((CYCLE_COUNT % 10)) -eq 0 ]; then
                log 'Resetting commented posts (10 cycles completed)'
                rm -f ~/.moltgrowth/commented_${ACCOUNT}.txt
            fi
            
            # Run engagement
            moltgrowth engage --account $ACCOUNT >> "$LOG_FILE" 2>&1 || log "Engagement failed"
            
            log '=== Engagement Cycle Completed ==='
            log "Sleeping for $INTERVAL seconds..."
            
            sleep $INTERVAL
        done
    ) >> "$LOG_FILE" 2>&1 &
    
    PID=$!
    echo $PID > "$PID_FILE"
    echo "✅ Background process started (PID: $PID)"
    echo "📊 Check status: tail -f $LOG_FILE"
}

# Function to stop background process
stop() {
    if ! is_running; then
        echo "❌ Moltgrowth background process is not running"
        exit 1
    fi
    
    PID=$(cat "$PID_FILE")
    echo "🛑 Stopping Moltgrowth background process (PID: $PID)..."
    kill "$PID" 2>/dev/null
    
    # Wait for process to stop
    for i in {1..10}; do
        if ! ps -p "$PID" > /dev/null 2>&1; then
            rm -f "$PID_FILE"
            echo "✅ Background process stopped"
            exit 0
        fi
        sleep 1
    done
    
    # Force kill if still running
    kill -9 "$PID" 2>/dev/null
    rm -f "$PID_FILE"
    echo "✅ Background process force stopped"
}

# Function to check status
status() {
    if is_running; then
        PID=$(cat "$PID_FILE")
        echo "✅ Moltgrowth background process is running (PID: $PID)"
        echo "📝 Logs: $LOG_FILE"
        echo ""
        echo "Recent log entries:"
        tail -20 "$LOG_FILE" 2>/dev/null || echo "No log entries yet"
    else
        echo "❌ Moltgrowth background process is not running"
    fi
}

# Function to view logs
logs() {
    if [ -f "$LOG_FILE" ]; then
        tail -f "$LOG_FILE"
    else
        echo "No log file found"
    fi
}

# Main command handling
case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    status)
        status
        ;;
    restart)
        stop
        sleep 2
        start
        ;;
    logs)
        logs
        ;;
    *)
        echo "Usage: $0 {start|stop|status|restart|logs}"
        echo ""
        echo "Commands:"
        echo "  start   - Start background engagement process"
        echo "  stop    - Stop background engagement process"
        echo "  status  - Check if process is running"
        echo "  restart - Restart background process"
        echo "  logs    - View live logs"
        exit 1
        ;;
esac
