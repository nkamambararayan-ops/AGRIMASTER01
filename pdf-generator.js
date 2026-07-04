/* =========================================================
   AGRIMASTER — Générateur de PDF de formation (jsPDF)
   Génère un guide PDF structuré : Introduction, Objectifs,
   Matériel, Étapes, Budget, Risques, Solutions, Rentabilité, Conclusion
   ========================================================= */

const BUDGET_TEMPLATES = {
  'Agriculture': [
    ['Préparation du terrain (labour, défrichage)', '35 000 - 70 000 FCFA / ha'],
    ['Semences ou plants de qualité', '15 000 - 45 000 FCFA / ha'],
    ['Engrais et intrants organiques', '25 000 - 60 000 FCFA / ha'],
    ['Main d\'œuvre (entretien, sarclage)', '30 000 - 80 000 FCFA / cycle'],
    ['Matériel agricole (houes, pulvérisateur, arrosoirs)', '20 000 - 100 000 FCFA'],
    ['Transport et commercialisation', '10 000 - 30 000 FCFA / cycle'],
  ],
  'Élevage': [
    ['Achat des sujets (poussins, porcelets, etc.)', '50 000 - 250 000 FCFA'],
    ['Construction ou aménagement de l\'habitat', '75 000 - 300 000 FCFA'],
    ['Alimentation (aliments, compléments)', '40 000 - 150 000 FCFA / mois'],
    ['Produits vétérinaires et vaccins', '15 000 - 50 000 FCFA'],
    ['Équipements (mangeoires, abreuvoirs, éclairage)', '20 000 - 80 000 FCFA'],
    ['Main d\'œuvre et suivi sanitaire', '25 000 - 60 000 FCFA / mois'],
  ],
  'Agro-business': [
    ['Étude de marché et enregistrement de l\'activité', '25 000 - 75 000 FCFA'],
    ['Équipement de transformation ou de vente', '100 000 - 500 000 FCFA'],
    ['Emballage et étiquetage des produits', '20 000 - 60 000 FCFA'],
    ['Marketing digital et communication', '15 000 - 50 000 FCFA / mois'],
    ['Logistique et transport', '20 000 - 80 000 FCFA / mois'],
    ['Fonds de roulement', '100 000 - 400 000 FCFA'],
  ]
};

const RISK_TEMPLATES = {
  'Agriculture': [
    ['Attaques de ravageurs et maladies des plantes', 'Rotation des cultures, utilisation de semences résistantes, traitement phytosanitaire préventif'],
    ['Aléas climatiques (sécheresse, inondations)', 'Irrigation d\'appoint, choix de variétés adaptées, calendrier cultural rigoureux'],
    ['Fluctuation des prix du marché', 'Diversification des cultures, contrats de vente anticipés, transformation locale'],
    ['Dégradation de la fertilité du sol', 'Compostage régulier, jachère, association de cultures'],
  ],
  'Élevage': [
    ['Épidémies et maladies infectieuses', 'Programme de vaccination strict, quarantaine des nouveaux animaux, hygiène rigoureuse'],
    ['Mortalité liée à une mauvaise alimentation', 'Ration équilibrée, eau propre en permanence, suivi vétérinaire régulier'],
    ['Vol et prédateurs', 'Clôture sécurisée, gardiennage, enclos bien fermés la nuit'],
    ['Fluctuation des prix des intrants', 'Achat groupé, production locale d\'aliments, stockage stratégique'],
  ],
  'Agro-business': [
    ['Concurrence sur le marché local', 'Différenciation produit, qualité constante, image de marque forte'],
    ['Difficulté d\'accès au financement', 'Business plan solide, épargne progressive, coopératives et tontines'],
    ['Pertes post-récolte et logistique', 'Stockage adapté, transformation rapide, partenariats logistiques fiables'],
    ['Faible pouvoir d\'achat des clients', 'Offres adaptées, vente en petites quantités, fidélisation client'],
  ]
};

function buildStepsForCourse(course) {
  const cat = course.category;
  if (cat === 'Agriculture') {
    return [
      'Choix du terrain et analyse du sol (exposition, drainage, qualité).',
      'Préparation du sol : labour, nivellement et enrichissement organique.',
      'Sélection de semences ou plants certifiés et adaptés à la zone climatique.',
      'Semis ou plantation selon le calendrier cultural optimal.',
      'Entretien régulier : sarclage, fertilisation, arrosage/irrigation.',
      'Surveillance phytosanitaire et traitement préventif des maladies.',
      'Récolte au stade de maturité optimale pour garantir la qualité.',
      'Post-récolte : séchage, tri, conditionnement et stockage.',
      'Commercialisation directe ou transformation à valeur ajoutée.',
    ];
  } else if (cat === 'Élevage') {
    return [
      'Étude de faisabilité et choix de la race/espèce adaptée à la région.',
      'Construction ou aménagement d\'un habitat sain, aéré et sécurisé.',
      'Approvisionnement en sujets de qualité auprès de fournisseurs fiables.',
      'Mise en place d\'un programme alimentaire équilibré selon l\'âge.',
      'Suivi sanitaire : vaccination, vermifugation et hygiène quotidienne.',
      'Gestion de la reproduction et du renouvellement du cheptel.',
      'Suivi de la croissance et ajustement de l\'alimentation.',
      'Préparation à la vente : pesée, tri, transport dans de bonnes conditions.',
      'Commercialisation sur le marché local ou auprès de grossistes.',
    ];
  }
  return [
    'Réalisation d\'une étude de marché pour identifier la demande.',
    'Définition du modèle économique et du positionnement de l\'offre.',
    'Élaboration d\'un business plan détaillé avec projections financières.',
    'Recherche de financement (fonds propres, microcrédit, subventions).',
    'Mise en place des outils de production ou de transformation.',
    'Structuration de la chaîne logistique et d\'approvisionnement.',
    'Stratégie de marketing et de vente (digitale et physique).',
    'Suivi de la rentabilité et ajustement continu de la stratégie.',
    'Développement et mise à l\'échelle de l\'activité.',
  ];
}

function generateCoursePdf(course) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 50;
  let y = 0;

  const GREEN = [26, 138, 69];
  const ORANGE = [224, 99, 26];
  const DARK = [16, 36, 26];
  const GRAY = [92, 109, 98];

  function addHeader() {
    doc.setFillColor(...GREEN);
    doc.rect(0, 0, pageWidth, 100, 'F');
    doc.setFillColor(...ORANGE);
    doc.rect(0, 96, pageWidth, 4, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('AgriMaster', margin, 42);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Se former aujourd\'hui pour mieux produire demain.', margin, 60);
    doc.setFontSize(9);
    doc.text(`Catégorie : ${course.category}  •  Niveau : ${course.level}`, margin, 78);
    y = 130;
  }

  function addFooter(pageNum) {
    doc.setFontSize(8);
    doc.setTextColor(...GRAY);
    doc.text(`AgriMaster © ${new Date().getFullYear()} — Guide généré automatiquement — Page ${pageNum}`, margin, doc.internal.pageSize.getHeight() - 24);
  }

  function checkPageBreak(neededHeight) {
    if (y + neededHeight > doc.internal.pageSize.getHeight() - 60) {
      addFooter(doc.internal.getNumberOfPages());
      doc.addPage();
      y = 50;
    }
  }

  function sectionTitle(icon, text) {
    checkPageBreak(40);
    doc.setFillColor(...GREEN);
    doc.roundedRect(margin, y, 14, 14, 3, 3, 'F');
    doc.setTextColor(...DARK);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(text, margin + 22, y + 12);
    y += 30;
  }

  function paragraph(text, size = 10.5) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(size);
    doc.setTextColor(...DARK);
    const lines = doc.splitTextToSize(text, pageWidth - margin * 2);
    lines.forEach(line => {
      checkPageBreak(18);
      doc.text(line, margin, y);
      y += 16;
    });
    y += 10;
  }

  function bulletList(items) {
    items.forEach(item => {
      checkPageBreak(20);
      doc.setFillColor(...ORANGE);
      doc.circle(margin + 4, y - 3, 2.5, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10.5);
      doc.setTextColor(...DARK);
      const lines = doc.splitTextToSize(item, pageWidth - margin * 2 - 18);
      doc.text(lines, margin + 16, y);
      y += lines.length * 15 + 6;
    });
    y += 8;
  }

  function tableSimple(rows, headers) {
    const colWidth = (pageWidth - margin * 2) / headers.length;
    checkPageBreak(30);
    doc.setFillColor(...GREEN);
    doc.rect(margin, y, pageWidth - margin * 2, 26, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    headers.forEach((h, i) => doc.text(h, margin + 10 + i * colWidth, y + 17));
    y += 26;
    rows.forEach((row, idx) => {
      checkPageBreak(24);
      if (idx % 2 === 0) {
        doc.setFillColor(230, 248, 236);
        doc.rect(margin, y, pageWidth - margin * 2, 24, 'F');
      }
      doc.setTextColor(...DARK);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      row.forEach((cell, i) => {
        const lines = doc.splitTextToSize(String(cell), colWidth - 14);
        doc.text(lines[0] || '', margin + 10 + i * colWidth, y + 16);
      });
      y += 24;
    });
    y += 14;
  }

  // ---- COVER / HEADER ----
  addHeader();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(19);
  doc.setTextColor(...DARK);
  const titleLines = doc.splitTextToSize(`Guide complet : ${course.title}`, pageWidth - margin * 2);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 24 + 10;

  doc.setDrawColor(...ORANGE);
  doc.setLineWidth(2);
  doc.line(margin, y, margin + 80, y);
  y += 26;

  // Introduction
  sectionTitle('', '1. Introduction');
  paragraph(`Ce guide pratique vous accompagne pas à pas dans la mise en œuvre du projet "${course.title}". Conçu pour les débutants comme pour les producteurs expérimentés, ce document rassemble les meilleures pratiques utilisées en Afrique francophone pour garantir une activité rentable, durable et adaptée aux réalités locales.`);

  // Objectifs
  sectionTitle('', '2. Objectifs de la formation');
  bulletList([
    `Comprendre les fondamentaux techniques liés à : ${course.title.toLowerCase()}.`,
    'Maîtriser les étapes clés de la mise en œuvre du projet, de la préparation à la commercialisation.',
    'Identifier les investissements nécessaires et estimer le budget de démarrage.',
    'Anticiper les risques courants et connaître les solutions pratiques associées.',
    'Évaluer la rentabilité potentielle du projet à court et moyen terme.',
  ]);

  // Matériel nécessaire
  sectionTitle('', '3. Matériel et ressources nécessaires');
  const materiel = course.category === 'Élevage'
    ? ['Abri ou enclos adapté à l\'espèce', 'Mangeoires et abreuvoirs', 'Équipement de nettoyage et désinfection', 'Aliments et compléments nutritionnels', 'Registre de suivi sanitaire', 'Kit vétérinaire de base']
    : course.category === 'Agriculture'
    ? ['Outils agricoles (houe, machette, arrosoir)', 'Semences ou plants de qualité', 'Engrais organiques et/ou minéraux', 'Système d\'irrigation adapté', 'Produits de protection phytosanitaire', 'Matériel de récolte et de stockage']
    : ['Ordinateur ou smartphone connecté', 'Modèle de business plan', 'Outils de gestion comptable simples', 'Supports de communication et marketing', 'Réseau de partenaires et fournisseurs', 'Espace de stockage ou de transformation'];
  bulletList(materiel);

  // Étapes détaillées
  sectionTitle('', '4. Étapes détaillées de mise en œuvre');
  const steps = buildStepsForCourse(course);
  steps.forEach((step, i) => paragraph(`Étape ${i + 1} — ${step}`));

  // Budget
  sectionTitle('', '5. Budget prévisionnel');
  tableSimple(BUDGET_TEMPLATES[course.category] || BUDGET_TEMPLATES['Agriculture'], ['Poste de dépense', 'Coût estimé']);

  // Risques et solutions
  sectionTitle('', '6. Risques identifiés et solutions');
  tableSimple(RISK_TEMPLATES[course.category] || RISK_TEMPLATES['Agriculture'], ['Risque', 'Solution recommandée']);

  // Rentabilité
  sectionTitle('', '7. Analyse de rentabilité');
  paragraph('La rentabilité de ce projet dépend de plusieurs facteurs : la qualité de la mise en œuvre, l\'accès au marché, la maîtrise des coûts de production et la régularité de la demande. En moyenne, avec une gestion rigoureuse et une bonne application des techniques enseignées dans ce guide, un retour sur investissement peut être observé entre 3 et 12 mois selon le type d\'activité.');
  bulletList([
    'Marge brute estimée : 25% à 60% selon la filière et la saison.',
    'Diversification des débouchés pour sécuriser les revenus.',
    'Réinvestissement recommandé des premiers bénéfices pour accélérer la croissance.',
  ]);

  // Conclusion
  sectionTitle('', '8. Conclusion');
  paragraph(`"${course.title}" représente une opportunité concrète de développement économique. En appliquant rigoureusement les étapes de ce guide, tout porteur de projet — débutant ou expérimenté — peut bâtir une activité durable et rentable. AgriMaster vous accompagne dans cette transformation : se former aujourd'hui, pour mieux produire demain.`);

  addFooter(doc.internal.getNumberOfPages());

  const fileName = `AgriMaster_${course.title.replace(/[^a-zA-Z0-9]+/g, '_')}.pdf`;
  doc.save(fileName);
  return fileName;
}
