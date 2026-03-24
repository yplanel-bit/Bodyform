// ============================================================
// APP.OnStart — Initialisation globale
// Fichier : App_OnStart.fx
// ============================================================
// Ce fichier contient toutes les formules à placer dans la
// propriété OnStart de l'objet App dans PowerApps Studio.
// ============================================================

// ─────────────────────────────────────────────
// 1. CHARGEMENT DES DONNÉES SHAREPOINT
// ─────────────────────────────────────────────
// Charge toutes les données en mémoire locale pour des
// performances optimales et moins d'appels réseau répétés.

Concurrent(
    Collect(colClients,   Clients),
    Collect(colCommandes, Commandes),
    Collect(colPieces,    Pieces),
    Collect(colPalettes,  Palettes)
);

// ─────────────────────────────────────────────
// 2. INITIALISATION DES VARIABLES DE NAVIGATION
// ─────────────────────────────────────────────
Set(varClientSelectionne,     Blank());
Set(varCommandeSelectionnee,  Blank());
Set(varReferenceSelectionnee, Blank());

// Variables de progression globale (initialisées à 0)
Set(varProgGlobalClient,         0);
Set(varProgGlobalClientAtt,      0);
Set(varProgGlobalClientPret,     0);

// Variables totaux bon de livraison
Set(varBLTotalAttendu,  0);
Set(varBLTotalPrets,    0);
Set(varBLTotalCartons,  0);
Set(varBLTotalPoids,    0);

// Collection dénormalisée pour le bon de livraison
ClearCollect(colBLDetail, Blank())


// ─────────────────────────────────────────────
// 3. BOUTON DE RAFRAÎCHISSEMENT DES DONNÉES
// ─────────────────────────────────────────────
// À placer sur le OnSelect d'un bouton "Rafraîchir" (icône sync)
// disponible sur tous les écrans :

Concurrent(
    ClearCollect(colClients,   Clients),
    ClearCollect(colCommandes, Commandes),
    ClearCollect(colPieces,    Pieces),
    ClearCollect(colPalettes,  Palettes)
);
Notify("Données actualisées ✓", NotificationType.Success)


// ─────────────────────────────────────────────
// 4. RÉSUMÉ DES COLLECTIONS DISPONIBLES
// ─────────────────────────────────────────────
// colClients    → tous les clients (champs: ID, Title)
// colCommandes  → toutes les commandes (champs: ID, Title, Client{Id,Value}, DateCommande, DateLivraison, Statut{Value})
// colPieces     → toutes les pièces (champs: ID, Title, Commande{Id,Value}, QuantiteAttendue, NombreCartons, Poids)
// colPalettes   → toutes les palettes (champs: ID, Title, Commande{Id,Value}, Reference, QuantitePieces, NombreCartons, Poids)
// colBLDetail   → collection temporaire pour le bon de livraison (reconstruite à l'arrivée sur Écran4)


// ─────────────────────────────────────────────
// 5. FORMULES UTILITAIRES (à réutiliser partout)
// ─────────────────────────────────────────────

// --- Calcul de la progression d'une commande ---
// (remplacer CommandeID par l'ID de la commande souhaitée)
//
// With(
//     {
//         att:  Sum(Filter(colPieces,   Commande.Id = CommandeID), QuantiteAttendue),
//         pret: Sum(Filter(colPalettes, Commande.Id = CommandeID), QuantitePieces)
//     },
//     If(att > 0, pret / att, 0)
// )

// --- Calcul de la progression d'une référence dans une commande ---
//
// With(
//     {
//         att:  LookUp(colPieces, Commande.Id = CommandeID && Title = RefTitle, QuantiteAttendue),
//         pret: Sum(Filter(colPalettes, Commande.Id = CommandeID, Reference = RefTitle), QuantitePieces)
//     },
//     If(att > 0, pret / att, 0)
// )

// --- Calcul de la progression globale d'un client ---
//
// With(
//     {
//         att:  Sum(Filter(colPieces,   Commande.Client.Id = ClientID), QuantiteAttendue),
//         pret: Sum(Filter(colPalettes, Commande.Client.Id = ClientID), QuantitePieces)
//     },
//     If(att > 0, pret / att, 0)
// )


// ─────────────────────────────────────────────
// 6. COULEURS DE STATUT (constantes de charte)
// ─────────────────────────────────────────────
//
// Statut "Complète"     → RGBA(0,   200, 100, 1)  — vert
// Statut "En cours"     → RGBA(255, 165,   0, 1)  — orange
// Statut "Pas commencé" → RGBA(200,  50,  50, 1)  — rouge
// Statut inconnu        → RGBA(150, 150, 150, 1)  — gris
//
// Barre progression (remplie)  → RGBA(0, 180, 120, 1)  — vert menthe
// Barre progression (fond)     → RGBA(200, 200, 200, 0.3)
// Accent bleu (boutons)        → RGBA(0, 120, 210, 1)
// Accent orange (références)   → RGBA(255, 140, 0, 1)
