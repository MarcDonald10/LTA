import { redirect } from "next/navigation";

// La racine appartient au site LTA (Phase 1). En attendant l'intégration,
// elle renvoie vers le magazine.
export default function Home() {
  redirect("/mag");
}
