import type { WorkItem, BaseUrl } from "../../../Data";

/**
 * Callback to Copy the formatted planning poker links to the users clipboard
 * @param workItemList the workitems to format into links
 */
export const copyPlanningPokerLinks = (workItemList: WorkItem[]) => {
  const links = workItemList
    .reduce(
      (acc, item) =>
        acc +
        `${item.link}
    `,
      ""
    )
    .trim();
  navigator.clipboard.writeText(links);
};

/**
 * Generates the url for retreiving a work item from ADO
 * @param workItemId the workitem id to search for
 * @param baseUrl the base url to prefix the workitem id
 */
export const generateQueryUrl = (
  baseUrl: BaseUrl,
  workItemId: WorkItem["id"]
) => `${baseUrl}${workItemId}?api-version=6.0`;
