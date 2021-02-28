import { Agenda } from "./index.d";

const { ipcRenderer } = window.require("electron");

/**
 * A repository used to perform CRUD operations on an Agenda
 */
const useAgendaRepository = () => {
  // TODO: experiment with making this call async
  const saveAgenda = (agenda: Agenda) => {
    return ipcRenderer.sendSync("save-agenda", agenda);
  };

  const getAgenda = (id: Agenda["id"]) => {};
  const getAllAgendas = () => {};
  const deleteAgenda = (id: Agenda["id"]) => {};

  return { saveAgenda, getAgenda, getAllAgendas, deleteAgenda };
};

export default useAgendaRepository;
