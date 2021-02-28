import { Agenda } from "./index.d";

import { SAVEAGENDA } from "./Requests";

const { ipcRenderer } = window.require("electron");

/**
 * A repository used to perform CRUD operations on an Agenda
 */
const useAgendaRepository = () => {
  // TODO: experiment with making this call async
  const saveAgenda = (agenda: Agenda) => {
    return ipcRenderer.sendSync(SAVEAGENDA, agenda);
  };

  const getAgenda = (id: Agenda["id"]) => {};
  const getAllAgendas = () => {};
  const deleteAgenda = (id: Agenda["id"]) => {};

  return { saveAgenda, getAgenda, getAllAgendas, deleteAgenda };
};

export default useAgendaRepository;
