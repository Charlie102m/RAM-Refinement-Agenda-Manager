import { Landing, AgendaManager, SavedAgendas, Settings } from "../Views";

export interface Route {
  path: string;
  component: React.FunctionComponent;
  exact?: boolean;
}

export const routes: Route[] = [
  {
    path: "/agendamanager",
    component: AgendaManager,
    exact: true,
  },
  {
    path: "/savedagendas",
    component: SavedAgendas,
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
    exact: true,
  },
];
