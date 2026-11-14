import os
import sys
import time
import json
import urllib.request
import traceback

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
RAW_DIR = os.path.join(DATA_DIR, "raw")
os.makedirs(RAW_DIR, exist_ok=True)

ENV_FILE = os.path.join(os.path.dirname(__file__), ".env.local")
TOKEN = None
if os.path.exists(ENV_FILE):
    with open(ENV_FILE, "r") as f:
        for line in f:
            if line.startswith("AQ_TOKEN="):
                TOKEN = line.strip().split("=", 1)[1]

if not TOKEN:
    TOKEN = os.environ.get("AQ_TOKEN")

if not TOKEN:
    print("ERROR: AQ_TOKEN not found in .env.local or environment")
    sys.exit(1)

MCP_URL = "https://questathon.aihackerscollective.com/api/public/mcp"

STATE_FILE = os.path.join(DATA_DIR, "sync_state.json")

def load_state():
    if os.path.exists(STATE_FILE):
        try:
            with open(STATE_FILE, "r") as f:
                return json.load(f)
        except Exception:
            pass
    return {
        "last_call_timestamp": 0,
        "completed_tools": [],
        "pending_tools": [
            {"name": "get_my_accounts", "args": {}},
            {"name": "get_data_format", "args": {}},
            {"name": "get_all_paperwork", "args": {"account": "A"}},
            {"name": "get_all_paperwork", "args": {"account": "B"}},
            {"name": "get_signals", "args": {}},
            {"name": "get_flytbase_team", "args": {}},
            {"name": "get_feature_requests", "args": {}},
            {"name": "get_release_notes", "args": {}},
            {"name": "list_notes", "args": {}},
            {"name": "list_paperwork", "args": {}}
        ],
        "history": []
    }

def save_state(state):
    with open(STATE_FILE, "w") as f:
        json.dump(state, f, indent=2)

def call_mcp(tool_name, args={}):
    payload = {
        "jsonrpc": "2.0",
        "id": int(time.time() * 1000) % 1000000,
        "method": "tools/call",
        "params": {
            "name": tool_name,
            "arguments": args
        }
    }
    
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream",
        "Authorization": f"Bearer {TOKEN}"
    }
    
    req = urllib.request.Request(
        MCP_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers=headers,
        method="POST"
    )
    
    with urllib.request.urlopen(req, timeout=30) as resp:
        body = resp.read().decode("utf-8")
        parsed = json.loads(body)
        return parsed

def run_sync_loop():
    state = load_state()
    print(f"Sync runner started. Pending tools: {len(state['pending_tools'])}")
    
    while state["pending_tools"]:
        now = time.time()
        elapsed = now - state["last_call_timestamp"]
        WAIT_SECONDS = 62.0  # safe margin for 1 call / min
        
        if elapsed < WAIT_SECONDS:
            sleep_time = WAIT_SECONDS - elapsed
            print(f"Waiting {sleep_time:.1f}s to respect rate limit (1 call / min)...")
            time.sleep(sleep_time)
            
        target = state["pending_tools"][0]
        tool_name = target["name"]
        args = target["args"]
        call_key = f"{tool_name}_{json.dumps(args, sort_keys=True)}"
        safe_filename = f"{tool_name}" + ("_" + "_".join(f"{k}-{v}" for k,v in sorted(args.items())) if args else "") + ".json"
        
        print(f"\n[{time.strftime('%X')}] Calling MCP tool: {tool_name} with args: {args}...")
        try:
            res = call_mcp(tool_name, args)
            state["last_call_timestamp"] = time.time()
            
            # Save raw output
            raw_path = os.path.join(RAW_DIR, safe_filename)
            with open(raw_path, "w") as f:
                json.dump(res, f, indent=2)
                
            # Check for error or rate limit message
            is_error = res.get("isError", False)
            content_list = res.get("result", {}).get("content", [])
            content_text = ""
            if content_list and isinstance(content_list, list):
                content_text = content_list[0].get("text", "")
                
            if is_error and ("Rate limit" in content_text or "429" in content_text):
                print(f"Rate limited: {content_text}. Will retry in 65s.")
                time.sleep(65)
                continue
                
            print(f"SUCCESS: Received response for {tool_name} ({len(content_text)} chars). Saved to {safe_filename}")
            
            # Record in state
            state["completed_tools"].append({
                "name": tool_name,
                "args": args,
                "timestamp": state["last_call_timestamp"],
                "file": safe_filename,
                "is_error": is_error
            })
            if state["pending_tools"] and state["pending_tools"][0]["name"] == tool_name and state["pending_tools"][0]["args"] == args:
                state["pending_tools"].pop(0)
            save_state(state)
            
        except urllib.error.HTTPError as he:
            err_body = he.read().decode('utf-8') if hasattr(he, 'read') else str(he)
            print(f"HTTPError {he.code}: {err_body}")
            state["last_call_timestamp"] = time.time()
            if he.code == 429:
                print("Hit 429 Rate Limit. Sleeping 70s...")
                time.sleep(70)
            else:
                # Log error and wait before retry
                time.sleep(30)
        except Exception as e:
            print(f"Exception calling {tool_name}: {e}")
            traceback.print_exc()
            time.sleep(15)

    print("\nALL SCHEDULED INGESTION TOOLS COMPLETED!")

if __name__ == "__main__":
    run_sync_loop()
