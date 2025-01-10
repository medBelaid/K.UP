export type IEmail = {
  id: string;
  address: string;
};

export type IEmailFilters = {
  address?: { equal: string; in: string[] } | null;
};

export type IAddEmail = Omit<IEmail, 'id'>;

export type EmailId = IEmail['id'];
