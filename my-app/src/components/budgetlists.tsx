import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const BudgetList = ({ budgets }: any) => {
  const [selectedBudget, setSelectedBudget] = useState<any>(null);
  const [amountToAdd, setAmountToAdd] = useState('');
  const [history, setHistory] = useState<any[]>([]);

  const handleSelectBudget = (budget: any) => {
    console.log(budget);
    setSelectedBudget(budget);
    setAmountToAdd(''); 
    setHistory([]); 
  };

  const handleAddAmount = () => {
    if (!selectedBudget) return;

    const newAmount = parseInt(amountToAdd);
    const newRemaining = selectedBudget.amountLimit - newAmount;
    const timestamp = new Date().toLocaleString();

    setSelectedBudget((prevState:any) => ({
      ...prevState,
      amountLimit: newRemaining,
    }));

    setHistory([
      ...history,
      { action: 'Added', amount: newAmount, remaining: newRemaining, timestamp, budgetId: selectedBudget.id },
    ]);

    setAmountToAdd(''); 
  };

  const handleRemoveAmount = () => {
    if (!selectedBudget) return;

    const newAmount = parseInt(amountToAdd);
    const newRemaining = selectedBudget.amountLimit + newAmount;
    const timestamp = new Date().toLocaleString(); 

    setSelectedBudget((prevState:any) => ({
      ...prevState,
      amountLimit: newRemaining,
    }));

    setHistory([
      ...history,
      { action: 'Removed', amount: newAmount, remaining: newRemaining, timestamp, budgetId: selectedBudget.id },
    ]);

    setAmountToAdd(''); 
  };

  const handleCloseCard = () => {
    setSelectedBudget(null); 
    setAmountToAdd(''); 
    setHistory([]); 
  };

  const getRemainingAmount = (budget: any) => {
    const historyForBudget = history.filter(item => item.budgetId === budget.id);
    const totalAddedAmount = historyForBudget.reduce((total, item) => {
      if (item.action === 'Added') {
        return total + item.amount;
      } else if (item.action === 'Removed') {
        return total - item.amount;
      }
      return total;
    }, 0);
    return budget.amountLimit - totalAddedAmount;
  };
  

  return (
    <div className="bg-white rounded-lg shadow-md p-4 my-5 lg:p-6">
      <h2 className="text-lg text-center lg:text-xl font-bold mb-4">
        {budgets.length > 0 ? "Budget Lists" : "Nothing to show! Create your first Budget list"}
      </h2>
      {selectedBudget && (
        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold">{selectedBudget.name}</h3>
            <Button size="sm" onClick={handleCloseCard}>Close</Button>
          </div>
          <p>Remaining Amount: {selectedBudget.amountLimit}</p>
          <div className="flex items-center mt-2">
            <Input
              type="number"
              className="border border-gray-300 rounded-lg px-3 py-2 mr-2 w-32"
              placeholder="Enter amount"
              value={amountToAdd}
              onChange={(e) => setAmountToAdd(e.target.value)}
            />
            <Button size="sm" className="w-20 mx-5" onClick={handleAddAmount}>Add</Button>
            <Button size="sm" className="w-20" onClick={handleRemoveAmount}>Remove</Button>
          </div>
          <ul className="mt-4">
                {history.map((item, index) => (
                    <li key={index} className="py-2 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                        <span className="text-sm">{item.action}</span>
                        <span className="text-xs text-gray-500">{item.timestamp}</span>
                        </div>
                        <div className="flex items-center">
                        <span className="text-sm">{item.amount}</span>
                        <span className="text-xs text-gray-500 ml-2">Remaining: {item.remaining}</span>
                        </div>
                    </div>
                    </li>
                ))}
            </ul>

        </div>
      )}
      {budgets.length > 0 && (
        <ul className="divide-y divide-gray-300">
          {budgets.map((budget: any) => (
            <li key={budget.id} className="py-2">
              <div className="flex justify-between items-center">
                <Button size="sm" className="w-auto" onClick={() => handleSelectBudget(budget)}>
                  {budget.name}
                </Button>
                <span className="text-base lg:text-lg">{budget.amountLimit - getRemainingAmount(budget)} / {budget.amountLimit}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BudgetList;
