import React from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation'; // 'Navigation' == 'Navigation.js'
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition'; // 'FaceRecognition' == 'FaceRecognition.js'
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';


const particlesOptions = {
  particles: {
    number: {
      value: 35,
      density: {
        enable: true,
        value_area: 800
      }
    }
  },
  "interactivity": {
    "detect_on": "window",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "repulse"
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 400,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 400,
        "size": 40,
        "duration": 2,
        "opacity": 8,
        "speed": 3
      },
      "repulse": {
        "distance": 200,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 2
      },
      "remove": {
        "particles_nb": 2
      }
    }
  }
}

const initialState = {
  input: '', // 'input' goes to 'onButtonSubmit' {imageUrl: input} 
  imageUrl: '',
  boxes: [],  // box goes to <FaceRecognition /> component
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0, // how many times he/she signed in
    joined: '' 
  }
}

class App extends React.Component{
  constructor() {
    super();
    this.state = initialState;
  }
 
  // get data from 'Sign In' form
  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    // recieves input from Clarifai
    const image = document.getElementById('inputimage');
    // grabbing 'inputimage' from FaceRecognition.js <img id='inputimage'  .../> 
    const width = Number(image.width);
    const height = Number(image.height); // to make sure width,height are number(not string)
    // console.log(width, height);
    return data.outputs[0].data.regions.map(face => {
      const clarifaiFace = face.region_info.bounding_box;
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      }
    });
  }

  displayFaceBox = (boxes) => {
    this.setState({boxes: boxes});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
    // detect 'enter' key
    const imageInput = document.getElementById("imageInput");        // 8.24 change
    imageInput.addEventListener("keyup", function(event) {           // 8.24 change
      if (event.keyCode === 13) {                                    // 8.24 change
       event.preventDefault();                                       // 8.24 change
       document.getElementById("detectBtn").click();                 // 8.24 change
      }                                                              // 8.24 change
    });                                                              // 8.24 change
  }

  onButtonSubmit = () => {
    // need to do < npm install clarifai > first
    this.setState({imageUrl: this.state.input}); // it passes 'imageUrl' to <FaceRecognition /> tag
      fetch('https: (SERVER_URL) /imageurl', {
        method: 'post', // default is 'get' request.
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input
        })
      })
      .then(response => response.json()) // because this is a fetch, we have to do response.json()
      .then(response => {
        if (response) {
          fetch('https: (SERVER_URL) /image', {
            method: 'put', // default is 'get' request.
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id 
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }

  // 'onRouteChange' changes states(line51) : isSignedIn, route
  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})      
    }
    this.setState({route: route}); // [[ "set"State !!! not state ]
  }            // -> have to wrap it with {}. it's object.


  render() {
    // destructuring. write this line, and delete 'this.state'
    const { isSignedIn, imageUrl, route, boxes } = this.state;
    return (
      <div className="App">
        <Particles className='particles'
          params = {particlesOptions} 
        />
        {/* components : Navigation, Logo, Rank, ImageLinkForm, FaceRecognition, SiginIn, Register 
                    ㄴ>  imported from './components/.../     */}
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home' // {if condition} ? (execute) : (if not, do this) 
          ? <div> 
              <Logo /> 
              <Rank name={this.state.user.name} entries={this.state.user.entries}/> 
              <ImageLinkForm 
                // onInputChange={this.onInputChange} {/* need 'this.' because we're calling the function, that is in this class. */}
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}
              /> 
              <FaceRecognition boxes={boxes} imageUrl={imageUrl}/>
            </div> // don't return multiple elements, wrap them into one 
          : (
             route === 'signin'
             ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>  
             : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
  }
}

export default App;
