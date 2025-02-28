import React, { useContext, useState } from "react";
import styles from "./modal.module.css";
import { GroupContext } from "./context/groupContext";

function Modal({ closeModal }) {
  const [grpname, setGrpname] = useState("");
  const [grpclr, setgrpclr] = useState("");
  const { setGroup, groupList, setGroupList } = useContext(GroupContext);

  const createGroup = () => {
    if (!grpname || !grpclr) {
      alert("Please provide a group name and color.");
      return;
    }

    const newGroup = {
      name: grpname,
      color: grpclr,
      notes: [],
    };

    setGroup(newGroup);
    setGroupList((prev) => {
      const updatedList = [...prev, newGroup];
      localStorage.setItem("groupList", JSON.stringify(updatedList));
      return updatedList;
    });


    setGrpname("");
    setgrpclr("");
    closeModal();
  };

  return (
    <div className={styles.overlay} onClick={closeModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>Create new group</h2>
        <label htmlFor="gname">Group name</label>
        <input
          type="text"
          id="gname"
          placeholder="Enter Group Name"
          value={grpname}
          className={styles.input}
          onChange={(e) => setGrpname(e.target.value)}
        />
        <br />
        <br />
        <label htmlFor="clr">Choose color</label>
        <div className={styles.colors}>
          {["rgb(180, 140, 250)", "rgb(255, 120, 241)", "rgb(68, 231, 252)", "rgb(242, 150, 119)", "rgb(0, 72, 255)", "rgb(102, 145, 255)"].map(
            (color, index) => (
              <div
                key={index}
                className={styles[`color${index + 1}`]}
                style={{ backgroundColor: color }}
                onClick={() => setgrpclr(color)}
              ></div>
            )
          )}
        </div>
        <button className={styles.closeButton} onClick={createGroup}>
          Create
        </button>
      </div>
    </div>
  );
}

export default Modal;
