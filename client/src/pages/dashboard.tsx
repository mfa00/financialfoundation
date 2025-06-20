import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";
import { useState, useEffect } from "react"; // Ensure useEffect is imported
import { useCurrentCompany } from "@/hooks/use-current-company";
import { DashboardMetrics } from "@/components/dashboard-metrics";
import { ChartAccountsOverview } from "@/components/chart-accounts-overview";
import { RecentTransactions } from "@/components/recent-transactions";
import { OutstandingItems } from "@/components/outstanding-items";
import { QuickActions } from "@/components/quick-actions";
import { AddCompanyDialog } from "@/components/add-company-dialog";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [showAddCompanyDialog, setShowAddCompanyDialog] = useState(false);
  const { currentCompany, companies } = useCurrentCompany(); // Destructure companies

  // useEffect to show AddCompanyDialog for new users
  useEffect(() => {
    if (!currentCompany && companies && companies.length === 0) {
      setShowAddCompanyDialog(true);
    }
  }, [currentCompany, companies, setShowAddCompanyDialog]);

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!currentCompany) {
    // This message is shown when no company is selected.
    // If it's a new user (no companies), the dialog will open automatically.
    return (
      <>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-ibm-gray-100 mb-2">
              {companies && companies.length === 0 ? "Welcome to AccuBooks Pro!" : "No Company Selected"}
            </h2>
            <p className="text-ibm-gray-60 mb-4">
              {companies && companies.length === 0 ? "Let's get you started by creating your first company." : "Please select a company or create a new one to continue."}
            </p>
            {/* Button to manually open dialog is not strictly needed if auto-opens, but can be a fallback */}
            {companies && companies.length > 0 && (
               <Button onClick={() => setShowAddCompanyDialog(true)}>Create New Company</Button>
            )}
          </div>
        </div>
        {/* The AddCompanyDialog is rendered globally at the bottom of the main component structure,
            and its 'open' state is controlled by 'showAddCompanyDialog'.
            The useEffect hook correctly sets this state. So, no need to render it here again.
        */}
      </>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-ibm-gray-20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-ibm-gray-100">Dashboard</h1>
            <p className="text-ibm-gray-60">
              Welcome back, here's what's happening with {currentCompany.name}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/journal-entries">
              <Button className="bg-ibm-blue hover:bg-ibm-blue/90">
                <Plus className="mr-2 h-4 w-4" />
                New Transaction
              </Button>
            </Link>
            <div className="flex items-center space-x-2 text-ibm-gray-60">
              <Calendar className="h-4 w-4" />
              <span className="font-mono text-sm">{getCurrentDate()}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        {/* Financial Metrics */}
        <DashboardMetrics />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Transactions */}
          <RecentTransactions />

          {/* Quick Actions & Outstanding Items */}
          <div className="space-y-6">
            <QuickActions />
            <OutstandingItems />
          </div>
        </div>

        {/* Chart of Accounts Overview */}
        <ChartAccountsOverview />
      </main>

      <AddCompanyDialog 
        open={showAddCompanyDialog} 
        onOpenChange={setShowAddCompanyDialog} 
      />
    </div>
  );
}