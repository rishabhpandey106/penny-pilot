import { NextRequest , NextResponse } from 'next/server'
import { connect } from '@/dbConfig/dbConfig'
import Budgetdetail from '@/models/BudgetDetailSchema';

export async function POST(req : NextRequest){
    try {
        const reqbody = await req.json();
        const newdata = new Budgetdetail ({
            username: reqbody.username,
            name: reqbody.name,
            budgetid: reqbody.budgetid,
            amount: reqbody.amount,
            remaining: reqbody.remaining,
            suffix: reqbody.suffix,
            timestamp: reqbody.timestamp
        });
        console.log(newdata);
        await newdata.save();
        console.log("saved in database");

        return NextResponse.json({message: "New Budget List details saved in database"} , {status: 200});
        
    } catch (error:any) {
        return NextResponse.json({error: error.message} , {status: 500});
    }
}

connect();