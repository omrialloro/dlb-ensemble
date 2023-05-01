import './Intro.css';
import './base.css';

import './variables.css';



export default function Intro(){
  return(
    <>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Dont Look Back</title>
        <link rel="stylesheet" href="https://use.typekit.net/vxs2ckm.css"/>
        <link rel="stylesheet" href="variables.css"/>
        <link rel="stylesheet" type="text/css" href="base.css"/>
        <link rel="stylesheet" type="text/css" href="style.css"/>
    </head>
<div className='bodyy'>
    <div className='headerr'>    
        <div className="lang">
            <a href="#">EN/עברית</a>
         </div>
         <div>
            <a href="index.html">
                <img src="assets/logo-in-line.svg"/>      
            </a>
        </div>
        <div className="icon">
          <a href="#">
            <img src="assets/icon.svg"/>
          </a>  
        </div>
    </div>
    <div className="link-list">
        <ul>
            <li><a href="about.html">About</a></li>
            <li><a href="walkthrough.html">Walkthrough</a></li>
            <li><a href="education.html">Education</a></li>
            <li><a href="community.html">Community</a></li>
            <li><a href="media.html">Media</a></li>
            <li><a href="contact.html">Contact</a></li>
          </ul>
    </div>
</div>
</>
  )

}
