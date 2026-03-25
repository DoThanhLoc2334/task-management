import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import ColumnContainer from "../../components/board/ColumnContainer";
import AddColumnButton from "../../components/board/AddColumnButton";
import CreateColumnModal from "../../modals/Creation/CreateColumnModal";

import {
  getColumnsByProject,
  createColumn
} from "../../services/columnsService.js";

const ProjectBoard = () => {
  const { id: projectId } = useParams();

  const [columnList, setColumnList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false); // 👈 loading create
  const [error, setError] = useState(null);
  const [openCreateColumn, setOpenCreateColumn] = useState(false);

  // 🔥 FETCH DATA (tách riêng)
  const fetchColumns = async () => {
    try {
      setLoading(true);

      const res = await getColumnsByProject(projectId);

      const data = res.data?.data || [];

      // 👇 chống undefined
      setColumnList(data.filter((c) => c && c.id));
    } catch (err) {
      console.error(err);
      setError("Failed to load columns");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 gọi khi load page
  useEffect(() => {
    fetchColumns();
  }, [projectId]);

  // 🔥 CREATE COLUMN
  const addColumn = async (name) => {
    try {
      setCreating(true);

      await createColumn({
        name,
        project_id: projectId
      });

      // 👇 fetch lại cho chắc chắn data đúng
      await fetchColumns();

    } catch (err) {
      console.error(err);
      alert("Create column failed");
    } finally {
      setCreating(false);
    }
  };

  // 🔥 UI loading
  if (loading) {
    return <div style={{ padding: 20 }}>Loading columns...</div>;
  }

  // 🔥 UI error
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
            tasks={[]}
            setTaskList={() => {}}
            onAddTask={() => {}}
          />
        ))}

        <AddColumnButton onClick={() => setOpenCreateColumn(true)} />
      </div>

      {/* 🔥 MODAL */}
      <CreateColumnModal
        open={openCreateColumn}
        onClose={() => setOpenCreateColumn(false)}
        onCreate={addColumn}
        loading={creating} // 👈 optional nếu bạn muốn dùng
      />
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