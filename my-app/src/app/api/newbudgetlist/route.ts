import { NextRequest , NextResponse } from 'next/server'
import { connect } from '@/dbConfig/dbConfig'
import BudgetList from '@/models/BudgetListSchema';

export async function POST(req : NextRequest){
    try {
        const reqbody = await req.json();
        const newdata = new BudgetList ({
            name: reqbody.name,
            amount: reqbody.amount,
            left: reqbody.amount
        });
        console.log(reqbody.amount , reqbody.name);
        console.log(newdata)
        await newdata.save();
        console.log("saved in database");

        return NextResponse.json({message: "New Budget List saved in database"} , {status: 200});
        
    } catch (error:any) {
        return NextResponse.json({error: error.message} , {status: 500});
    }
}

connect();