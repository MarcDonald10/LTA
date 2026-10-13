import { NextResponse, type NextRequest } from "next/server";

/*
 * Première barrière, optimiste : sans cookie de session, on renvoie vers la
 * connexion. La vérification réelle (signature, rôle) se fait dans chaque page
 * et chaque action serveur.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/connexion") return NextResponse.next();

  if (!request.cookies.has("lta_admin_session")) {
    const url = new URL("/admin/connexion", request.url);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
