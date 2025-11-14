// HubSpot Configuration
const HUBSPOT_PORTAL_ID = "YOUR_PORTAL_ID"; // Replace with your HubSpot Portal ID
const HUBSPOT_FORM_GUID = "YOUR_FORM_GUID"; // Replace with your HubSpot Form GUID

function goToStep2() {
    const bill = document.getElementById("bill").value;
    const zip = document.getElementById("zip").value;

    if (!bill || !zip) {
        alert("Please enter your bill and zip code.");
        return;
    }

    document.getElementById("step1").style.display = "none";
    document.getElementById("step2").style.display = "block";
}

function submitLead() {
    const bill = document.getElementById("bill").value;
    const zip = document.getElementById("zip").value;
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;

    if (!name || !phone || !email) {
        alert("Please enter your contact info.");
        return;
    }

    // Calculate solar estimate
    const systemSize = (bill / 20).toFixed(1); // rough Gulf coast ratio
    const panels = Math.ceil(systemSize / 0.425); // using Jinko 425W
    const yearlySavings = bill * 12;

    // Send lead to HubSpot
    sendToHubSpot({
        name,
        email,
        phone,
        bill,
        zip,
        systemSize,
        panels,
        yearlySavings
    });

    // Show success message with Google Earth background
    document.getElementById("step2").style.display = "none";
    document.getElementById("success").style.display = "flex";
}

function resetForm() {
    document.getElementById("success").style.display = "none";
    document.getElementById("step1").style.display = "block";
    document.getElementById("bill").value = "";
    document.getElementById("zip").value = "";
    document.getElementById("name").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("email").value = "";
}

function sendToHubSpot(data) {
    const hubspotUrl = `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_GUID}`;
    
    // Split name into first and last
    const nameParts = data.name.trim().split(" ");
    const firstname = nameParts[0];
    const lastname = nameParts.slice(1).join(" ") || "";

    const payload = {
        fields: [
            { name: "firstname", value: firstname },
            { name: "lastname", value: lastname },
            { name: "email", value: data.email },
            { name: "phone", value: data.phone },
            { name: "zip", value: data.zip },
            { name: "monthly_power_bill", value: data.bill },
            { name: "system_size_kw", value: data.systemSize },
            { name: "panels_needed", value: data.panels },
            { name: "yearly_savings", value: data.yearlySavings }
        ],
        context: {
            pageUri: window.location.href,
            pageName: "Solar Calculator"
        }
    };

    fetch(hubspotUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(result => {
        console.log("Successfully sent to HubSpot:", result);
    })
    .catch(error => {
        console.error("Error sending to HubSpot:", error);
    });
}
