import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import axios from 'axios';
import {Trash2 , Pencil} from 'lucide-react'

interface BudgetListProps {
  budgets: any[]; 
}

const BudgetList: React.FC<BudgetListProps> = ({ budgets }: any) => {
  const [selectedBudget, setSelectedBudget] = useState<any>(null);
  const [amountToAdd, setAmountToAdd] = useState('');
  const [history, setHistory] = useState<any[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState<string>('');
  const [updatedamount, setupdatedamount] = useState(0)

  const handleSelectBudget = async (budget: any) => {
    console.log(budget);
    const res = await axios.post("/api/budgetdetail" , budget);
    console.log(res);
    setSelectedBudget(budget);
    setAmountToAdd(''); 
    setHistory(res.data.data); 
  };
  
  const handleAddAmount = async () => {
    if (!selectedBudget) return;

    const lastHistoryItem = history[history.length - 1];
    const leftAmount = lastHistoryItem.remaining;
    const newAmount = parseInt(amountToAdd);
    const newRemaining = leftAmount - newAmount;
    const timestamp = new Date().toLocaleString();

    const data = {
      username: 'rishabh',
      name: selectedBudget.name,
      budgetid: selectedBudget._id,
      amount: newAmount,
      remaining: newRemaining,
      suffix: 'Added',
      timestamp: timestamp
    }
    const res = await axios.post("/api/savebudgetdetails" , data);
    console.log(res);
    setSelectedBudget((prevState:any) => ({
      ...prevState,
      amount: newRemaining,
    }));
    console.log(selectedBudget._id);
    setHistory([
      ...history,
      { suffix: 'Added', amount: newAmount, remaining: newRemaining, timestamp, budgetId: selectedBudget._id },
    ]);

    setAmountToAdd(''); 
  };

  const handleRemoveAmount = async () => {
    if (!selectedBudget) return;
    const lastHistoryItem = history[history.length - 1];
    const leftAmount = lastHistoryItem.remaining;
    const newAmount = parseInt(amountToAdd);
    const newRemaining = leftAmount + newAmount;
    const timestamp = new Date().toLocaleString(); 

    const data = {
      username: 'rishabh',
      name: selectedBudget.name,
      budgetid: selectedBudget._id,
      amount: newAmount,
      remaining: newRemaining,
      suffix: 'Removed',
      timestamp: timestamp
    }
    const res = await axios.post("/api/savebudgetdetails" , data);
    console.log(res);

    setSelectedBudget((prevState:any) => ({
      ...prevState,
      amount: newRemaining,
    }));

    setHistory([
      ...history,
      { suffix: 'Removed', amount: newAmount, remaining: newRemaining, timestamp, budgetId: selectedBudget._id },
    ]);

    setAmountToAdd(''); 

  };

  const handleCloseCard = async () => {
    const lastHistoryItem = history[history.length - 1];
    const leftAmount = lastHistoryItem.remaining;
    setSelectedBudget((prevState: any) => ({
      ...prevState,
      left: leftAmount,
    }));
    const data = {
      _id: selectedBudget._id,
      left: leftAmount,
    };
    console.log("cradclose", data);
    const res = await axios.post("/api/updateleft", data);
    console.log(res);
    setSelectedBudget(null); 
    setAmountToAdd(''); 
    setHistory([]); 
    setEditMode(false);
    // window.location.reload();
  };

  const getRemainingAmount = (budget: any) => {
    
    const historyForBudget = history.filter(item => item.budgetId === budget._id);
    const totalAddedAmount = historyForBudget.reduce((total, item) => {
      if (item.action === 'Added') {
        return total + item.amount;
      } else if (item.action === 'Removed') {
        return total - item.amount;
      }
      return total;
    }, 0);
    return budget.amount - totalAddedAmount;
  };

  const handleEditBudget = async (itemid:any) => {
    setEditItemId(itemid);
    setEditMode(true); 
  };

  const handleSaveBudget = async () => {
    let flag = false;
    let suffix0 = '';
    let add = 0;
    if (selectedBudget && editItemId) {
      const updatedHistory = history.map(item => {
        if (item._id === editItemId) {
          flag = true;
          let rem = 0
          if (item.suffix === 'Removed') {
            rem = item.amount - updatedamount + item.remaining;
            add =  item.amount - updatedamount
            suffix0 = 'Removed'
          } else if(item.suffix === 'Added') {
            rem = updatedamount - item.amount + item.remaining;
            add = updatedamount - item.amount
            suffix0 = 'Added'
          }
          console.log("rem", rem)
          return { ...item, amount: parseInt(item.amount) , remaining: rem }; 
        }
        else if (flag){
          let rem1;
          if(suffix0 === 'Added')
            rem1 = add + item.remaining;
          else if(suffix0 === 'Removed')
            rem1 = add + item.remaining;
          console.log("rem", rem1)
          return { ...item, amount: parseInt(item.amount) , remaining: parseInt(rem1) }; 
        }
        return item;
      });
      setHistory(updatedHistory)
      await axios.post("/api/editlist", updatedHistory);
      console.log("Budget details updated.");
      console.log("updatedhistory" , updatedHistory);
      setEditItemId('');
      setEditMode(false);
    }
  };
  const settheupdatedamount = (amount:any) => {
    console.log(amount);
    setupdatedamount(parseInt(amount));
  }

  const handleDeleteItem = async (itemId:any) => {
    console.log(itemId)
    const res = await axios.post("/api/deletelist" , { _id: itemId })
    console.log("deleted from database" , res);
    // const updatedHistory = history.filter(item => item._id !== itemId);
    let flag = false;
    let suffix = '';
    let quantity = 0;
    const updatedHistory = history.map(item => {
      if(item._id == itemId)
        {
          //delete that item
          flag = true;
          suffix = item.suffix;
          quantity = item.amount;
          return null;
        }
        else if(flag)
          {
            let rem;
            if(suffix === 'Added')
              {
                rem = item.remaining + quantity;
              }
            else if(suffix === 'Removed')
              {
                rem = item.remaining - quantity;
              }
            return { ...item, remaining: parseInt(rem) }
          }

        return item;
    }).filter(Boolean);
    await axios.post("/api/editlist", updatedHistory);
    console.log("Budget details updated.");
    setHistory(updatedHistory);
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
              <Button size="sm" variant="destructive" onClick={handleCloseCard}>Close</Button>
            </div>
          <p>Remaining Amount: {history.length > 0 ? history[history.length - 1].remaining : selectedBudget.left}</p>
          <div className="flex items-center mt-2">
            <Input
              type="number"
              className="border border-gray-300 rounded-lg px-3 py-2 mr-2 w-32"
              placeholder="Enter amount"
              value={amountToAdd}
              onChange={(e) => setAmountToAdd(e.target.value)}
            />
            <Button size="sm" className="w-20 mx-5 hover:bg-orange-200 hover:text-orange-600" onClick={handleAddAmount}>Add</Button>
            <Button size="sm" className="w-20 hover:bg-green-200 hover:text-green-600" onClick={handleRemoveAmount}>Remove</Button>
          </div>
          <ul className="mt-4">
                {history.map((item, index) => (
                    <li key={index} className={item.suffix === 'Removed' ? 'py-2 border-b border-t-2 hover:border-t-green-600 hover:bg-green-100' : 'py-2 border-t-2 border-b hover:border-t-orange-600 hover:bg-orange-100'}>
                    {editMode && editItemId === item._id ? (
                      <div className="flex justify-between items-center mb-2">
                        <Input
                          type="number"
                          className="border border-gray-300 rounded-lg px-3 py-2 mr-2 w-32"
                          value={item.amount}
                          onChange={(e) => {
                            const updatedHistory = history.map(historyItem => {
                              if (historyItem._id === editItemId) {
                                return { ...historyItem, amount: e.target.value };
                              }
                              return historyItem;
                            });
                            setHistory(updatedHistory);
                          }}
                        />
                        <Button size="sm" className='hover:bg-blue-400 hover:text-black' onClick={handleSaveBudget}>Save</Button>
                      </div>
                    ) : (
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                        <span className={item.suffix === 'Removed' ? 'text-sm text-green-600 font-bold' : 'font-bold text-sm text-orange-500'}>{item.suffix}</span>
                        <span className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center">
                        <span className={item.suffix === 'Removed' ? 'text-sm text-green-600 font-bold' : 'font-bold text-sm text-orange-500'}>{item.amount}</span>
                        <span className="text-xs text-gray-500 ml-2 mx-5">Remaining: {item.remaining}</span>
                        <Button className='bg-gray-100 hover:bg-gray-200 mx-2' size="icon">
                          <Pencil color="#000000" className="h-4 w-4" onClick={() => {handleEditBudget(item._id)
                          settheupdatedamount(item.amount)}}/>
                        </Button>
                        <Button className='bg-gray-100 hover:bg-gray-200' size="icon" onClick={() => handleDeleteItem(item._id)}>
                          <Trash2 color="#000000" className="h-4 w-4"/>
                        </Button>
                        </div> 
                    </div>
                    )}
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
                <span className="text-base lg:text-lg">{budget.amount}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BudgetList;
