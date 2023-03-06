var theForm = document.forms["calc_form"];

function getEyeheight() {
    var eyeheight = theForm.elements["eyeheight"];
    var eyevalue =0;
    //If the textbox is not blank
    if(eyeheight.value!="")
    {
        eyevalue = Number(eyeheight.value);
    }
    return eyevalue;
}

function getDistance() {
    var dist = theForm.elements["eyeheight"];
    var distvalue =0;
    //If the textbox is not blank
    if(dist.value!="")
    {
        distvalue = Number(dist.value);
    }
    return distvalue;
}


function calculateHeight () {
    eyeheight = getEyeheight();
    dist = getDistance();

    height = 2*dist + eyeheight;

    document.getElementById('height').innerHTML = "Height of Object: "+height + " cm";

}