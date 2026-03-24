// ============================================================
// ÉCRAN 4 — BON DE LIVRAISON (syntaxe FR)
// ============================================================


// ─────────────────────────────────────────────
// ONVISIBLE de l'écran
// ─────────────────────────────────────────────
// Précalcul des totaux de la commande
Avec(
    {
        palCmd: Filtrer(colPalettes; Commande.Id = varCommandeSelectionnee.ID);
        pcsCmd: Filtrer(colPieces;   Commande.Id = varCommandeSelectionnee.ID)
    };
    Définir(varBLTotalAttendu;  Somme(pcsCmd;    QuantiteAttendue));
    Définir(varBLTotalPrets;    Somme(palCmd;     QuantitePieces));
    Définir(varBLTotalCartons;  Somme(palCmd;     NombreCartons));
    Définir(varBLTotalPoids;    Somme(palCmd;     Poids))
);

// Construction de la collection dénormalisée pour la galerie plate
EffacerCollecte(
    colBLDetail;
    PourTous(
        Filtrer(colPieces; Commande.Id = varCommandeSelectionnee.ID);
        Avec(
            {ref: CetEnregistrement};
            PourTous(
                Filtrer(colPalettes;
                    Commande.Id = varCommandeSelectionnee.ID;
                    Reference   = ref.Title
                );
                {
                    RefTitle:         ref.Title;
                    RefQteAttendue:   ref.QuantiteAttendue;
                    RefNombreCartons: ref.NombreCartons;
                    RefPoids:         ref.Poids;
                    LotNom:           Title;
                    LotQtePieces:     QuantitePieces;
                    LotNombreCartons: NombreCartons;
                    LotPoids:         Poids
                }
            )
        )
    )
)


// ─────────────────────────────────────────────
// BOUTON RETOUR : btnRetour4
// ─────────────────────────────────────────────
// Text
"← Retour"
// OnSelect
Naviguer(Ecran2_DetailCommande; TransitionÉcran.Précédent)


// ─────────────────────────────────────────────
// EN-TÊTE
// ─────────────────────────────────────────────

// Titre — Text
"BON DE LIVRAISON"

// lblEnTeteClient — Text
varClientSelectionne.Title

// lblEnTeteCommande — Text
"Commande N° " & varCommandeSelectionnee.Title

// lblEnTeteDate — Text
"Date de livraison : " & Texte(varCommandeSelectionnee.DateLivraison; "[$-fr-FR]jj/mm/aaaa")

// lblDateGeneration — Text
"Généré le : " & Texte(Maintenant(); "[$-fr-FR]jj/mm/aaaa hh:mm")


// ─────────────────────────────────────────────
// BLOC TOTAUX
// ─────────────────────────────────────────────

// lblTotalPieces — Text
"Total pièces attendues : " & Texte(varBLTotalAttendu; "[$-fr-FR]# ##0")

// lblTotalPrets — Text
"Total pièces prêtes : " & Texte(varBLTotalPrets; "[$-fr-FR]# ##0")
// Color
Si(varBLTotalPrets >= varBLTotalAttendu; RVBA(0; 180; 100; 1); RVBA(200; 100; 0; 1))

// lblTotalCartons — Text
"Total cartons : " & Texte(varBLTotalCartons; "[$-fr-FR]# ##0")

// lblTotalPoids — Text
"Poids total : " & Texte(varBLTotalPoids; "[$-fr-FR]0,00") & " kg"


// ─────────────────────────────────────────────
// GALERIE PLATE : galDetailBL
// ─────────────────────────────────────────────
// (remplace les galeries imbriquées impossibles dans PowerApps)

// Items
Trier(colBLDetail; RefTitle; OrdreTri.Croissant)

// Afficher l'en-tête de référence seulement pour le premier lot de chaque référence
// lblEnteteRef — Visible
NbLignes(Filtrer(colBLDetail; RefTitle = CetElément.RefTitle; LotNom < CetElément.LotNom)) = 0

// lblEnteteRef — Text
CetElément.RefTitle

// lblInfoLot — Text
"Lot " & CetElément.LotNom &
"  |  " & Texte(CetElément.LotQtePieces;     "[$-fr-FR]# ##0") & " pcs" &
"  |  " & Texte(CetElément.LotNombreCartons;  "[$-fr-FR]# ##0") & " ctn" &
"  |  " & Texte(CetElément.LotPoids;          "[$-fr-FR]0,00")  & " kg"

// Rectangle fond alterné — Fill
Si(
    EstPair(NbLignes(Filtrer(colBLDetail; RefTitle = CetElément.RefTitle; LotNom < CetElément.LotNom)));
    RVBA(255; 255; 255; 0,04);
    Transparent
)


// ─────────────────────────────────────────────
// BOUTON IMPRIMER : btnImprimer
// ─────────────────────────────────────────────
// Text
"🖨️  Imprimer"
// OnSelect
Imprimer()
// Fill
RVBA(0; 120; 210; 1)
// Color (texte)
Blanc

// ─────────────────────────────────────────────
// NOTES SUR L'IMPRESSION
// ─────────────────────────────────────────────
// Imprimer() ouvre la boîte de dialogue d'impression du navigateur.
// Pour une mise en page A4 propre :
//   1. Créer un écran dédié impression : largeur 595 · hauteur 842 · fond Blanc
//   2. Masquer tous les boutons de navigation sur cet écran
//   3. Naviguer vers cet écran, puis appeler Imprimer()
