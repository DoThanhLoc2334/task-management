import React from "react";
import { workspaces } from "../../mock/mockData";

import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const WorkspaceSwitcher = () => {

  const handleChange = (e) => {
    const workspaceId = e.target.value;
    console.log("Switch workspace:", workspaceId);
  };

  return (

    <FormControl size="small" sx={{ minWidth: 200 }}>

      <Select
        defaultValue={workspaces[0].id}
        onChange={handleChange}
      >

        {workspaces.map((workspace) => (

          <MenuItem
            key={workspace.id}
            value={workspace.id}
          >
            {workspace.name}
          </MenuItem>

        ))}

      </Select>

    </FormControl>

  );
};

export default WorkspaceSwitcher;