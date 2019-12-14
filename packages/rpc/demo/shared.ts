import { effect as T } from "@matechs/effect";
import * as RPC from "@matechs/rpc";
import * as H from "@matechs/http-client";
import { Option } from "fp-ts/lib/Option";

// environment entries
export const placeholderJsonEnv: unique symbol = Symbol();

// simple todo interface
export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

// describe the service we want to expose
export interface PlaceholderJson extends RPC.Remote<PlaceholderJson> {
  [placeholderJsonEnv]: {
    getTodo: (n: number) => T.Effect<H.RequestEnv, string, Option<Todo>>;
  };
}

// dumb impl for client generation
export const placeholderJsonSpec: PlaceholderJson = {
  [placeholderJsonEnv]: {
    getTodo: {} as any
  }
};
