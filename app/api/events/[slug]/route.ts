import { NextResponse } from "next/server";
import { Error as MongooseError } from "mongoose";

import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";

type EventRouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

type ErrorResponse = {
  message: string;
  error?: string;
};

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function buildErrorResponse(
  message: string,
  status: number,
  error?: string
) {
  const body: ErrorResponse = error ? { message, error } : { message };
  return NextResponse.json(body, { status });
}

function parseSlug(value: string | undefined): string {
  const normalizedSlug = value?.trim().toLowerCase();

  if (!normalizedSlug) {
    throw new Error("Missing event slug.");
  }

  if (!SLUG_PATTERN.test(normalizedSlug)) {
    throw new Error(
      "Invalid event slug. Use lowercase letters, numbers, and hyphens only."
    );
  }

  return normalizedSlug;
}

export async function GET(
  _request: Request,
  context: EventRouteContext
) {
  try {
    const { slug: rawSlug } = await context.params;
    const slug = parseSlug(rawSlug);

    await connectDB();

    // Return a plain object so the response is cleanly serializable.
    const event = await Event.findOne({ slug }).select("-__v").lean();

    if (!event) {
      return buildErrorResponse("Event not found.", 404);
    }

    return NextResponse.json(
      {
        message: "Event fetched successfully.",
        event,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === "Missing event slug." ||
        error.message ===
          "Invalid event slug. Use lowercase letters, numbers, and hyphens only."
      ) {
        return buildErrorResponse(error.message, 400);
      }
    }

    if (error instanceof MongooseError.ValidationError) {
      return buildErrorResponse("Validation failed.", 400, error.message);
    }

    console.error("Error fetching event by slug:", error);

    return buildErrorResponse(
      "Failed to fetch event.",
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}
