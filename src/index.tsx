import * as React from "react";
import { render } from "react-dom";
import * as _ from "lodash";

import "./styles.css";
import { Filter } from "./useFilter";
import Facets from "./Facets";
import Comic from "./Comic";
import comics from "./data";

function App() {
  const seriesNames = _.uniq(
    comics.data.results.map(comic => comic.series.name)
  );
  const formats = _.uniq(comics.data.results.map(comic => comic.format));
  const creators = _.uniq(
    _.flatten(
      comics.data.results.map(comic =>
        comic.creators.items.map(creator => creator.name)
      )
    )
  );

  return (
    <Filter
      facets={[
        { key: "series", values: seriesNames, properties: ["name"] },
        { key: "format", values: formats },
        {
          key: "creators",
          values: creators,
          properties: ["items", "name"]
        }
      ]}
      filterableData={comics.data.results}
    >
      {({ facets, filteredData, toggleSelectedFilter, selectedFilters }) => (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            maxWidth: "100%"
          }}
        >
          <Facets facets={facets} toggleSelectedFilter={toggleSelectedFilter} />

          <div style={{ flex: "1 1 50%", width: "50%" }}>
            <h1>{`Results (${filteredData.length || 0})`}</h1>
            {filteredData && filteredData.map(comic => <Comic {...comic} />)}
          </div>
        </div>
      )}
    </Filter>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
