import * as React from "react";
import * as _ from "lodash";

interface Props {
  facets: Array<{
    key: string;
    values: Array<string>;
    properties?: Array<string>;
  }>;
  filterableData?: Array<any>;
}

type State = Props & {
  selectedFilters: Array<{ key: string; values: Array<string> }>;
  filterableData?: Array<any>;
}

export const buildProperty = (
  item: object | Array<any>,
  nextValues: Array<string>,
  starts?: string
) => {
  if (Array.isArray(item)) {
    return item.map(i => buildProperty(i, nextValues));
  }

  const [nextValue, ...remainingValues] = nextValues;
  const newItem = _.get(item, `${starts ? `${starts}.` : ""}${nextValue}`);

  if (remainingValues.length) {
    return buildProperty(newItem, remainingValues);
  }

  return newItem;
};

export const filterData = (filterableData, selectedFilters, facets) =>
  filterableData.filter(item => {
    const matchedFilters = selectedFilters.filter(filter => {
      const [facet] = facets.filter(facet => facet.key === filter.key);
      if (facet.properties) {
        const property = buildProperty(item, facet.properties, filter.key);

        if (Array.isArray(property) {
          return _.includes(property, filter.value);
        }

        return property === filter.value;
      }

      return item[filter.key] === filter.value;
    });

    return matchedFilters.length === selectedFilters.length;
  });

export const useFilter = ({ filterableData, ...initialState }: Props) => {
  const [state, setState] = React.useState({
    ...initialState,
    selectedFilters: []
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

  return {
    ...state,
    toggleSelectedFilter,
    filteredData: filterData(
      filterableData,
      state.selectedFilters,
      state.facets
    )
  };
};

export const Filter = ({
  children,
  ...props
}: Props & { children: (props: State) => React.ReactElement }) =>
  children(useFilter(props));
