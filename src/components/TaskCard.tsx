import {Id, Task} from '../types';
import DeleteIcon from "../icons/DeleteIcon.tsx";
import {useState} from "react";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
}

/**
 * TaskCard()
 * @param task
 * @param deleteTask
 * TaskCard component
 */
function TaskCard({task, deleteTask}: Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false);

  return (
    <div className="
      bg-mainBackgroundColor
      p-2.5
      h-[100px]
      min-h-[100px]
      items-center
      text-left
      rounded-xl
      hover:ring-2
      hover:ring-inset
      hover:ring-rose-500
      cursor-grab
      relative
      "
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
    >
      {task.content}
      {/** Show delete button when mouseover **/}
      {mouseIsOver &&
        <button className="
          stroke-white
          absolute
          right-4
          top-1/2
          -translate-y-1/2
          bg-columnBackgroundColor
          p-2
          rounded
          opacity-60
          hover:opacity-100
          "
          onClick={() => {
            deleteTask(task.id);
          }}
        >
          <DeleteIcon />
        </button>
      }
    </div>
  );
}

export default TaskCard;