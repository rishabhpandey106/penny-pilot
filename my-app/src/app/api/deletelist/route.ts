import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Budgetdetail from '@/models/BudgetDetailSchema';

export async function POST(req: NextRequest) {
  try {
    const { _id } = await req.json();
    console.log(_id);

    const res = await Budgetdetail.findByIdAndDelete(_id);

    console.log(res);

    console.log("Item deleted from the database");

    return NextResponse.json({ message: "Deleted budget list in the database" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

connect();
