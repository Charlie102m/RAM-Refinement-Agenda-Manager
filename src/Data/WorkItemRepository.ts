import { Agenda, WorkItem } from "./index.d";

import {
  SAVEWORKITEM,
  GETWORKITEM,
  GETWORKITEMBYAGENDA,
  UPDATEWORKITEM,
  DELETEWORKITEM,
} from "./Requests";

// const { ipcRenderer } = window.require("electron");

/**
 * A repository used to perform CRUD operations on a WorkItem
 */
const useWorkItemRepository = () => {
  const saveWorkItem = (workItem: WorkItem, agendaId: Agenda["id"]) => {
    // ipcRenderer.send(SAVEWORKITEM, workItem, agendaId);
  };

  const getWorkItem = (workItemId: WorkItem["id"], agendaId: Agenda["id"]) => {
    // ipcRenderer.send(GETWORKITEM, workItemId, agendaId);
  };

  const getWorkItemsByAgenda = (agendaId: Agenda["id"]) => {
    // ipcRenderer.send(GETWORKITEMBYAGENDA, agendaId);
  };

  const updateWorkItem = (workItem: WorkItem, agendaId: Agenda["id"]) => {
    // ipcRenderer.send(UPDATEWORKITEM, workItem, agendaId);
  };

  const deleteWorkItem = (
    workItemId: WorkItem["id"],
    agendaId: Agenda["id"]
  ) => {
    // ipcRenderer.send(DELETEWORKITEM, workItemId, agendaId);
  };

  return {
    saveWorkItem,
    getWorkItem,
    getWorkItemsByAgenda,
    updateWorkItem,
    deleteWorkItem,
  };
};

export default useWorkItemRepository;
