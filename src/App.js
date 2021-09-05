import './App.css';
import axios from "axios";
import React, {useState, useEffect} from "react";

const App = () => {

    const [searchId, setSearchId] = useState(null);
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        (async () => {
            let sId = "";

            await axios.get("https://front-test.beta.aviasales.ru/search")
                .then(r => {
                    setSearchId(r.data.searchId);
                    sId = r.data.searchId;
                })
                .catch(e => console.log("Some error: " + e.response.status));

            const request = "https://front-test.beta.aviasales.ru/tickets?searchId=" + sId;

            await axios.get(request)
                .then(async r => setTickets(r.data.tickets))
                .catch(async e => console.log(e.response.status));
            // const get = async () => {
            //   await axios.get(request)
            //     .then(async r => {
            //       setTickets(r.data.tickets);
            //
            //       if (!r.data.stop) await get();
            //       else console.log("Stopped");
            //     })
            //     .catch(async e => {
            //       if (e.response.status === 500) await get();
            //       else console.log(e.response.status);
            //     });
            // }
            // await get();
            console.log("Stop");
        })();
    }, []);

    return (
        <div>
            <p>SearchID: {searchId}</p>
            <p>Tickets:</p>
            <ul>
                {tickets.map((t, i) =>
                    <li key={i}>
                        <p>{t.price} ({t.carrier})</p>
                        {t.segments.map((s, j) =>
                            <div key={j}>
                                <p>{s.origin} - {s.destination} {s.date} ({s.duration})</p>
                                <p>{s.stops.toString()}</p>
                            </div>
                        )}
                    </li>
                )}
            </ul>
        </div>
    );
};

export default App
