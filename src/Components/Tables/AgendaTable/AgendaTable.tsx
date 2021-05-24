import { IconButton } from "@material-ui/core";
import { format, parseISO } from "date-fns";
import { useHistory } from "react-router-dom";

import DeleteForeverRoundedIcon from "@material-ui/icons/DeleteForeverRounded";
import EditRoundedIcon from "@material-ui/icons/EditRounded";

import { BaseTable } from "../..";

import type { Column } from "react-table";

import type { Agenda, WorkItem } from "../../../Data";

interface Props {
  agendas: Agenda[];
  onDelete: (agendaId: Agenda["id"]) => void;
}

const AgendaTable = ({ agendas, onDelete }: Props) => {
  const { push } = useHistory();
  const columns: Column<{ [key: string]: any }>[] = [
    {
      Header: "Date",
      accessor: "date",
      Cell: ({ value }: { value: string }) =>
        format(parseISO(value), "dd/MM/yyyy"),
    },
    {
      Header: "Work Items",
      accessor: "workItems",
      Cell: ({ value }: { value: WorkItem[] }) => value.length,
    },
    {
      Header: "Edit",
      accessor: (r) => r.id,
      Cell: ({ value }: { value: any }) => (
        <IconButton
          onClick={() =>
            push({ pathname: "/agendamanager", state: { agendaId: value } })
          }
        >
          <EditRoundedIcon />
        </IconButton>
      ),
    },
    {
      Header: "Delete",
      accessor: (r) => r.id,
      Cell: ({ value }: { value: any }) => (
        <IconButton onClick={() => onDelete(value)}>
          <DeleteForeverRoundedIcon />
        </IconButton>
      ),
    },
  ];

  return <BaseTable data={agendas} columns={columns} />;
};

export default AgendaTable;
