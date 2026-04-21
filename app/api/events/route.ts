import Event from "@/database/event.model";
import { NextRequest,NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";


export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const forData = await request.formData();

        let event;

        try {
            event = Object.fromEntries(forData.entries());
        } catch (error) {
            console.error('Error parsing form data:', error);
            return NextResponse.json({ message: 'Invalid form data', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
        }

        const createdEvent = await Event.create(event);

        return NextResponse.json({ message: 'Event created successfully', event: createdEvent }, { status: 201 });

    } catch (error) {
        console.error('Error creating event:', error);
        return NextResponse.json({ message: 'Failed to create event', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }   
}
