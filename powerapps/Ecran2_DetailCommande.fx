// ============================================================
// ÉCRAN 2 — DÉTAIL COMMANDE
// Fichier : Ecran2_DetailCommande.fx
// ============================================================
// Nommage des contrôles recommandé :
//   btnRetour2           → bouton retour vers Écran 1
//   lblTitreEcran2       → titre de l'écran
//   galCommandesDetail   → galerie commandes client (gauche)
//   galReferences        → galerie références de la commande sélectionnée (droite)
//   panneauDroite2       → zone droite (visible si commande sélectionnée)
//   btnBonLivraison      → bouton "Bon de livraison"
// ============================================================


// ─────────────────────────────────────────────
// ONVISIBLE de l'écran
// ─────────────────────────────────────────────
// Ré-initialise la référence sélectionnée à l'arrivée sur cet écran
Set(varReferenceSelectionnee, Blank())


// ─────────────────────────────────────────────
// BOUTON RETOUR : btnRetour2
// ─────────────────────────────────────────────
// Text
"← Retour"
// OnSelect
Navigate(Ecran1_Accueil, ScreenTransition.Back)


// ─────────────────────────────────────────────
// LABEL TITRE : lblTitreEcran2
// ─────────────────────────────────────────────
// Text
varClientSelectionne.Title & " — Commandes"
// FontSize
20
// FontWeight
FontWeight.Bold


// ─────────────────────────────────────────────
// GALERIE COMMANDES (gauche) : galCommandesDetail
// ─────────────────────────────────────────────

// Items
Sort(
    Filter(colCommandes, Client.Id = varClientSelectionne.ID),
    DateLivraison,
    SortOrder.Ascending
)

// Hauteur du template
100

// Rectangle sélection active — Fill
If(ThisItem.ID = varCommandeSelectionnee.ID, RGBA(255,255,255,0.18), Transparent)

// Label numéro commande
// Text
ThisItem.Title
// FontWeight
FontWeight.Semibold
// FontSize
15

// Label date livraison
// Text
"Livraison : " & Text(ThisItem.DateLivraison, "[$-fr-FR]dd/mm/yyyy")
// FontSize
12

// Badge statut — Fill
Switch(
    ThisItem.Statut.Value,
    "Complète",     RGBA(0,  200, 100, 1),
    "En cours",     RGBA(255,165,   0, 1),
    "Pas commencé", RGBA(200,  50,  50, 1),
                    RGBA(150, 150, 150, 1)
)
// Badge statut — Text
ThisItem.Statut.Value

// Barre progression — Fond — Width
Parent.TemplateWidth - 24
// Barre progression — Fond — Height
8
// Barre progression — Fond — Fill
RGBA(200, 200, 200, 0.3)

// Barre progression — Remplie — Width
(Parent.TemplateWidth - 24) * With(
    {
        att:  Sum(Filter(colPieces,   Commande.Id = ThisItem.ID), QuantiteAttendue),
        pret: Sum(Filter(colPalettes, Commande.Id = ThisItem.ID), QuantitePieces)
    },
    If(att > 0, pret / att, 0)
)
// Barre progression — Remplie — Fill
RGBA(0, 180, 120, 1)

// Label pourcentage progression
// Text
With(
    {
        att:  Sum(Filter(colPieces,   Commande.Id = ThisItem.ID), QuantiteAttendue),
        pret: Sum(Filter(colPalettes, Commande.Id = ThisItem.ID), QuantitePieces)
    },
    Text(If(att > 0, pret / att * 100, 0), "[$-fr-FR]0") & " %  (" &
    Text(pret, "[$-fr-FR]#,##0") & " / " & Text(att, "[$-fr-FR]#,##0") & ")"
)

// OnSelect — sélectionne la commande (pas de navigation, affichage à droite)
Set(varCommandeSelectionnee, ThisItem);
Set(varReferenceSelectionnee, Blank())


// ─────────────────────────────────────────────
// PANNEAU DROITE — Visible
// ─────────────────────────────────────────────
Visible : !IsBlank(varCommandeSelectionnee)


// ─────────────────────────────────────────────
// LABEL TITRE COMMANDE SÉLECTIONNÉE
// ─────────────────────────────────────────────
// Text
"Commande : " & varCommandeSelectionnee.Title & "  —  Livraison : " &
Text(varCommandeSelectionnee.DateLivraison, "[$-fr-FR]dd/mm/yyyy")
// FontSize
15
// FontWeight
FontWeight.Semibold


// ─────────────────────────────────────────────
// GALERIE RÉFÉRENCES (droite) : galReferences
// ─────────────────────────────────────────────

// Items
Sort(
    Filter(colPieces, Commande.Id = varCommandeSelectionnee.ID),
    Title,
    SortOrder.Ascending
)

// Hauteur du template
110

// Rectangle fond — Fill
RGBA(255, 255, 255, 0.05)

// Label référence
// Text
ThisItem.Title
// FontSize
14
// FontWeight
FontWeight.Semibold

// Label quantité attendue
// Text
"Attendu : " & Text(ThisItem.QuantiteAttendue, "[$-fr-FR]#,##0") & " pcs"

// Label pièces prêtes
// Text
"Prêtes : " & Text(
    Sum(
        Filter(colPalettes,
            Commande.Id = varCommandeSelectionnee.ID,
            Reference   = ThisItem.Title
        ),
        QuantitePieces
    ),
    "[$-fr-FR]#,##0"
) & " pcs"

// Label cartons
// Text
"Cartons : " & Text(ThisItem.NombreCartons, "[$-fr-FR]#,##0")

// Label poids
// Text
"Poids : " & Text(ThisItem.Poids, "[$-fr-FR]0.00") & " kg"

// Barre progression référence — Fond — Width
Parent.TemplateWidth - 24
// Barre progression référence — Fond — Height
6
// Barre progression référence — Fond — Fill
RGBA(200, 200, 200, 0.3)

// Barre progression référence — Remplie — Width
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
// Barre progression référence — Remplie — Fill
RGBA(255, 140, 0, 1)

// OnSelect — navigate vers détail référence
Set(varReferenceSelectionnee, ThisItem);
Navigate(Ecran3_DetailReference, ScreenTransition.Fade)


// ─────────────────────────────────────────────
// BOUTON BON DE LIVRAISON : btnBonLivraison
// ─────────────────────────────────────────────
// Text
"📄 Bon de livraison"
// Visible
!IsBlank(varCommandeSelectionnee)
// OnSelect
Navigate(Ecran4_BonDeLivraison, ScreenTransition.Fade)
// Fill
RGBA(0, 120, 210, 1)
// Color (texte)
White
// BorderRadius
8
