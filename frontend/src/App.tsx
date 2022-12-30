import { useState } from "react";
import "./App.css";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { CSVLink } from "react-csv";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Button,
  Box,
  CircularProgress,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";

function App() {
  const [website, setWebsite] = useState(
    "https://www.snapdeal.com/search?keyword="
  );
  const [searchField, setSearchField] = useState("earphones");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const clickHandler = () => {

    setLoading(true);
    setError(false);
    setErrorMessage("")
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ website, searchField }),
    };
    //Port set at 5001
    fetch("http://localhost:5001/getData", requestOptions)
      .then((response) => response.json())
      .then((data: any) => {
        console.log(data);
        console.log(data.data.length);

        if (data.data.length) {
          console.log("DATA FOUND")
          setResults(data.data);
        } else {
          if (data.data.length === 0) {
            setResults([]);
            setError(true);
            setErrorMessage("No Data Found");
          } else {
            setResults([]);
            setError(true);
            setErrorMessage("true");
          }
        }

        setLoading(false);
      })
      .catch((error) => {
        console.log(error.message);
        setError(true);
        setErrorMessage(error.message);
        setLoading(false);
      });
  };

  return (
    <Container>
      <div className="App">
        {/* <Form> */}
        <Row>
          <Alert key="primary" variant="primary">
            {website}
            {searchField}
          </Alert>
          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <Select
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            >
              <MenuItem value="https://www.snapdeal.com/search?keyword=">
                Snapdeal
              </MenuItem>
              <MenuItem value="https://www.amazon.in/s?k=">Amazon</MenuItem>
              <MenuItem value="https://www.flipkart.com/search?q=">
                Flipkart
              </MenuItem>
            </Select>

            <TextField
              size="medium"
              label="Search Field"
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              type="text"
              placeholder="earphones"
            ></TextField>
            {/* <Stack
              spacing={2}
              direction="row"
              style={{ justifyContent: "center" }}
            > */}
              <Button
                variant="contained"
                type="button"
                onClick={clickHandler}
                // style={{ width: "30%", marginLeft: "30%" }}
              >
                Run Scraper
              </Button>

              <Button
                variant="outlined"
                type="button"
                onClick={clickHandler}
                disabled={results.length ? false : true}
              >
                <CSVLink data={results}>CSV Download</CSVLink>
              </Button>
            {/* </Stack> */}
          </Box>
        </Row>

        {/* </Form> */}
      </div>
      <Row>
        <div style={{ marginTop: "2%" }}>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <CircularProgress />
            </Box>
          ) : null}
          {error ? <h3>{errorMessage}</h3> : null}
          {!loading && !error && results.length ? (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow style={{ backgroundColor: "#cfe2ff" }}>
                    <TableCell
                      align="center"
                      style={{ fontSize: "1.02em", fontStyle: "bold" }}
                    >
                      Product Name
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{ fontSize: "1.02em", fontStyle: "bold" }}
                    >
                      Product Price
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{ fontSize: "1.02em", fontStyle: "bold" }}
                    >
                      Product Rating
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.map((result: any, index: number) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>{result.product_name}</TableCell>
                        <TableCell>{result.product_price}</TableCell>
                        <TableCell>{result.product_rating}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : null}
        </div>
      </Row>
    </Container>
  );
}

export default App;
