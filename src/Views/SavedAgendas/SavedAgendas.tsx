import { useEffect } from "react";

import { Box, Typography } from "@material-ui/core";

import { AgendaTable } from "../../Components";

import { useAgendaRepository } from "../../Data";

const SavedAgendas = () => {
  const { agendas, getAllAgendas, deleteAgenda } = useAgendaRepository();

  useEffect(() => {
    getAllAgendas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      flexGrow={1}
      alignSelf="flex-start"
      textAlign="left"
    >
      {/* Summary & DatePicker */}
      <Typography variant="h1" color="textPrimary">
        Saved Agendas
      </Typography>
      <Box marginY={2}>
        <AgendaTable agendas={agendas} onDelete={deleteAgenda} />
      </Box>
    </Box>
  );
};

export default SavedAgendas;
