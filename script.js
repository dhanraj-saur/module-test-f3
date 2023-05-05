const featchBtn = document.getElementById("btn");
const landPage = document.getElementById("landing-page");
const mainPage = document.getElementById("main");

let postalData;

featchBtn.addEventListener("click", async () => {
    mainPage.style.display = "block";
    landPage.style.display = "none"
    let result = await getIp();
    let ipinfo = await getIpInfo(result.ip)
    postalData = await getPostalAddress(ipinfo.postal)
    displayData(ipinfo, postalData);

});

function displayData(ipinfo, postalData) {
    showGoogleMap(ipinfo)
    showPostalAddress(ipinfo, postalData)
}
async function getIp() {
    let res = await fetch("https://api.ipify.org/?format=json");
    let rep = await res.json();
    return rep;
}
async function getIpInfo(ip) {
    let url = `https://ipinfo.io/${ip}/geo?token=43f18b16f86ba4`
    let res = await fetch(url);
    let rep = await res.json();
    return rep;
}

async function getPostalAddress(pincode) {
    let url = `https://api.postalpincode.in/pincode/${pincode}`
    let res = await fetch(url);
    let rep = await res.json();
    return rep;

}

function showGoogleMap(ipinfo) {
    const [lat, log] = ipinfo.loc.split(",");
    geolocation(ipinfo)
    map.innerHTML = `<iframe class="frame" src="https://maps.google.com/maps?q=${lat},${log}&output=embed"></iframe>`;
};
function showPostalAddress(ipinfo, postalData) {
    showTimeZone(ipinfo, postalData)
    showData(postalData[0].PostOffice)
}
function showTimeZone(info, postalData) {
    console.log(postalData)
    let host = ""
    const dateAndTime = document.getElementById("data-1");
    host =
        `
    <div>
        <div class="data-1">
            <div>
               <span>Time zone</span> <span>:-</span> <span>${info.timezone}</span>
            </div><br>
            <div>
              <span>Date and Time</span> <span>:-</span> <span>${new Date().toLocaleString("en-US", { timeZone: info.timezone })}</span>
            </div><br>
            <div>
              <span>Picode</span> <span>:-</span> <span>${info.postal}</span>
            </div><br>
            <div>
               <span>Message</span> <span>:-</span> <span>${postalData[0].Message}</span>
            </div>   
        </div>


    </div>
    
    `
    dateAndTime.innerHTML = host;
}

function geolocation(ipinfo) {
    const [lat, log] = ipinfo.loc.split(",");

    let innerHtml = ""
    const content = document.getElementById("content")

    innerHtml = `
     <div class="lat-long">
        <p id="lati">Lat:<span>${lat}</span></p>
        <p id="longed">Long:<span>${log}</span></p>
     </div>
     <div class="region">
        <p id="city">City:<span>${ipinfo.city}</span></p>
        <p id="region">Region:<span>${ipinfo.region}</span></p>
     </div>
     <div class="host">
        <p id="organ">Organisation:<span>${ipinfo.org}</span></p>
        <p id="host">Hostname :<span>${window.location.hostname}</span></p>
     </div>
    `
    content.innerHTML = innerHtml;
}

function showData(data) {
    let html = "";
    const dataStore = document.getElementById("dataContainer");

    data.forEach((item) => {
        html += `
            <div class="items">
                <div class="display">
                   <div class="data1"><span>Name</span> <span>:-</span> <span>${item.Name}</span></div><br>
               
                   <div class="data1"><span>Branch Type</span> <span>:-</span> <span>${item.BranchType}</span></div><br>
    
                   <div class="data1"><span>Delivery Status</span> <span>:-</span> <span>${item.DeliveryStatus}</span></div><br>
    
                   <div class="data1"><span>District</span> <span>:-</span> <span>${item.District}</span></div><br>
    
                   <div class="data1"><span>Division</span> <span>:-</span> <span>${item.Division}</span></div><br>
                </div>
            </div>
        `
    });
    dataStore.innerHTML = html;
}

document.getElementById("search").addEventListener("input", () => {
    var newArr = postalData[0].PostOffice.filter((item) =>
        item.Name
            .toLowerCase()
            .includes(document.getElementById("search").value.trim().toLowerCase())
    );
    showData(newArr);
});