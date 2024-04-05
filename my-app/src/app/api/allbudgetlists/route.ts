import { NextRequest , NextResponse } from 'next/server'
import { connect } from '@/dbConfig/dbConfig'
import BudgetList from '@/models/BudgetListSchema';

export async function POST(req : NextRequest){
    try {
        const {username} = await req.json();
        console.log(username);
        const list = await BudgetList.find({ username: username });
        console.log(list)
        console.log("retrive from database");

        return NextResponse.json({message: "All budget Lists retrieved from database" , data: list} , {status: 200});
        
    } catch (error:any) {
        return NextResponse.json({error: error.message} , {status: 500});
    }
}

connect();