// Import the necessary types from react-router
import type { LoaderFunctionArgs } from "react-router";

export namespace Route {
  // Loader args type
  export type LoaderArgs = LoaderFunctionArgs;

  // Meta args type
  export type MetaArgs = {
    data: unknown;
    params: Record<string, string>;
  };

  // Define what the loader returns
  export type LoaderData = {
    releaseVersion: string;
    releaseDate: string;
    assets: Array<{
      name: string;
      browser_download_url: string;
    }>;
    releaseUrl: string;
    repoOwner: string;
    repoName: string;
  };
}
