// ============================================================
// ÉCRAN 2 — DÉTAIL COMMANDE (syntaxe FR)
// ============================================================


// ─────────────────────────────────────────────
// ONVISIBLE de l'écran
// ─────────────────────────────────────────────
Définir(varReferenceSelectionnee; Vide())


// ─────────────────────────────────────────────
// BOUTON RETOUR : btnRetour2
// ─────────────────────────────────────────────
// Text
"← Retour"
// OnSelect
Naviguer(Ecran1_Accueil; TransitionÉcran.Précédent)


// ─────────────────────────────────────────────
// LABEL TITRE : lblTitreEcran2
// ─────────────────────────────────────────────
// Text
varClientSelectionne.Title & " — Commandes"


// ─────────────────────────────────────────────
// GALERIE COMMANDES (gauche) : galCommandesDetail
// ─────────────────────────────────────────────

// Items
Trier(
    Filtrer(colCommandes; Client.Id = varClientSelectionne.ID);
    DateLivraison;
    OrdreTri.Croissant
)

// Rectangle sélection active — Fill
Si(CetElément.ID = varCommandeSelectionnee.ID; RVBA(255; 255; 255; 0,18); Transparent)

// Label numéro commande — Text
CetElément.Title

// Label date livraison — Text
"Livraison : " & Texte(CetElément.DateLivraison; "[$-fr-FR]jj/mm/aaaa")

// Badge statut — Fill
Basculer(
    CetElément.Statut.Value;
    "Complète";     RVBA(0;   200; 100; 1);
    "En cours";     RVBA(255; 165;   0; 1);
    "Pas commencé"; RVBA(200;  50;  50; 1);
                    RVBA(150; 150; 150; 1)
)
// Badge statut — Text
CetElément.Statut.Value

// Barre progression — Fond — Fill
RVBA(200; 200; 200; 0,3)

// Barre progression — Remplie — Width
(Parent.TemplateWidth - 24) * Avec(
    {
        att:  Somme(Filtrer(colPieces;   Commande.Id = CetElément.ID); QuantiteAttendue);
        pret: Somme(Filtrer(colPalettes; Commande.Id = CetElément.ID); QuantitePieces)
    };
    Si(att > 0; pret / att; 0)
)
// Barre progression — Remplie — Fill
RVBA(0; 180; 120; 1)

// Label pourcentage progression — Text
Avec(
    {
        att:  Somme(Filtrer(colPieces;   Commande.Id = CetElément.ID); QuantiteAttendue);
        pret: Somme(Filtrer(colPalettes; Commande.Id = CetElément.ID); QuantitePieces)
    };
    Texte(Si(att > 0; pret / att * 100; 0); "[$-fr-FR]0") & " %  (" &
    Texte(pret; "[$-fr-FR]# ##0") & " / " & Texte(att; "[$-fr-FR]# ##0") & ")"
)

// OnSelect
Définir(varCommandeSelectionnee; CetElément);
Définir(varReferenceSelectionnee; Vide())


// ─────────────────────────────────────────────
// PANNEAU DROITE — Visible
// ─────────────────────────────────────────────
Non(EstVide(varCommandeSelectionnee))


// ─────────────────────────────────────────────
// LABEL COMMANDE SÉLECTIONNÉE
// ─────────────────────────────────────────────
// Text
"Commande : " & varCommandeSelectionnee.Title & "  —  Livraison : " &
Texte(varCommandeSelectionnee.DateLivraison; "[$-fr-FR]jj/mm/aaaa")


// ─────────────────────────────────────────────
// GALERIE RÉFÉRENCES (droite) : galReferences
// ─────────────────────────────────────────────

// Items
Trier(
    Filtrer(colPieces; Commande.Id = varCommandeSelectionnee.ID);
    Title;
    OrdreTri.Croissant
)

// Label référence — Text
CetElément.Title

// Label quantité attendue — Text
"Attendu : " & Texte(CetElément.QuantiteAttendue; "[$-fr-FR]# ##0") & " pcs"

// Label pièces prêtes — Text
"Prêtes : " & Texte(
    Somme(
        Filtrer(colPalettes;
            Commande.Id = varCommandeSelectionnee.ID;
            Reference   = CetElément.Title
        );
        QuantitePieces
    );
    "[$-fr-FR]# ##0"
) & " pcs"

// Label cartons — Text
"Cartons : " & Texte(CetElément.NombreCartons; "[$-fr-FR]# ##0")

// Label poids — Text
"Poids : " & Texte(CetElément.Poids; "[$-fr-FR]0,00") & " kg"

// Barre progression référence — Fond — Fill
RVBA(200; 200; 200; 0,3)

// Barre progression référence — Remplie — Width
(Parent.TemplateWidth - 24) * Avec(
    {
        att:  CetElément.QuantiteAttendue;
        pret: Somme(
            Filtrer(colPalettes;
                Commande.Id = varCommandeSelectionnee.ID;
                Reference   = CetElément.Title
            );
            QuantitePieces
        )
    };
    Si(att > 0; pret / att; 0)
)
// Barre progression référence — Remplie — Fill
RVBA(255; 140; 0; 1)

// OnSelect
Définir(varReferenceSelectionnee; CetElément);
Naviguer(Ecran3_DetailReference; TransitionÉcran.Fondu)


// ─────────────────────────────────────────────
// BOUTON BON DE LIVRAISON : btnBonLivraison
// ─────────────────────────────────────────────
// Text
"📄 Bon de livraison"
// Visible
Non(EstVide(varCommandeSelectionnee))
// OnSelect
Naviguer(Ecran4_BonDeLivraison; TransitionÉcran.Fondu)
// Fill
RVBA(0; 120; 210; 1)
// Color (texte)
Blanc
