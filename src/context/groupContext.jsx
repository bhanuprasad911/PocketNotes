import React, { createContext, useState } from "react";

export const GroupContext = createContext()

export const GroupProvider =({children})=>{
    const [selectedGroup, setSelectedGroup] = useState(null)
    const [group, setGroup] = useState({})
    const [groupList, setGroupList]=useState(
        JSON.parse(localStorage.getItem('groupList')) ?? []);
    return(
        <GroupContext.Provider value={{group, setGroup, groupList, setGroupList, selectedGroup, setSelectedGroup}}>
            {children}
        </GroupContext.Provider>
    )
}
