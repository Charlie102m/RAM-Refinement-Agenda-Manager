import { useMemo } from "react";

import { IconButton } from "@material-ui/core";

import DeleteForeverRoundedIcon from "@material-ui/icons/DeleteForeverRounded";

import type { WorkItem } from "../../../Data";

import type { Column } from "react-table";

import { BaseTable } from "../..";

import { fromCamelCase } from "../helpers/tableHelpers";

interface Props {
  workItems: WorkItem[];
  onDelete: (workItemId: WorkItem["id"]) => void;
}

const WorkItemTable = ({ workItems, onDelete }: Props) => {
  const columns = useMemo(() => {
    const headers: Column<{ [key: string]: any }>[] = Object.keys(
      workItems[0]
    ).map((key) => ({
      Header: fromCamelCase(key),
      accessor: key,
      show: key !== "link",
    }));

    headers.push({
      Header: "Delete",
      accessor: (r) => r.id,
      Cell: ({ value }: { value: any }) => (
        <IconButton onClick={() => onDelete(value)}>
          <DeleteForeverRoundedIcon />
        </IconButton>
      ),
    });

    return headers;
  }, [workItems, onDelete]);

  return <BaseTable data={workItems} columns={columns} />;
};

export default WorkItemTable;
