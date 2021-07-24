export type Flair = {
  id: string;
  name: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

export type Activity = {
  id: string;
  user_id: string;
  title: string;
  action: string;
  entity: string;
  description: string;
  read_at: boolean;
  created_at: Date;
  updated_at: Date;
};

export type User = {
  id: string;
  github_id: string;
  name: string;
  email: string;
  image: string;
  github_url: string;
  location: string;
  company: string;
  description: string;
  created_at: Date;
  updated_at: Date;
  is_verified: boolean;
  flairs: Array<Flair>;
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
  request_seen: boolean;
  response_seen: boolean;
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
