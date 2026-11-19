// Sauvegarde du panier dans le navigateur, pour le retrouver à la visite suivante.

const CLE = "panier-roussel";
const VERSION = 2;

// Enregistre le panier et le code promo.
export function sauverPanier(lignes, codePromo) {
  const donnees = { version: VERSION, lignes, codePromo };
  localStorage.setItem(CLE, JSON.stringify(donnees));
}

// Relit le panier enregistré, ou un panier vide.
export function chargerPanier() {
  const brut = localStorage.getItem(CLE);
  if (!brut) {
    return { lignes: [], codePromo: "", sauvegardeProtegee: false };
  }
  let donnees;
  try {
    donnees = JSON.parse(brut);
  } catch (erreur) {
    console.error("La sauvegarde du panier est illisible; les données sont conservées.", erreur);
    return { lignes: [], codePromo: "", sauvegardeProtegee: true };
  }
  if (!donnees || donnees.version !== VERSION || !Array.isArray(donnees.lignes)) {
    return { lignes: [], codePromo: "", sauvegardeProtegee: true };
  }
  return {
    lignes: donnees.lignes,
    codePromo: donnees.codePromo || "",
    sauvegardeProtegee: false,
  };
}
