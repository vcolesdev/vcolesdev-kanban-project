import {Id, Task} from '../types';
import DeleteIcon from "../icons/DeleteIcon.tsx";
import {useState} from "react";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

/**
 * TaskCard()
 * @param task
 * @param deleteTask
 * TaskCard component
 */
function TaskCard({task, deleteTask, updateTask}: Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

  /**
   * toggleEditMode()
   * Toggle the edit mode of the task, currently editing...
   */
  const toggleEditMode = () => {
    setEditMode((prevState) => !prevState);
    setMouseIsOver(false);
  }

  if (editMode) {
    return (
      <>
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
        >
          <textarea className="
            h-[90%]
            w-full
            resize-none
            border-none
            rounded
            bg-transparent
            text-white
            focus:outline-none
            "
            value={task.content}
            autoFocus
            placeholder="Task content here"
            onBlur={toggleEditMode}
            onChange={(e) => {
              updateTask(task.id, e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.shiftKey) {
                toggleEditMode();
              }
            }}
          ></textarea>
        </div>
      </>
    )
  }

  return (
    <>
      {/** Task Card **/}
      <div className="
        task
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
        onClick={toggleEditMode}
        onMouseEnter={() => {
          setMouseIsOver(true);
        }}
        onMouseLeave={() => {
          setMouseIsOver(false);
        }}
      >
        <p className="
          my-auto
          h-[90%]
          w-full
          overflow-y-auto
          overflow-x-hidden
          whitespace-pre-wrap
          "
        >
          {task.content}
        </p>
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
    </>
  );
}

export default TaskCard;