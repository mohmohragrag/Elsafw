const steelSections = {
    "Steel Plates and Sheets": ["Length (mm)", "Width (mm)", "Thickness (mm)"],
    "Chequered Steel Plates": ["Length (mm)", "Width (mm)", "Thickness (mm)"], // الصاج البقلاوه
    "Seamless Steel Pipes - Circular": ["Length (mm)", "Outer Diameter (mm)", "Thickness (mm)"],
    "Hollow Structural Sections - Square": ["Length (mm)", "Outer Diameter (mm)", "Thickness (mm)"],
    "Hollow Structural Sections - Rectangular": ["Length (mm)", "Width (mm)", "Height (mm)", "Thickness (mm)"],
    "Round Steel Bars": ["Length (mm)", "Diameter (mm)"],
    "Square Steel Bars": ["Length (mm)", "Side Length (mm)"],
    "Flat Bars": ["Length (mm)", "Width (mm)", "Thickness (mm)"],
    "Equal Angles": ["Length (mm)", "Leg Length (mm)", "Thickness (mm)"],
    "Unequal Angles": ["Length (mm)", "Leg Length 1 (mm)", "Leg Length 2 (mm)", "Thickness (mm)"],
    "T-profile": ["Length (mm)", "Width (mm)", "Height (mm)", "Thickness (mm)"], // Added dimensions for T-profile
    "Hexagonal Sections": ["Length (mm)", "Outer (mm)"]
};

function showFields() {
    const sectionType = document.getElementById("sectionType").value;
    const fieldsContainer = document.getElementById("fields");
    const sectionImage = document.getElementById("sectionImage");

    fieldsContainer.innerHTML = '';
    sectionImage.style.display = "none";

    if (sectionType === "UPN") {
        window.location.href = "https://mohmohragrag.github.io/Elsafwa_Calculator/upn/index.html";
    } else if (sectionType === "IPN") {
        window.location.href = "https://mohmohragrag.github.io/Elsafwa_Calculator/ipn/index.html";
    } else if (sectionType === "IPE") {
        window.location.href = "https://mohmohragrag.github.io/Elsafwa_Calculator/ipe/index.html";
    } else if (sectionType === "HEA") {
        window.location.href = "https://mohmohragrag.github.io/Elsafwa_Calculator/hea/index.html";
    } else if (sectionType === "HEB") {
        window.location.href = "https://mohmohragrag.github.io/Elsafwa_Calculator/heb/index.html";
    } else if (sectionType && steelSections[sectionType]) {
        steelSections[sectionType].forEach(field => {
            const inputField = document.createElement("input");
            inputField.type = "number";
            inputField.placeholder = field;
            inputField.oninput = calculateWeight; // Add input event listener
            fieldsContainer.appendChild(inputField);
        });

        if (sectionType === "T-profile") {
            sectionImage.src = "images/t_profile.png";
        } else {
            sectionImage.src = `images/${sectionType.replace(/\s+/g, '_').toLowerCase()}.png`;
        }
        sectionImage.style.display = "block"; // Show image
    } else {
        alert("Invalid section type selected. Please choose a valid option.");
    }
}
function calculateWeight() {
    const sectionType = document.getElementById("sectionType").value;
    const fields = document.getElementById("fields").children;
    const density = 7850; // kg/m³ for steel
    let weight = 0;

    if (sectionType && fields.length > 0) {
        const values = Array.from(fields).map(field => parseFloat(field.value));

        // Validate input values: check for NaN, negative, or zero values
        if (values.some(value => isNaN(value) || value <= 0)) {
            document.getElementById("result").innerHTML = "Please enter valid dimensions for all fields. Values must be greater than zero.";
            return;
        }

        // Check values based on the section type
        switch (sectionType) {
            case "Steel Plates and Sheets":
                const [lengthPlate, widthPlate, thicknessPlate] = values;
                weight = (lengthPlate / 1000) * (widthPlate / 1000) * (thicknessPlate / 1000) * density; // in grams
                break;

            case "Chequered Steel Plates": // حساب الصاج البقلاوه
                const [lengthCheq, widthCheq, thicknessCheq] = values;
                const adjustedThickness = thicknessCheq + 0.3; // إضافة 0.3 للسمك
                weight = (lengthCheq / 1000) * (widthCheq / 1000) * (adjustedThickness / 1000) * density; // in grams
                break;

            case "Seamless Steel Pipes - Circular":
                const [lengthPipe, outerDiameter, thicknessPipe] = values;
                const innerDiameter = outerDiameter - 2 * thicknessPipe;
                weight = (lengthPipe / 1000) * (Math.PI / 4) * (Math.pow(outerDiameter, 2) - Math.pow(innerDiameter, 2)) * (density); // in grams
                break;



            case "Hollow Structural Sections - Rectangular":
                const [lengthRect, widthRect, heightRect, thicknessRect] = values;
                weight = lengthRect * ((widthRect * heightRect) - ((widthRect - 2 * thicknessRect) * (heightRect - 2 * thicknessRect))) * density; // in grams
                break;


            

            case "Equal Angles":
                const [lengthAngle, legLengthAngle, thicknessAngle] = values;
                weight = 2 * lengthAngle * (legLengthAngle / 1000 * thicknessAngle / 1000) * density; // in grams
                break;

            case "Unequal Angles": {
                const [lengthUnequalAngle, legLength1, legLength2, thicknessUnequal] = values; // تأكد من إضافة thicknessUnequal هنا
                weight = lengthUnequalAngle *
                    ((legLength1 * thicknessUnequal) +
                        (legLength2 * thicknessUnequal) -
                        (thicknessUnequal ** 2)) *
                    density; // in grams
                break;
            }

            case "T-profile":
                const [lengthT, widthT, heightT, thicknessT] = values;
                weight = lengthT * ((widthT * heightT) - ((widthT - thicknessT) * (heightT - thicknessT))) * density; // in grams
                break;

            case "Round Steel Bars":
                    // تحويل المدخلات من مليمترات إلى أمتار
                    const lengthRound = values[0] / 1000; // الطول بالمتر
                    const diameterRound = values[1] / 1000; // القطر بالمتر
        
                    // حساب الوزن
                    weight = lengthRound * (Math.PI / 4) * Math.pow(diameterRound, 2) * density;
                    break;
        
            case "Flat Steel Bars":
                    // تحويل المدخلات من مليمترات إلى أمتار
                    const lengthFlat = values[0] / 1000; // الطول بالمتر
                    const widthFlat = values[1] / 1000; // العرض بالمتر
                    const thicknessFlat = values[2] / 1000; // السمك بالمتر
        
                    // حساب الوزن
                    weight = lengthFlat * widthFlat * thicknessFlat * density;
                    break;
        
            case "Hexagonal Steel Bars":
                    // تحويل المدخلات من مليمترات إلى أمتار
                    const lengthHex = values[0] / 1000; // الطول بالمتر
                    const diameterHex = values[1] / 1000; // القطر بالمتر
        
                    // حساب مساحة السداسي المنتظم
                    const areaHex = ((3 * Math.sqrt(3)) / 2) * Math.pow(diameterHex, 2);
        
                    // حساب الوزن
                    weight = lengthHex * areaHex * density;
                    break;
        
            case "Square Steel Bars":
                    // تحويل المدخلات من مليمترات إلى أمتار
                    const lengthSquare = values[0] / 1000; // الطول بالمتر
                    const sideSquare = values[1] / 1000; // طول الضلع بالمتر
        
                    // حساب الوزن
                    weight = lengthSquare * Math.pow(sideSquare, 2) * density;
                    break;
            }
        }

        // تحويل الوزن من جرامات إلى كيلوغرامات وأجزاء الجرام
       // تحويل الوزن إلى كيلوجرامات
    weight = weight.toFixed(3); // تقريب الوزن إلى 3 منازل عشرية

    // تحويل الوزن إلى كيلوجرامات وجرامات
    const kg = Math.floor(weight); // جزء الكيلوجرامات
    const grams = Math.round((weight - kg) * 1000); // جزء الجرامات

    // عرض النتيجة
    if (grams > 0) {
        console.log(`Weight: ${kg} kg ${grams} g`); // عرض الوزن بالكيلوجرامات والجرامات
    } else {
        console.log(`Weight: ${kg} kg`); // إذا لم يكن هناك جرامات فقط الكيلوجرامات
    }

}
