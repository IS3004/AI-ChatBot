import type { BillingMoneyAmount, BillingMoneyAmountJSON, BillingPerUnitTotal, BillingPerUnitTotalJSON, BillingSubscriptionItemSeats, BillingSubscriptionItemSeatsJSON, BillingTotals, BillingTotalsJSON } from '@clerk/shared/types';
export declare const billingMoneyAmountFromJSON: (amount: BillingMoneyAmountJSON) => BillingMoneyAmount;
export declare const billingPerUnitTotalsFromJSON: (perUnitTotals: BillingPerUnitTotalJSON[]) => BillingPerUnitTotal[];
export declare const billingTotalsFromJSON: (totals: BillingTotalsJSON) => BillingTotals;
export declare const billingSubscriptionItemSeatsFromJSON: (seats: BillingSubscriptionItemSeatsJSON) => BillingSubscriptionItemSeats;
//# sourceMappingURL=billing.d.ts.map