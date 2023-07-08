import { useSearchParams } from "react-router-dom";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  console.log(searchParams.get("search"));
  return (
    <>
      <h1>Search Results: {searchParams.get("search")}</h1>
    </>
  );
};

export default Search;
