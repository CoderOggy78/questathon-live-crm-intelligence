import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const LOCAL_NOTES_FILE = path.join(process.cwd(), "data", "local_notes.json");
const MCP_URL = "https://questathon.aihackerscollective.com/api/public/mcp";

function getLocalNotes() {
  if (fs.existsSync(LOCAL_NOTES_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(LOCAL_NOTES_FILE, "utf-8"));
    } catch (e) {}
  }
  return [];
}

function saveLocalNotes(notes: any[]) {
  fs.writeFileSync(LOCAL_NOTES_FILE, JSON.stringify(notes, null, 2));
}

export async function GET() {
  const localNotes = getLocalNotes();
  const rawNotesPath = path.join(process.cwd(), "data", "raw", "list_notes.json");
  let serverNotes = [];
  
  if (fs.existsSync(rawNotesPath)) {
    try {
      const raw = JSON.parse(fs.readFileSync(rawNotesPath, "utf-8"));
      serverNotes = JSON.parse(raw.result.content[0].text).notes || [];
    } catch (e) {}
  }

  return NextResponse.json({
    ok: true,
    serverNotes,
    localNotes,
    allNotes: [...localNotes, ...serverNotes]
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, account, kind, title } = body;

    if (!text) {
      return NextResponse.json({ ok: false, error: "Text is required" }, { status: 400 });
    }

    // Check rate limit safety from sync_state
    const statePath = path.join(process.cwd(), "data", "sync_state.json");
    let lastCall = 0;
    if (fs.existsSync(statePath)) {
      const state = JSON.parse(fs.readFileSync(statePath, "utf-8"));
      lastCall = state.last_call_timestamp || 0;
    }

    const elapsed = Date.now() / 1000 - lastCall;
    const token = process.env.AQ_TOKEN;

    if (!token) {
      return NextResponse.json({ ok: false, error: "AQ_TOKEN missing on server" }, { status: 500 });
    }

    // Attempt to write note via MCP
    const payload = {
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: {
        name: "write_note",
        arguments: {
          text,
          account: account || undefined,
          kind: kind || "note",
          title: title || undefined
        }
      }
    };

    let mcpResult: any = null;
    let mcpSuccess = false;

    // Call MCP
    try {
      const response = await fetch(MCP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json, text/event-stream",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        mcpResult = await response.json();
        mcpSuccess = !mcpResult.isError;
      }
    } catch (err: any) {
      console.error("MCP write_note error:", err);
    }

    // Save locally
    const newNote = {
      id: "note_" + Date.now(),
      text,
      account,
      kind: kind || "note",
      title: title || "Executive Action Note",
      created_at: new Date().toISOString(),
      synced_to_mcp: mcpSuccess,
      mcp_response: mcpResult
    };

    const notes = getLocalNotes();
    notes.unshift(newNote);
    saveLocalNotes(notes);

    return NextResponse.json({
      ok: true,
      note: newNote,
      mcpSuccess
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
