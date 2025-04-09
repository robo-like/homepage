import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";

export namespace Route {
  // Loader arguments type
  export type LoaderArgs = LoaderFunctionArgs;
  
  // Action arguments type
  export type ActionArgs = ActionFunctionArgs;
  
  // Meta arguments type
  export type MetaArgs = {
    data: unknown;
    params: Record<string, string>;
  };
  
  // Form data type for login
  export type LoginForm = {
    email: string;
    redirectTo?: string;
  };
  
  // Form data type for magic link confirmation
  export type ConfirmForm = {
    key: string;
  };
  
  // Loader data type for login
  export type LoginLoaderData = {
    error?: string;
  };
  
  // Action data type for login
  export type LoginActionData = {
    success: boolean;
    error?: string;
  };
  
  // Action data type for confirm
  export type ConfirmActionData = {
    success: boolean;
    redirectTo?: string;
    error?: string;
  };
  
  // Loader data type for success
  export type SuccessLoaderData = {
    userEmail?: string;
  };
}