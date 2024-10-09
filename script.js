const steelSections = {
    "Steel Plates and Sheets": ["Length (mm)", "Width (mm)", "Thickness (mm)"],
    "Chequered Steel Plates": ["Length (mm)", "Width (mm)", "Thickness (mm)"],
    "Seamless Steel Pipes - Circular": ["Length (mm)", "Outer Diameter (mm)", "Thickness (mm)"],
    "Hollow Structural Sections - Square": ["Length (mm)", "Outer Diameter (mm)", "Thickness (mm)"],
    "Hollow Structural Sections - Rectangular": ["Length (mm)", "Width (mm)", "Height (mm)", "Thickness (mm)"],
    "Round Steel Bars": ["Length (mm)", "Diameter (mm)"],
    "Square Steel Bars": ["Length (mm)", "Side Length (mm)"],
    "Flat Bars": ["Length (mm)", "Width (mm)", "Thickness (mm)"],
    "Equal Angles": ["Length (mm)", "Leg Length (mm)", "Thickness (mm)"],
    "Unequal Angles": ["Length (mm)", "Leg Length 1 (mm)", "Leg Length 2 (mm)", "Thickness (mm)"],
    "T-profile": ["Length (mm)", "Width (mm)", "Height (mm)", "Thickness (mm)"],
    "Hexagonal Sections": ["Length (mm)", "Outer (mm)"]
};

function showFields() {
    const sectionType = document.getElementById("sectionType").value;
    const fieldsContainer = document.getElementById("fields");
    const sectionImage = document.getElementById("sectionImage");

    fieldsContainer.innerHTML = '';
    sectionImage.style.display = "none";

    if (sectionType === "UPN" || sectionType === "IPN" || sectionType === "IPE" || sectionType === "HEA" || sectionType === "HEB") {
        window.location.href = `https://mohmohragrag.github.io/Elsafwa_Calculator/${sectionType.toLowerCase()}/index.html`;
    } else if (sectionType && steelSections[sectionType]) {
        steelSections[sectionType].forEach(field => {
            const inputField = document.createElement("input");
            inputField.type = "number";
            inputField.placeholder = field;
            inputField.oninput = calculateWeight;
            fieldsContainer.appendChild(inputField);
        });

        const imagePath = sectionType === "T-profile" ? "images/t_profile.png" : `images/${sectionType.replace(/\s+/g, '_').toLowerCase()}.png`;
        sectionImage.src = imagePath;
        sectionImage.style.display = "block";
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

        if (values.some(value => isNaN(value) || value <= 0)) {
            document.getElementById("result").innerHTML = "Please enter valid dimensions for all fields. Values must be greater than zero.";
            return;
        }

        switch (sectionType) {
            case "Steel Plates and Sheets":
                const [lengthPlate, widthPlate, thicknessPlate] = values;
                weight = (lengthPlate / 1000) * (widthPlate / 1000) * (thicknessPlate / 1000) * density;
                break;

            case "Chequered Steel Plates":
                const [lengthCheq, widthCheq, thicknessCheq] = values;
                const adjustedThickness = thicknessCheq + 0.3;
                weight = (lengthCheq / 1000) * (widthCheq / 1000) * (adjustedThickness / 1000) * density;
                break;

            case "Seamless Steel Pipes - Circular":
                const [lengthPipe, outerDiameter, thicknessPipe] = values;
                const innerDiameter = outerDiameter - 2 * thicknessPipe;
                weight = (lengthPipe / 1000) * (Math.PI / 4) * (Math.pow(outerDiameter, 2) - Math.pow(innerDiameter, 2)) * density;
                break;

            case "Hollow Structural Sections - Rectangular":
                const [lengthRect, widthRect, heightRect, thicknessRect] = values;
                weight = lengthRect * ((widthRect * heightRect) - ((widthRect - 2 * thicknessRect) * (heightRect - 2 * thicknessRect))) * density;
                break;

            case "Equal Angles":
                const [lengthAngle, legLengthAngle, thicknessAngle] = values;
                weight = 2 * lengthAngle * (legLengthAngle / 1000 * thicknessAngle / 1000) * density;
                break;

            case "Unequal Angles":
                const [lengthUnequalAngle, legLength1, legLength2, thicknessUnequal] = values;
                weight = lengthUnequalAngle * ((legLength1 * thicknessUnequal) + (legLength2 * thicknessUnequal) - (thicknessUnequal ** 2)) * density;
                break;

            case "T-profile":
                const [lengthT, widthT, heightT, thicknessT] = values;
                weight = lengthT * ((widthT * heightT) - ((widthT - thicknessT) * (heightT - thicknessT))) * density;
                break;

            case "Round Steel Bars":
                const lengthRound = values[0] / 1000;
                const diameterRound = values[1] / 1000;
                weight = lengthRound * (Math.PI / 4) * Math.pow(diameterRound, 2) * density;
                break;

            case "Flat Bars":
                const lengthFlat = values[0] / 1000;
                const widthFlat = values[1] / 1000;
                const thicknessFlat = values[2] / 1000;
                weight = lengthFlat * widthFlat * thicknessFlat * density;
                break;

            case "Hexagonal Sections":
                const lengthHex = values[0] / 1000;
                const diameterHex = values[1] / 1000;
                const areaHex = ((3 * Math.sqrt(3)) / 2) * Math.pow(diameterHex, 2);
                weight = lengthHex * areaHex * density;
                break;

            case "Square Steel Bars":
                const lengthSquare = values[0] / 1000;
                const sideSquare = values[1] / 1000;
                weight = lengthSquare * Math.pow(sideSquare, 2) * density;
                break;
        }

        weight = weight.toFixed(3);

        const kg = Math.floor(weight);
        const grams = Math.round((weight - kg) * 1000);

        if (grams > 0) {
            console.log(`Weight: ${kg} kg ${grams} g`);
        } else {
            console.log(`Weight: ${kg} kg`);
        }
    }
}
