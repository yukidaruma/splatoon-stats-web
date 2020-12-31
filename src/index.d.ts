declare namespace NodeJS {
  export interface ProcessEnv {
    APP_NAME: string;
    REPO_URL: string;
    SPLATOON_STATS_API_URL?: string;
  }
}

type Nullable<T> = null | T;
