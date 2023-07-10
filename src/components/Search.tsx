import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

import Container from "@mui/material/Container";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

type searchResult = {
  _id: string;
  username: string;
};
type queryResultstype = {
  error?: string;
  search?: string;
  result?: [
    {
      _id: string;
      username: string;
    }
  ];
};

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState<searchResult[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const query: string | null = searchParams.get("search");
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://odin-facebook-api.onrender.com/api/users/search?search=${query}`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const resJson: queryResultstype = await res.json();

        console.log(resJson);
        if (res.status === 200) {
          if (resJson.error) {
            const error = new Error(resJson.error);
            setAlertMessage(error.message);
            setSnackbarOpen(true);
          } else if (resJson.result) {
            setSearchResults(resJson.result);
          } else {
            const error = new Error("Unable to get search results");
            setAlertMessage(error.message);
            setSnackbarOpen(true);
          }
        }
      } catch (err) {
        if (err instanceof Error) {
          setAlertMessage(err.message);
          setSnackbarOpen(true);
        }
      }
    };
    if (query) {
      fetchData();
    }
  }, [searchParams]);
  return (
    <>
      <Container maxWidth="sm">
        <h1>Search Results: {searchParams.get("search")}</h1>
        {searchResults.map((result) => {
          return <p key={result._id}>{result.username}</p>;
        })}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="error"
            sx={{ width: "100%" }}
          >
            {alertMessage}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default Search;
