import React, { useEffect, useState } from "react";
import AdminBingo from "../../components/admin/AdminBingo";
import { gameApi } from "../../api/gameApi";
import AdminStop from "../../components/admin/AdminStop";

const Admin = () => {

    const [gameType, setGameType] = useState('BINGO');


    const fetchConfig = async () => {
        const res = await gameApi.getConfig();
        setGameType(res.data.gameType);
    }

    useEffect(() => {
        fetchConfig();
    }, []);

    if (gameType === 'STOP') {
        return <AdminStop />
    }

    return(
        <AdminBingo />
    )
}

export default Admin;
