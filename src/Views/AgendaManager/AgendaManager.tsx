import { useEffect, useState, useCallback, useRef } from "react";
import { generate } from "shortid";
import { useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import DateFnsUtils from "@date-io/date-fns";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardDatePickerProps,
} from "@material-ui/pickers";
import { Box, Typography, TextField, Button } from "@material-ui/core";

import { WorkItemTable, WorkItemView } from "../../Components";

import { useSettingsRepository, useAgendaRepository } from "../../Data";
import {
  copyPlanningPokerLinks,
  generateQueryUrl,
} from "./helpers/agendaHelpers";

import type { Agenda, WorkItem } from "../../Data";

interface FetchResponse extends Response {
  data?: any;
}

const AgendaManager = () => {
  const { enqueueSnackbar } = useSnackbar();
  // repos
  const { getToken, token, getBaseUrl, baseUrl } = useSettingsRepository();
  const {
    saveAgenda,
    agenda: agendaFromStorage,
    getAgenda,
  } = useAgendaRepository();

  // router state
  const { state: locationState } = useLocation<Record<"agendaId", string>>();

  // refs
  const fieldRef = useRef<HTMLInputElement>();
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  // local state
  const [workItemIdSearch, setWorkItemIdSearch] = useState<string>("");
  const [workItem, setWorkItem] = useState<WorkItem | null>(null);
  const [agenda, setAgenda] = useState<Agenda | null>({
    id: generate(),
    date: new Date(),
    workItems: [],
  });
  const [loading, setLoading] = useState(false);

  /**
   * gets the latest token value from the repository
   */
  useEffect(() => {
    getToken();
    getBaseUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Loads the agenda for edit from storage if id is container in router state
   */
  useEffect(() => {
    if (locationState?.agendaId !== undefined) {
      getAgenda(locationState.agendaId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Keeps agenda in local state in sync with agenda from storage
   */
  useEffect(() => {
    if (agendaFromStorage) {
      setAgenda(agendaFromStorage);
    }
  }, [agendaFromStorage]);

  /**
   * Handles changes to the date in the datepicker
   * @param dateToUpdate the date from the datepicker to save
   */
  const handleDateChange: KeyboardDatePickerProps["onChange"] = (
    dateToUpdate
  ) => {
    if (dateToUpdate !== null && agenda) {
      saveAgenda({
        ...agenda,
        date: dateToUpdate,
      });
    }
  };

  /**
   * onChange field handler for work item number
   * @param e - Change event triggered when searching for event
   */
  const handleWorkItemNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setWorkItemIdSearch(e.target.value);
  };

  /**
   * Removes a work item from the agenda
   * @param workItemId work item identifier to be removed from repository
   */
  const removeFromAgenda = (workItemId: number) => {
    if (agenda) {
      saveAgenda({
        ...agenda,
        workItems: agenda.workItems.filter(
          (workItem) => workItem.id !== workItemId
        ),
      });
    }
  };

  /**
   * Saves the current work item to the agenda in the repository
   */
  const handleAddToAgenda = () => {
    if (workItem !== null && agenda !== null) {
      saveAgenda({
        ...agenda,
        workItems: [...agenda.workItems, workItem],
      });
      setWorkItem(null);
      setWorkItemIdSearch("");
      fieldRef?.current?.focus();
    }
  };

  /**
   * Callback to retrieve work item from ADO
   */
  const getWorkItem = useCallback(
    async (workItemId: string) => {
      setLoading(true);
      try {
        const result: FetchResponse = await fetch(
          generateQueryUrl(baseUrl, Number(workItemId)),
          {
            headers: {
              Authorization: `Basic ${btoa("Basic:" + token)}`,
            },
          }
        );

        if (result.status === 404) {
          enqueueSnackbar(`No workitem found with id ${workItemId}`, {
            variant: "error",
          });
          return result;
        }

        if (result.ok) {
          const resultText = await result.text();

          result.data = JSON.parse(resultText);
        } else {
          throw new Error("unexpected error");
        }

        return result;
      } catch (err) {
        enqueueSnackbar(
          `Something went wrong, double check you supplied a token and base url in settings.`,
          {
            variant: "error",
          }
        );
        return err;
      } finally {
        setLoading(false);
      }
    },
    [enqueueSnackbar, token, baseUrl]
  );

  /**
   * Retrieves workitem from ADO on form submission
   * @param e submission event
   */
  const handleWorkItemLookup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { data, ok } = await getWorkItem(workItemIdSearch);

    if (ok) {
      setWorkItem({
        id: data?.id,
        title: data?.fields["System.Title"],
        category: data?.fields["SEL.WorkCategory"],
        storyPoints: data?.fields["Microsoft.VSTS.Scheduling.StoryPoints"],
        state: data?.fields["System.State"],
        link: `<a href='${data["_links"].html.href}'>${data?.fields["System.Title"]}</a>`,
      });
      confirmButtonRef?.current?.focus();
    }
  };

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
        New Agenda
      </Typography>
      <Box marginY={2} display="flex">
        <Box marginRight={3}>
          <Typography variant="subtitle1" color="textSecondary">
            Input the planned date of your refinement session, then search for
            work items to add to your agenda
          </Typography>
        </Box>
        <Box flexShrink={0}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              autoOk
              value={agenda?.date}
              onChange={handleDateChange}
              format="dd/MM/yyyy"
              placeholder="DD/MM/YYYY"
              variant="inline"
              inputVariant="outlined"
              orientation="landscape"
              label="Refinement Date"
              disableToolbar
            />
          </MuiPickersUtilsProvider>
        </Box>
      </Box>

      {/* Work Item Search */}
      <Box display="flex">
        <form onSubmit={handleWorkItemLookup}>
          <TextField
            variant="outlined"
            label="Work Item Number"
            name="work-item-id"
            id="work-item-id"
            value={workItemIdSearch}
            onChange={handleWorkItemNumberChange}
            inputRef={fieldRef}
          />
        </form>
        {agenda && agenda.workItems.length > 0 && (
          <Box
            display="flex"
            flexGrow={1}
            justifyContent="flex-end"
            alignItems="center"
          >
            <Button
              onClick={() => copyPlanningPokerLinks(agenda.workItems)}
              variant="contained"
            >
              Copy Links
            </Button>
          </Box>
        )}
      </Box>

      {/* Work Item Search Result */}
      <Box marginY={2} display="flex" justifyContent="center" minHeight={172}>
        {workItem && (
          <WorkItemView
            workItem={workItem}
            loading={loading}
            onClick={handleAddToAgenda}
            ref={confirmButtonRef}
          />
        )}
      </Box>

      {/* Work Items Table */}
      {agenda && agenda.workItems.length > 0 && (
        <Box marginBottom={1}>
          <WorkItemTable
            workItems={agenda.workItems}
            onDelete={removeFromAgenda}
          />
        </Box>
      )}
    </Box>
  );
};

export default AgendaManager;
