import React from "react";
import { useParams } from "react-router-dom";
import { users, workspaceMembers } from "../../mock/mockData";

const WorkspaceMembers = () => {

  const { id } = useParams();

  const members = workspaceMembers
    .filter((wm) => wm.workspace_id === id)
    .map((wm) => {

      const user = users.find((u) => u.id === wm.user_id);

      return {
        ...wm,
        user
      };
    });

  return (
    <div className="container mt-4">

      <h3>Workspace Members</h3>

      <table className="table mt-3">

        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>

          {members.map((member, index) => (

            <tr key={index}>

              <td>{member.user?.name}</td>
              <td>{member.user?.email}</td>
              <td>{member.role}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default WorkspaceMembers;