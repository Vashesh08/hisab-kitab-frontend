import React, { useState } from "react";
import KareegarDetails from "./KareegarDetails";
import KareegarBook from "./KareegarBook";

export default function KareegarPage() {
    const [kareegarDetailsPage, setKareegarDetailsPage] = useState(true);
    const [kareegarId, setKareegarId] = useState(null);
    
    if (kareegarDetailsPage){
        return <KareegarDetails setKareegarId={ setKareegarId } setKareegarDetailsPage={ setKareegarDetailsPage }/>
    }

    return <KareegarBook kareegarId={kareegarId} setKareegarDetailsPage={ setKareegarDetailsPage }/>
}