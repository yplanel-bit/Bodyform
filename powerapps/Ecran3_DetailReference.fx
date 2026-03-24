// ============================================================
// ÉCRAN 3 — DÉTAIL RÉFÉRENCE
// Fichier : Ecran3_DetailReference.fx
// ============================================================
// Nommage des contrôles recommandé :
//   btnRetour3           → bouton retour vers Écran 2
//   lblTitreEcran3       → titre de l'écran
//   galReferencesDetail  → galerie références (gauche) avec barres de progression
//   galLots              → galerie lots de la référence sélectionnée (droite)
//   panneauDroite3       → zone droite
// ============================================================


// ─────────────────────────────────────────────
// ONVISIBLE de l'écran
// ─────────────────────────────────────────────
// Ré-initialise la référence sélectionnée si besoin
// (laisse varReferenceSelectionnee intacte pour afficher directement la ref cliquée)


// ─────────────────────────────────────────────
// BOUTON RETOUR : btnRetour3
// ─────────────────────────────────────────────
// Text
"← Retour"
// OnSelect
Navigate(Ecran2_DetailCommande, ScreenTransition.Back)


// ─────────────────────────────────────────────
// LABEL TITRE : lblTitreEcran3
// ─────────────────────────────────────────────
// Text
"Commande " & varCommandeSelectionnee.Title & " — Références"
// FontSize
20
// FontWeight
FontWeight.Bold


// ─────────────────────────────────────────────
// GALERIE RÉFÉRENCES (gauche) : galReferencesDetail
// ─────────────────────────────────────────────

// Items
Sort(
    Filter(colPieces, Commande.Id = varCommandeSelectionnee.ID),
    Title,
    SortOrder.Ascending
)

// Hauteur du template
110

// Rectangle sélection active — Fill
If(ThisItem.ID = varReferenceSelectionnee.ID, RGBA(255,255,255,0.18), Transparent)

// Label référence
// Text
ThisItem.Title
// FontSize
15
// FontWeight
FontWeight.Semibold

// Label pièces attendues / prêtes
// Text
With(
    {
        att:  ThisItem.QuantiteAttendue,
        pret: Sum(
            Filter(colPalettes,
                Commande.Id = varCommandeSelectionnee.ID,
                Reference   = ThisItem.Title
            ),
            QuantitePieces
        )
    },
    Text(pret, "[$-fr-FR]#,##0") & " / " & Text(att, "[$-fr-FR]#,##0") & " pcs"
)

// Label cartons
// Text
"Cartons : " & Text(ThisItem.NombreCartons, "[$-fr-FR]#,##0")

// Barre progression — Fond — Width
Parent.TemplateWidth - 24
// Barre progression — Fond — Height
8
// Barre progression — Fond — Fill
RGBA(200, 200, 200, 0.3)

// Barre progression — Remplie — Width
(Parent.TemplateWidth - 24) * With(
    {
        att:  ThisItem.QuantiteAttendue,
        pret: Sum(
            Filter(colPalettes,
                Commande.Id = varCommandeSelectionnee.ID,
                Reference   = ThisItem.Title
            ),
            QuantitePieces
        )
    },
    If(att > 0, pret / att, 0)
)
// Barre progression — Remplie — Fill
RGBA(255, 140, 0, 1)

// Label % progression
// Text
With(
    {
        att:  ThisItem.QuantiteAttendue,
        pret: Sum(
            Filter(colPalettes,
                Commande.Id = varCommandeSelectionnee.ID,
                Reference   = ThisItem.Title
            ),
            QuantitePieces
        )
    },
    Text(If(att > 0, pret / att * 100, 0), "[$-fr-FR]0") & " %"
)
// FontSize
11
// Color
RGBA(150, 150, 150, 1)

// OnSelect — affiche les lots à droite
Set(varReferenceSelectionnee, ThisItem)


// ─────────────────────────────────────────────
// PANNEAU DROITE — Visible
// ─────────────────────────────────────────────
Visible : !IsBlank(varReferenceSelectionnee)


// ─────────────────────────────────────────────
// LABEL TITRE RÉFÉRENCE SÉLECTIONNÉE
// ─────────────────────────────────────────────
// Text
"Référence : " & varReferenceSelectionnee.Title
// FontSize
18
// FontWeight
FontWeight.Semibold


// ─────────────────────────────────────────────
// LABEL RÉCAPITULATIF RÉFÉRENCE
// ─────────────────────────────────────────────
// Text
"Attendu : " & Text(varReferenceSelectionnee.QuantiteAttendue, "[$-fr-FR]#,##0") &
" pcs  |  Prêtes : " & Text(
    Sum(
        Filter(colPalettes,
            Commande.Id = varCommandeSelectionnee.ID,
            Reference   = varReferenceSelectionnee.Title
        ),
        QuantitePieces
    ),
    "[$-fr-FR]#,##0"
) & " pcs"


// ─────────────────────────────────────────────
// GALERIE LOTS (droite) : galLots
// ─────────────────────────────────────────────

// Items
Sort(
    Filter(colPalettes,
        Commande.Id = varCommandeSelectionnee.ID,
        Reference   = varReferenceSelectionnee.Title
    ),
    Title,
    SortOrder.Ascending
)

// Hauteur du template
80

// Rectangle fond — Fill
RGBA(255, 255, 255, 0.05)

// Label numéro de lot
// Text
"Lot : " & ThisItem.Title
// FontSize
14
// FontWeight
FontWeight.Semibold

// Label quantité pièces
// Text
Text(ThisItem.QuantitePieces, "[$-fr-FR]#,##0") & " pièces"
// FontSize
13

// Label cartons
// Text
Text(ThisItem.NombreCartons, "[$-fr-FR]#,##0") & " cartons"
// FontSize
12

// Label poids
// Text
Text(ThisItem.Poids, "[$-fr-FR]0.00") & " kg"
// FontSize
12

// Séparateur bas
// Fill
RGBA(255, 255, 255, 0.08)


// ─────────────────────────────────────────────
// TOTAL LOTS DE LA RÉFÉRENCE (bas du panneau droite)
// ─────────────────────────────────────────────

// Label total pièces de la référence
// Text
"Total : " & Text(
    Sum(
        Filter(colPalettes,
            Commande.Id = varCommandeSelectionnee.ID,
            Reference   = varReferenceSelectionnee.Title
        ),
        QuantitePieces
    ),
    "[$-fr-FR]#,##0"
) & " pcs  |  " & Text(
    Sum(
        Filter(colPalettes,
            Commande.Id = varCommandeSelectionnee.ID,
            Reference   = varReferenceSelectionnee.Title
        ),
        NombreCartons
    ),
    "[$-fr-FR]#,##0"
) & " ctn  |  " & Text(
    Sum(
        Filter(colPalettes,
            Commande.Id = varCommandeSelectionnee.ID,
            Reference   = varReferenceSelectionnee.Title
        ),
        Poids
    ),
    "[$-fr-FR]0.00"
) & " kg"
// FontWeight
FontWeight.Semibold
