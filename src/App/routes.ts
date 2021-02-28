import { Landing, NewAgenda, Settings } from "../Views";

export interface Route {
  path: string;
  component: React.FunctionComponent;
  exact?: boolean;
}

export const routes: Route[] = [
  {
    path: "/newagenda",
    component: NewAgenda,
    exact: true,
  },
  {
    path: "/settings",
    component: Settings,
    exact: true,
  },
  {
    path: "",
    component: Landing,
  },
];
