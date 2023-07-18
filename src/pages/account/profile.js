import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { CardHeader, Chip, Container, Divider, Stack } from "@mui/material";
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
import { StyledCard } from "../components/styledcomponents";

function Profile() {
  const userinfo = useSelector((state) => state.useInfos);
  return (
    <Container maxWidth="xs">
      <StyledCard variant="outlined">
        <CardContent>
          <List>
            {[
              { title: "Email", value: userinfo.email },
              { title: "Country", value: userinfo.country },
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
                value: userinfo.Verificationstatus
                  ? "Confirmed"
                  : "Unconfirmed",
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
      </StyledCard>
    </Container>
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
      title="Welcome !"
      subheader={`${userinfo.firstName} ${userinfo.lastName}`}
      sx={{ textTransform: "capitalize" }}
      titleTypographyProps={{ variant: "h5" }}
      subheaderTypographyProps={{ variant: "h6" }}
    />
  );
};
