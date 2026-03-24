// ============================================================
// ÉCRAN 3 — DÉTAIL RÉFÉRENCE (syntaxe FR)
// ============================================================


// ─────────────────────────────────────────────
// BOUTON RETOUR : btnRetour3
// ─────────────────────────────────────────────
// Text
"← Retour"
// OnSelect
Naviguer(Ecran2_DetailCommande; TransitionÉcran.Précédent)


// ─────────────────────────────────────────────
// LABEL TITRE : lblTitreEcran3
// ─────────────────────────────────────────────
// Text
"Commande " & varCommandeSelectionnee.Title & " — Références"


// ─────────────────────────────────────────────
// GALERIE RÉFÉRENCES (gauche) : galReferencesDetail
// ─────────────────────────────────────────────

// Items
Trier(
    Filtrer(colPieces; Commande.Id = varCommandeSelectionnee.ID);
    Title;
    OrdreTri.Croissant
)

// Rectangle sélection active — Fill
Si(CetElément.ID = varReferenceSelectionnee.ID; RVBA(255; 255; 255; 0,18); Transparent)

// Label référence — Text
CetElément.Title

// Label pièces attendues / prêtes — Text
Avec(
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
    Texte(pret; "[$-fr-FR]# ##0") & " / " & Texte(att; "[$-fr-FR]# ##0") & " pcs"
)

// Label cartons — Text
"Cartons : " & Texte(CetElément.NombreCartons; "[$-fr-FR]# ##0")

// Barre progression — Fond — Fill
RVBA(200; 200; 200; 0,3)

// Barre progression — Remplie — Width
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
// Barre progression — Remplie — Fill
RVBA(255; 140; 0; 1)

// Label % progression — Text
Avec(
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
    Texte(Si(att > 0; pret / att * 100; 0); "[$-fr-FR]0") & " %"
)

// OnSelect
Définir(varReferenceSelectionnee; CetElément)


// ─────────────────────────────────────────────
// PANNEAU DROITE — Visible
// ─────────────────────────────────────────────
Non(EstVide(varReferenceSelectionnee))


// ─────────────────────────────────────────────
// LABEL TITRE RÉFÉRENCE SÉLECTIONNÉE
// ─────────────────────────────────────────────
// Text
"Référence : " & varReferenceSelectionnee.Title


// ─────────────────────────────────────────────
// LABEL RÉCAPITULATIF RÉFÉRENCE
// ─────────────────────────────────────────────
// Text
"Attendu : " & Texte(varReferenceSelectionnee.QuantiteAttendue; "[$-fr-FR]# ##0") &
" pcs  |  Prêtes : " & Texte(
    Somme(
        Filtrer(colPalettes;
            Commande.Id = varCommandeSelectionnee.ID;
            Reference   = varReferenceSelectionnee.Title
        );
        QuantitePieces
    );
    "[$-fr-FR]# ##0"
) & " pcs"


// ─────────────────────────────────────────────
// GALERIE LOTS (droite) : galLots
// ─────────────────────────────────────────────

// Items
Trier(
    Filtrer(colPalettes;
        Commande.Id = varCommandeSelectionnee.ID;
        Reference   = varReferenceSelectionnee.Title
    );
    Title;
    OrdreTri.Croissant
)

// Label numéro de lot — Text
"Lot : " & CetElément.Title

// Label quantité pièces — Text
Texte(CetElément.QuantitePieces; "[$-fr-FR]# ##0") & " pièces"

// Label cartons — Text
Texte(CetElément.NombreCartons; "[$-fr-FR]# ##0") & " cartons"

// Label poids — Text
Texte(CetElément.Poids; "[$-fr-FR]0,00") & " kg"


// ─────────────────────────────────────────────
// TOTAL LOTS DE LA RÉFÉRENCE
// ─────────────────────────────────────────────
// Text
"Total : " & Texte(
    Somme(
        Filtrer(colPalettes;
            Commande.Id = varCommandeSelectionnee.ID;
            Reference   = varReferenceSelectionnee.Title
        );
        QuantitePieces
    );
    "[$-fr-FR]# ##0"
) & " pcs  |  " & Texte(
    Somme(
        Filtrer(colPalettes;
            Commande.Id = varCommandeSelectionnee.ID;
            Reference   = varReferenceSelectionnee.Title
        );
        NombreCartons
    );
    "[$-fr-FR]# ##0"
) & " ctn  |  " & Texte(
    Somme(
        Filtrer(colPalettes;
            Commande.Id = varCommandeSelectionnee.ID;
            Reference   = varReferenceSelectionnee.Title
        );
        Poids
    );
    "[$-fr-FR]0,00"
) & " kg"
