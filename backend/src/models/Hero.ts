import mongoose, { Document, Schema } from 'mongoose';

export interface IHero extends Document {
  nom: string;
  alias: string;
  univers: string;
  pouvoirs: string[];
  description: string;
  image: string;
  origine: string;
  premiereApparition: string;
  createdAt: Date;
  updatedAt: Date;
}

const HeroSchema: Schema = new Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  },
  alias: {
    type: String,
    required: true,
    trim: true
  },
  univers: {
    type: String,
    required: true,
    enum: ['Marvel', 'DC', 'Autre']
  },
  pouvoirs: {
    type: [String],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  origine: {
    type: String,
    required: true
  },
  premiereApparition: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IHero>('Hero', HeroSchema);