import styled from "styled-components";

const StyledSaveLoad= styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 7vh;
  width: 14vh;
  `;

const StyledSave= styled.div`
background-color: #CEB0D1;
width: 40px;
height: 40px;
margin: 2px;
border-radius: 15%;
border: 1px solid #000;
`;
const StyledGif= styled.div`
    height: 10vh;
    cursor: pointer;
`;

const StyledExtract= styled.div`
width: 14vh;
padding: 14px 2px;
border: 1px solid;
border-radius: 0;
background-color: #f4261e;
text-align: center;
`;



// .extract h3 {
//   font-size: 16px;
//   line-height: 6vh;
//   text-align: center;

// }

export function SaveAndLoad(props) {
  
  const handleGifExtraction = props.handleGifExtraction
  const handleSaveProject = props.handleSaveProject
  const handleLoadProject = props.handleLoadProject

  return (
    <>
    <StyledGif>
      <StyledExtract onClick={handleGifExtraction}> 
        <h3> extract to GIF </h3> 
      </StyledExtract>
    </StyledGif>
    <StyledSaveLoad>
       <StyledSave onClick={handleSaveProject}>
         <div className="msg">
            <img src="save.svg"/>
            <span className="tooltiptext">
                Save
            </span>
         </div>
       </StyledSave>
       {/* <StyledSave onClick={handleLoadProject}>
         <div className="msg">
           <img src="save_temp.svg"/>
           <span className="tooltiptext"> 
               Load
           </span>
         </div>
       </StyledSave> */}
    </StyledSaveLoad>
  </>
  )
}

