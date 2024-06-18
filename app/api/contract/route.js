import { connect } from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const db = await connect();
        const [rows] = await db.query(`SELECT * FROM sc_details`);
        const data = rows;

        console.log('Fetched data:', data);

        return NextResponse.json({
            message: data,
            status: 'success'
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ message: error, status: 500 });
    }
}
export async function POST(request) {
    try {
        const { contract } = await request.json();
        console.log("Request Body:", contract);
        const db = await connect();
        const [rows] = await db.query(`SELECT id FROM user_contract_address where contract_addresses = ?`, [contract]);
        // const data = rows;
        let id = rows[0].id;

        console.log('Fetched data:', id);
        
        const [data] = await db.query(`SELECT transfer_wallet_name, transfer_wallet_address, transfer_percentage FROM sc_details where user_contract_address_id = ?`, [id]);
        
        console.log('Fetched data:', data);
        
        return NextResponse.json({
            message: data,
            status: 'success'
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ message: error, status: 500 });
    }
}

export async function PUT(request) {
    try {
        const data = await request.json();
        console.log("Request Body:", data);
        const filteredEntries = data.filter(data => data.percentage > 0);
        console.log("Filtered Entries:", filteredEntries);
        const values = filteredEntries.map(({name, wallet, percentage, id}) => [name, wallet, percentage, id]);

        console.log("Values:", values);

        const db = await connect();

        const [result] = await db.query(
            'INSERT INTO sc_details (transfer_wallet_name, transfer_wallet_address, transfer_percentage, user_contract_address_id) VALUES ?',
            [values]
        );

        console.log('Update result:', result);

        return NextResponse.json({
            message: 'Database updated successfully',
            status: 'success',
            affectedRows: result.affectedRows
        });
    } catch (error) {
        console.error('Error updating database:', error);
        return NextResponse.json({ message: error.message, status: 500 });
    }
}
export async function PATCH(request) {
    try {
        const { wallet, contractAddress } = await request.json();
        console.log("Wallet:", wallet);
        console.log("Contract Address:", contractAddress);

        const db = await connect();

        const [result] = await db.query(
            'UPDATE user_contract_address SET contract_addresses = ? WHERE wallet_address = ?',
            [contractAddress, wallet]
        );

        console.log('Update result:', result);

        return NextResponse.json({
            message: 'Database updated successfully',
            status: 'success',
            affectedRows: result.affectedRows
        });
    } catch (error) {
        console.error('Error updating database:', error);
        return NextResponse.json({ message: error.message, status: 500 });
    }
}

