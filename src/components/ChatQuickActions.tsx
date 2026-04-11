import { FileText, Receipt, ClipboardList, Wrench, CreditCard, FileSignature, Send as SendIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ChatQuickActionsProps {
  role: "landlord" | "tenant" | null;
  conversationId: string;
  listingId?: string;
  onInsertMessage: (text: string) => void;
}

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  action: () => void;
}

export default function ChatQuickActions({ role, conversationId, listingId, onInsertMessage }: ChatQuickActionsProps) {
  const navigate = useNavigate();

  const landlordActions: QuickAction[] = [
    {
      icon: <ClipboardList className="h-4 w-4" />,
      label: "Application",
      action: () => onInsertMessage("📋 I'd like to send you a rental application. Please fill it out at your earliest convenience."),
    },
    {
      icon: <FileSignature className="h-4 w-4" />,
      label: "Agreement",
      action: () => navigate("/rental-forms"),
    },
    {
      icon: <Receipt className="h-4 w-4" />,
      label: "Invoice",
      action: () => navigate("/invoices"),
    },
    {
      icon: <FileText className="h-4 w-4" />,
      label: "Notice",
      action: () => onInsertMessage("📄 Please see the attached notice regarding your tenancy."),
    },
  ];

  const tenantActions: QuickAction[] = [
    {
      icon: <Wrench className="h-4 w-4" />,
      label: "Repair",
      action: () => navigate("/repair-request"),
    },
    {
      icon: <CreditCard className="h-4 w-4" />,
      label: "Payment",
      action: () => onInsertMessage("💳 I'd like to discuss a payment. Can you send me the details?"),
    },
    {
      icon: <ClipboardList className="h-4 w-4" />,
      label: "Lease Info",
      action: () => onInsertMessage("📋 Could you share the lease agreement details?"),
    },
  ];

  const actions = role === "tenant" ? tenantActions : landlordActions;

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto px-1 py-1.5 no-scrollbar">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={action.action}
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary active:bg-accent"
        >
          {action.icon}
          {action.label}
        </button>
      ))}
    </div>
  );
}
