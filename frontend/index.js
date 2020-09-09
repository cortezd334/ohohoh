let addPet = false
const collection = document.querySelector('#pet-collection')
const header = document.getElementById('pet-header')
const signup = document.getElementById('signup')
signup.addEventListener('click', newAccount)
const login = document.getElementById('login')
login.addEventListener('click', userLogin)
const alogin = document.getElementById('agencylogin')
alogin.addEventListener('click', agencyLogin)
const petFormContainer = document.querySelector(".container")
const viewpets = document.getElementById('viewpets')
viewpets.addEventListener('click', fetchGetPets)
// const adoptButton = document.querySelector('.adopt-button')

//collection.innerHTML = '' removes whatever keeps showing up on the page
//petFormContainer.innerHTML = '' removes the make a new pet form


function fetchAgency() {
    fetch('http://localhost:3000/agencies')
    .then(res => res.json())
    .then(json => agencyInfo(json))
}

function fetchGetPets() {
    collection.innerHTML = ''

    fetch('http://localhost:3000/pets')
    .then(resp => resp.json())
    .then(pets => pets.forEach(pet => appendPet(pet)))
}

function userLoggedIn(e){
    e.preventDefault()
    localStorage.id? fetchUser() : localStorage.setItem('username', e.target.username.value), getUserId()
}

function fetchUser() {
    fetch(`http://localhost:3000/users/${localStorage.id}`)
    .then(res => res.json())
    .then(json => renderUserProfile(json))
}

function getUserId() {
    fetch(`http://localhost:3000/users`)
    .then(res => res.json())
    .then(json => json.forEach(user => {
    if(localStorage.username === user.username){
        localStorage.setItem('id', user.id)
        renderUserProfile(user)
    }
    }))
}

fetchAgency()
// fetchGetPets()
// fetchUser()


const agencyInfo = (agency) => {

    let {name, established, description} = agency

    let title = document.createElement('h1')
    title.textContent = `${name}`
    header.appendChild(title)

    // let div = document.createElement('div')
    collection.innerHTML = `
    <h2>${name}</h2>
    <h4><i>Open Hands Open Hearts Open Home</i></h4>
    <h5>Established ${established}</h5>
    <p>${description}</p>
    `
    // collection.appendChild(div)
}


const appendPet = (pet) => {

    let {name, species, breed, age, bio, image_url, available, id} = pet
    
    petFormContainer.innerHTML = ''
    
    let avail = available ? "" : "Pending Adoption"

    
    
    collection.innerHTML += 
        `<div class="card" id=${id}>
            <h2>${name}</h2>
            <h4 id="species">${species}</h4>
            <h4 id="breed"> ${breed}</h4>
            <p id="age"> ${age}</p>
            <p id="bio"> ${bio}</p>
            <img src=${image_url} class="pet-avatar" />
            <p id="available"> ${avail} </p>
        </div>` 
        
        let petAvatar =document.getElementById(`${id}`)
        
        let btn = document.createElement('button')
        btn.className = 'adopt-btn'
        if(available === true){
            btn.textContent = "Adopt Me!"
            petAvatar.append(btn)
        }
        collection.addEventListener('click', (e) => adoptPet(e, pet))
}

const adoptPet = (e, pet) => {
    if(e.target.matches('button')){
        // console.log(pet)
        let id = e.target.parentElement.id
        let availablity = e.target.previousElementSibling
        if (pet.id == id){
            pet.available = !pet.available
            
            let data = {available: pet.available}
            fetch(`http://localhost:3000/pets/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                    body: JSON.stringify(data)
                })
                .then(res => res.json())
                .then(json => {let avail = json.available ? "" : "Pending Adoption"
                availablity.textContent = avail
                e.target.remove()
            })
        }        
    }   
}

const renderUserProfile = (user) => {

    const {name, age, email, username, preference} = user

    collection.innerHTML = `
    <div id='MyProfile'>
        <h2>${name}</h2>
        <label>Username:</label>
        <p>${username}</p>
        <label>Email Address:</label>
        <p>${email}</p>
        <label>Age:</label>
        <p>${age}</p>
        <label>Which pet would you prefer to adopt:</label>
        <p>${preference}</p>
        <button id='update'>Update Profile</button>
        <button id='delete'>Delete Profile</button>
    </div>
    `
    let updateBtn = document.getElementById('update')
    updateBtn.addEventListener('click', (e) => updateForm(e, user))
    let deleteBtn = document.getElementById('delete')
    deleteBtn.addEventListener('click', deleteUser)
}

const updateForm = (e, user) => {
    // const {name, age, email, username, preference} = user
    // is there a way we can pre-plot these?
    //user will be available when we do
    collection.innerHTML =`
    <h4>Update Profile</h4>
    <form class='user-form'>
        <label>Name:</label>
        <input type='text' name='name' value='' placeholder='Enter Name Here' class='input-text'/>
        </br>
        <label>Username:</label>
        <input type='text' name='username' value='' placeholder='Enter Username Here' class='input-text'/>
        </br>
        <label>Email Address:</label>
        <input type='text' name='email' value='' placeholder='Enter Email Address Here' class='input-text'/>
        </br>
        <label>Age:</label>
        <input type='text' name='age' value='' placeholder='Enter Age Here' class='input-text'/>
        </br>
        <label>Pet I would prefer to adopt:</label>
        <input type='text' name='preference' value='' placeholder='Enter Pet Preference Here' class='input-text'/>
        </br>
        <input type='submit' name='submit' value='Update Profile'
        class='submit'/>
    </form>
    `
    console.log(user)
    let form = document.querySelector('form')
    form.addEventListener('submit', (e) => updateProfile(e))
}

const updateProfile = (e) => {
    console.log(e)
    e.preventDefault()

    const{name, username, email, age, preference} = e.target

    data = {
        name: name.value,
        username: username.value,
        email: email.value,
        age: age.value,
        preference: preference.value
    }
    console.log(data)

    fetch(`http://localhost:3000/users/${localStorage.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(json => renderUserProfile(json))
}

const deleteUser = () => {

    collection.innerHTML = ''
    collection.innerHTML = `
    <h3>Your Account Has Been Deleted</h3>
    `
    fetch(`http://localhost:3000/users/${localStorage.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    })
    .then(res => res.json())
    .then(json => {
        localStorage.clear()
        newAccount()
    })

}


function agencyLogin(){
    petFormContainer.innerHTML = ''
    collection.innerHTML = ''

    collection.innerHTML =`
    <h2>Employee Log In</h2>
    <h4>Enter Username and Password</h4>
    <form class='user-form'>
        <label>Username:</label>
        <input type='text' name='username' value='' placeholder='Enter Username Here' class='input-text'/>
        </br>
        <input type='submit' name='submit' value='Log In'
        class='submit'/>
    </form>
    `
        // <label>Password:</label>
        // <input type='text' name='name' value='' placeholder='Enter Password' class='input-text'/>
// add this to innerHTML when we add auth
// debugger
let form = document.querySelector('.user-form')
form.addEventListener('submit', agencySideFetch)
}

const agencySideFetch = () => {

    collection.innerHTML = ''

    fetch('http://localhost:3000/pets')
    .then(resp => resp.json())
    .then(pets => pets.forEach(pet => agencyPage(pet)))
}

const agencyPage = (pet) => {

    let {name, species, breed, age, bio, image_url, id, available} = pet

    petFormContainer.innerHTML =
    `<form id="add-pet-form">
        <h3>Add a pet for adoption</h3> 
        <input type="text" name="name" value="" placeholder="Enter pet's name..." class="input-text"/>
        <br />
        <input type="text" name="image" value="" placeholder="Enter pet's image URL..." class="input-text"/>
        <br />
        <input type="text" name="species" value="" placeholder="Enter species..." class="input-text"/>
        <br />
        <input type="integer" name="age" value="" placeholder="Enter age..." class="input-text"/>
        <br />
        <input type="text" name="bio" value="" placeholder="Enter pet description..." class="input-text"/>
        <br />
        <input type="submit" name="submit" value="Add Pet to Adoption List" class="submit"/>
    </form> `
    
    collection.innerHTML += 
    `<div class="agency-card" id=${id}>
    <h2>${name}</h2>
    <h4 id="species">${species}</h4>
    <h4 id="breed"> ${breed}</h4>
    <p id="age"> ${age}</p>
    <p id="bio"> ${bio}</p>
    <img src=${image_url} class="pet-avatar" />
    <p id="available"></p>
    </div>`

    const newPetForm = document.querySelector('#add-pet-form')
    newPetForm.addEventListener('submit', addNewPet)
    

    // create Buttons
    // check if available === true
    // if true evaluate to ""
    // if false evaluete to approve addoption

    // let btn = document.createElement('button')
    //     btn.className = 'adopt-btn'
    //     if(available === true){
    //         btn.textContent = "Adopt Me!"
    //         petAvatar.append(btn)
    //what info do we want to show on the agency side? Should style the cards differently so that it's obviously a different login
}


const addNewPet = (e) => {
    e.preventDefault()

    newPetName = e.target.name.value
    newPetImage = e.target.image.value
    newPetSpecies = e.target.species.value
    newPetAge = e.target.age.value
    newPetBio = e.target.bio.value

    let newPetInfo = {
        name: newPetName,
        image: newPetImage,
        species: newPetSpecies,
        age: newPetAge,
        bio: newPetBio,
        available: true,
        agency_id: 5
    }

    fetch('http://localhost:3000/pets', { 
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify(newPetInfo)
    })
    .then(resp => resp.json())
    .then(pet => {appendPet(pet)})
}


function newAccount() {
    petFormContainer.innerHTML = ''
    collection.innerHTML =`
    <h2>Welcome to OHOHOH!</h2>
    <h4>Create an Account</h4>
    <form class='user-form'>
        <label>Name:</label>
        <input type='text' name='name' value='' placeholder='Enter Name Here' class='input-text'/>
        </br>
        <label>Username:</label>
        <input type='text' name='username' value='' placeholder='Enter Username Here' class='input-text'/>
        </br>
        <input type='submit' name='submit' value='Create Account'
        class='submit'/>
    </form>
        `
        // <label>Password:</label>
        // <input type='text' name='name' value='' placeholder='Create Password' class='input-text'/>
// add this to innerHTML when we add auth

//need to make a function call to render homepage
// createUser()
let form = document.getElementsByTagName('form')[0]
form.addEventListener('submit', (e) => userLogin(e))
form.addEventListener('submit', (e) => createUser(e))
}

function userLogin(e){
    e.preventDefault()

    petFormContainer.innerHTML = ''
    collection.innerHTML =`
    <h2>Welcome to OHOHOH!</h2>
    <h4>Please Log In</h4>
    <form class='user-form'>
        <label>Username:</label>
        <input type='text' name='username' value='' placeholder='Enter Username Here' class='input-text'/>
        </br>
        <input type='submit' name='submit' value='Log In'
        class='submit'/>
    </form>
    `
        // <label>Password:</label>
        // <input type='text' name='name' value='' placeholder='Enter Password' class='input-text'/>
// add this to innerHTML when we add auth
// debugger

let form = document.querySelector('form')
form.addEventListener('submit', userLoggedIn)
}

const createUser = (e) => {
    e.preventDefault()
    let name = e.target.name.value
    let username = e.target.username.value
    localStorage.setItem('username', username)
    localStorage.setItem('name', name)

    console.log(localStorage)
    fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({username: localStorage.username, name: localStorage.name})
    })
    .then(res => res.json())
    .then(user => localStorage.setItem('id', user.id))
}