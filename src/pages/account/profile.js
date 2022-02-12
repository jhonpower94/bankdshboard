import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { CardHeader, Chip, Divider, Stack } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";
import { useSelector } from "react-redux";

function Profile() {
  const userinfo = useSelector((state) => state.useInfos);
  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar
            sx={{ bgcolor: "#d20000", width: 56, height: 56 }}
            alt="Remy Sharp"
            src="/broken-image.jpg"
          />
        }
        title={`${userinfo.firstName} ${userinfo.lastName}`}
        subheader={`Country: ${userinfo.country}`}
      />
      <Divider />
      <CardContent>
        <List>
          {[
            { title: "Email", value: userinfo.email },
            { title: "Mobile", value: userinfo.numberformat },
            {
              title: "Account status",
              value: (
                <Stack spacing={3} direction={"row"}>
                  {["savings", "checkngs"].map((val, index) => (
                    <Chip
                      key={index}
                      label={val}
                      color="success"
                      size="small"
                      icon={<CheckCircleOutlineIcon />}
                    />
                  ))}
                </Stack>
              ),
            },
          ].map((info, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={info.title}
                secondary={info.value}
                secondaryTypographyProps={{ component: "div" }}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

export default Profile;
