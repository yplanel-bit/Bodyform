// ============================================================
// ÉCRAN 1 — ACCUEIL (syntaxe FR)
// ============================================================
// NOTE IMPORTANTE — Syntaxe PowerApps FR :
//   • Séparateur de paramètres : point-virgule  (;)
//   • Séparateur décimal       : virgule        (0,3)
//   • Fonctions traduites      : Filtrer / Trier / Somme / Si / EstVide / Vide /
//                                Avec / Définir / Naviguer / Collecter /
//                                EffacerCollecte / Simultané / Texte / Maintenant
//   • Énumérations             : OrdreTri.Croissant · TransitionÉcran.Fondu
// ============================================================


// ─────────────────────────────────────────────
// APP.OnStart
// ─────────────────────────────────────────────
Simultané(
    Collecter(colClients;   Clients);
    Collecter(colCommandes; Commandes);
    Collecter(colPieces;    Pieces);
    Collecter(colPalettes;  Palettes)
);
Définir(varClientSelectionne;     Vide());
Définir(varCommandeSelectionnee;  Vide());
Définir(varReferenceSelectionnee; Vide())


// ─────────────────────────────────────────────
// GALERIE : galClients
// ─────────────────────────────────────────────

// Items
Trier(colClients; Title; OrdreTri.Croissant)

// Rectangle de sélection active — Fill
Si(CetElément.ID = varClientSelectionne.ID; RVBA(255; 255; 255; 0,15); Transparent)

// Label nom du client — Text
CetElément.Title

// OnSelect de la galerie
Définir(varClientSelectionne; CetElément);
Définir(varCommandeSelectionnee; Vide());
Définir(varReferenceSelectionnee; Vide())


// ─────────────────────────────────────────────
// PANNEAU DROITE — Visible
// ─────────────────────────────────────────────
Non(EstVide(varClientSelectionne))


// ─────────────────────────────────────────────
// LABEL TITRE CLIENT SÉLECTIONNÉ
// ─────────────────────────────────────────────
// Text
varClientSelectionne.Title


// ─────────────────────────────────────────────
// BARRE DE PROGRESSION GLOBALE CLIENT
// ─────────────────────────────────────────────

// OnVisible de l'écran (recalcul à chaque affichage) :
Avec(
    {
        att:  Somme(Filtrer(colPieces;   Commande.Client.Id = varClientSelectionne.ID); QuantiteAttendue);
        pret: Somme(Filtrer(colPalettes; Commande.Client.Id = varClientSelectionne.ID); QuantitePieces)
    };
    Définir(varProgGlobalClient;    Si(att > 0; pret / att; 0));
    Définir(varProgGlobalClientAtt;  att);
    Définir(varProgGlobalClientPret; pret)
)

// rectProgGlobalFond — Fill
RVBA(200; 200; 200; 0,3)

// rectProgGlobalRempli — Width
(panneauDroite.Width - 48) * varProgGlobalClient
// rectProgGlobalRempli — Fill
RVBA(0; 120; 210; 1)

// lblPourcentageGlobal — Text
Texte(varProgGlobalClient * 100; "[$-fr-FR]0,0") & " %  (" &
Texte(varProgGlobalClientPret; "[$-fr-FR]# ##0") & " / " &
Texte(varProgGlobalClientAtt;  "[$-fr-FR]# ##0") & " pièces)"


// ─────────────────────────────────────────────
// GALERIE : galCommandesClient
// ─────────────────────────────────────────────

// Items
Trier(
    Filtrer(colCommandes; Client.Id = varClientSelectionne.ID);
    DateLivraison;
    OrdreTri.Croissant
)

// Label numéro de commande — Text
CetElément.Title

// Label date de livraison — Text
"Livraison : " & Texte(CetElément.DateLivraison; "[$-fr-FR]jj/mm/aaaa")

// Badge statut — Fill
Basculer(
    CetElément.Statut.Value;
    "Complète";       RVBA(0;   200; 100; 1);
    "En cours";       RVBA(255; 165;   0; 1);
    "Pas commencé";   RVBA(200;  50;  50; 1);
                      RVBA(150; 150; 150; 1)
)

// Badge statut — Text
CetElément.Statut.Value

// Barre progression commande — Fond — Fill
RVBA(200; 200; 200; 0,3)

// Barre progression commande — Remplie — Width
(Parent.TemplateWidth - 24) * Avec(
    {
        att:  Somme(Filtrer(colPieces;   Commande.Id = CetElément.ID); QuantiteAttendue);
        pret: Somme(Filtrer(colPalettes; Commande.Id = CetElément.ID); QuantitePieces)
    };
    Si(att > 0; pret / att; 0)
)
// Barre progression commande — Remplie — Fill
RVBA(0; 180; 120; 1)

// Label % commande — Text
Texte(
    Avec(
        {
            att:  Somme(Filtrer(colPieces;   Commande.Id = CetElément.ID); QuantiteAttendue);
            pret: Somme(Filtrer(colPalettes; Commande.Id = CetElément.ID); QuantitePieces)
        };
        Si(att > 0; pret / att * 100; 0)
    );
    "[$-fr-FR]0"
) & " %"

// OnSelect de galCommandesClient
Définir(varCommandeSelectionnee; CetElément);
Naviguer(Ecran2_DetailCommande; TransitionÉcran.Fondu)
