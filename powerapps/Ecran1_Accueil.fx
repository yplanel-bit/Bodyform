// ============================================================
// ÉCRAN 1 — ACCUEIL
// Fichier : Ecran1_Accueil.fx
// ============================================================
// Nommage des contrôles recommandé :
//   galClients           → galerie des clients (gauche)
//   galCommandesClient   → galerie des commandes du client sélectionné (droite)
//   rectProgGlobalFond   → rectangle fond barre progression globale
//   rectProgGlobalRempli → rectangle rempli barre progression globale
//   lblPourcentageGlobal → label % global
//   lblTitreClient       → label titre client sélectionné
//   panneauDroite        → groupe ou rectangle délimitant la zone droite
// ============================================================


// ─────────────────────────────────────────────
// APP.OnStart
// ─────────────────────────────────────────────
// Chargement des données et initialisation des variables
Collect(colClients,   Clients);
Collect(colCommandes, Commandes);
Collect(colPieces,    Pieces);
Collect(colPalettes,  Palettes);
Set(varClientSelectionne,    Blank());
Set(varCommandeSelectionnee, Blank());
Set(varReferenceSelectionnee, Blank())


// ─────────────────────────────────────────────
// GALERIE : galClients
// ─────────────────────────────────────────────

// Items
Sort(colClients, Title, SortOrder.Ascending)

// Hauteur du template
72

// Rectangle de fond (sélection active)
// Fill
If(ThisItem.ID = varClientSelectionne.ID, RGBA(255, 255, 255, 0.15), Transparent)

// Label nom du client
// Text
ThisItem.Title
// FontSize
16
// FontWeight
FontWeight.Semibold

// Séparateur bas de template
// Fill
RGBA(255, 255, 255, 0.08)

// OnSelect de la galerie
Set(varClientSelectionne, ThisItem);
Set(varCommandeSelectionnee, Blank());
Set(varReferenceSelectionnee, Blank())


// ─────────────────────────────────────────────
// PANNEAU DROITE — Visible
// ─────────────────────────────────────────────
Visible : !IsBlank(varClientSelectionne)


// ─────────────────────────────────────────────
// LABEL TITRE CLIENT SÉLECTIONNÉ : lblTitreClient
// ─────────────────────────────────────────────
// Text
varClientSelectionne.Title
// FontSize
22
// FontWeight
FontWeight.Bold


// ─────────────────────────────────────────────
// BARRE DE PROGRESSION GLOBALE CLIENT
// ─────────────────────────────────────────────

// Variable locale pour éviter la duplication de calcul
// (à placer dans le OnVisible de l'écran ou en variable)
// OnVisible de Ecran1_Accueil :
With(
    {
        att:  Sum(Filter(colPieces,   Commande.Client.Id = varClientSelectionne.ID), QuantiteAttendue),
        pret: Sum(Filter(colPalettes, Commande.Client.Id = varClientSelectionne.ID), QuantitePieces)
    },
    Set(varProgGlobalClient, If(att > 0, pret / att, 0));
    Set(varProgGlobalClientAtt,  att);
    Set(varProgGlobalClientPret, pret)
)

// rectProgGlobalFond — Width
panneauDroite.Width - 48
// rectProgGlobalFond — Height
14
// rectProgGlobalFond — Fill
RGBA(200, 200, 200, 0.3)
// rectProgGlobalFond — RadiusTopLeft / RadiusTopRight / etc.
7

// rectProgGlobalRempli — Width
(panneauDroite.Width - 48) * varProgGlobalClient
// rectProgGlobalRempli — Height
14
// rectProgGlobalRempli — Fill
RGBA(0, 120, 210, 1)
// rectProgGlobalRempli — RadiusTopLeft / etc.
7

// lblPourcentageGlobal — Text
Text(varProgGlobalClient * 100, "[$-fr-FR]0.0") & " %  (" &
Text(varProgGlobalClientPret, "[$-fr-FR]#,##0") & " / " &
Text(varProgGlobalClientAtt,  "[$-fr-FR]#,##0") & " pièces)"


// ─────────────────────────────────────────────
// GALERIE : galCommandesClient
// ─────────────────────────────────────────────

// Items
Sort(
    Filter(colCommandes, Client.Id = varClientSelectionne.ID),
    DateLivraison,
    SortOrder.Ascending
)

// Hauteur du template
90

// Label numéro de commande
// Text
ThisItem.Title
// FontWeight
FontWeight.Semibold

// Label date de livraison
// Text
"Livraison : " & Text(ThisItem.DateLivraison, "[$-fr-FR]dd/mm/yyyy")

// Badge statut — Fill (couleur de fond)
Switch(
    ThisItem.Statut.Value,
    "Complète",       RGBA(0,  200, 100, 1),
    "En cours",       RGBA(255,165,   0, 1),
    "Pas commencé",   RGBA(200,  50,  50, 1),
                      RGBA(150, 150, 150, 1)
)

// Badge statut — Text
ThisItem.Statut.Value

// Barre progression commande — Fond — Width
Parent.TemplateWidth - 24
// Barre progression commande — Fond — Height
6
// Barre progression commande — Fond — Fill
RGBA(200, 200, 200, 0.3)

// Barre progression commande — Remplie — Width
(Parent.TemplateWidth - 24) * With(
    {
        att:  Sum(Filter(colPieces,   Commande.Id = ThisItem.ID), QuantiteAttendue),
        pret: Sum(Filter(colPalettes, Commande.Id = ThisItem.ID), QuantitePieces)
    },
    If(att > 0, pret / att, 0)
)
// Barre progression commande — Remplie — Fill
RGBA(0, 180, 120, 1)

// Label % commande
// Text
Text(
    With(
        {
            att:  Sum(Filter(colPieces,   Commande.Id = ThisItem.ID), QuantiteAttendue),
            pret: Sum(Filter(colPalettes, Commande.Id = ThisItem.ID), QuantitePieces)
        },
        If(att > 0, pret / att * 100, 0)
    ),
    "[$-fr-FR]0"
) & " %"

// OnSelect de galCommandesClient
Set(varCommandeSelectionnee, ThisItem);
Navigate(Ecran2_DetailCommande, ScreenTransition.Fade)
