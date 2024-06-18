import { connect } from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const db = await connect();
        const [rows] = await db.query(`SELECT * FROM user_contract_address`);
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
        const { wallet } = await request.json();
        console.log("Request Body:", wallet);
        const db = await connect();
        const [rows] = await db.query(`SELECT contract_addresses FROM user_contract_address where wallet_address = ?`, [wallet]);

        let data = [];
        for (let i = 0; i < rows.length; i++) {
            data.push(rows[i].contract_addresses)
        }

        const [id] = await db.query(`SELECT user_contract_address_id FROM sc_details where transfer_wallet_address = ?`, [wallet]);
        console.log("ID:", id);

        for (let i = 0; i < id.length; i++) {
            let x = id[i].user_contract_address_id;
            const [address] = await db.query(`SELECT contract_addresses FROM user_contract_address where id = ?`, [x]);
            console.log("Address:", address[0].contract_addresses);
            data.push(address[0].contract_addresses)
        }
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
        const { wallet, contractAddress } = await request.json();
        console.log("Wallet:", wallet);
        console.log("Contract Address:", contractAddress);

        const db = await connect();

        const [result] = await db.query(
            'INSERT INTO user_contract_address (contract_addresses, wallet_address) VALUES (?, ?)',
            [contractAddress, wallet]
        );

        console.log('Update result:', result);

        return NextResponse.json({
            message: 'Database updated successfully',
            status: 'success',
            affectedRows: result.affectedRows,
            affectedId: result.insertId
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

