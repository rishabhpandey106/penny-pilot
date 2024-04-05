import { NextRequest , NextResponse } from 'next/server'
import { connect } from '@/dbConfig/dbConfig'
import Budgetdetail from '@/models/BudgetDetailSchema';

export async function POST(req : NextRequest){
    try {
        const reqbody = await req.json();
        console.log(reqbody);
        const list = await Budgetdetail.find({ budgetid: reqbody._id });
        console.log(list)
        console.log("retrive from database");

        return NextResponse.json({message: "All budget Lists retrieved from database" , data: list} , {status: 200});
        
    } catch (error:any) {
        return NextResponse.json({error: error.message} , {status: 500});
    }
}

connect();