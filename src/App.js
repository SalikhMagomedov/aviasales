import './App.css';
import axios from "axios";
import React, {useState, useEffect} from "react";
import {Checkbox, FormControlLabel, FormGroup} from "@material-ui/core";

const App = () => {

    const [searchId, setSearchId] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [filters, setFilters] = useState({
        'All': {
            'checked': false,
            'value': 0
        },
        'Without': {
            'checked': false,
            'value': 0
        },
        'One': {
            'checked': false,
            'value': 1
        },
        'Two': {
            'checked': false,
            'value': 2
        },
        'Three': {
            'checked': false,
            'value': 3
        }
    });
    const [active, setActive] = useState([]);

    const handleChange = (e) => {
        setFilters({...filters, [e.target.name]: {'checked': e.target.checked, 'value': filters[e.target.name].value}});
    };

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

    useEffect(() => {
        setActive(Object.keys(filters).filter(k => filters[k].checked).map(k => filters[k].value));
    }, [filters])

    return (
        <div>
            <p>SearchID: {searchId}</p>
            <p>Filters:</p>
            <FormGroup row>
                {Object.keys(filters).map((k, i) =>
                    <FormControlLabel
                        control={<Checkbox checked={filters.k} onChange={handleChange} name={k} key={k}/>}
                        label={k}
                        key={i}
                    />
                )}
            </FormGroup>
            <p>Tickets:</p>
            <ul>
                {tickets
                    .filter(t => active.includes(t.segments[0].stops.length))
                    .map((t, i) =>
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
