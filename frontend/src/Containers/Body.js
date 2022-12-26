import { useState } from "react";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Paper from "@material-ui/core/Paper";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import styled from "styled-components";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
//advance todo
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { useStyles } from "../hooks";
import axios from "../api";
import { useScoreCard } from "../hooks/useScoreCard";

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1em;
`;

const StyledFormControl = styled(FormControl)`
  min-width: 120px;
`;

const ContentPaper = styled(Paper)`
  height: 300px;
  padding: 2em;
  overflow: auto;
`;

const Body = () => {
  const classes = useStyles();

  const {
    messages,
    addCardMessage,
    addRegularMessage,
    addErrorMessage,
    changeView,
  } = useScoreCard();

  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [score, setScore] = useState(0);
  const [info, setInfo] = useState([]);

  const [queryType, setQueryType] = useState("name");
  const [queryString, setQueryString] = useState("");

  const [value, setValue] = useState("add");

  const handleChange = (func) => (event) => {
    //console.log(event.target.value);
    func(event.target.value);
  };

  const handleAdd = async () => {
    const {
      data: { message, card },
    } = await axios.post("/card", {
      name,
      subject,
      score,
    });

    if (!card) addErrorMessage(message);
    else addCardMessage(message);
    getInfo("name", name);
  };

  const handleQuery = async () => {
    const {
      data: { messages, message },
    } = await axios.get("/cards", {
      params: {
        type: queryType,
        queryString,
      },
    });

    if (!messages) addErrorMessage(message);
    else addRegularMessage("query", ...messages);
    getInfo(queryType, queryString);
  };

  const getInfo = async (filter, content) => {
    const {
      data: { tmpInfo },
    } = await axios.get("/cards/info", {
      params: { filter, content },
    });
    setInfo(tmpInfo);
  };

  const advTable = () => {
    if (info.length === 0) return;
    else {
      return (
        <TableContainer component={Paper}>
          <Table sx={{ width: "100%" }} aria-label="info table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Subject</TableCell>
                <TableCell align="right">Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {info.map((dt, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {dt.name}
                  </TableCell>
                  <TableCell align="right">{dt.subject}</TableCell>
                  <TableCell align="right">{dt.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }
  };

  return (
    <Wrapper>
      <Box sx={{ width: "100%" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList aria-label="tab API">
              <Tab
                label="ADD"
                value="add"
                onClick={() => {
                  setValue("add");
                  changeView("ADD");
                  setInfo([]);
                }}
              ></Tab>
              <Tab
                label="QUERY"
                value="query"
                onClick={() => {
                  setValue("query");
                  changeView("QUERY");
                  setInfo([]);
                }}
              ></Tab>
            </TabList>
          </Box>
          <TabPanel value="add">
            <Row>
              {/* Could use a form & a library for handling form data here such as Formik, but I don't really see the point... */}
              <TextField
                className={classes.input}
                placeholder="Name"
                value={name}
                onChange={handleChange(setName)}
              />
              <TextField
                className={classes.input}
                placeholder="Subject"
                style={{ width: 240 }}
                value={subject}
                onChange={handleChange(setSubject)}
              />
              <TextField
                className={classes.input}
                placeholder="Score"
                value={score}
                onChange={handleChange(setScore)}
                type="number"
              />
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                disabled={!name || !subject}
                onClick={handleAdd}
              >
                Add
              </Button>
            </Row>
          </TabPanel>
          <TabPanel value="query">
            <Row>
              <StyledFormControl>
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    value={queryType}
                    onChange={handleChange(setQueryType)}
                  >
                    <FormControlLabel
                      value="name"
                      control={<Radio color="primary" />}
                      label="Name"
                    />
                    <FormControlLabel
                      value="subject"
                      control={<Radio color="primary" />}
                      label="Subject"
                    />
                  </RadioGroup>
                </FormControl>
              </StyledFormControl>
              <TextField
                placeholder="Query string..."
                value={queryString}
                onChange={handleChange(setQueryString)}
                style={{ flex: 1 }}
              />
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                disabled={!queryString}
                onClick={handleQuery}
              >
                Query
              </Button>
            </Row>
          </TabPanel>
        </TabContext>
      </Box>
      <ContentPaper variant="outlined">
        {advTable()}
        {messages.map((m, i) => (
          <Typography variant="body2" key={m + i} style={{ color: m.color }}>
            {m.message}
          </Typography>
        ))}
      </ContentPaper>
    </Wrapper>
  );
};

export default Body;
