import { formatCurrency } from "@/lib/utils";

interface QuoteSummaryProps {
  bedrooms: number;
  bathrooms: number;
  duration: number;
  tasks: {
    ironing: boolean;
    laundry: boolean;
    insideWindows: boolean;
    insideFridge: boolean;
    insideOven: boolean;
  };
  frequency: string;
  bringCleaningProducts: boolean;
}

const HOURLY_RATE = 18.50;

export const QuoteSummary = ({
  bedrooms,
  bathrooms,
  duration,
  tasks,
  frequency,
  bringCleaningProducts,
}: QuoteSummaryProps) => {
  const basePrice = duration * HOURLY_RATE;
  const productsPrice = bringCleaningProducts ? 6.00 : 0;
  const totalPrice = basePrice + productsPrice;

  const frequencyLabel = {
    more_than_weekly: "More than weekly",
    weekly: "Weekly",
    biweekly: "Biweekly",
    one_off: "One-off",
  }[frequency];

  const getFrequencyDiscount = () => {
    switch (frequency) {
      case "more_than_weekly":
        return 0.15; // 15% discount
      case "weekly":
        return 0.10; // 10% discount
      case "biweekly":
        return 0.05; // 5% discount
      default:
        return 0;
    }
  };

  const discount = getFrequencyDiscount();
  const finalPrice = totalPrice * (1 - discount);

  return (
    <div className="space-y-6 p-6 bg-accent rounded-lg">
      <h3 className="text-lg font-semibold">Quote Summary</h3>
      
      <div className="space-y-2">
        <p>Property Details:</p>
        <ul className="list-disc list-inside text-sm pl-4 space-y-1">
          <li>{bedrooms} bedroom{bedrooms !== 1 ? 's' : ''}</li>
          <li>{bathrooms} bathroom{bathrooms !== 1 ? 's' : ''}</li>
        </ul>
      </div>

      {Object.entries(tasks).some(([_, value]) => value) && (
        <div className="space-y-2">
          <p>Extra Tasks:</p>
          <ul className="list-disc list-inside text-sm pl-4 space-y-1">
            {Object.entries(tasks).map(([key, value]) => value && (
              <li key={key}>
                {key.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^./, str => str.toUpperCase())}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-2">
        <p>Duration: {duration} hours</p>
        <p>Frequency: {frequencyLabel}</p>
      </div>

      <div className="space-y-2 pt-4 border-t">
        <div className="flex justify-between">
          <span>Cleaning ({duration} hours)</span>
          <span>{formatCurrency(basePrice)}</span>
        </div>
        
        {bringCleaningProducts && (
          <div className="flex justify-between">
            <span>Cleaning products</span>
            <span>{formatCurrency(productsPrice)}</span>
          </div>
        )}

        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>{frequencyLabel} discount</span>
            <span>-{formatCurrency(totalPrice * discount)}</span>
          </div>
        )}

        <div className="flex justify-between font-semibold pt-2 border-t">
          <span>Total</span>
          <span>{formatCurrency(finalPrice)}</span>
        </div>
      </div>
    </div>
  );
};