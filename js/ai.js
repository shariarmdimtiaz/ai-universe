let counter = 0;
let isSorted = false;

// get all data and pass data using slice or all to show in the UI
const loadData = async () => {
    showSpinner();
    url = "https://openapi.programming-hero.com/api/ai/tools";
    const res = await fetch(url);
    const data = await res.json();
    hideSpinner();
    if(isSorted == true){
        data.data.tools.sort((a,b) => new Date(a.published_in) - new Date(b.published_in));
        if (counter===0){        
            displayAiTools(data.data.tools.slice(0, 6));
        }else{
            displayAiTools(data.data.tools);
        }
    }else{
        if (counter===0){        
            displayAiTools(data.data.tools.slice(0, 6));
        }else{
            displayAiTools(data.data.tools);
        }
    }
    
};
loadData();

// date formate method
function getFormattedDate(date) {
    let dateArr = date.split('/');
    
    let month = dateArr[0];
    let day = dateArr[1];
    let year = dateArr[2];
    if(month.length < 2){
        month = ("0" + month);
    }
    if(day.length < 2){
        day = ("0" + day);
    }
    return month + '/' + day + '/' + year;;
}

// async await and data load by id
const loadAiToolsDetail = async(id) => {
    if(id>0 && id<10){
        id = '0'+id;
    }
    const url = `https://openapi.programming-hero.com/api/ai/tool/${id}`;
    try{
        const res = await fetch(url);
        const data = await res.json();
        console.log(data)
        displayDetails(data.data);
    }
    catch(error){
        console.log(error)
    }
}

// tools packages check
function toolPackages(plan){
    if(plan === undefined || plan === null || plan.toLowerCase() == 'no cost' ||plan == 0){
        return 'free of<br>' + 'cost/';
    }
    else{
        if(plan.indexOf("/") >= 0) {
            let plans = plan.split('/');
            let price = plans[0] + '/<br>';
            let month = plans[1];
            return price + month;
         }
         else{
            return plan;
         }
    }
}


// check data is available or not. If callback function is found then run the callback function
function isDataAvailable(data){
    console.log(data);
    if(data == null || data == "" || data == 0 || data == undefined){
        return 'No data found.';
    }
    else{
        let dataArr = data.split(' ');        
        if(dataArr[0] === 'function'){  
            let text = 'Hello world!';       
            let reversedString = eval('(' + data + ')')(text);  
            return 'Input: ' + text + '<br>' + 'Output: ' + reversedString;
        }
        return data;
    }
}

// input example que check
function isNullExamplesQ(data){
    if(data === null){
        console.log('Can you give any example?');
        return 'Can you give any example?';
    }
    else{
        isDataAvailable(data.input_output_examples[0].input);
    }

}
// input example ans check
function isNullExamplesA(data){
    if(data === null){
        return 'No! Not Yet! Take a break!!!';
    }
    else{
        isDataAvailable(data.input_output_examples[0].output);
    }

}
// check integration data
function isIntegrationsNull(data){
    if(data === null){
        return 'No data found.';
    }

}

// check accuracy score data
function accuracy(accuracy){
    if(accuracy !== null){
        accuracy = parseFloat(accuracy) * 100;
        return accuracy;
    }
}


//display details in modal
const displayDetails = (data) => {  
    
    const toolDetails = document.getElementById('modal-details');

    if(data.input_output_examples === null && data.integrations === null && data.pricing === null){

        toolDetails.innerHTML = `
        <div class="row g-2">
            <div class="col-12 col-md-6">
                <div class="bg-danger-subtle border border-danger rounded-2">
                    <p class="fs-5 fw-bold text-start p-2">${data.description}</p>
                    <div class="d-flex justify-content-center gap-2">
                        <div class="fw-bold text-center text- bg-light rounded-2 p-2" style="width: 7rem; color: #03A30A;">${toolPackages(data.pricing)}</div> 
                        <div class="fw-bold text-center bg-light rounded-2 p-2" style="width: 7rem; color: #F28927;">${toolPackages(data.pricing)}</div>
                        <div class="fw-bold text-center bg-light rounded-2 p-2" style="width: 7rem; color: #EB5757;">${toolPackages(data.pricing)}</div>                      
                    </div>
                    <div class="d-flex justify-content-between p-2">
                        <div class="">
                            <h6>Features</h6>
                            <ul class="ps-4">
                                <li>${isDataAvailable(data.features[1].feature_name)}</li>  
                                <li>${isDataAvailable(data.features[2].feature_name)}</li>    
                                <li>${isDataAvailable(data.features[3].feature_name)}</li>                
                            </ul>
                        </div>
                        <div class="">
                            <h6>Integration</h6>
                            <ul class="ps-4">
                                <li>${isIntegrationsNull(data.integrations)}</li>              
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-6">
                <div class="border border-secondary-subtle rounded-2 p-2">
                    <img class="img-fluid border-0 rounded-2" src="${data.image_link[0]}">
                    <div id="input-output-examples" class="text-center p-3">
                        <p class="fw-bold fs-5">${isNullExamplesQ(data.input_output_examples)}</p>
                        <p>${isNullExamplesA(data.input_output_examples)}</p>
                    </div>
                </div>
            </div>
        </div>
    `
    }else{
            if(data.accuracy.score === null){
                toolDetails.innerHTML = `
                <div class="row g-2">
                    <div class="col-12 col-md-6">
                        <div class="bg-danger-subtle border border-danger rounded-2">
                            <p class="fs-5 fw-bold text-start p-2">${data.description}</p>
                            <div class="d-flex justify-content-center gap-2">
                                <div class="fw-bold text-center text- bg-light rounded-2 p-2" style="width: 7rem; color: #03A30A;">${toolPackages(data.pricing[0].price)}<br>${data.pricing[0].plan}</div> 
                                <div class="fw-bold text-center bg-light rounded-2 p-2" style="width: 7rem; color: #F28927;">${toolPackages(data.pricing[1].price)}<br>${data.pricing[1].plan}</div>
                                <div class="fw-bold text-center bg-light rounded-2 p-2" style="width: 7rem; color: #EB5757;">${toolPackages(data.pricing[2].price)}<br>${data.pricing[2].plan}</div>                      
                            </div>
                            <div class="d-flex justify-content-between p-2">
                                <div class="">
                                    <h6>Features</h6>
                                    <ul class="ps-4">
                                        <li>${isDataAvailable(data.features[1].feature_name)}</li>  
                                        <li>${isDataAvailable(data.features[2].feature_name)}</li>    
                                        <li>${isDataAvailable(data.features[3].feature_name)}</li>                
                                    </ul>
                                </div>
                                <div class="">
                                    <h6>Integration</h6>
                                    <ul class="ps-4">
                                        <li>${isDataAvailable(data.integrations[0])}</li>
                                        <li>${isDataAvailable(data.integrations[1])}</li>
                                        <li>${isDataAvailable(data.integrations[2])}</li>                
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-6">
                        <div class="border border-secondary-subtle rounded-2 p-2">
                            <div class="">
                                <img class="img-fluid border-0 rounded-2" src="${data.image_link[0]}">                        
                            </div>
                            <div id="input-output-examples" class="text-center p-3">
                                <p class="fw-bold fs-5">${isDataAvailable(data.input_output_examples[0].input)}</p>
                                <p>${isDataAvailable(data.input_output_examples[0].output)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `

            }else{
                toolDetails.innerHTML = `
                <div class="row g-2">
                    <div class="col-12 col-md-6">
                        <div class="bg-danger-subtle border border-danger rounded-2">
                            <p class="fs-5 fw-bold text-start p-2">${data.description}</p>
                            <div class="d-flex justify-content-center gap-2">
                                <div class="fw-bold text-center text- bg-light rounded-2 p-2" style="width: 7rem; color: #03A30A;">${toolPackages(data.pricing[0].price)}<br>${data.pricing[0].plan}</div> 
                                <div class="fw-bold text-center bg-light rounded-2 p-2" style="width: 7rem; color: #F28927;">${toolPackages(data.pricing[1].price)}<br>${data.pricing[1].plan}</div>
                                <div class="fw-bold text-center bg-light rounded-2 p-2" style="width: 7rem; color: #EB5757;">${toolPackages(data.pricing[2].price)}<br>${data.pricing[2].plan}</div>                      
                            </div>
                            <div class="d-flex justify-content-between p-2">
                                <div class="">
                                    <h6>Features</h6>
                                    <ul class="ps-4">
                                        <li>${isDataAvailable(data.features[1].feature_name)}</li>  
                                        <li>${isDataAvailable(data.features[2].feature_name)}</li>    
                                        <li>${isDataAvailable(data.features[3].feature_name)}</li>                
                                    </ul>
                                </div>
                                <div class="">
                                    <h6>Integration</h6>
                                    <ul class="ps-4">
                                        <li>${isDataAvailable(data.integrations[0])}</li>
                                        <li>${isDataAvailable(data.integrations[1])}</li>
                                        <li>${isDataAvailable(data.integrations[2])}</li>                
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-6">
                        <div class="border border-secondary-subtle rounded-2 p-2">
                            <div class="position-relative">
                                <img class="img-fluid border-0 rounded-2" src="${data.image_link[0]}">
                                <div class="position-absolute top-0 end-0"><p class="border-0 rounded fw-normal text-white px-2 py-1 m-1" style="background-color: #EB5757;">${accuracy(data.accuracy.score)}% accuracy</p></div>
                            </div>
                            <div id="input-output-examples" class="text-center p-3">
                                <p class="fw-bold fs-5">${isDataAvailable(data.input_output_examples[0].input)}</p>
                                <p>${isDataAvailable(data.input_output_examples[0].output)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `
            }
    }
    
    
}

// display AI tools inside card
const displayAiTools = (tools) =>{
    // container element
    
    const toolsContainer = document.getElementById('tools-container');
    toolsContainer.innerText = '';
    tools.forEach(tool => {
        // console.log(tool.published_in)
        // create child for each element
        //publishedDate = getFormattedDate(tool.published_in);

        const toolDiv = document.createElement('div');
        toolDiv.classList.add('d-flex');
        toolDiv.classList.add('justify-content-center');
        toolDiv.classList.add('col-12');
        toolDiv.classList.add('col-md-4');
        toolDiv.classList.add('gap-2');
        // set content of the child
        toolDiv.innerHTML = `
        <div class="card p-3" style="width: 100%;">
            <img class="card-img-top img-fluid" src="${tool.image}" style="height: 100%;" alt="...">
            <div class="card-body">
                <p class="fs-5 fw-bold text-start">Features:</p>
                <ol class="px-3">
                    <li>${tool.features[0]}</li>
                    <li>${tool.features[1]}</li>
                    <li>${tool.features[2]}</li>                
                </ol>
                <hr/>
                <h3 class="fw-bold text-start">${tool.name}</h3>
                <div class="d-flex justify-content-between py-1">
                    <p><i class="fa-regular fa-calendar-days"></i> ${getFormattedDate(tool.published_in)}</p>
                    <button onclick="loadAiToolsDetail(${tool.id})" type="button" class="btn rounded-circle btn-light bg-danger-subtle" data-bs-toggle="modal" data-bs-target="#btnModal">
                        <i class="fa-solid fa-arrow-right text-danger"></i>
                    </button>
                </div>
            </div>
        </div>
        `
        // append child
        toolsContainer.appendChild(toolDiv);

    })
    
}

// show all data
document.getElementById("see-more").addEventListener("click", function () {
    counter++;
    loadData();
    document.getElementById("see-more").style.display = 'none';
});

//show sort by date data
document.getElementById("sort-by-date").addEventListener("click", function () {  
    isSorted = true;  
    loadData();
});


// spinner function
function showSpinner() {
    document.getElementById("ai-spinner").style.display = "block";
 }
  
function hideSpinner() {
    document.getElementById("ai-spinner").style.display = "none";
}
