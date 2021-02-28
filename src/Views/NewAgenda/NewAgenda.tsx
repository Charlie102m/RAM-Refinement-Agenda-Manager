import { useEffect, useState, useCallback, useRef } from "react";
import { Box, Typography, TextField, Fab, Button } from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { useTokenRepository, useAgendaRepository } from "../../Data";
import AddIcon from "@material-ui/icons/Add";

import { WorkItemTable } from "../../Components";

import type { WorkItem } from "../../Data/index.d";

interface FetchResponse extends Response {
  data?: any;
}

const generateQueryUrl = (workItemId: WorkItem["id"]) =>
  `https://dev.azure.com/SelenityAllocate/Spend%20Management/_apis/wit/workitems/${workItemId}?api-version=6.0`;

const NewAgenda = () => {
  // TODO: see which states can be removed here
  const [date, setDate] = useState<Date | null>(new Date());
  const [workItemIdSearch, setWorkItemIdSearch] = useState<string>("");
  const [workItem, setWorkItem] = useState<WorkItem | null>(null);
  const [workItemList, setWorkItemList] = useState<Array<WorkItem>>([]);

  const fieldRef = useRef<HTMLInputElement>();
  const confirmButtonRef = useRef<HTMLButtonElement>();

  const { getToken, token } = useTokenRepository();
  const { saveAgenda } = useAgendaRepository();

  /**
   * gets the latest token value from the repository
   */
  useEffect(() => {
    getToken();
  }, [getToken]);

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
  // TODO: update this to remove duplicated local state if possible
  const removeFromAgenda = (workItemId: number) => {
    setWorkItemList((items) => items.filter((item) => item.id !== workItemId));
    saveAgendaToRepo(workItemList.filter((item) => item.id !== workItemId));
  };

  /**
   * Saves the current work item to the agenda in the repository
   */
  // TODO: update this to remove duplicated local state if possible
  const handleAddToAgenda = () => {
    if (workItem) {
      setWorkItemList((workItems) => [...workItems, workItem]);
      setWorkItem(null);
      setWorkItemIdSearch("");
      fieldRef?.current?.focus();
      saveAgendaToRepo([...workItemList, workItem]);
    }
  };

  /**
   * Callback used to save agenda to the repository
   */
  // TODO: update to accept entire agenda object as argument, consider id generation
  const saveAgendaToRepo = useCallback(
    (workItems: WorkItem[]) => {
      const agenda = saveAgenda({ id: 1, date, workItems });
      console.log(agenda);
    },
    [date, saveAgenda]
  );

  /**
   * Callback to Copy the formatted planning poker links to the users clipboard
   */
  const copyPlanningPokerLinks = useCallback(() => {
    const links = workItemList.reduce(
      (acc, item) =>
        acc +
        `${item.link}
    `,
      ""
    );
    navigator.clipboard.writeText(links);
  }, [workItemList]);

  /**
   * Callback to retrieve work item from ADO
   */
  const getWorkItem = useCallback(
    async (workItemId: string) => {
      const result: FetchResponse = await fetch(generateQueryUrl(workItemId), {
        headers: {
          Authorization: `Basic ${btoa("Basic:" + token)}`,
        },
      });

      const resultText = await result.text();

      result.data = JSON.parse(resultText);

      return result;
    },
    [token]
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
              value={date}
              onChange={(date) => setDate(date)}
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
        {workItem && (
          <Box marginTop={0.5} marginX={2}>
            <Fab
              color="primary"
              size="medium"
              onClick={handleAddToAgenda}
              innerRef={confirmButtonRef}
            >
              <AddIcon />
            </Fab>
          </Box>
        )}
        <Box
          display="flex"
          flexGrow={1}
          justifyContent="flex-end"
          alignItems="center"
        >
          <Typography>Agenda Count: {workItemList.length}</Typography>
        </Box>
      </Box>

      <Box marginY={2} textAlign="center" height={112}>
        {workItem && (
          <>
            <Typography paragraph variant="h6">
              {workItem.id} - {workItem.title}
            </Typography>
            <Box display="flex" justifyContent="space-around">
              {workItem.category && (
                <Box>
                  <Typography variant="button" color="textSecondary">
                    Category
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {workItem.category}
                  </Typography>
                </Box>
              )}
              {workItem.storyPoints && (
                <Box>
                  <Typography variant="button" color="textSecondary">
                    Story Points
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {workItem.storyPoints}
                  </Typography>
                </Box>
              )}
              {workItem.state && (
                <Box>
                  <Typography variant="button" color="textSecondary">
                    State
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {workItem.state}
                  </Typography>
                </Box>
              )}
            </Box>
          </>
        )}
      </Box>

      {workItemList.length > 0 && (
        <>
          <WorkItemTable workItems={workItemList} onDelete={removeFromAgenda} />
          <Box mt={2} textAlign="right">
            <Button onClick={copyPlanningPokerLinks} variant="outlined">
              Copy Planning Poker Links
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default NewAgenda;
