import React, { useEffect, useState } from "react";

function FolderList() {
  const [folders, setFolders] = useState([]);
  console.log("Fetching folders...", folders);

  useEffect(() => {
    fetch("/api/folders")
      .then((res) => res.json())
      .then((data) => setFolders(data));
  }, []);

  return (
    <div>
      <h2>Email Folders</h2>
      <ul>
        {folders.map((folder) => (
          <li key={folder._id}>{folder.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default FolderList;
