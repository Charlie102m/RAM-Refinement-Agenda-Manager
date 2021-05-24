import { useState, useEffect } from "react";

import { Agenda } from "./";

const { ipcRenderer } = window.require("electron");

/**
 * A repository used to perform CRUD operations on an Agenda
 */
const useAgendaRepository = () => {
  const [agenda, setAgenda] = useState<Agenda | null>(null);
  const [agendas, setAgendas] = useState<Agenda[]>([]);

  const saveAgenda = (agenda: Agenda) => {
    console.log("save-agenda", agenda);
    ipcRenderer.send("save-agenda", agenda);
  };

  const getAgenda = (id: Agenda["id"]) => {
    console.log("get-agenda", id);
    ipcRenderer.send("get-agenda", id);
  };

  const getAllAgendas = () => {
    console.log("get-agendas");
    ipcRenderer.send("get-agendas");
  };

  const deleteAgenda = (id: Agenda["id"]) => {
    console.log("delete-agenda", id);
    ipcRenderer.send("delete-agenda", id);
  };

  const handleAgendaResponse = (_: any, agenda: Agenda) => {
    console.log("get-agenda-response", agenda);
    setAgenda(agenda);
  };

  useEffect(() => {
    ipcRenderer.on("get-agenda-response", handleAgendaResponse);
    return () => {
      ipcRenderer.removeListener("get-agenda-response", handleAgendaResponse);
    };
  });

  const handleAgendasResponse = (_: any, agendas: Agenda[]) => {
    console.log("get-agendas-response", agendas);
    setAgendas(agendas);
  };

  useEffect(() => {
    ipcRenderer.on("get-agendas-response", handleAgendasResponse);
    return () => {
      ipcRenderer.removeListener("get-agendas-response", handleAgendasResponse);
    };
  });

  return {
    saveAgenda,
    getAgenda,
    getAllAgendas,
    deleteAgenda,
    agenda,
    agendas,
  };
};

export default useAgendaRepository;
