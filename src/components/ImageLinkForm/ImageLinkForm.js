import React from 'react';
import './ImageLinkForm.css'; 

const ImageLinkForm = ({ onInputChange, onButtonSubmit }) => {
/*  instead of doing 'props.onInputChange' here, we just destructur it from the 'props'  */
	return (
		<div>
			<p className='f3'> 
				{'This Magic Brain will detect faces in your pictures. Git it a try'}
			</p>
			<div className='center'>   {/* f4 = size of 4 , pa2 = padding of 2 , w-70 = width of 70% */}
				<div className='form center pa4 br3 shadow-5'>										{/* ㄴ> 70% of total width of the page */}
					<input className='f4 pa2 w-70' type='tex' onChange={onInputChange}
								 placeholder="Paste image URL here." 
								 id="imageInput" />    {/*******  8.24 midified : added id="imageInput"  ******/}
					<button 
						id="detectBtn"  	/***** 8.24 midified : added id="detectBtn" *****/
						/* grow = grow when you hoover , link = there will be a link. bg-light = background light */
						className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple'
						onClick={onButtonSubmit}
					>Detect</button>
			  </div>
			</div>
		</div>
	);
}

export default ImageLinkForm;
