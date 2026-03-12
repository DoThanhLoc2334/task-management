import React, { useState } from "react";
import TaskCard from "./TaskCard";
import AddTaskButton from "./AddTaskButton";

import CreateTaskModal from "../../modals/Creation/CreateTaskModal";

import {
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";

function ColumnContainer({ column, tasks, onAddTask }) {

  const [openCreateTask, setOpenCreateTask] = useState(false);

  return (

    <div style={columnStyle}>

      <h3>{column.name}</h3>

      <SortableContext
        items={tasks}
        strategy={verticalListSortingStrategy}
      >

        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}

      </SortableContext>

      <AddTaskButton
        onClick={() => setOpenCreateTask(true)}
      />

      {openCreateTask && (
        <CreateTaskModal
          columnId={column.id}
          onClose={() => setOpenCreateTask(false)}
          onAddTask={onAddTask}
        />
      )}

    </div>

  );

}

const columnStyle = {
  width: "260px",
  background: "#f4f5f7",
  padding: "10px",
  borderRadius: "8px",
  minHeight: "400px"
};

export default ColumnContainer;