import type { Flair } from "../../codebooth-api/src/entities/Flair";

export type User = {
  id: string;
  githubId: string;
  name: string;
  email: string;
  image: string;
  github_url: string;
  location: string;
  company: string;
  bio: string;
  created_at: Date;
  updated_at: Date;
  verified: boolean;
  __flairs__: Array<Flair>;
  __teams__: Array<Team>;
  __stars__: Array<Star>;
  __teamsIn__: Array<TeamMember>;
  __projects__: Array<Project>;
};

export type Star = {
  id: string;
  user_id: string;
  liker_id: string;
  created_at: Date;
  updated_at: Date;
  __user__: User;
};

export type TeamMember = {
  id: string;
  user_id: string;
  team_id: string;
  team_name: string;
  status: string;
  request_seen: string;
  response_seen: string;
  created_at: Date;
  updated_at: Date;
  __team__: Team;
  __user__: User;
};

export type Team = {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
  created_at: Date;
  updated_at: Date;
  __user__: User;
  __projects__: Array<Project>;
  __members__: Array<TeamMember>;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
  user_id: string;
  team_id: string;
  created_at: Date;
  updated_at: Date;
  __user__: User;
  __team__: Team;
};

export type Activity = {
  message: string;
  read: boolean;
  date: Date;
};
