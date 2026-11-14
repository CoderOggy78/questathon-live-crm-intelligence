import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), "data");
    const dbPath = path.join(dataDir, "crm_db.json");
    const statePath = path.join(dataDir, "sync_state.json");
    
    let db = null;
    let syncState = null;
    
    if (fs.existsSync(dbPath)) {
      db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
    }
    
    if (fs.existsSync(statePath)) {
      syncState = JSON.parse(fs.readFileSync(statePath, "utf-8"));
    }
    
    // Check Flytbase team
    let team = [];
    const teamPath = path.join(dataDir, "raw", "get_flytbase_team.json");
    if (fs.existsSync(teamPath)) {
      try {
        const teamRaw = JSON.parse(fs.readFileSync(teamPath, "utf-8"));
        const parsed = JSON.parse(teamRaw.result.content[0].text);
        team = parsed.people || [];
      } catch (e) {}
    }

    return NextResponse.json({
      ok: true,
      data: db,
      syncState: {
        lastCallTimestamp: syncState?.last_call_timestamp || 0,
        completedCount: syncState?.completed_tools?.length || 0,
        pendingCount: syncState?.pending_tools?.length || 0,
        completedTools: syncState?.completed_tools || [],
        pendingTools: syncState?.pending_tools || []
      },
      team
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
