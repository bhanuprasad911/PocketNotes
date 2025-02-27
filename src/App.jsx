import { useState, useEffect, useContext } from 'react';
import firstImage from '/image-removebg-preview 1.png';
import sendImg from '/Vector.png';
import Modal from './Modal';
import style from './app.module.css';
import { GroupContext } from './context/groupContext.jsx';

function App() {
  const { groupList, setGroupList, selectedGroup, setSelectedGroup } = useContext(GroupContext);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [newnotes, setNewnote] = useState('');
  const [showRight, setShowRight] = useState(false); // State for responsive behavior

  function groupHead(name) {
    if (!name || typeof name !== 'string') return '';
    const words = name.trim().split(/\s+/);
    return words.length > 1 ? words[0][0].toUpperCase() + words[1][0].toUpperCase() : words[0][0].toUpperCase();
  }

  const formatDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const mm = months[today.getMonth()];
    const yyyy = today.getFullYear();
    return `${dd} ${mm} ${yyyy}`;
  };

  const formatTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12 || 12;
  
    return `${hours}:${minutes} ${ampm}`;
  };

  const addNote = () => {
    if (!newnotes.trim()) return;

    const insertList = {
      note: newnotes,
      datestamp: formatDate(),
      timestamp: formatTime(),
    };

    const updatedGroup = {
      ...selectedGroup,
      notes: [...(selectedGroup.notes || []), insertList],
    };

    setSelectedGroup(updatedGroup);

    setGroupList(prevGroups =>
      prevGroups.map(group =>
        group.name === selectedGroup.name ? updatedGroup : group
      )
    );

    setNewnote('');
    localStorage.setItem('groupList', JSON.stringify(groupList));
  };

  useEffect(() => {
    localStorage.setItem('groupList', JSON.stringify(groupList));
  }, [groupList]);

  return (
    <>
      <div className={`${style.main} ${showRight ? style.showRight : ''}`}>
        {/* LEFT SIDE (Group List) */}
        <div className={style.left}>
          <h1 className={style.heading}>Pocket Notes</h1>
          <div className={style.groups}>
            {groupList.map((group, index) => (
              <button
                key={index}
                className={style.innergroup}
                onClick={() => {
                  setSelectedGroup(group);
                  setShowRight(true); // Show right section on mobile
                }}
              >
                <div className={style.groupimg} style={{ backgroundColor: group.color }}>
                  {groupHead(group.name)}
                </div>
                <h2 className={style.groupHeading}>{group.name}</h2>
              </button>
            ))}
            <button className={style.button} onClick={() => setisModalOpen(true)}>+</button>
          </div>
        </div>

        {/* RIGHT SIDE (Notes) */}
        <div className={`${style.right} ${showRight ? style.showRight : ''}`}>
          {!selectedGroup ? (
            <div className={style.nogroup}>
              <img src={firstImage} alt="Hi" className={style.notesLogo} />
              <h1>Pocket Notes</h1>
              <p>
                Send and receive messages without keeping your phone online.
                <br />
                Use pocket notes on up to 4 linked devices and 1 mobile phone.
              </p>
            </div>
          ) : (
            <>
              <div className={style.noteHead}>
                <button className={style.backButton} onClick={() => setShowRight(false)}>←</button>
                <div className={style.rightgroupimg} style={{ backgroundColor: selectedGroup.color }}>
                  {groupHead(selectedGroup.name)}
                </div>
                <h2 className={style.rightgroupHeading}>{selectedGroup.name}</h2>
              </div>

              <div className={style.noteBody}>
                {selectedGroup.notes.length > 0 ? (
                  selectedGroup.notes.map((note, index) => (
                    <div className={style.notesBody} key={index}>
                      <p className={style.notestext}>{note.note}</p>
                      <div className={style.noteFooter}>
                        <p className={style.noteDate}>{note.datestamp}</p>
                        <ul className={style.list}>
                          <li><p className={style.noteDate}>{note.timestamp}</p></li>
                        </ul>
                      </div>
                    </div>
                  ))
                ) : <></>}
              </div>

              <div className={style.newNote}>
                <textarea
                  type="text"
                  placeholder="Enter your text here..."
                  value={newnotes}
                  onChange={(e) => setNewnote(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      addNote();
                    }
                  }}
                ></textarea>
                <img 
                  src={sendImg} 
                  alt="send" 
                  className={newnotes.trim() ? style.sendButtonActive : style.sendButtonDisabled} 
                  onClick={() => {
                    if (newnotes.trim()) addNote();
                  }}
                  style={{ cursor: newnotes.trim() ? 'pointer' : 'not-allowed' }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {isModalOpen && <Modal closeModal={() => setisModalOpen(false)} />}
    </>
  );
}

export default App;
