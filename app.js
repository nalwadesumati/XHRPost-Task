const cl = console.log;


const postForm = document.getElementById("postForm")
const postTitleControl = document.getElementById("postTitle")
const postContentControl = document.getElementById("postContent")
const userIdControl = document.getElementById("userId")

const loader = document.getElementById("loader")
const AddpostBtn = document.getElementById("AddpostBtn")
const updatePostBtn = document.getElementById("updatePostBtn")

const postContainer = document.getElementById("postContainer")

BASE_URL = 'https://jsonplaceholder.typicode.com'
POST_URL = `${BASE_URL}/posts`




function toggelSpineer(flag) {
    if (flag === true) {
        loader.classList.remove('d-none')
    } else {
        loader.classList.add('d-none')
    }
}
function snackbar(title, icon) {
    Swal.fire({
        title: title,
        icon: icon,
        timer: 1000,

    });
}

const createCards = arr => {
    let result = arr.map(post => {
        return `
         <div class="col-md-3" id=${post.id}>
                <div class="card mb-5">
                    <div class="card-header">
                        <h3>${post.title}<h3>
                    </div>
                    <div class="card-body">
                        <p>${post.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-outline-primary btn-sm" onclick = "onEdit(this)">Edit</button>
                        <button  class="btn btn-outline-danger btn-sm removebtn" onclick = "onremove(this)">Remove</button>
                    </div>
                </div>
            </div>     `;
    }).join('');

    postContainer.innerHTML = result;
};

function onremove(ele) {

    Swal.fire({
        title: "Do you want to Remove the post?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Remove it!"

    }).then((result) => {
        if (result.isConfirmed) {

            let remove_id = ele.closest(".col-md-3").id;

            const DELETE_URL = `${POST_URL}/${remove_id}`;

            let xhr = new XMLHttpRequest();

            xhr.open("DELETE", DELETE_URL);

            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    let res = xhr.response;
                    cl(res);

                    ele.closest(".col-md-3").remove();
                    snackbar(`The post of id=(${remove_id}) deleted successfully`, "success");

                } else {
                    snackbar(`Something went wrong while deleting post`, "error");
                }
            };



            xhr.send(null);
        }
    });

}









function fetchAllPosts() {

    //loader start (show by removeing d-none)
    loader.classList.remove('d-none');

    //create instance of XMLHTTPRequest

    let xhr = new XMLHttpRequest()

    //configuration by using 'open' method
    xhr.open("GET", POST_URL, true)

    xhr.setRequestHeader('Auth', 'Token from Ls')
    //xhr.setRequestHeader('Content-type', 'Application/json')

    //to show data on frontend


    xhr.onload = function () {
        // cl(this.readyState)
        if (xhr.status >= 200 && xhr.status < 300 && xhr.readyState === 4) {
            let Data = JSON.parse(xhr.response)
            // cl(Data)
            createCards(Data)
        } else {
            cl('failed to featch post')
        }

        loader.classList.add('d-none');
    }

    //to send request on backend
    xhr.send(null) ///if we post/update data on backend then we write body on that paranthysis otherwise this willbe  null 
}
fetchAllPosts()



const onPostSubmit = (eve) => {
    eve.preventDefault();

    //Get new POST oBJ
    let postObj = {
        title: postTitleControl.value,
        body: postContentControl.value,
        userId: userIdControl.value
    }
    cl(postObj)
    eve.target.reset()

    //API call to POST method (send) the obj


    ///1  create XHR instance
    let xhr = new XMLHttpRequest()

    //2 call open method(condiguration)
    xhr.open('POST', POST_URL)

    /// API CALL onload
    xhr.onload = function () {
        /// API CALL

        if (xhr.status >= 200 && xhr.status < 300 && xhr.readyState === 4) {

            //if api call will success
            const res = JSON.parse(xhr.response)
            console.log(res);



            let card = document.createElement('div')
            card.className = `col-md-3`
            card.id = res.id
            card.innerHTML = `
            
               <div class="card mb-5">
                    <div class="card-header">
                        <h3>${postObj.title}<h3>
                    </div>
                    <div class="card-body">
                        <p>${postObj.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-outline-primary btn-sm" onclick = "onEdit(this)">Edit</button>
                        <button  class="btn btn-outline-danger btn-sm " onclick = "onremove(this)">Remove</button>
                    </div>
                </div>   `

            postContainer.prepend(card)

            //create a new card in UI


            snackbar(`The post of id=${card.id} is created successfully`, "success")

        } else {
            ////API CALL FAIL
            snackbar('Failed to create post', 'error');
        }
        //loader.classList.add('d-none')

    }

    ///xhr.send(body)
    xhr.send(JSON.stringify(postObj))
}

function onEdit(ele) {

    let card = ele.closest(".col-md-3");

    let EDIT_ID = ele.closest(".col-md-3").id;


    //edit id store in ls
    localStorage.setItem("EDIT_ID", EDIT_ID);


    ///EDIT_URL 
    const EDIT_URL = `${POST_URL}/${EDIT_ID}`;


    //API CALL///METHOD GET
    let xhr = new XMLHttpRequest();

    xhr.open("GET", EDIT_URL);


    xhr.onload = function () {

        if (xhr.status >= 200 && xhr.status < 300) {
            let res = JSON.parse(xhr.response)
            cl(res)

            postTitleControl.value = res.title,
                postContentControl.value = res.body,
                userIdControl.value = res.id



            AddpostBtn.classList.add("d-none");
            updatePostBtn.classList.remove("d-none");



        } else {
            snackbar('Something went wrong !!!', 'error')
        }
    }
    xhr.send(null)

}


function onPostUpdate() {
    //updated_id
    let UPDATED_ID = localStorage.getItem('EDIT_ID')
    ///localStorage.removeItem('EDIT_ID')

    //updated url
    let UPDATED_URL = `${BASE_URL}/posts/${UPDATED_ID}`


    //UPDATED_OBJ
    let UPDATED_OBJ = {
        title: postTitleControl.value,
        body: postContentControl.value,
        userId: userIdControl.value,
        id: UPDATED_ID
    }

    postForm.reset();


    //API
    let xhr = new XMLHttpRequest()

    xhr.open("PATCH", UPDATED_URL)

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            let res = JSON.parse(xhr.response)
            cl(res)


            //update on UI

            card = document.getElementById(UPDATED_ID);
            cl(card);
            card.querySelector(".card-header h3").innerText = UPDATED_OBJ.title
            card.querySelector(".card-body p").innerText = UPDATED_OBJ.body

            updatePostBtn.classList.add("d-none");
            AddpostBtn.classList.remove("d-none");


            snackbar(`The post of id=${UPDATED_ID} updated successfully`, "success")

        } else {

            snackbar(`Something went wrong while updating post`, "error")

        }
    }
    xhr.send(JSON.stringify(UPDATED_OBJ))

}
//loder hide
toggelSpineer()



updatePostBtn.addEventListener("click", onPostUpdate)
postForm.addEventListener("submit", onPostSubmit)
