import React, { useEffect, useState } from "react";
import AdminBingo from "../../components/admin/AdminBingo";
import { gameApi } from "../../api/gameApi";
import AdminStop from "../../components/admin/AdminStop";

const Admin = () => {

    const [gameType, setGameType] = useState('');


    const fetchConfig = async () => {
        const res = await gameApi.getConfig();
        setGameType(res.data.gameType);
    }

    useEffect(() => {
        fetchConfig();
    }, []);

    if (gameType === 'STOP') {
        return <AdminStop />
    } else if (gameType === 'BINGO') {
        return(<AdminBingo />)
    }

    return <></>

}

export default Admin;
