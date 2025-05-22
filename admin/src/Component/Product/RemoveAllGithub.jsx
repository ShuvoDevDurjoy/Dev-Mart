import axios from 'axios';
import React from 'react'

const RemoveAllGithub = () => {

    const removeAllGithub = async()=>{
        try{
            await axios.delete('http://localhost:5000/product/remove_all/products');
            console.log('deleting successfull');
        }catch(e){
            console.log('error ');
        }
    }

    const removeAllDatabase = async()=>{
        try{
            await axios.delete('http://localhost:5000/product/remove_all/database');
            console.log('deleting from database successfull');
        }catch(e){
            console.log('err database');
        }
    }

    const removeAllSystem = async()=>{
        try{
            await axios.delete('http://localhost:5000/product/remove_all/file_system');
            console.log("done with removing all the files from the local filesystem")
        }catch(e){
            console.log('err with removing from file system') ; 
        }

    }

  return (
    <div className='remove_all_github_main_container'>
        <div className="top_fixed">Removing all from github</div>
        <div className="fl_col gap_1">
        <div className="remove_all submit" onClick={removeAllGithub}>Remove All Github</div>
        <div className="remove_all submit" onClick={removeAllDatabase}>Remove All Database</div>
        <div className="remove_all submit" onClick={removeAllSystem}>Remove All System</div>
        </div>
    </div>
  )
}

export default RemoveAllGithub
