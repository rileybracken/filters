import * as React from "react";
import { render } from "react-dom";
import _ from "lodash";

import "./styles.css";
import { Filter } from "./useFilter";
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
          <div style={{ flex: "1 1 50%", width: "50%" }}>
            {facets.map(({ key, values }) => (
              <div key={key}>
                <h1>{_.capitalize(key)}</h1>

                <div>
                  {values.map(value => (
                    <button
                      key={value}
                      onClick={() => toggleSelectedFilter({ key, value })}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ flex: "1 1 50%", width: "50%" }}>
            <h1>{`Results (${filteredData.length || 0})`}</h1>
            {filteredData &&
              filteredData.map(({ series, format, creators, title }) => (
                <div
                  style={{
                    background: "#f5f5f5",
                    margin: "10px 0",
                    padding: "10px 20px",
                    overflow: "scroll"
                  }}
                >
                  <h4>{title}</h4>
                  <div>
                    <strong>Series:</strong>
                    &nbsp;{series.name}
                  </div>
                  <hr />
                  <div>
                    <strong>Format:</strong>
                    &nbsp;{format}
                  </div>
                  <hr />
                  <div>
                    <div>
                      <strong>Creators:</strong>
                    </div>
                    <ul>
                      {creators.items.map(creator => (
                        <li>{creator.name}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </Filter>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
