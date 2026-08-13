import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "API - SAGES (Système d'Aide à la Gestion d'Etablissements Scolaire) par Beaujock !" });
}
