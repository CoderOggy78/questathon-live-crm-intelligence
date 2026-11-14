import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const account = searchParams.get("account") || "A";
    const targetPath = searchParams.get("path") || "";
    const factId = searchParams.get("factId") || "";

    const dataDir = path.join(process.cwd(), "data");
    const paperworkFile = path.join(dataDir, "raw", `get_all_paperwork_account-${account}.json`);
    const accountsFile = path.join(dataDir, "raw", "get_my_accounts.json");
    
    let recordFound: any = null;

    if (fs.existsSync(paperworkFile)) {
      const raw = JSON.parse(fs.readFileSync(paperworkFile, "utf-8"));
      const records = JSON.parse(raw.result.content[0].text).records || [];
      
      if (targetPath) {
        recordFound = records.find((r: any) => r.path === targetPath || r.path.endsWith(targetPath));
      }
    }

    let factFound: any = null;
    if (factId && fs.existsSync(accountsFile)) {
      const rawAcc = JSON.parse(fs.readFileSync(accountsFile, "utf-8"));
      const accounts = JSON.parse(rawAcc.result.content[0].text).accounts || [];
      const acc = accounts.find((a: any) => a.id === account);
      if (acc) {
        factFound = acc.facts?.find((f: any) => f.id === factId);
      }
    }

    return NextResponse.json({
      ok: true,
      account,
      targetPath,
      factId,
      record: recordFound,
      fact: factFound
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
