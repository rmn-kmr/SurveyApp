
function fetchAlbums(){
  fetch(url)
  .then(res => res.json() )
  .then( json => console.log(json);)
}


async function fetchAlbums(){
  const res = await fetch(url);
  const json = await res.json();
  console.log(json);
}


const fetchAlbums = async() => {
  const res = await fetch(url);
  const json = await res.json();
  console.log(json);
}
