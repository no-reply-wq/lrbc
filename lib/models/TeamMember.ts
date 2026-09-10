import mongoose, { Schema, type Document } from 'mongoose';

export interface ITeamMember extends Document {
  name: string; role: string; avatar_url: string;
  linkedin_url: string; object_position: string; sort_order: number;
}

const TeamMemberSchema = new Schema<ITeamMember>({
  name:            { type: String, required: true },
  role:            { type: String, default: '' },
  avatar_url:      { type: String, default: '' },
  linkedin_url:    { type: String, default: '' },
  object_position: { type: String, default: 'center top' },
  sort_order:      { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.TeamMember ??
  mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);
