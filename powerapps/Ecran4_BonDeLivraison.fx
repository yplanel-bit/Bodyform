// ============================================================
// ÉCRAN 4 — BON DE LIVRAISON
// Fichier : Ecran4_BonDeLivraison.fx
// ============================================================
// Nommage des contrôles recommandé :
//   btnRetour4           → bouton retour vers Écran 2
//   btnImprimer          → bouton d'impression
//   lblEnTeteClient      → nom du client
//   lblEnTeteCommande    → numéro de commande
//   lblEnTeteDate        → date de livraison
//   lblTotalPieces       → total pièces attendues
//   lblTotalPrets        → total pièces prêtes
//   lblTotalCartons      → total cartons
//   lblTotalPoids        → poids total
//   galBonLivraison      → galerie des références avec leurs lots
// ============================================================


// ─────────────────────────────────────────────
// ONVISIBLE de l'écran
// ─────────────────────────────────────────────
// Précalcul des totaux globaux de la commande pour performances
With(
    {
        palettesCommande: Filter(colPalettes, Commande.Id = varCommandeSelectionnee.ID),
        piecesCommande:   Filter(colPieces,   Commande.Id = varCommandeSelectionnee.ID)
    },
    Set(varBLTotalAttendu,  Sum(piecesCommande,    QuantiteAttendue));
    Set(varBLTotalPrets,    Sum(palettesCommande,  QuantitePieces));
    Set(varBLTotalCartons,  Sum(palettesCommande,  NombreCartons));
    Set(varBLTotalPoids,    Sum(palettesCommande,  Poids))
)


// ─────────────────────────────────────────────
// BOUTON RETOUR : btnRetour4
// ─────────────────────────────────────────────
// Text
"← Retour"
// OnSelect
Navigate(Ecran2_DetailCommande, ScreenTransition.Back)


// ─────────────────────────────────────────────
// EN-TÊTE DU BON DE LIVRAISON
// ─────────────────────────────────────────────

// Titre principal
// Text
"BON DE LIVRAISON"
// FontSize
24
// FontWeight
FontWeight.Bold
// Align
Align.Center

// lblEnTeteClient — Text
varClientSelectionne.Title
// FontSize
18
// FontWeight
FontWeight.Semibold

// lblEnTeteCommande — Text
"Commande N° " & varCommandeSelectionnee.Title
// FontSize
16

// lblEnTeteDate — Text
"Date de livraison : " & Text(varCommandeSelectionnee.DateLivraison, "[$-fr-FR]dd/mm/yyyy")
// FontSize
14

// lblDateGeneration — Text
"Généré le : " & Text(Now(), "[$-fr-FR]dd/mm/yyyy hh:mm")
// FontSize
12
// Color
RGBA(120, 120, 120, 1)


// ─────────────────────────────────────────────
// BLOC TOTAUX
// ─────────────────────────────────────────────

// lblTotalPieces — Text
"Total pièces attendues : " & Text(varBLTotalAttendu, "[$-fr-FR]#,##0")
// FontSize
14

// lblTotalPrets — Text
"Total pièces prêtes : " & Text(varBLTotalPrets, "[$-fr-FR]#,##0")
// FontSize
14
// Color
If(varBLTotalPrets >= varBLTotalAttendu, RGBA(0, 180, 100, 1), RGBA(200, 100, 0, 1))

// lblTotalCartons — Text
"Total cartons : " & Text(varBLTotalCartons, "[$-fr-FR]#,##0")
// FontSize
14

// lblTotalPoids — Text
"Poids total : " & Text(varBLTotalPoids, "[$-fr-FR]0.00") & " kg"
// FontSize
14
// FontWeight
FontWeight.Semibold


// ─────────────────────────────────────────────
// GALERIE PRINCIPALES (références) : galBonLivraison
// ─────────────────────────────────────────────

// Items
Sort(
    Filter(colPieces, Commande.Id = varCommandeSelectionnee.ID),
    Title,
    SortOrder.Ascending
)

// IMPORTANT : La hauteur du template doit être auto-ajustable ou suffisamment grande
// pour contenir la sous-galerie des lots. Recommandé : 200 + (nb lots × 50)
// En pratique, utiliser une galerie Flexible Height si disponible dans ta version PowerApps.

// Hauteur du template (fixe, à adapter selon nb de lots)
200

// ── CONTENU DU TEMPLATE ──

// Rectangle séparateur haut
// Fill
RGBA(200, 200, 200, 0.4)
// Height
1

// Label référence
// Text
ThisItem.Title
// FontSize
15
// FontWeight
FontWeight.Bold

// Label quantité attendue
// Text
"Attendu : " & Text(ThisItem.QuantiteAttendue, "[$-fr-FR]#,##0") & " pièces"
// FontSize
13

// Label pièces prêtes pour cette référence
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
) & " pièces"
// FontSize
13

// Label cartons référence
// Text
Text(ThisItem.NombreCartons, "[$-fr-FR]#,##0") & " carton(s)"
// FontSize
12

// Label poids référence
// Text
Text(ThisItem.Poids, "[$-fr-FR]0.00") & " kg"
// FontSize
12


// ── SOUS-GALERIE DES LOTS PAR RÉFÉRENCE ──
// Nom recommandé : galLotsParRef (imbriquée dans galBonLivraison)
// ATTENTION : PowerApps n'autorise pas les galeries imbriquées directement.
// Solution : utiliser une galerie plate avec une collection dénormalisée (voir ci-dessous)

// ── ALTERNATIVE RECOMMANDÉE : Collection dénormalisée ──
// Créer une collection plate dans OnVisible ou App.OnStart :
Collect(
    colBonLivraisonDetail,
    AddColumns(
        colPalettes,
        // Récupère la référence de pièce associée
        "RefTitle",      Reference,
        "CommandeId",    Commande.Id
    )
);
// Puis filtrer dans une galerie plate :
// galLotsDetail.Items =
Filter(
    colBonLivraisonDetail,
    CommandeId = varCommandeSelectionnee.ID
)
// Et grouper visuellement par référence (afficher l'en-tête de référence
// seulement quand le lot courant a une référence différente du lot précédent).

// ── OU : Galerie avec galerie intérieure via le composant Gallery dans un Canvas Component ──


// ─────────────────────────────────────────────
// GALERIE PLATE RECOMMANDÉE : galDetailBL
// (remplacement de la galerie imbriquée)
// ─────────────────────────────────────────────

// OnVisible de l'écran — construction de la collection dénormalisée :
ClearCollect(
    colBLDetail,
    ForAll(
        Filter(colPieces, Commande.Id = varCommandeSelectionnee.ID),
        With(
            {ref: ThisRecord},
            ForAll(
                Filter(colPalettes,
                    Commande.Id = varCommandeSelectionnee.ID,
                    Reference   = ref.Title
                ),
                {
                    RefTitle:         ref.Title,
                    RefQteAttendue:   ref.QuantiteAttendue,
                    RefNombreCartons: ref.NombreCartons,
                    RefPoids:         ref.Poids,
                    LotNom:           Title,
                    LotQtePieces:     QuantitePieces,
                    LotNombreCartons: NombreCartons,
                    LotPoids:         Poids
                }
            )
        )
    )
)

// Items de galDetailBL
Sort(colBLDetail, RefTitle, SortOrder.Ascending)

// Hauteur du template
72

// Rectangle fond
// Fill
If(
    IsEven(CountRows(Filter(colBLDetail, RefTitle = ThisItem.RefTitle, LotNom < ThisItem.LotNom))),
    RGBA(255, 255, 255, 0.04),
    Transparent
)

// Label référence (affiché seulement si premier lot de cette référence)
// Visible
CountRows(Filter(colBLDetail, RefTitle = ThisItem.RefTitle, LotNom < ThisItem.LotNom)) = 0
// Text
ThisItem.RefTitle
// FontWeight
FontWeight.Bold
// FontSize
14

// Label info lot
// Text
"Lot " & ThisItem.LotNom &
"  |  " & Text(ThisItem.LotQtePieces, "[$-fr-FR]#,##0") & " pcs" &
"  |  " & Text(ThisItem.LotNombreCartons, "[$-fr-FR]#,##0") & " ctn" &
"  |  " & Text(ThisItem.LotPoids, "[$-fr-FR]0.00") & " kg"
// FontSize
13


// ─────────────────────────────────────────────
// BOUTON IMPRIMER : btnImprimer
// ─────────────────────────────────────────────
// Text
"🖨️  Imprimer"
// OnSelect
Print()
// Fill
RGBA(0, 120, 210, 1)
// Color (texte)
White
// BorderRadius
8
// FontSize
16
// Padding
12
// Width
200
// Height
50

// ─────────────────────────────────────────────
// NOTES SUR L'IMPRESSION
// ─────────────────────────────────────────────
// La fonction Print() ouvre la boîte de dialogue d'impression native du navigateur.
// Pour une mise en page A4 optimisée :
// 1. Créer un écran dédié à l'impression (ex: Ecran4_Print) avec fond blanc,
//    texte noir, police 10-12pt, largeur = 595px (A4 portrait).
// 2. Masquer les boutons de navigation sur cet écran.
// 3. Naviguer vers cet écran puis appeler Print().
//
// Paramètres d'écran recommandés pour impression :
//   Width  : 595
//   Height : 842
//   Fill   : White
