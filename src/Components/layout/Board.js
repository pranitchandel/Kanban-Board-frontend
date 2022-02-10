import React, { useEffect, useState } from "react";
import Select from "react-dropdown-select";
import "react-dropdown/style.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Modal from "react-modal";
import axios from "axios";

const Board = () => {
  useEffect(() => {
    axios({
      method: "get",
      url: "https://kanban-board-rest.herokuapp.com/api/tasks/all",
    })
      .then((res) => {
        console.log(res.data);
        setTaskArray(res.data);
      })
      .catch((err) => console.log("Got an error"));
  }, []);

  const stages = [
    "Requirement Analysis",
    "Ready to start",
    "Development",
    "Testing",
    "Deployment",
    "Done",
  ];
  const [taskArray, setTaskArray] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [name, setName] = useState("");
  const [assignee, setAssignee] = useState("");
  const [creationDate, setCreationDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [desc, setDesc] = useState("");

  const options = [
    { value: "one", label: "1" },
    { value: "two", label: "2" },
  ];
  const handleSubmit = () => {
    const newTask = {
      name,
      assignee,
      stage: 0,
      desc,
      creationDate,
      dueDate,
    };
    axios({
      method: "post",
      url: "https://kanban-board-rest.herokuapp.com/api/tasks/addTask",
      withCredentials: false,
      headers: {},
      data: {
        name,
        assignee,
        stage: 0,
        desc,
        creationDate,
        dueDate,
      },
    })
      .then(() => console.log("task added"))
      .catch((err) => console.log("err"));
    setModalShow(!modalShow);
    setTaskArray([...taskArray, newTask]);

    setName("");
    setDesc("");
    setAssignee("");
    setCreationDate("");
    setDueDate("");
  };

  const handleBackward = (tsk, index) => {
    axios({
      method: "put",
      url: `https://kanban-board-rest.herokuapp.com/api/tasks/updateStage/${
        tsk._id
      }/${tsk.stage - 1}`,
    });
    const newState = [...taskArray];
    newState[index].stage = tsk.stage - 1;
    setTaskArray(newState);
  };
  const handleForward = (tsk, index) => {
    axios({
      method: "put",
      url: `https://kanban-board-rest.herokuapp.com/api/tasks/updateStage/${
        tsk._id
      }/${tsk.stage + 1}`,
    });
    const newState = [...taskArray];
    newState[index].stage = tsk.stage + 1;
    setTaskArray(newState);
  };
  const deleteTask = (tsk, index) => {
    console.log(tsk);
    axios({
      method: "delete",
      url: `https://kanban-board-rest.herokuapp.com/api/tasks/delete/${tsk._id}`,
    });
    console.log(taskArray);
    const newState = [...taskArray];
    newState.splice(index, 1);
    setTaskArray(newState);
  };
  const style = (stage) => {
    var value = (100 / 6) * stage;
    const marginLeft = value;
    return marginLeft + "%";
  };
  const closeModal = () => {
    setModalShow(!modalShow);
  };
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };
  const FormatDate = (date) => {
    var dt = new Date(date.date).toUTCString().slice(0, 16);
    return dt;
  };
  Modal.setAppElement(document.getElementById("test"));
  return (
    <div id="test">
      <h2>Kanban board</h2>
      <div>
        <button
          className="newTaskButton"
          onClick={() => setModalShow(!modalShow)}
        >
          Add new task
        </button>
        <Modal
          isOpen={modalShow}
          style={customStyles}
          onRequestClose={closeModal}
        >
          <h3>Add a new task</h3>
          <form name="myForm">
            <div className="modalContents">
              <div>
                <div className="modalLabel">
                  <label>
                    <h5>Project</h5>
                  </label>
                </div>
                <div className="modalInput">
                  <input
                    type="text"
                    placeholder="Project"
                    autoFocus="autofocus"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <div className="modalLabel">
                  <label>
                    <h5>Description</h5>
                  </label>
                </div>
                <div className="modalInput">
                  <input
                    type="text"
                    placeholder="Description"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <div className="modalLabel">
                  <label>
                    <h5>Assignee</h5>
                  </label>
                </div>
                <div className="modalInput">
                  {/* <input
                    type="text"
                    placeholder="Assignee"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                  /> */}
                  <Select
                    options={options}
                    value={assignee}
                    placeholder="select from here"
                    onChange={(value) => {
                      console.log(value);
                      setAssignee(value[0].value);
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="modalLabel">
                  <label>
                    <h5>Creation date</h5>
                  </label>
                </div>
                <div className="modalInput">
                  {/* <input
                    type="text"
                    placeholder="Creation date"
                    value={creationDate}
                    onChange={(e) => setCreationDate(e.target.value)}
                  /> */}
                  <DatePicker
                    selected={creationDate}
                    dateFormat="yyyy-mm-dd"
                    onChange={(date) => setCreationDate(date)}
                  />
                </div>
              </div>
              <div>
                <div className="modalLabel">
                  <label>
                    <h5>Due date</h5>
                  </label>
                </div>
                <div className="modalInput">
                  {/* <input
                    type="text"
                    placeholder="due date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  /> */}
                  <DatePicker
                    selected={dueDate}
                    dateFormat="yyyy-mm-dd"
                    onChange={(date) => setDueDate(date)}
                  />
                </div>
              </div>
            </div>
            <div>
              <button
                type="button"
                value="Add"
                className="btn btn-primary btn-block modalAddButton"
                onClick={handleSubmit}
              >
                Add
              </button>
            </div>
          </form>
        </Modal>
        <div className="board">
          <div className="stages">
            {stages.map((stage, key) => (
              <div className="stagesOfProjects" key={key}>
                {stage}
              </div>
            ))}
          </div>
          <div className="taskArray">
            {taskArray.map((task, key) => (
              <div
                className="task"
                style={{ marginLeft: style(task.stage) }}
                key={key}
              >
                <div className="taskButons">
                  <button
                    className="taskButton"
                    type="submit"
                    disabled={task.stage === 0}
                    onClick={() => {
                      handleBackward(task, key);
                    }}
                  >
                    <i class="fas fa-chevron-left"></i>
                  </button>
                  <button
                    className="taskButton"
                    type="submit"
                    disabled={task.stage === 5}
                    onClick={() => {
                      handleForward(task, key);
                    }}
                  >
                    <i class="fas fa-chevron-right"></i>{" "}
                  </button>
                  <button
                    className="taskButtonDelete"
                    type="submit"
                    onClick={() => deleteTask(task, key)}
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                <div className="taskName">
                  <div className="taskNameContent">{task.name}</div>
                  <div className="taskDescContent">Stage: {task.stage}</div>
                  <div className="taskDescContent">{task.assignee}</div>
                  <div className="taskDescContent">
                    <FormatDate date={task.creationDate} />
                  </div>
                  <div className="taskDescContent">
                    <FormatDate date={task.dueDate} />
                  </div>
                  <div className="taskDescContent">{task.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;
