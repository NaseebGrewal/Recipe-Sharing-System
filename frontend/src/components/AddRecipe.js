import React, {useState} from 'react';
import './AddRecipe.css';
import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate} from 'react-router-dom';

const AddRecipe = () =>{

    const navigate = useNavigate();
    const url = "http://localhost:5000/AddRecipe";
    const urlCloudinaryAPI = "https://api.cloudinary.com/v1_1/yummytummysrh2023/image/upload";
    const uploadPreset = "yummytummy_srh";

    const [recipeData, setRecipeData] = useState({
        name: "",
        description: "",
        imageurl: "",
        servings:"",
        cooking_time:"",
        nutritions: {
            calories:"",
            fat:"",
            carbs:"",
            protein:"",
            sugar:"",
            fiber:""
        }
    });

    const [imageSelected, setImageSelected] = useState("");
    const [ingredientlist, setList] = useState([]);
    const [value, setValue] = useState("");
    var [instructionlist] = useState([]);

    const validateForm = () => {
        var validationMessage = "";

        if(!recipeData.name.trim().length)
            validationMessage = ' Recipe Name';
        if(!recipeData.description.trim().length)
            if(validationMessage.trim().length > 0)
                validationMessage = validationMessage + ', Description';
            else
                validationMessage = validationMessage + ' Description';

        if(!ingredientlist.length)
            if(validationMessage.trim().length > 0)
                validationMessage = validationMessage + ', Ingredients';
            else
                validationMessage = validationMessage + ' Ingredients';

        if(!instructionlist.length)
            if(validationMessage.trim().length > 0)
                validationMessage = validationMessage + ', Instructions';
            else
                validationMessage = validationMessage + ' Instructions';

        // console.log(recipeData.nutritions.calories.trim() + ',' +
        //     recipeData.nutritions.fat.trim() + ',' +
        //     recipeData.nutritions.carbs.trim() + ',' +
        //     recipeData.nutritions.protein.trim() + ',' +
        //     recipeData.nutritions.sugar.trim() + ',' +
        //     recipeData.nutritions.fiber.trim());   

        if(!recipeData.nutritions.calories.trim().length
            || !recipeData.nutritions.fat.trim().length
            || !recipeData.nutritions.carbs.trim().length
            || !recipeData.nutritions.protein.trim().length
            || !recipeData.nutritions.sugar.trim().length
            || !recipeData.nutritions.fiber.trim().length)
            {
                if(validationMessage.trim().length > 0)
                validationMessage = validationMessage + ', Nutritions';
            else
                validationMessage = validationMessage + ' Nutritions';
            }

        if(!recipeData.cooking_time.length)
            if(validationMessage.trim().length > 0)
                validationMessage = validationMessage + ', Cooking Time';
            else
                validationMessage = validationMessage + ' Cooking Time';
    

        if(!recipeData.servings.length)
            if(validationMessage.trim().length > 0)
                validationMessage = validationMessage + ', Servings';
            else
                validationMessage = validationMessage + ' Servings';
        
        
        return validationMessage.trim();
    }

    const fetchInstrctions = () => {
        var instructionsLI = document.getElementById("instructions").childNodes;
        //console.log(instructionsLI + ', length = ' + instructionsLI.length);
        instructionlist = [];
        for (var i = 0; i < instructionsLI.length; i++) {
            if(instructionsLI[i].nodeName==='#text')
            {
                var myArrayNode = instructionsLI[i].nodeValue.split('<br>');

                for (var j = 0; j < myArrayNode.length; j++)
                {
                    if(myArrayNode[j].trim().length > 0)
                    {
                        //console.log(myArrayNode[j])
                        instructionlist.push(myArrayNode[j].trim());
                    }
                }
            }
            else if(instructionsLI[i].nodeName==='DIV')
            {
                var myArray = instructionsLI[i].innerHTML.split('<br>');
                for (var k= 0; k < myArray.length; k++)
                {
                    if(myArray[k].trim().length > 0)
                    {
                       //console.log(myArray[k])
                        instructionlist.push(myArray[k].trim());
                    }
                }
                //console.log('DIV -' + instructionsLI[i].innerHTML.);
                //alert(instructionsLI[i].innerHTML.trim());
            }
        }
    }

    const onSubmitForm = async(e)=>{
        e.preventDefault();
        //Fetch Instruction data
        fetchInstrctions();

        //console.log("List -- " + instructionlist);

        //Form Validation
        var validateResult = validateForm();
        //console.log(validateResult);
        if (validateResult.length > 0)
        {
            validateResult = 'Please enter ' + validateResult + `.`;
            toast.warn(validateResult);
            return false;
        }
        
        try{
            //console.log('hit');;
            //Upload Image to Cloudinary
            const formData = new FormData();
            formData.append("file", imageSelected);
            formData.append("upload_preset", uploadPreset);
            
            if(imageSelected)
            {
                await Axios.post(urlCloudinaryAPI, formData).then((response)=>{
                    //console.log(response);
                    recipeData.imageurl = response.data.secure_url;
                });
            }

            Axios.post(url,{
                name : recipeData.name,
                description: recipeData.description,
                ingredientlist: ingredientlist,
                imageurl: recipeData.imageurl,
                servings: recipeData.servings,
                cooking_time: recipeData.cooking_time,
                instructionlist: instructionlist,
                nutritions: recipeData.nutritions,
                authorID: 23728
            }).then(res=>{
                if(res.data){
                    if(res.data.toString().includes('Recipe Name Already Exists')){
                        toast.error(res.data);
                    }
                    else{
                        toast.success("Recipe Added Successfully!!!");
                        setTimeout(() => {
                            navigate("/recipe/" + res.data);
                          }, 3500);
                    }
                }
            });           
        }catch(err)
        {
            toast.error(err);;
            console.error(err.message);
        }
    }

    function changehandle(e)
    {
        const newdata = {...recipeData};
        newdata[e.target.id] = e.target.value;
        setRecipeData(newdata);
        //console.log(newdata);
    }

    function changehandleNutrition(e){
        const newdata = {...recipeData};        
        newdata.nutritions[e.target.id] = e.target.value;
        setRecipeData(newdata);
        //console.log(newdata);
    }

    const addToList = (e) => {
        e.preventDefault();
        let tempArr = ingredientlist;
        if(value.length){
            tempArr.push(value);
            setList(tempArr);
        }
        setValue("");
    };
  
    const deleteItem = (index) => {
        let temp = ingredientlist.filter((item, i) => i !== index);
        setList(temp);
    };

    return (
        <div id="AddRecipe" className='template d-flex justify-content-center align-items-center vh-100 bg-secondary bg-gradient'>
            <div>
                <ToastContainer position="top-right" autoClose={3500} hideProgressBar={false} newestOnTop={false}
                    closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
            </div>
            <div className='form-container p-5 rounded bg-white' style={{'minWidth':'60%'}}>
                <form id='addRecipeForm' className='addRecipeForm' onSubmit={(e)=>onSubmitForm(e)} noValidate>
                    <div style={{"width":"100%","display":"inline-block"}}>
                        <h3 className='text-center' style={{"textAlign":"center"}}>Add Recipe</h3>
                    </div>

                    <div className='mb-2 mt-2'>
                        <label htmlFor='name' className="form-label required">Recipe Name</label>
                        <input id='name' type='text' placeholder='Enter Recipe Name' className='form-control' 
                            maxLength={30} value={recipeData.name} onChange={(e) => changehandle(e)} required />
                    </div>

                    <div className='mb-2'>
                            <label htmlFor='description' className="form-label required">Description</label>
                            <textarea maxLength={1000} id='description' type='textarea' placeholder='Enter Recipe Description' 
                                className='form-control' value={recipeData.description} onChange={(e) => changehandle(e)} required />
                    </div>

                    {/* <div style={{'display':'flex'}}>
                        <div className='form-control mb-2' style={{'border':'0px','padding':'0px','paddingRight':'3px'}}>
                            <label className="form-label" htmlFor='imageurl'>Image URL</label>
                            <textarea id='imageurl' type='text' placeholder='Enter Recipe Image URL' className='form-control' 
                                maxLength={150} value={recipeData.imageurl} onChange={(e) => changehandle(e)} />
                        </div>
                    </div> */}

                    <div className='mb-2'>
                        <label className='form_label'>Upload Image</label>
                        <input type='file' className='form-control' id='updImage' 
                            onChange={(event)=>{setImageSelected(event.target.files[0]);}} />
                    </div>

                    <div className=' mb-2' >
                        <label htmlFor='inputIngredients' className="form-label required">Ingredients</label>
                        <div className='dvIngredients'>
                            <input type="text" id='inputIngredients' name='inputIngredients' value={value} onChange={(e) => setValue(e.target.value)} 
                                className='form-control' style={{'marginRight':'4px'}} placeholder='Enter Recipe Ingredients' />
                            <button className='btn btn-secondary' onClick={(e)=>addToList(e)}> + </button>
                        </div>
                        <ol className={ingredientlist.length > 0 ? 'form-control ingreOL' : 'form-control ingreOINone'} required>
                            {ingredientlist.length > 0 && ingredientlist.map((item, i) => <li key={i} className='ingreLI'
                                onClick={() => deleteItem(i)}>{item}<span className='liCloseMark'>X</span></li>)}
                        </ol>
                    </div>

                    <div className='mb-2' >
                        <label className="form-label required">Instructions Steps</label>
                        <div>                            
                            <ol className="form-control" required>
                                <li id='instructions' className="text-area-local" contentEditable="true" />
                            </ol>
                        </div>
                    </div>

                    <div className='mb-2'>
                        <label className="form-label required">Nutritions</label>
                        <div className='form-control dvNutritions'>
                            <label htmlFor='calories' className='nutritionLabel'>Calories: </label>
                            <input type='number' id='calories' className='nutritionInput' maxLength={4}
                            value={recipeData.nutritions.calories} onChange={(e) => changehandleNutrition(e)} pattern=".e"
                            onKeyDown={ (evt) => (evt.key === '.' && evt.preventDefault()) || (evt.key === 'e' && evt.preventDefault()) } />{'   '}
                            <label htmlFor='fat' className='nutritionLabel'>Fat: </label>
                            <input type='number' id='fat' className='nutritionInput'
                            value={recipeData.nutritions.fat} onChange={(e) => changehandleNutrition(e)}
                            onKeyDown={ (evt) => (evt.key === 'e' && evt.preventDefault()) } />{'   '}
                            <label htmlFor='carbs' className='nutritionLabel'>Carbs:</label>
                            <input type='number' maxLength={4} id='carbs' className='nutritionInput' 
                            value={recipeData.nutritions.carbs} onChange={(e) => changehandleNutrition(e)}
                            onKeyDown={ (evt) => (evt.key === 'e' && evt.preventDefault()) } />{'   '}
                            <label htmlFor='protein' className='nutritionLabel'>Protein:</label>
                            <input type='number' maxLength={4} id='protein' className='nutritionInput'
                            value={recipeData.nutritions.protein} onChange={(e) => changehandleNutrition(e)}
                            onKeyDown={ (evt) => (evt.key === 'e' && evt.preventDefault()) } />{'   '}
                            <label htmlFor='sugar' className='nutritionLabel'>Sugar:</label>
                            <input type='number' maxLength={4} id='sugar' className='nutritionInput'
                            value={recipeData.nutritions.sugar} onChange={(e) => changehandleNutrition(e)}
                            onKeyDown={ (evt) => (evt.key === 'e' && evt.preventDefault()) } />{'   '}
                            <label htmlFor='fiber' className='nutritionLabel'>Fiber:</label>
                            <input type='number' maxLength={4} id='fiber' className='nutritionInput'
                            value={recipeData.nutritions.fiber} onChange={(e) => changehandleNutrition(e)}
                            onKeyDown={ (evt) => (evt.key === 'e' && evt.preventDefault()) } />{'   '}
                        </div>
                    </div>

                    <div style={{'display':'flex'}}>
                        <div className='form-control mb-2' style={{'border':'0px','padding':'0px','paddingRight':'3px'}}>
                            <label htmlFor='cooking_time' className="form-label required">Cooking Time</label>
                            <input id='cooking_time' type='text' placeholder='Enter Recipe Cooking Time' className='form-control' 
                                maxLength={150} value={recipeData.cooking_time} onChange={(e) => changehandle(e)} required />
                        </div>
                        <div className='form-control mb-2' style={{'border':'0px','padding':'0px','paddingRight':'3px'}}>
                            <label htmlFor='servings' className="form-label required">Servings</label>
                            <input id='servings' type='text' placeholder='Enter Recipe Servings' className='form-control' 
                                maxLength={150} value={recipeData.servings} onChange={(e) => changehandle(e)} required />
                        </div>
                    </div>
                    
                    <div className='d-grid mt-2'>
                        <button className='btn btn-success bg-gradient'> Save </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddRecipe;