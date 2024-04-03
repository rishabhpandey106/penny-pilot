'use client'
import React, { useState } from 'react'
import Dashboard from '@/components/navbar'
import Budgetlist from '@/components/budgetlist'
import MonthlyExpense from '@/components/monthlyexpense'

const homePage = () => {
  const [showBudgetList, setShowBudgetList] = useState(false);
  const [showMonthlyExpense, setShowMonthlyExpense] = useState(false);

  const handleBudgetListClick = () => {
    setShowBudgetList(true);
    setShowMonthlyExpense(false);
  };

  const handleMonthlyExpenseClick = () => {
    setShowMonthlyExpense(true);
    setShowBudgetList(false);
  };
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Dashboard
        onBudgetListClick={handleBudgetListClick}
        onMonthlyExpenseClick={handleMonthlyExpenseClick}
      />
      {showBudgetList && <Budgetlist />}
      {showMonthlyExpense && <MonthlyExpense />}
    </div>
  )
}

export default homePage;
