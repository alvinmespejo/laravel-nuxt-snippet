declare global {
  interface APIResponseError {
    [key: string]: string | string[];
  }

  interface User {
    id: number;
    name: string;
    email: string;
  }

  interface RegistrationPayload {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    remember_me?: boolean;
  }

  interface Step {
    uuid: string;
    title: string;
    body: string;
    order: number;
  }

  interface Snippet {
    uuid: string;
    title: string;
    step_counts: number;
    is_public: boolean;
    owner?: boolean;
    steps?: Step[];
    author: User;
  }

  interface SnippetResponse {
    uuid: string;
    title: string | null;
    step_counts: number;
    is_public: boolean;
    owner?: boolean;
    steps?: Step[];
    author: User;
  }
}
