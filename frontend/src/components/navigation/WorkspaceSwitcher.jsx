import { workspaces } from "../../mock/mockData";

function WorkspaceSwitcher() {

  return (

    <select>

      {workspaces.map((ws) => (

        <option key={ws.id}>
          {ws.name}
        </option>

      ))}

    </select>

  );
}

export default WorkspaceSwitcher;