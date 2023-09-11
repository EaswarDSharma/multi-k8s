import React, { useState, useEffect,useMemo} from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import MaterialReactTable,{MRT_ColumnDef} from 'material-react-table';
import { BrowserRouter as  Link } from 'react-router-dom';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link to="/">website</Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function Fib() {
  const [seenIndexes, setSeenIndexes] = useState([]);
  const [values, setvalues] = useState({});
  const [index, setIndex] = useState('');
  const columns = useMemo(
    () => [
      {
        accessorKey: 'key', //access nested data with dot notation
        header: 'item',
      },
      {
        accessorKey: 'link',
        header: 'link',
        Cell: ({ cell, renderedCellValue }) => (
          React.createElement(
            'a', 
            {
              onClick: (e) => e.stopPropagation(),
              href: `https://${cell.getValue()}`,
              target: '_blank',
            },
            renderedCellValue
          )
        ),
      },
    ],
    [],);
  useEffect(() => {
    const fetchvalues = async () => {
      try {
      const values = await axios.get('/api/values/current');
      setvalues(values.data); } catch (error) {
        console.log(error);
      }
    };
    const fetchIndexes = async () => {
      try {
      const seenIndexes = await axios.get('/api/values/all');
      setSeenIndexes(seenIndexes.data); } catch (error) {
        console.log(error);
      }
    };
      fetchvalues();
      fetchIndexes();
     
    }, []);
  const handleSubmit = async (event) => {
    if(index.trim()!==""){
    event.preventDefault();
    await axios.post('/api/values', {
      index: index.toLowerCase(),
    });
    setIndex('');
    try {
      const seenIndexes = await axios.get('/api/values/all');
      setSeenIndexes(seenIndexes.data);
//      console.log("index  "+seenIndexes.data)
      const values = await axios.get('/api/values/current');
      setvalues(values.data);
      console.log("values "+JSON.stringify(values.data))
    } catch (error) {
      console.log(error);
    }}
  };
  const RenderSeenIndexes = React.memo(() => {
    console.log('rendering SeenIndexes');
    const ind = [];
    for (let key in values) {
      ind.push(key);
    }
    ind.sort();
    return ind.map((number) => number).join(", ");
  });
  const Rendervalues = React.memo(() => {

    const l = document.createElement("a");

// Set the href attribute (the URL the link points to)
l.href = "https://www.example.com";

// Set the link text
l.textContent = "Visit Example.com";
// Append the link element to the document body (or any other desired element)
document.body.appendChild(l);
    var arr = [{key:"one",link:"www.onetv.com"},{key:"two",link:"www.twotv.com"}];
    for (let key in values) {
      arr.push({ key: key, link: values[key] });
    }
      arr.sort((a,b) => (a.key > b.key) ? 1 : ((b.key > a.key) ? -1 : 0))
      /* const array1 = arr.map(obj => {
        const linkElement = document.createElement('a');
        linkElement.href = obj.link;
        linkElement.innerText = obj.key;
        return { ...obj, link: linkElement.outerHTML };
      });
      //<a href="http://www.seriouseats.com/recipes/2009/03/cauliflower-potato-curry-aloo-ghobi-recipe.html">aloo</a> 
      //this kind of elements are in array
      const array=array1.map((obj)=>{  
        var doc = new DOMParser().parseFromString(obj.link, "text/html");
        obj.link = doc.firstChild.firstChild.nextSibling.innerHTML
       // var l= ReactDOMServer.renderToStaticMarkup(obj.link)
        console.log( doc.firstChild.firstChild.nextSibling.innerHTML)
              return{...obj,link:obj.link}
  
      })
      array.sort((a,b) => (a.key > b.key) ? 1 : ((b.key > a.key) ? -1 : 0))
      console.log(JSON.stringify(array))*/
    return (
        <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        
        >
        <MaterialReactTable columns={columns} data={arr} muiTableHeadCellProps={{
    //simple styling with the `sx` prop, works just like a style prop in this example
    sx: {
      fontFamily: 'Bebas Neue',
      fontSize: 24,
    },
  }} 
  muiTableBodyCellProps={{
      //simple styling with the `sx` prop, works just like a style prop in this example
      sx: {
        fontFamily: 'DM Sans',
        fontSize: "22px",
      },
    }}/>
        </Box>
      );
    });

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Enter your index:</label>
        <input
          value={index}
          onChange={(event) => setIndex(event.target.value)}
        />
        <button>Submit</button>
      </form>
      <h3>Indexes I have seen:</h3>
      <RenderSeenIndexes />
      <h3>Calculated values:</h3>
      <Rendervalues />
      </div>
  );
}
export default Fib;
