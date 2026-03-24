# Guide d'implémentation PowerApps — Suivi de préparation de commandes

## Vue d'ensemble

Application Canvas PowerApps connectée à SharePoint pour le suivi de préparation de pièces pour 3 clients : **DSSA A16**, **CCH 7**, **APEX**.

---

## Structure des listes SharePoint

### Liste : `Clients`
| Colonne       | Type         | Description         |
|---------------|--------------|---------------------|
| Title         | Ligne de texte | Nom du client (ex: DSSA A16) |

### Liste : `Commandes`
| Colonne        | Type              | Description                          |
|----------------|-------------------|--------------------------------------|
| Title          | Ligne de texte    | Numéro de commande                   |
| Client         | Recherche (Lookup)| Lié à la liste Clients               |
| DateCommande   | Date et heure     | Date de la commande                  |
| DateLivraison  | Date et heure     | Date de livraison prévue             |
| Statut         | Choix             | "En cours" / "Pas commencé" / "Complète" |

### Liste : `Pieces`
| Colonne          | Type              | Description                                |
|------------------|-------------------|--------------------------------------------|
| Title            | Ligne de texte    | Référence de la pièce                      |
| Commande         | Recherche (Lookup)| Lié à la liste Commandes                   |
| QuantiteAttendue | Nombre            | Quantité totale de pièces attendues        |
| NombreCartons    | Nombre            | Nombre de cartons pour cette référence     |
| Poids            | Nombre décimal    | Poids total (kg) pour cette référence      |

### Liste : `Palettes`
| Colonne       | Type              | Description                             |
|---------------|-------------------|-----------------------------------------|
| Title         | Ligne de texte    | Numéro de lot                           |
| Commande      | Recherche (Lookup)| Lié à la liste Commandes                |
| Reference     | Ligne de texte    | Référence de la pièce (doit correspondre au Title de Pieces) |
| QuantitePieces| Nombre            | Nombre de pièces dans ce lot            |
| NombreCartons | Nombre            | Nombre de cartons dans ce lot           |
| Poids         | Nombre décimal    | Poids de ce lot (kg)                    |

> **Important** : La colonne `Reference` dans Palettes doit contenir exactement la même valeur que `Title` dans Pieces pour que les filtres fonctionnent.

---

## Syntaxe PowerApps FR — Règles essentielles

| Règle | Anglais | **Français** |
|---|---|---|
| Séparateur de paramètres | `,` | **`;`** |
| Séparateur décimal | `0.3` | **`0,3`** |
| Booléens | `true` / `false` | **`vrai`** / **`faux`** |
| Couleur | `RGBA(...)` | **`RVBA(...)`** |

### Traduction des fonctions principales

| Anglais | **Français** |
|---|---|
| `Filter(...)` | **`Filtrer(...)`** |
| `Sort(...)` | **`Trier(...)`** |
| `Sum(...)` | **`Somme(...)`** |
| `If(...)` | **`Si(...)`** |
| `IsBlank(...)` | **`EstVide(...)`** |
| `Blank()` | **`Vide()`** |
| `With(...)` | **`Avec(...)`** |
| `Set(...)` | **`Définir(...)`** |
| `Navigate(...)` | **`Naviguer(...)`** |
| `Collect(...)` | **`Collecter(...)`** |
| `ClearCollect(...)` | **`EffacerCollecte(...)`** |
| `Concurrent(...)` | **`Simultané(...)`** |
| `ForAll(...)` | **`PourTous(...)`** |
| `Text(...)` | **`Texte(...)`** |
| `Now()` | **`Maintenant()`** |
| `Switch(...)` | **`Basculer(...)`** |
| `Notify(...)` | **`Notifier(...)`** |
| `Print()` | **`Imprimer()`** |
| `CountRows(...)` | **`NbLignes(...)`** |
| `IsEven(...)` | **`EstPair(...)`** |
| `Not(...)` | **`Non(...)`** |
| `LookUp(...)` | **`RechercherV(...)`** |

### Traduction des énumérations

| Anglais | **Français** |
|---|---|
| `SortOrder.Ascending` | **`OrdreTri.Croissant`** |
| `SortOrder.Descending` | **`OrdreTri.Décroissant`** |
| `ScreenTransition.Fade` | **`TransitionÉcran.Fondu`** |
| `ScreenTransition.Back` | **`TransitionÉcran.Précédent`** |
| `NotificationType.Success` | **`TypeNotification.Succès`** |
| `White` | **`Blanc`** |
| `Transparent` | **`Transparent`** |

---

## Architecture des écrans

```
Écran1_Accueil
  ├── Galerie Clients (gauche)
  └── Panneau Commandes (droite, visible au clic sur un client)
       ├── Galerie Commandes avec statut + barre de progression
       └── Barre de progression globale toutes commandes

Écran2_DetailCommande
  ├── Galerie Commandes avec progression (gauche)
  └── Panneau Références (droite, visible au clic sur une commande)
       ├── Galerie Références (ref, qté, cartons, poids)
       └── Bouton → Bon de Livraison

Écran3_DetailReference
  ├── Galerie Références avec progression (gauche)
  └── Panneau Lots (droite, visible au clic sur une référence)
       └── Galerie Lots (numéro lot, quantité pièces)

Écran4_BonDeLivraison
  ├── En-tête commande
  ├── Galerie Pièces avec lots imbriqués
  ├── Totaux (poids, cartons, pièces)
  └── Bouton Imprimer
```

---

## Variables globales (App.OnStart)

```powerfx
// Connexions aux sources de données SharePoint
// (à définir dans "Sources de données" de l'application)

// Initialisation des variables
Set(varClientSelectionne, Blank());
Set(varCommandeSelectionnee, Blank());
Set(varReferenceSelectionnee, Blank());
Set(varPanneauDroiteVisible, false)
```

---

## Écran 1 — Accueil (`Ecran1_Accueil`)

### Mise en page
- Fond : couleur principale de la charte graphique
- Titre en haut : "Suivi de préparation"
- Galerie clients à gauche (30% de la largeur)
- Panneau de droite (70%) visible seulement si `!IsBlank(varClientSelectionne)`

---

### Galerie clients : `galClients`

**Source de données :**
```
Clients
```

**Propriétés de la galerie :**
```
Items      : Sort(Clients, Title, SortOrder.Ascending)
Width      : Parent.Width * 0.28
Height     : Parent.Height - hauteurEntete
X          : 0
Y          : hauteurEntete
```

**Contenu du template (par item) :**

Label Nom client :
```
Text  : ThisItem.Title
```

Rectangle de sélection (mise en surbrillance) :
```
Fill : If(ThisItem.ID = varClientSelectionne.ID, RGBA(255,255,255,0.2), Transparent)
```

**OnSelect de la galerie :**
```powerfx
Set(varClientSelectionne, ThisItem);
Set(varCommandeSelectionnee, Blank());
Set(varReferenceSelectionnee, Blank())
```

---

### Galerie commandes : `galCommandesClient`

Visible uniquement si un client est sélectionné.

**Source de données :**
```powerfx
Items : Filter(Commandes, Client.Id = varClientSelectionne.ID)
```

**Contenu du template :**

Label numéro commande :
```
Text : ThisItem.Title
```

Label date de livraison :
```
Text : "Livraison : " & Text(ThisItem.DateLivraison, "dd/mm/yyyy")
```

Label statut :
```
Text : ThisItem.Statut.Value
Fill : Switch(
    ThisItem.Statut.Value,
    "Complète",   RGBA(0, 200, 100, 1),
    "En cours",   RGBA(255, 165, 0, 1),
    "Pas commencé", RGBA(200, 50, 50, 1)
)
```

Barre de progression (Rectangle fond) :
```
Width  : Parent.TemplateWidth - 20
Height : 8
Fill   : RGBA(200, 200, 200, 0.4)
```

Barre de progression (Rectangle rempli) :
```powerfx
// Calcul du taux de complétion de la commande
// Pièces attendues pour cette commande
With(
    {
        totalAttendu: Sum(Filter(Pieces, Commande.Id = ThisItem.ID), QuantiteAttendue),
        totalPret:    Sum(Filter(Palettes, Commande.Id = ThisItem.ID), QuantitePieces)
    },
    Set(varProgCommandeItem, If(totalAttendu > 0, totalPret / totalAttendu, 0))
);
// Utiliser varProgCommandeItem pour la largeur :
Width : (Parent.TemplateWidth - 20) * varProgCommandeItem
Fill  : RGBA(0, 180, 120, 1)
```

> **Note** : Dans PowerApps, pour éviter de recalculer dans chaque contrôle, il est recommandé d'utiliser `With()` dans le template ou de stocker les calculs dans une collection lors du chargement.

**OnSelect de la galerie :**
```powerfx
Set(varCommandeSelectionnee, ThisItem);
Navigate(Ecran2_DetailCommande, ScreenTransition.Fade)
```

---

### Barre de progression globale du client

**Label pourcentage :**
```powerfx
Text : Text(
    If(
        Sum(Filter(Pieces, Commande.Client.Id = varClientSelectionne.ID), QuantiteAttendue) > 0,
        Sum(Filter(Palettes, Commande.Client.Id = varClientSelectionne.ID), QuantitePieces) /
        Sum(Filter(Pieces,   Commande.Client.Id = varClientSelectionne.ID), QuantiteAttendue) * 100,
        0
    ),
    "[$-fr-FR]0.0"
) & " %"
```

**Barre de progression (Rectangle fond) :**
```
Width  : panneauDroite.Width - 40
Height : 16
Fill   : RGBA(200, 200, 200, 0.4)
```

**Barre de progression (Rectangle rempli) :**
```powerfx
Width : (panneauDroite.Width - 40) * If(
    Sum(Filter(Pieces,   Commande.Client.Id = varClientSelectionne.ID), QuantiteAttendue) > 0,
    Sum(Filter(Palettes, Commande.Client.Id = varClientSelectionne.ID), QuantitePieces) /
    Sum(Filter(Pieces,   Commande.Client.Id = varClientSelectionne.ID), QuantiteAttendue),
    0
)
Fill : RGBA(0, 120, 210, 1)
```

---

## Écran 2 — Détail Commande (`Ecran2_DetailCommande`)

### Mise en page
- Bouton Retour en haut à gauche → `Navigate(Ecran1_Accueil, ScreenTransition.Back)`
- Titre : `varClientSelectionne.Title`
- Galerie des commandes du client à gauche (avec barre de progression par commande)
- Panneau de droite : références de la commande sélectionnée
- Bouton "Bon de livraison" en bas à droite

---

### Galerie commandes (gauche) : `galCommandesDetail`

```powerfx
Items : Filter(Commandes, Client.Id = varClientSelectionne.ID)
```

**Mise en surbrillance de la commande sélectionnée :**
```powerfx
Fill : If(ThisItem.ID = varCommandeSelectionnee.ID, RGBA(255,255,255,0.2), Transparent)
```

**Barre de progression par commande :**
```powerfx
// Même logique que sur l'Écran 1
// Rectangle rempli :
Width : (Parent.TemplateWidth - 16) * With(
    {
        att: Sum(Filter(Pieces,   Commande.Id = ThisItem.ID), QuantiteAttendue),
        pret: Sum(Filter(Palettes, Commande.Id = ThisItem.ID), QuantitePieces)
    },
    If(att > 0, pret / att, 0)
)
```

**OnSelect :**
```powerfx
Set(varCommandeSelectionnee, ThisItem)
```

---

### Galerie références (droite) : `galReferences`

Visible seulement si `!IsBlank(varCommandeSelectionnee)`

```powerfx
Items : Filter(Pieces, Commande.Id = varCommandeSelectionnee.ID)
```

**Contenu du template :**

Label référence :
```
Text : ThisItem.Title
```

Label quantité attendue :
```
Text : "Qté attendue : " & Text(ThisItem.QuantiteAttendue, "[$-fr-FR]#,##0")
```

Label pièces prêtes :
```powerfx
Text : "Prêtes : " & Text(
    Sum(Filter(Palettes, Commande.Id = varCommandeSelectionnee.ID, Reference = ThisItem.Title), QuantitePieces),
    "[$-fr-FR]#,##0"
)
```

Label cartons :
```
Text : "Cartons : " & Text(ThisItem.NombreCartons, "[$-fr-FR]#,##0")
```

Label poids :
```
Text : "Poids : " & Text(ThisItem.Poids, "[$-fr-FR]0.00") & " kg"
```

**OnSelect :**
```powerfx
Set(varReferenceSelectionnee, ThisItem);
Navigate(Ecran3_DetailReference, ScreenTransition.Fade)
```

---

### Bouton Bon de Livraison

```
Text    : "Bon de livraison"
OnSelect : Navigate(Ecran4_BonDeLivraison, ScreenTransition.Fade)
```

---

## Écran 3 — Détail Référence (`Ecran3_DetailReference`)

### Mise en page
- Bouton Retour → `Navigate(Ecran2_DetailCommande, ScreenTransition.Back)`
- Titre : `varCommandeSelectionnee.Title`
- Galerie des références à gauche avec barre de progression
- Galerie des lots à droite pour la référence sélectionnée

---

### Galerie références (gauche) : `galReferencesDetail`

```powerfx
Items : Filter(Pieces, Commande.Id = varCommandeSelectionnee.ID)
```

**Barre de progression par référence :**
```powerfx
// Rectangle rempli :
Width : (Parent.TemplateWidth - 16) * With(
    {
        att:  ThisItem.QuantiteAttendue,
        pret: Sum(
            Filter(Palettes,
                Commande.Id = varCommandeSelectionnee.ID,
                Reference   = ThisItem.Title
            ),
            QuantitePieces
        )
    },
    If(att > 0, pret / att, 0)
)
```

**Label pourcentage par référence :**
```powerfx
Text : Text(
    With(
        {
            att:  ThisItem.QuantiteAttendue,
            pret: Sum(
                Filter(Palettes,
                    Commande.Id = varCommandeSelectionnee.ID,
                    Reference   = ThisItem.Title
                ),
                QuantitePieces
            )
        },
        If(att > 0, pret / att * 100, 0)
    ),
    "[$-fr-FR]0"
) & " %"
```

**Mise en surbrillance :**
```powerfx
Fill : If(ThisItem.ID = varReferenceSelectionnee.ID, RGBA(255,255,255,0.2), Transparent)
```

**OnSelect :**
```powerfx
Set(varReferenceSelectionnee, ThisItem)
```

---

### Galerie lots (droite) : `galLots`

Visible seulement si `!IsBlank(varReferenceSelectionnee)`

```powerfx
Items : Filter(
    Palettes,
    Commande.Id = varCommandeSelectionnee.ID,
    Reference   = varReferenceSelectionnee.Title
)
```

**Contenu du template :**

Label numéro de lot :
```
Text : "Lot : " & ThisItem.Title
```

Label quantité :
```
Text : "Pièces : " & Text(ThisItem.QuantitePieces, "[$-fr-FR]#,##0")
```

Label cartons :
```
Text : "Cartons : " & Text(ThisItem.NombreCartons, "[$-fr-FR]#,##0")
```

Label poids :
```
Text : "Poids : " & Text(ThisItem.Poids, "[$-fr-FR]0.00") & " kg"
```

---

## Écran 4 — Bon de Livraison (`Ecran4_BonDeLivraison`)

### En-tête

Label client :
```
Text : varClientSelectionne.Title
```

Label commande :
```
Text : "Commande : " & varCommandeSelectionnee.Title
```

Label date de livraison :
```
Text : "Date de livraison : " & Text(varCommandeSelectionnee.DateLivraison, "dd/mm/yyyy")
```

---

### Totaux de la commande

**Total pièces attendues :**
```powerfx
Text : "Total pièces attendues : " & Text(
    Sum(Filter(Pieces, Commande.Id = varCommandeSelectionnee.ID), QuantiteAttendue),
    "[$-fr-FR]#,##0"
)
```

**Total pièces prêtes :**
```powerfx
Text : "Total pièces prêtes : " & Text(
    Sum(Filter(Palettes, Commande.Id = varCommandeSelectionnee.ID), QuantitePieces),
    "[$-fr-FR]#,##0"
)
```

**Total cartons :**
```powerfx
Text : "Total cartons : " & Text(
    Sum(Filter(Palettes, Commande.Id = varCommandeSelectionnee.ID), NombreCartons),
    "[$-fr-FR]#,##0"
)
```

**Poids total :**
```powerfx
Text : "Poids total : " & Text(
    Sum(Filter(Palettes, Commande.Id = varCommandeSelectionnee.ID), Poids),
    "[$-fr-FR]0.00"
) & " kg"
```

---

### Galerie pièces avec lots : `galBonLivraison`

```powerfx
Items : Filter(Pieces, Commande.Id = varCommandeSelectionnee.ID)
```

**Contenu du template (par référence) :**

Label référence :
```
Text       : ThisItem.Title
FontWeight : FontWeight.Bold
```

Label quantité attendue :
```
Text : "Qté attendue : " & Text(ThisItem.QuantiteAttendue, "[$-fr-FR]#,##0")
```

Label poids référence :
```
Text : "Poids total référence : " & Text(ThisItem.Poids, "[$-fr-FR]0.00") & " kg"
```

**Sous-galerie des lots par référence : `galLotsParRef`**

```powerfx
Items : Filter(
    Palettes,
    Commande.Id = varCommandeSelectionnee.ID,
    Reference   = ThisItem.Title
)
```

Colonnes de la sous-galerie :
- `"Lot " & ThisItem.Title`
- `Text(ThisItem.QuantitePieces, "[$-fr-FR]#,##0") & " pcs"`
- `Text(ThisItem.NombreCartons, "[$-fr-FR]#,##0") & " ctn"`
- `Text(ThisItem.Poids, "[$-fr-FR]0.00") & " kg"`

---

### Bouton Imprimer

```powerfx
Text    : "🖨️ Imprimer"
OnSelect : Print()
```

> **Note** : La fonction `Print()` dans PowerApps ouvre la boîte de dialogue d'impression du navigateur/système. Assure-toi que l'application est publiée en version web pour que l'impression fonctionne correctement.
> Pour une mise en page optimisée à l'impression, envisage de créer un écran dédié `Ecran4_BonDeLivraison` avec des contrôles disposés pour une page A4 (595 × 842 pts).

---

## Optimisation des performances — Collections locales

Pour éviter trop d'appels SharePoint répétés (surtout sur les barres de progression), charge les données au démarrage dans des collections locales :

### App.OnStart (recommandé)

```powerfx
// Chargement initial de toutes les données
Collect(colClients,   Clients);
Collect(colCommandes, Commandes);
Collect(colPieces,    Pieces);
Collect(colPalettes,  Palettes);

// Initialisation des variables
Set(varClientSelectionne,    Blank());
Set(varCommandeSelectionnee, Blank());
Set(varReferenceSelectionnee, Blank())
```

Puis remplacer dans toutes les formules `Clients` → `colClients`, `Commandes` → `colCommandes`, etc.

**Bouton de rafraîchissement (optionnel) :**
```powerfx
OnSelect :
Clear(colClients);   Collect(colClients,   Clients);
Clear(colCommandes); Collect(colCommandes, Commandes);
Clear(colPieces);    Collect(colPieces,    Pieces);
Clear(colPalettes);  Collect(colPalettes,  Palettes)
```

---

## Connexion aux sources de données SharePoint

1. Dans PowerApps Studio → **Données** (panneau gauche) → **Ajouter des données**
2. Rechercher **SharePoint**
3. Entrer l'URL de ton site SharePoint
4. Sélectionner les 4 listes : `Clients`, `Commandes`, `Pieces`, `Palettes`

---

## Checklist de création dans PowerApps Studio

- [ ] Créer les 4 écrans avec les bons noms
- [ ] Connecter les 4 listes SharePoint
- [ ] Configurer `App.OnStart` avec les collections
- [ ] Écran 1 : galerie clients + galerie commandes + barre globale
- [ ] Écran 2 : galerie commandes (gauche) + galerie références (droite) + bouton BL
- [ ] Écran 3 : galerie références (gauche) + galerie lots (droite)
- [ ] Écran 4 : en-tête + totaux + galerie pièces/lots + bouton imprimer
- [ ] Configurer les navigations entre écrans
- [ ] Tester les barres de progression avec des données réelles
- [ ] Publier l'application
