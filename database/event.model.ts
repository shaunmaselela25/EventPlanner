import mongoose, { Document, Schema } from 'mongoose';

// Interface for the Event document
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Event schema definition
const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    overview: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    mode: { type: String, required: true, trim: true },
    audience: { type: String, required: true, trim: true },
    agenda: { type: [String], required: true },
    organizer: { type: String, required: true, trim: true },
    tags: { type: [String], required: true },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Function to generate URL-friendly slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

// Pre-save hook for slug generation, date normalization, and validation
eventSchema.pre<IEvent>('save', async function (next) {
  // Generate slug only if title has changed or is new
  if (this.isModified('title') || this.isNew) {
    this.slug = generateSlug(this.title);
  }

  // Normalize date to ISO format
  if (this.isModified('date') || this.isNew) {
    const dateObj = new Date(this.date);
    if (isNaN(dateObj.getTime())) {
      return next(new Error('Invalid date format'));
    }
    this.date = dateObj.toISOString().split('T')[0]; // Store as YYYY-MM-DD
  }

  // Normalize time to HH:MM format
  if (this.isModified('time') || this.isNew) {
    const timeRegex = /^(\d{1,2}):(\d{2})$/;
    const match = this.time.match(timeRegex);
    if (!match) {
      return next(new Error('Invalid time format. Use HH:MM'));
    }
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return next(new Error('Invalid time values'));
    }
    this.time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  // Validate required array fields are not empty
  if (this.agenda.length === 0) {
    return next(new Error('Agenda cannot be empty'));
  }
  if (this.tags.length === 0) {
    return next(new Error('Tags cannot be empty'));
  }

  next();
});

// Add unique index on slug
eventSchema.index({ slug: 1 }, { unique: true });

// Create and export the Event model
const Event = mongoose.model<IEvent>('Event', eventSchema);
export default Event;