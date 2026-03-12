import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { columns as mockColumns, tasks as mockTasks, projects } from "../../mock/mockData";

import ColumnContainer from "../../components/board/ColumnContainer";
import AddColumnButton from "../../components/board/AddColumnButton";
import CreateColumnModal from "../../modals/Creation/CreateColumnModal";

import { DndContext, closestCorners } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

function ProjectBoard() {

  const { id: projectId } = useParams();
  const project = projects.find((p) => p.id === projectId);

  // Lấy columns theo project
  const projectColumns = useMemo(
    () => mockColumns.filter((col) => col.project_id === projectId),
    [projectId]
  );

  // Lấy tasks theo columns của project
  const projectTasks = useMemo(
    () => mockTasks.filter((task) => {
      const column = projectColumns.find((col) => col.id === task.column_id);
      return !!column;
    }),
    [projectColumns]
  );

  const [taskList, setTaskList] = useState(projectTasks);
  const [columnList, setColumnList] = useState(projectColumns);

  const [openCreateColumn, setOpenCreateColumn] = useState(false);

  // create column
  const addColumn = (name) => {

    const newColumn = {
      id: "c" + Date.now(),
      name,
      project_id: projectId
    };

    setColumnList((prev) => [...prev, newColumn]);

  };

  // create task
  const addTask = (newTask) => {
    setTaskList((prev) => [...prev, newTask]);
  };

  const getTaskIndex = (id) =>
    taskList.findIndex((task) => task.id === id);

  const handleDragEnd = (event) => {

    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeIndex = getTaskIndex(active.id);
    const overIndex = getTaskIndex(over.id);

    const activeTask = taskList[activeIndex];
    const overTask = taskList[overIndex];

    // move to different column
    if (activeTask.column_id !== overTask.column_id) {

      setTaskList((prev) =>
        prev.map((task) =>
          task.id === active.id
            ? { ...task, column_id: overTask.column_id }
            : task
        )
      );

      return;
    }

    // reorder inside same column
    setTaskList((prev) =>
      arrayMove(prev, activeIndex, overIndex)
    );

  };

  return (

    <div style={boardWrapper}>
{project?.name || "Project Board"}
      <h2>Project Board</h2>

      <DndContext
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >

        <div style={boardContainer}>

          {columnList.map((column) => {

            const columnTasks = taskList.filter(
              (task) => task.column_id === column.id
            );

            return (
              <ColumnContainer
                key={column.id}
                column={column}
                tasks={columnTasks}
                setTaskList={setTaskList}
                onAddTask={addTask}
              />
            );

          })}

          <AddColumnButton
            onClick={() => setOpenCreateColumn(true)}
          />

        </div>

      </DndContext>

      {openCreateColumn && (
        <CreateColumnModal
          onClose={() => setOpenCreateColumn(false)}
          onCreate={addColumn}
        />
      )}

    </div>

  );

}

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