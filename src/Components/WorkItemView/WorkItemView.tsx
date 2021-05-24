import { forwardRef } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Fab,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { Skeleton } from "@material-ui/lab";

import { WorkItem } from "../../Data";

interface Props {
  workItem: WorkItem;
  loading: boolean;
  onClick: () => void;
}

const WorkItemView = forwardRef<HTMLButtonElement, Props>(
  ({ workItem, loading, onClick }, ref) => {
    return (
      <Card raised={true} style={{ width: 500 }}>
        {loading ? (
          <Skeleton variant="rect" animation="wave" height={172} />
        ) : (
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              mb={2}
              alignItems="center"
            >
              <Typography color="textSecondary">{workItem.id}</Typography>
              <Chip
                label={workItem.state}
                color="secondary"
                variant="outlined"
              />
            </Box>

            <Typography variant="h6" gutterBottom paragraph>
              {workItem.title}
            </Typography>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body1" gutterBottom color="textSecondary">
                Category: {workItem.category || "none"}
              </Typography>
              <Typography variant="body1" gutterBottom color="textSecondary">
                Story Points: {workItem.storyPoints || "none"}
              </Typography>
              <Fab ref={ref} onClick={onClick} size="small">
                <AddIcon />
              </Fab>
            </Box>
          </CardContent>
        )}
      </Card>
    );
  }
);

export default WorkItemView;
