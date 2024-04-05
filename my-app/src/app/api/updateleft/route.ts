import { NextRequest , NextResponse } from 'next/server'
import { connect } from '@/dbConfig/dbConfig'
import BudgetList from '@/models/BudgetListSchema';

export async function POST(req : NextRequest){
    try {
        const reqbody = await req.json();
        const newdata = await BudgetList.findByIdAndUpdate(reqbody._id , {left: reqbody.left})
        console.log(newdata);
        console.log("saved in database");

        return NextResponse.json({message: `Left attribute updated in databse ${reqbody.left}`} , {status: 200});
        
    } catch (error:any) {
        return NextResponse.json({error: error.message} , {status: 500});
    }
}

connect();