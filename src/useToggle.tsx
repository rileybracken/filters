import * as React from "react";

const useToggle = ({ isOpen, ...rest }) => {
  const [open, toggleOpen] = React.useState(!!isOpen);
  return { open, toggleOpen, ...rest };
};

export { useToggle };
