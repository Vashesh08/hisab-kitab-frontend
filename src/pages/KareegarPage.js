import React, { useState } from "react";
import KareegarDetails from "./KareegarDetails";
import KareegarBook from "./KareegarBook";

export default function KareegarPage() {
    const [kareegarDetailsPage, setKareegarDetailsPage] = useState(true);
    const [kareegarId, setKareegarId] = useState(null);
    const [kareegarName, setKareegarName] = useState("");
    
    if (kareegarDetailsPage){
        return <KareegarDetails setKareegarId={ setKareegarId } setKareegarDetailsPage={ setKareegarDetailsPage } setKareegarName={ setKareegarName }/>
    }

    return <KareegarBook kareegarId={kareegarId} kareegarName={kareegarName} setKareegarDetailsPage={ setKareegarDetailsPage }/>
}