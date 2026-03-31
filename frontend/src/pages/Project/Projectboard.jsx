// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";

// import ColumnContainer from "../../components/board/ColumnContainer";
// import AddColumnButton from "../../components/board/AddColumnButton";
// import CreateColumnModal from "../../modals/Creation/CreateColumnModal";

// import { getTasksByProjectId } from "../../services/projectsServices.js";
// import {
//   getColumnsByProject,
//   createColumn
// } from "../../services/columnsService.js";

// const ProjectBoard = () => {
//   const { id: projectId } = useParams();

//   const [columnList, setColumnList] = useState([]);
//   const [taskList, setTaskList] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [creating, setCreating] = useState(false);
//   const [error, setError] = useState(null);
//   const [openCreateColumn, setOpenCreateColumn] = useState(false);

//   // ================= FETCH COLUMNS =================
//   const fetchColumns = async () => {
//     try {
//       setLoading(true);
//       const res = await getColumnsByProject(projectId);
//       const data = res.data?.data || [];
//       setColumnList(data.filter((c) => c && c.id));
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load columns");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================= FETCH TASKS =================
//   const fetchTasks = async () => {
//     try {
//       const res = await getTasksByProjectId(projectId);
//       const data = res.data?.data || [];
//       setTaskList(data); // ⚠️ dạng grouped
//     } catch (err) {
//       console.error("Fetch tasks error:", err);
//     }
//   };

//   // ================= LOAD =================
//   useEffect(() => {
//     if (projectId) {
//       fetchColumns();
//       fetchTasks();
//     }
//   }, [projectId]);

//   // ================= CREATE COLUMN =================
//   const addColumn = async (name) => {
//     try {
//       setCreating(true);

//       await createColumn({
//         name,
//         project_id: projectId
//       });

//       await fetchColumns();
//     } catch (err) {
//       console.error(err);
//       alert("Create column failed");
//     } finally {
//       setCreating(false);
//     }
//   };

//   // ================= MAP TASKS =================
//   const taskMap = {};
//   taskList.forEach((item) => {
//     taskMap[item.column_id] = item.tasks;
//   });

//   // ================= UI =================
//   if (loading) {
//     return <div style={{ padding: 20 }}>Loading board...</div>;
//   }

//   if (error) {
//     return <div style={{ padding: 20, color: "red" }}>{error}</div>;
//   }

//   return (
//     <div style={boardWrapper}>
//       <h2 style={{ marginBottom: 10 }}>
//         {columnList.length ? "Project Board" : "No Columns Yet"}
//       </h2>

//       <div style={boardContainer}>
//         {columnList.map((column) => (
//           <ColumnContainer
//             key={column.id}
//             column={column}
//             tasks={taskMap[column.id] || []} // ✅ chuẩn API
//             onAddTask={fetchTasks}
//           />
//         ))}

//         <AddColumnButton onClick={() => setOpenCreateColumn(true)} />
//       </div>

//       {/* MODAL */}
//       <CreateColumnModal
//         open={openCreateColumn}
//         onClose={() => setOpenCreateColumn(false)}
//         onCreate={addColumn}
//         loading={creating}
//       />
//     </div>
//   );
// };

// // ================= STYLE =================
// const boardWrapper = {
//   padding: "20px",
//   backgroundColor: "#f9fafb",
//   height: "100vh"
// };

// const boardContainer = {
//   display: "flex",
//   gap: "20px",
//   alignItems: "flex-start",
//   overflowX: "auto",
//   paddingTop: "10px"
// };

// export default ProjectBoard;


import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import ColumnContainer from "../../components/board/ColumnContainer";
import AddColumnButton from "../../components/board/AddColumnButton";
import CreateColumnModal from "../../modals/Creation/CreateColumnModal";
import EditColumnModal from "../../modals/Editing/EditTaskModal.jsx"; 
import { getTasksByProjectId } from "../../services/projectsServices.js";
import {
  getColumnsByProject,
  createColumn,
  updateColumn,
  deleteColumn
} from "../../services/columnsService.js";

const ProjectBoard = () => {
  const { id: projectId } = useParams();

  const [columnList, setColumnList] = useState([]);
  const [taskList, setTaskList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [openCreateColumn, setOpenCreateColumn] = useState(false);

  // ================= EDIT MODAL =================
  const [openEditColumn, setOpenEditColumn] = useState(false);
  const [editColumnData, setEditColumnData] = useState(null);

  const handleEditTask = (task) => {
  setEditTaskData(task);
  setOpenEditTask(true);
  };

  // Hàm save xong refresh danh sách task
  const saveEditTask = async () => {
    await fetchTasks();
    setOpenEditTask(false);
    setEditTaskData(null);
  };
  // ================= FETCH COLUMNS =================
  const fetchColumns = async () => {
    try {
      setLoading(true);
      const res = await getColumnsByProject(projectId);
      const data = res.data?.data || [];
      setColumnList(data.filter((c) => c && c.id));
    } catch (err) {
      console.error(err);
      setError("Failed to load columns");
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH TASKS =================
  const fetchTasks = async () => {
    try {
      const res = await getTasksByProjectId(projectId);
      const data = res.data?.data || [];
      setTaskList(data);
    } catch (err) {
      console.error("Fetch tasks error:", err);
    }
  };

  // ================= LOAD =================
  useEffect(() => {
    if (projectId) {
      fetchColumns();
      fetchTasks();
    }
  }, [projectId]);

  // ================= CREATE COLUMN =================
  const addColumn = async (name) => {
    try {
      setCreating(true);
      await createColumn({ name, project_id: projectId });
      await fetchColumns();
    } catch (err) {
      console.error(err);
      alert("Create column failed");
    } finally {
      setCreating(false);
    }
  };

  // ================= EDIT COLUMN =================
  const handleEditColumn = (column) => {
    setEditColumnData(column);
    setOpenEditColumn(true);
  };

  const saveEditColumn = async (name) => {
    try {
      await updateColumn(editColumnData.id, { name });
      await fetchColumns();
      setOpenEditColumn(false);
      setEditColumnData(null);
    } catch (err) {
      console.error(err);
      alert("Update column failed");
    }
  };

  // ================= DELETE COLUMN =================
  const handleDeleteColumn = async (columnId) => {
    if (!window.confirm("Are you sure you want to delete this column?")) return;
    try {
      await deleteColumn(columnId);
      await fetchColumns();
    } catch (err) {
      console.error(err);
      alert("Delete column failed");
    }
  };

  // ================= MAP TASKS =================
  const taskMap = {};
  taskList.forEach((item) => {
    taskMap[item.column_id] = item.tasks;
  });

  // ================= UI =================
  if (loading) return <div style={{ padding: 20 }}>Loading board...</div>;
  if (error) return <div style={{ padding: 20, color: "red" }}>{error}</div>;

  return (
    <div style={boardWrapper}>
      <h2 style={{ marginBottom: 10 }}>
        {columnList.length ? "Project Board" : "No Columns Yet"}
      </h2>

      <div style={boardContainer}>
        {columnList.map((column) => (
          <div key={column.id} style={{ position: "relative" }}>
            {/* COLUMN CONTAINER */}
            <ColumnContainer
              column={column}
              tasks={taskMap[column.id] || []}
              onAddTask={fetchTasks}
              onEditTask={handleEditTask}
            />

            
            
          </div>
        ))}

        <AddColumnButton onClick={() => setOpenCreateColumn(true)} />
      </div>

      {/* MODALS */}
      <CreateColumnModal
        open={openCreateColumn}
        onClose={() => setOpenCreateColumn(false)}
        onCreate={addColumn}
        loading={creating}
      />

      {openEditColumn && editColumnData && (
        <EditColumnModal
          column={editColumnData}
          onClose={() => setOpenEditColumn(false)}
          onSave={saveEditColumn}
        />
      )}
    </div>
  );
};

// ================= STYLE =================
const boardWrapper = {
  padding: "20px",
  backgroundColor: "#f9fafb",
  height: "100vh"
};

const boardContainer = {
  display: "flex",
  gap: "20px",
  alignItems: "flex-start",
  overflowX: "auto",
  paddingTop: "10px"
};

const columnButtons = {
  position: "absolute",
  top: 5,
  right: 5,
  display: "flex",
  gap: "5px"
};

export default ProjectBoard;