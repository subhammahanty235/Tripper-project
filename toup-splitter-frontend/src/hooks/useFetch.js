import { useEffect, useState } from "react";



const useFetch = ({ url }) => {
    const [response, setResponse] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
        const fetchUrl = async () => {
            const res = await fetch(url, {
                method: 'GET'
            })
            try {
                const data = await res.json();
                setResponse(data)
            } catch (error) {
                setError(setError(error))
            }
            finally{
                setLoading(false)
            }
            
        }
        fetchUrl();
        console.log(response)
    }, [url]);

    return { response ,error , loading };
};

export default useFetch;