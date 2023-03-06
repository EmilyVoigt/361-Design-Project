var theForm = document.forms["calc_form2"];

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

function getAngle() {
    var angle = theForm.elements["angle"];
    var anglevalue =0;
    //If the textbox is not blank
    if(angle.value!="")
    {
        anglevalue = Number(angle.value);
    }
    return anglevalue;
}


function calculateHeight () {
    eyeheight = getEyeheight();
    angle = getAngle();

    height = 300*(Math.tan(angle*(Math.PI/180))) + eyeheight;


    document.getElementById('height').innerHTML = height + " cm";

}