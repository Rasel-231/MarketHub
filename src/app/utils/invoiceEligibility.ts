// ============================================================
// INVOICE ELIGIBILITY CHECKER
// ============================================================
// Eta ekta "pure function" - kono DB call ba side-effect nei,
// shudhu order-er state dekhe bole dey invoice generate kora
// jabe kina.

type PaymentStatus = 'pending' | 'paid' | 'refunded';
type DeliveryStatus = 'pending' | 'delivered' | 'cancelled';

interface OrderForEligibilityCheck {
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  invoiceGeneratedFor: string | null;
  invoiceGenerationCount: number;
}

export interface EligibilityResult {
  allowed: boolean;
  reason?:
    | 'cancelled_or_refunded'
    | 'invalid_status_combination'
    | 'already_generated_for_this_state'
    | 'generation_limit_reached';
  stateKey: string;
}

// Shudhu ei duita combination-e-i invoice generate kora jabe
const ALLOWED_STATES = ['pending_pending', 'paid_delivered'];

export function canGenerateInvoice(order: OrderForEligibilityCheck): EligibilityResult {
  const stateKey = `${order.paymentStatus}_${order.deliveryStatus}`;

  // ---- Rule 1: Cancelled/Refunded hole kokhono generate na ----
  if (order.paymentStatus === 'refunded' || order.deliveryStatus === 'cancelled') {
    return { allowed: false, reason: 'cancelled_or_refunded', stateKey };
  }

  // ---- Rule 2: Shudhu 2 ta valid state-e-i generate hobe ----
  if (!ALLOWED_STATES.includes(stateKey)) {
    return { allowed: false, reason: 'invalid_status_combination', stateKey };
  }

  // ---- Rule 3: Same state-er jonno already generate hoye gele, cache hit ----
  if (order.invoiceGeneratedFor === stateKey) {
    return { allowed: false, reason: 'already_generated_for_this_state', stateKey };
  }

  // ---- Rule 4: Max 2 bar-er beshi kokhono generate hobe na (safety net) ----
  if (order.invoiceGenerationCount >= 2) {
    return { allowed: false, reason: 'generation_limit_reached', stateKey };
  }

  return { allowed: true, stateKey };
}
