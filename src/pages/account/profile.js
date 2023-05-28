import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { CardHeader, Chip, Divider, Stack } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { blue, green, red } from "@mui/material/colors";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { color } from "@mui/system";
import * as React from "react";
import { useSelector } from "react-redux";

function Profile() {
  const userinfo = useSelector((state) => state.useInfos);
  return (
    <Card>
      <CardContent>
        <List>
          {[
            { title: "Email", value: userinfo.email },
            { title: "Mobile", value: userinfo.numberformat },
          ].map((info, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={info.title}
                primaryTypographyProps={{
                  component: "div",
                  variant: "body1",
                  gutterBottom: true,
                }}
                secondary={info.value}
                secondaryTypographyProps={{
                  variant: "body2",
                  color: green[800],
                }}
              />
            </ListItem>
          ))}

          {[
            {
              title: "Account status",
              value: userinfo.activated ? "Activated" : "Inactive",
              color: userinfo.activated ? green[800] : red[800],
            },
            {
              title: "Verification status",
              value: userinfo.Verificationstatus ? "Confirmed" : "Unconfirmed",
              color: userinfo.Verificationstatus ? green[800] : red[800],
            },
          ].map((info, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={info.title}
                primaryTypographyProps={{
                  component: "div",
                  variant: "body1",
                  gutterBottom: true,
                }}
                secondary={info.value}
                secondaryTypographyProps={{
                  variant: "body2",
                  color: info.color,
                }}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

export default Profile;

export const ProfileHeader = () => {
  const userinfo = useSelector((state) => state.useInfos);
  return (
    <CardHeader
      avatar={
        <Avatar
          sx={{ bgcolor: "#1A4DBE", width: 56, height: 56 }}
          alt="Remy Sharp"
          src={userinfo.image}
        />
      }
      title={`${userinfo.firstName} ${userinfo.lastName}`}
      subheader={`Country: ${userinfo.country}`}
      sx={{ textTransform: "capitalize" }}
    />
  );
};
