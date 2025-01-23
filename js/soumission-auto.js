let vehicule_has_camera = function (){
    return document.getElementsByName("vehicule_has_camera").values === "yes";
}
function isValideAge(dob, gender){
    const birth = Date(dob);
    const age = getAge(dob);
    const month = today.getMonth() - birth.getMonth();

    if((gender === "female" && age < 16) || 
        (gender === "male" &&  age < 18) ||
        (gender === "non-binaire" && age < 18) ||
        age >= 100){
        
        return false;

    }
    return true;
}
function getAge(date){
    return  Date().getFullYear() - Date(date).getFullYear();

}

function isValidVehicule(vehiculeAge, vehiculePrice){
    return vehiculeAge < 25 && vehiculePrice < 100000;
}

function isValidApplication(nb_applications, mileage ){

    return (nb_applications < 4) &&  mileage < 50000;
}

function isValidData(dob, gender, vehiculeAge, vehiculePrice, 
    nb_applications,  mileage){

    return isValidApplication(dob,gender) 
            && isValidVehicule(vehiculeAge, vehiculePrice)
            && isValidApplication(nb_applications, mileage)
            && vehicule_has_camera;
            
}

function calculateBaseAmount(){


}
function calculateInsurance(){
    var dob = document.getElementsByName("dob").values;
    var gender = document.getElementsByName("gender").values;
    var vehiculeAge = document.getElementsByName("vehicule_year").values;
    var vehiculePrice = parseFloat(document.getElementsByName("vehicule_value").values);
    var nb_applications = parseInt(document.getElementsByName("nb_applications").values);
    var mileage = parseInt(document.getElementsByName("vehicule_mileage").values);

    var age = getAge(dob);

    if(!isValidApplication(dob, gender, vehiculeAge, vehiculePrice, nb_applications, mileage)){

    }
    var basicAmount = 0;

    if(age < 25 && (gender === "male" || gender === "female"))
         basicAmount = vehiculePrice*1.05;
    else if(age >= 75)
        basicAmount = vehiculePrice*1.04;
    else
        basicAmount = vehiculePrice*1.015;

    var totalAmount = basicAmount + 350 * nb_applications + 0.02*mileage;



}
