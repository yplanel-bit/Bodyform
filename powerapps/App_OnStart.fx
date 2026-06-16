// ============================================================
// APP.OnStart — Initialisation globale (syntaxe FR)
// ============================================================

// ─────────────────────────────────────────────
// 1. CHARGEMENT DES DONNÉES SHAREPOINT
// ─────────────────────────────────────────────
Simultané(
    Collecter(colClients,   Clients),
    Collecter(colCommandes, Commandes),
    Collecter(colPieces,    Pieces),
    Collecter(colPalettes,  Palettes)
);

// ─────────────────────────────────────────────
// 2. INITIALISATION DES VARIABLES DE NAVIGATION
// ─────────────────────────────────────────────
Définir(varClientSelectionne,     Vide());
Définir(varCommandeSelectionnee,  Vide());
Définir(varReferenceSelectionnee, Vide());

Définir(varProgGlobalClient,      0);
Définir(varProgGlobalClientAtt,   0);
Définir(varProgGlobalClientPret,  0);

Définir(varBLTotalAttendu,  0);
Définir(varBLTotalPrets,    0);
Définir(varBLTotalCartons,  0);
Définir(varBLTotalPoids,    0);

EffacerCollecte(colBLDetail, Vide())


// ─────────────────────────────────────────────
// 3. BOUTON RAFRAÎCHISSEMENT (OnSelect)
// ─────────────────────────────────────────────
Simultané(
    EffacerCollecte(colClients,   Clients),
    EffacerCollecte(colCommandes, Commandes),
    EffacerCollecte(colPieces,    Pieces),
    EffacerCollecte(colPalettes,  Palettes)
);
Notifier("Données actualisées ✓"; TypeNotification.Succès)


// ─────────────────────────────────────────────
// 4. RÉSUMÉ DES COLLECTIONS
// ─────────────────────────────────────────────
// colClients    → ID, Title
// colCommandes  → ID, Title, Client{Id,Value}, DateCommande, DateLivraison, Statut{Value}
// colPieces     → ID, Title, Commande{Id,Value}, QuantiteAttendue, NombreCartons, Poids
// colPalettes   → ID, Title, Commande{Id,Value}, Reference, QuantitePieces, NombreCartons, Poids
// colBLDetail   → collection temporaire bon de livraison (reconstruite sur Écran 4)


// ─────────────────────────────────────────────
// 5. FORMULES UTILITAIRES
// ─────────────────────────────────────────────

// --- Progression d'une commande (remplacer CommandeID) ---
// Avec(
//     {
//         att:  Somme(Filtrer(colPieces;   Commande.Id = CommandeID); QuantiteAttendue);
//         pret: Somme(Filtrer(colPalettes; Commande.Id = CommandeID); QuantitePieces)
//     };
//     Si(att > 0; pret / att; 0)
// )

// --- Progression d'une référence dans une commande ---
// Avec(
//     {
//         att:  RechercherV(colPieces; Commande.Id = CommandeID && Title = RefTitle; QuantiteAttendue);
//         pret: Somme(Filtrer(colPalettes; Commande.Id = CommandeID; Reference = RefTitle); QuantitePieces)
//     };
//     Si(att > 0; pret / att; 0)
// )

// --- Progression globale d'un client ---
// Avec(
//     {
//         att:  Somme(Filtrer(colPieces;   Commande.Client.Id = ClientID); QuantiteAttendue);
//         pret: Somme(Filtrer(colPalettes; Commande.Client.Id = ClientID); QuantitePieces)
//     };
//     Si(att > 0; pret / att; 0)
// )


// ─────────────────────────────────────────────
// 6. PALETTE DE COULEURS
// ─────────────────────────────────────────────
// Statut "Complète"     → RVBA(0;   200; 100; 1)  — vert
// Statut "En cours"     → RVBA(255; 165;   0; 1)  — orange
// Statut "Pas commencé" → RVBA(200;  50;  50; 1)  — rouge
// Barre progression (remplie)  → RVBA(0; 180; 120; 1)
// Barre progression (fond)     → RVBA(200; 200; 200; 0,3)
// Boutons bleus                → RVBA(0; 120; 210; 1)
// Accent orange (références)   → RVBA(255; 140; 0; 1)

// NOTE : En PowerApps FR, le séparateur de paramètres est le point-virgule (;)
//        et les décimales utilisent la virgule (0,3 au lieu de 0.3)
