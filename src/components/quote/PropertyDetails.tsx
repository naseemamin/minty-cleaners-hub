import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PropertyDetailsProps {
  bedrooms: number;
  bathrooms: number;
  postcode: string;
  onUpdate: (field: string, value: any) => void;
}

export const PropertyDetails = ({ bedrooms, bathrooms, postcode, onUpdate }: PropertyDetailsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="postcode">Your postcode</Label>
        <Input
          id="postcode"
          value={postcode}
          onChange={(e) => onUpdate("postcode", e.target.value)}
          required
        />
      </div>

      <div>
        <Label>How many bedrooms need cleaning?</Label>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onUpdate("bedrooms", Math.max(1, bedrooms - 1))}
          >
            -
          </Button>
          <span>{bedrooms} bedroom{bedrooms !== 1 ? 's' : ''}</span>
          <Button
            type="button"
            variant="outline"
            onClick={() => onUpdate("bedrooms", bedrooms + 1)}
          >
            +
          </Button>
        </div>
      </div>

      <div>
        <Label>How many bathrooms need cleaning?</Label>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onUpdate("bathrooms", Math.max(1, bathrooms - 1))}
          >
            -
          </Button>
          <span>{bathrooms} bathroom{bathrooms !== 1 ? 's' : ''}</span>
          <Button
            type="button"
            variant="outline"
            onClick={() => onUpdate("bathrooms", bathrooms + 1)}
          >
            +
          </Button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Your cleaner will also clean your kitchen, lounge and common areas.
      </p>
    </div>
  );
};