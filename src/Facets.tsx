import * as React from "react";
import * as _ from "lodash";

export interface FacetProps {
  facets: Array<{
    key: string;
    values: Array<string>;
    property?: Array<string>;
  }>;
  toggleSelectedFilter: (props: { key: string; value: string }) => void;
}

export default ({ facets, toggleSelectedFilter }: FacetProps) => (
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
);
