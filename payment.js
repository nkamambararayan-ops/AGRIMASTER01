/* =========================================================
   AGRIMASTER — Module Paiement Mobile Money & Abonnement
   Numéro bénéficiaire : 691917365
   Montant : 100 FCFA / mois
   ========================================================= */

const BENEFICIARY_NUMBER = '691 91 73 65';
const SUBSCRIPTION_AMOUNT = 100;
const SUBSCRIPTION_DURATION_DAYS = 30;

function genRef() {
  return 'AGM-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(Math.random() * 900 + 100);
}

async function getActiveSubscription(userId) {
  const subs = await apiListAll('subscriptions', { search: userId });
  const mine = subs.filter(s => s.user_id === userId);
  const now = Date.now();
  const active = mine.find(s => s.status === 'active' && s.end_date > now);
  return active || null;
}

function injectPaymentModal() {
  if (document.getElementById('paymentModal')) return;
  const div = document.createElement('div');
  div.innerHTML = `
  <div class="modal-overlay" id="paymentModal">
    <div class="modal-box">
      <button class="modal-close" onclick="closePaymentModal()"><i class="fa-solid fa-xmark"></i></button>
      <div class="steps-row">
        <div class="step-dot active" id="stepDot1">1</div>
        <div class="step-line" id="stepLine1"></div>
        <div class="step-dot" id="stepDot2">2</div>
        <div class="step-line" id="stepLine2"></div>
        <div class="step-dot" id="stepDot3">3</div>
      </div>

      <div id="payStep1">
        <h3 class="text-center" style="margin-bottom:6px;"><i class="fa-solid fa-mobile-screen-button" style="color:var(--green-600)"></i> Paiement Mobile Money</h3>
        <p class="text-center" style="color:var(--ink-500); font-size:0.9rem; margin-bottom:24px;">Envoyez <strong>${SUBSCRIPTION_AMOUNT} FCFA</strong> au numéro ci-dessous, puis confirmez.</p>
        <div class="momo-number-box">
          <div>
            <div style="font-size:0.75rem; color:var(--ink-500); font-weight:700;">NUMÉRO BÉNÉFICIAIRE</div>
            <div class="num">${BENEFICIARY_NUMBER}</div>
          </div>
          <button class="copy-btn" onclick="copyBeneficiaryNumber()"><i class="fa-solid fa-copy"></i> Copier</button>
        </div>
        <div class="form-group">
          <label class="form-label">Votre numéro Mobile Money</label>
          <div class="input-icon-wrap">
            <i class="fa-solid fa-phone"></i>
            <input type="tel" class="form-input" id="payerPhone" placeholder="6XX XXX XXX">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Opérateur</label>
          <select class="form-input" id="payerOperator">
            <option value="MTN Mobile Money">MTN Mobile Money</option>
            <option value="Orange Money">Orange Money</option>
          </select>
        </div>
        <button class="btn btn-primary btn-block" onclick="goToPayStep2()"><i class="fa-solid fa-arrow-right"></i> J'ai envoyé le paiement</button>
      </div>

      <div id="payStep2" style="display:none;">
        <h3 class="text-center" style="margin-bottom:6px;"><i class="fa-solid fa-receipt" style="color:var(--green-600)"></i> Confirmation</h3>
        <p class="text-center" style="color:var(--ink-500); font-size:0.9rem; margin-bottom:24px;">Entrez la référence de la transaction reçue par SMS.</p>
        <div class="form-group">
          <label class="form-label">Référence de transaction</label>
          <div class="input-icon-wrap">
            <i class="fa-solid fa-hashtag"></i>
            <input type="text" class="form-input" id="transactionRef" placeholder="Ex : MP240610.1234.A12345">
          </div>
        </div>
        <button class="btn btn-primary btn-block" id="validatePaymentBtn" onclick="validatePayment()"><i class="fa-solid fa-circle-check"></i> Valider le paiement</button>
      </div>

      <div id="payStep3" style="display:none; text-align:center;">
        <div style="width:70px;height:70px;border-radius:50%;background:var(--green-100);display:flex;align-items:center;justify-content:center;margin:0 auto 20px;">
          <i class="fa-solid fa-check" style="font-size:1.8rem;color:var(--green-600)"></i>
        </div>
        <h3 style="margin-bottom:10px;">Paiement validé !</h3>
        <p style="color:var(--ink-500); font-size:0.92rem; margin-bottom:26px;">Votre abonnement est actif. Vous pouvez maintenant télécharger vos formations.</p>
        <button class="btn btn-primary btn-block" onclick="closePaymentModal(); window.location.reload();"><i class="fa-solid fa-arrow-right"></i> Continuer</button>
      </div>
    </div>
  </div>`;
  document.body.appendChild(div);
}

function openPaymentModal(onSuccessCallback) {
  injectPaymentModal();
  window._paymentSuccessCallback = onSuccessCallback || null;
  document.getElementById('paymentModal').classList.add('open');
  document.getElementById('payStep1').style.display = 'block';
  document.getElementById('payStep2').style.display = 'none';
  document.getElementById('payStep3').style.display = 'none';
  document.getElementById('stepDot1').classList.add('active');
  document.getElementById('stepDot2').classList.remove('active');
  document.getElementById('stepDot3').classList.remove('active');
  document.getElementById('stepLine1').classList.remove('active');
  document.getElementById('stepLine2').classList.remove('active');
}

function closePaymentModal() {
  const modal = document.getElementById('paymentModal');
  if (modal) modal.classList.remove('open');
}

function copyBeneficiaryNumber() {
  navigator.clipboard.writeText('691917365');
  toast('Numéro copié dans le presse-papiers !');
}

function goToPayStep2() {
  const phone = document.getElementById('payerPhone').value.trim();
  if (!phone || phone.length < 8) {
    toast('Veuillez entrer un numéro Mobile Money valide.', 'error');
    return;
  }
  document.getElementById('payStep1').style.display = 'none';
  document.getElementById('payStep2').style.display = 'block';
  document.getElementById('stepDot2').classList.add('active');
  document.getElementById('stepLine1').classList.add('active');
}

async function validatePayment() {
  const session = getSession();
  if (!session) { toast('Veuillez vous connecter.', 'error'); return; }

  const ref = document.getElementById('transactionRef').value.trim();
  if (!ref) { toast('Veuillez entrer la référence de transaction.', 'error'); return; }

  const btn = document.getElementById('validatePaymentBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Validation en cours...';

  const phone = document.getElementById('payerPhone').value.trim();
  const operator = document.getElementById('payerOperator').value;

  try {
    // Simulation d'une validation automatique de paiement Mobile Money
    await new Promise(r => setTimeout(r, 1600));

    const receiptNumber = 'REC-' + Date.now().toString(36).toUpperCase();
    const payment = await apiCreate('payments', {
      id: genId('pay'),
      user_id: session.id,
      user_email: session.email,
      user_name: session.full_name,
      amount: SUBSCRIPTION_AMOUNT,
      phone_number: phone,
      transaction_reference: ref,
      operator,
      status: 'valide',
      receipt_number: receiptNumber
    });

    const now = Date.now();
    const endDate = now + SUBSCRIPTION_DURATION_DAYS * 24 * 60 * 60 * 1000;
    await apiCreate('subscriptions', {
      id: genId('sub'),
      user_id: session.id,
      user_email: session.email,
      plan: 'Standard mensuel',
      amount: SUBSCRIPTION_AMOUNT,
      start_date: now,
      end_date: endDate,
      status: 'active',
      payment_id: payment.id
    });

    await apiCreate('notifications', {
      id: genId('notif'),
      user_id: session.id,
      user_email: session.email,
      title: 'Paiement confirmé ✅',
      message: `Votre abonnement AgriMaster est actif jusqu'au ${new Date(endDate).toLocaleDateString('fr-FR')}. Reçu n° ${receiptNumber}.`,
      type: 'succes',
      is_read: false
    });

    document.getElementById('payStep2').style.display = 'none';
    document.getElementById('payStep3').style.display = 'block';
    document.getElementById('stepDot3').classList.add('active');
    document.getElementById('stepLine2').classList.add('active');

    if (window._paymentSuccessCallback) window._paymentSuccessCallback();
  } catch (err) {
    console.error(err);
    toast('Erreur lors de la validation du paiement.', 'error');
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Valider le paiement';
  }
}
