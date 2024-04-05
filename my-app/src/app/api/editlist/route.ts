import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Budgetdetail from '@/models/BudgetDetailSchema';

export async function POST(req: NextRequest) {
  try {
    const updatedHistory = await req.json();
    console.log(updatedHistory);

    const updatedItems = [];
    for (const item of updatedHistory) {
      const newdata = {
        amount: item.amount,
        remaining: item.remaining
      };
      const updatedItem = await Budgetdetail.findByIdAndUpdate(item._id, newdata, { new: true });
      updatedItems.push(updatedItem);
      console.log("Item updated:", updatedItem);
    }

    console.log("All items updated in database");

    return NextResponse.json({ message: "Edited budget lists in the database", data: updatedItems }, { status: 200 });
        
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

connect();
