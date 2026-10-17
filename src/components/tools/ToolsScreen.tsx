import React, { useState } from 'react';
import ToolsListScreen from './ToolsListScreen';
import CalculatorTools from './CalculatorTools';
import FinancialTools from './FinancialTools';
import StockTools from './StockTools';
import PaymentTools from './PaymentTools';

export default function ToolsScreen() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const handleBack = () => setSelectedTool(null);

  if (!selectedTool) {
    return <ToolsListScreen onSelectTool={setSelectedTool} />;
  }

  // Route to correct tool component
  const calculatorTools = ['profit-calc', 'price-setter', 'break-even', 'bargain-helper'];
  const financialTools = ['monthly-cost', 'loan-checker', 'savings-goal', 'bill-splitter'];
  const stockTools = ['udhaar-tracker', 'stock-reorder', 'festival-planner'];
  const paymentTools = ['digital-payments'];

  if (calculatorTools.includes(selectedTool)) {
    return <CalculatorTools toolId={selectedTool} onBack={handleBack} />;
  }
  if (financialTools.includes(selectedTool)) {
    return <FinancialTools toolId={selectedTool} onBack={handleBack} />;
  }
  if (stockTools.includes(selectedTool)) {
    return <StockTools toolId={selectedTool} onBack={handleBack} />;
  }
  if (paymentTools.includes(selectedTool)) {
    return <PaymentTools toolId={selectedTool} onBack={handleBack} />;
  }

  return <ToolsListScreen onSelectTool={setSelectedTool} />;
}
