import { Separator } from "@/components/ui/separator";
import { BillingForm } from "./billing-form";

export default function SettingsProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Billing</h3>
        <p className="text-sm text-muted-foreground">Manage your billing information and view your invoices.</p>
      </div>
      <Separator />
      <BillingForm />
    </div>
  );
}
