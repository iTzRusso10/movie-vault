import { Route } from "next";
import { UrlObject } from "url";

export type Href<T extends string> = Route<T> | TypedUrlObject<T>;
type TypedUrlObject<T extends string> = Omit<UrlObject, "pathname"> & {
  pathname: Route<T>;
};
