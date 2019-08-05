import * as React from "react";
import _ from "lodash";

interface Props {
  facets?: Array<{
    key: string;
    values: Array<string>;
    properties?: Array<string>;
  }>;
  filterableData?: Array<any>;
  filteredData?: Array<any>;
}

interface State {
  selectedFilters: Array<{ key: string; values: Array<string> }>;
  filterableData?: Array<any>;
}

export const useFilter = ({ filterableData, ...initialState }: Props) => {
  const [state, setState] = React.useState({
    ...initialState,
    selectedFilters: []
  });

  const selectProperties = () => {};

  const filterData = () =>
    filterableData.filter(item => {
      const matchedFilters = state.selectedFilters.filter(filter => {
        const [facet] = state.facets.filter(fa => fa.key === filter.key);
        if (facet.properties) {
          // const property = item[filter.key][facet.properties[0]];
          const [property] = facet.properties.reduce((acc, cV) => {
            const thing = [...acc, item[filter.key][cV]];
            console.log(thing);
            return [...acc, item[filter.key][cV]];
          }, []);
          // console.log(property);
          return property === filter.value;
        }

        return item[filter.key] === filter.value;
      });

      return matchedFilters.length === state.selectedFilters.length;
    });

  const toggleSelectedFilter = (filter: { key: string; value: string }) => {
    const existingFilters = state.selectedFilters || [];
    setState({
      ...state,
      selectedFilters: !_.some(existingFilters, filter)
        ? [...existingFilters, filter]
        : _.remove(
            existingFilters,
            (i: { key: string; value: string }) => !_.isEqual(i, filter)
          )
    });
  };

  return { ...state, toggleSelectedFilter, filteredData: filterData() };
};

export const Filter = ({
  children,
  ...props
}: Props & { children: (props: State) => React.ReactNode }) =>
  children(useFilter(props));
