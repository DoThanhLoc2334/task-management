import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import ColumnContainer from "../../components/board/ColumnContainer";
import AddColumnButton from "../../components/board/AddColumnButton";
import CreateColumnModal from "../../modals/Creation/CreateColumnModal";

import { getColumnsByProject, createColumn } from "../../services/columnsServices";

const ProjectBoard = () => {
  const { id: projectId } = useParams();

  const [columnList, setColumnList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openCreateColumn, setOpenCreateColumn] = useState(false);

  // Fetch columns từ backend
  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const res = await getColumnsByProject(projectId);
        setColumnList(res.data?.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load columns");
      } finally {
        setLoading(false);
      }
    };

    fetchColumns();
  }, [projectId]);

  const addColumn = async (name) => {
    try {
      const res = await createColumn({ name, project_id: projectId });
      setColumnList((prev) => [...prev, res.data]);
    } catch (err) {
      console.error(err);
      alert("Failed to create column");
    }
  };

  if (loading) {
    return <div style={{ padding: 20 }}>Loading columns...</div>;
  }

  if (error) {
    return <div style={{ padding: 20, color: "red" }}>{error}</div>;
  }

  return (
    <div style={boardWrapper}>
      <h2>{columnList.length ? "Project Board" : "No Columns Yet"}</h2>

      <div style={boardContainer}>
        {columnList.map((column) => (
          <ColumnContainer
            key={column.id}
            column={column}
            tasks={[]}  // chưa cần tasks
            setTaskList={() => {}}
            onAddTask={() => {}}
          />
        ))}

        <AddColumnButton onClick={() => setOpenCreateColumn(true)} />
      </div>

      {openCreateColumn && (
        <CreateColumnModal
          onClose={() => setOpenCreateColumn(false)}
          onCreate={addColumn}
        />
      )}
    </div>
  );
};

const boardWrapper = {
  padding: "20px"
};

const boardContainer = {
  display: "flex",
  gap: "20px",
  alignItems: "flex-start",
  overflowX: "auto"
};

export default ProjectBoard;